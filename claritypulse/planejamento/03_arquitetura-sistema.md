# ClarityPulse — Arquitetura do Sistema

## Visão Geral

O sistema tem três planos distintos de responsabilidade:
- **Ingestão** — recebe eventos do browser com latência mínima
- **Processamento** — enriquece, valida e persiste os eventos
- **Query** — serve os dados para o dashboard com performance

---

## Fluxo de Ingestão de Eventos

```
Browser (script 4.8kb)
    │
    │  POST https://collect.claritypulse.io/e
    │  { token, url, referrer, utm_*, ua, viewport }
    ▼
Endpoint Go (p99 < 5ms)
    ├── Valida token do site
    ├── Verifica Origin header vs allowed_domains
    ├── Verifica IP vs blocked_ips
    ├── Trunca IP para geoloc (apenas 2 octetos)
    ├── Publica evento cru no Kafka
    └── Retorna 202 Accepted (sem dados)
    │
    ▼
Kafka Queue (Redpanda)
    │
    ▼
Worker de Processamento (Go)
    ├── Consome batch de 1.000 eventos / 2s
    ├── Enriquecimento:
    │   ├── GeoIP → country, region, city
    │   ├── User-Agent parsing → device, os, browser
    │   ├── UTM + referrer parsing
    │   ├── session_hash = FNV-1a(ip_2octetos + ua + date)
    │   └── is_bounce, duration (calculado na sessão)
    └── COPY INTO pageviews (PostgreSQL)
```

---

## Fluxo de Query (Dashboard)

```
Frontend (Next.js)
    │
    │  GET /api/analytics/overview?site=X&period=30d
    ▼
API Backend (Fastify)
    ├── Verifica JWT + workspace membership
    ├── Injeta workspace_id em todas as queries (middleware)
    ├── Consulta Redis cache (TTL 60s para queries recentes)
    │
    └── Cache miss → PostgreSQL (ClickHouse para enterprise)
        ├── Materialized views para KPIs diários
        ├── Tabelas raw para drill-downs específicos
        └── Retorna JSON normalizado
```

---

## Worker de IA

```
pg_cron (a cada 6h por site ativo)
    │
    ▼
Worker de IA (Node.js)
    ├── Executa conjunto fixo de queries analíticas
    ├── Monta contexto estruturado:
    │   ├── Variações de tráfego vs semana anterior
    │   ├── Top páginas por crescimento/queda
    │   ├── Mudanças de conversão
    │   └── Benchmarks do segmento de mercado
    ├── Chama OpenAI GPT-4o com prompt de análise
    └── Persiste insights em ai_insights
        └── TTL de 24h → regenera automaticamente
```

---

## Arquitetura de Infraestrutura

```
┌─────────────────────────────────────────────────────────┐
│                     CloudFront / BunnyCDN                │
│              (script JS — cache 1h, global)              │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │ collect │                 │  API    │
    │  (Go)   │                 │(Fastify)│
    │  :8080  │                 │  :3000  │
    └────┬────┘                 └────┬────┘
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │  Kafka  │                 │  Redis  │
    │(Redpanda│                 │  Cache  │
    └────┬────┘                 └────┬────┘
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │ Worker  │                 │PostgreSQL│
    │  (Go)   │────────────────►│(Supabase)│
    └─────────┘                 └─────────┘
```

---

## Decisões de Arquitetura

### Por que endpoint de coleta separado?
O domínio `collect.claritypulse.io` é separado do domínio principal para reduzir adblockers que bloqueiam por path. Serve o script via CDN com cache de 1h para minimizar latência global.

### Por que Go para ingestão?
Go processa 200k+ requests/segundo com latência p99 < 5ms em instância de 2 vCPU. Node.js não atinge essa performance no mesmo hardware para I/O de altíssima frequência com payload pequeno.

### Por que COPY em batch ao invés de INSERT?
PostgreSQL `COPY` é 10–50x mais rápido que `INSERT` individual. Batches de 1.000 eventos a cada 2s resultam em ~30k writes/min por worker — escalável horizontalmente adicionando mais workers.

### Por que Materialized Views?
As 5 queries mais comuns do dashboard (top páginas, top origens, visitantes por dia, dispositivos, países) representam 80% de todas as queries. Pre-computar evita full-scan em tabelas bilionárias.

### Por que Redis para cache?
Queries de dashboard com os mesmos parâmetros são feitas por múltiplos usuários do mesmo workspace simultaneamente. TTL de 60s elimina 90%+ dos hits ao PostgreSQL para workspaces ativos.

---

## Segurança

| Camada | Mecanismo |
|---|---|
| Autenticação | JWT (15min) + refresh token httpOnly cookie rotacionado |
| CSRF | Token CSRF em todas as mutations |
| Rate limiting | 100 req/min para usuários autenticados, 10 req/min para rotas públicas |
| Headers | Helmet.js: CSP, HSTS, X-Frame-Options, etc. |
| API Keys | SHA-256 hash — nunca armazenar em texto claro |
| Secrets | Doppler / AWS Secrets Manager |
| Ingestão | Origin header validation + allowed_domains check |
| Isolamento | workspace_id em middleware + RLS no PostgreSQL (defesa em profundidade) |
| Audit | admin_logs append-only para todas as ações sensíveis |
