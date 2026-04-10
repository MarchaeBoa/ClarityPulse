# ClarityPulse — Arquitetura do Script de Rastreamento

## 1. Visão Geral da Arquitetura

O script de rastreamento é o componente que roda no browser do visitante e envia
eventos para o backend da ClarityPulse. A filosofia é: **mínimo de código,
máximo de dados úteis, zero invasão de privacidade**.

```
┌──────────────────────────────────────────────────────────┐
│  Site do Cliente (Browser)                               │
│                                                          │
│  <script data-site="TOKEN"                               │
│    src="https://cdn.claritypulse.io/cp.js"               │
│    defer></script>                                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  clarity-pulse.js (~3.5kb gzipped)               │    │
│  │                                                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │    │
│  │  │ Collector │  │  Queue   │  │  Dispatcher  │   │    │
│  │  │  Module   │──│  Buffer  │──│   (Beacon)   │   │    │
│  │  └──────────┘  └──────────┘  └──────────────┘   │    │
│  │       │                            │             │    │
│  │  ┌────▼─────┐                 ┌────▼─────┐      │    │
│  │  │ SPA      │                 │ Retry    │      │    │
│  │  │ Observer  │                 │ Logic    │      │    │
│  │  └──────────┘                 └──────────┘      │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
           │
           │ POST /api/collect  (JSON ou sendBeacon)
           │ Headers: Content-Type, Origin
           ▼
┌──────────────────────────────────────────────────────────┐
│  API de Ingestão (Next.js → futuro Go)                   │
│                                                          │
│  ├── Valida token do site                                │
│  ├── Valida Origin vs allowed_domains                    │
│  ├── Verifica IP vs blocked_ips                          │
│  ├── Extrai país via IP (2 octetos truncados)            │
│  ├── Gera session_hash (FNV-1a sem cookie)               │
│  ├── Parseia User-Agent → device, os, browser            │
│  └── Persiste no banco (futuro: publica no Kafka)        │
│                                                          │
│  Retorna: 202 Accepted (corpo vazio)                     │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Princípios de Design

| Princípio | Implementação |
|---|---|
| **Leveza** | < 4kb gzipped, zero dependências, carregamento `defer` |
| **Privacidade** | Sem cookies, sem localStorage, sem fingerprinting, sem dados pessoais |
| **Performance** | Não bloqueia render, usa `requestIdleCallback` quando possível |
| **Resiliência** | `sendBeacon` como fallback, retry com backoff, tolerante a falhas |
| **Compatível SPA** | Observa History API (`pushState`, `replaceState`, `popstate`) |
| **Sem duplicação** | Deduplicação por hash de evento + timestamp no client e server |
| **Extensível** | API pública para eventos customizados: `claritypulse('event', ...)` |

---

## 3. Instalação pelo Usuário

### Opção 1: Script tag (recomendada)
```html
<script
  data-site="SEU_TOKEN_PUBLICO"
  src="https://cdn.claritypulse.io/cp.js"
  defer
></script>
```

### Opção 2: NPM (para SPAs)
```bash
npm install @claritypulse/tracker
```
```typescript
import { init, trackEvent } from '@claritypulse/tracker';

init({ siteToken: 'SEU_TOKEN_PUBLICO' });

// Evento customizado
trackEvent('signup_click', { plan: 'pro' });
```

### Opção 3: Google Tag Manager
Tag HTML customizada com o mesmo snippet da Opção 1.

---

## 4. Payload de Eventos

### 4.1 Pageview (automático)

```jsonc
{
  "t": "pv",                        // tipo: pageview
  "tk": "a1b2c3d4e5f6",             // public_token do site
  "u": "https://exemplo.com/pricing", // URL completa
  "p": "/pricing",                   // path only
  "q": "?ref=banner",               // query string (sem dados sensíveis)
  "r": "https://google.com",        // referrer completo
  "rd": "google.com",               // referrer domain
  "us": "google",                   // utm_source
  "um": "cpc",                      // utm_medium
  "uc": "black-friday",             // utm_campaign
  "un": "banner-hero",              // utm_content
  "ut": "analytics",                // utm_term
  "vw": 1440,                       // viewport width
  "vh": 900,                        // viewport height
  "ts": 1699900000000,              // timestamp (ms)
  "sid": "f7a3b1c2",                // session ID (hash efêmero, não cookie)
  "uniq": 1                         // 1 = primeira visita na sessão, 0 = não
}
```

### 4.2 Evento Customizado

```jsonc
{
  "t": "ev",                        // tipo: event
  "tk": "a1b2c3d4e5f6",             // public_token
  "n": "signup_click",              // event name
  "pr": { "plan": "pro" },          // properties (max 10 keys, 256 chars/val)
  "u": "https://exemplo.com/pricing",
  "p": "/pricing",
  "ts": 1699900000000,
  "sid": "f7a3b1c2"
}
```

### 4.3 Princípios do Payload

- **Chaves curtas** (`t`, `tk`, `u`) para minimizar bytes transferidos
- **Sem dados pessoais**: nunca coleta IP, email, nome, ID de usuário
- **UTM parseado no client**: evita processamento no servidor
- **Session ID efêmero**: calculado via hash do timestamp de início + random, vive apenas na memória (perdido ao fechar aba)
- **Query string filtrada**: remove parâmetros sensíveis (`email`, `token`, `password`, `secret`, `key`, `auth`)

---

## 5. Estratégia Anti-Duplicação

### No Client
1. **Dedup por URL + timestamp**: Se a mesma URL for enviada novamente em < 500ms, ignora (proteção contra double pushState em SPAs)
2. **Flag de visibilidade**: Só envia pageview quando `document.visibilityState === 'visible'`
3. **Session ID em memória**: Sem persistência = sem risco de replay entre sessões

### No Server
1. **Constraint natural**: `(site_id, session_hash, page_url, occurred_at)` com resolução de 1s previne duplicatas exatas
2. **Idempotency window**: Eventos com mesmo `session_hash + url + timestamp` no intervalo de 5s são descartados
3. **Rate limiting por IP**: Máximo 60 eventos/minuto por IP truncado (anti-bot)

---

## 6. Suporte a SPAs (Single Page Applications)

O script intercepta navegações client-side sem necessidade de configuração:

```
┌──────────────────────────────────────────────┐
│  Monkey-patch History API                    │
│                                              │
│  1. Salva referências originais:             │
│     - history.pushState                      │
│     - history.replaceState                   │
│                                              │
│  2. Substitui por wrappers que:              │
│     a) Chamam o método original              │
│     b) Disparam evento 'claritypulse:nav'    │
│                                              │
│  3. Escuta também:                           │
│     - window.popstate (back/forward)         │
│     - hashchange (hash routing)              │
│                                              │
│  4. Em cada navegação:                       │
│     a) Verifica se URL realmente mudou       │
│     b) Envia pageview com referrer = URL     │
│        anterior                              │
│     c) Aplica dedup de 500ms                 │
└──────────────────────────────────────────────┘
```

**Frameworks testados**: React Router, Next.js, Vue Router, Nuxt, SvelteKit, Angular Router.

---

## 7. API de Ingestão

### Endpoint

```
POST /api/collect
Content-Type: application/json
Origin: https://site-do-cliente.com
```

### Fluxo de Processamento

```
Request
  │
  ├─ 1. Validar Content-Type (application/json ou text/plain para sendBeacon)
  │
  ├─ 2. Parsear body JSON
  │
  ├─ 3. Validar token (tk) → buscar site_id
  │     └── Cache em memória (Map com TTL de 5min)
  │
  ├─ 4. Validar Origin header vs site.allowed_domains
  │
  ├─ 5. Verificar IP vs blocked_ips do site
  │
  ├─ 6. Enriquecer evento:
  │     ├── GeoIP: IP truncado (2 octetos) → country_code
  │     ├── User-Agent → device_type, os, browser
  │     ├── session_hash = FNV-1a(ip_truncado + ua + date_iso)
  │     └── Sanitizar URLs (remover query params sensíveis)
  │
  ├─ 7. Validar payload:
  │     ├── Tipo válido (pv ou ev)
  │     ├── URL válida (< 2048 chars)
  │     ├── Properties: max 10 keys, valores < 256 chars
  │     └── Timestamp: dentro de ±5 min do server time
  │
  ├─ 8. Persistir:
  │     ├── MVP: INSERT direto no PostgreSQL via Supabase
  │     └── Futuro: Publish no Kafka → Worker faz COPY batch
  │
  └─ 9. Retornar 202 Accepted (corpo vazio)

Erros silenciosos:
  - Token inválido → 202 (não revelar se token existe)
  - Origin inválido → 202 (não revelar allowed_domains)
  - Rate limit → 429 (com Retry-After header)
  - Payload inválido → 202 (descarta silenciosamente)
```

### Headers de Resposta

```
Access-Control-Allow-Origin: * (ou domínio específico)
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Cache-Control: no-store
```

---

## 8. Escalabilidade para Alto Volume

### Fase 1: MVP (até 1M eventos/mês)
- Next.js API route (`/api/collect`)
- INSERT direto no Supabase (PostgreSQL)
- Rate limit em memória (Map)
- Cache de tokens em memória

### Fase 2: Crescimento (1M–50M eventos/mês)
- Endpoint Go separado (`collect.claritypulse.io`)
- Kafka/Redpanda como buffer
- Worker Go com COPY batch (1000 eventos / 2s)
- Connection pooling com PgBouncer
- CDN (CloudFront/BunnyCDN) para o script

### Fase 3: Enterprise (50M+ eventos/mês)
- ClickHouse como OLAP engine
- Workers horizontalmente escaláveis
- Partition pruning automático
- Materialized views com refresh assíncrono
- Edge computing para coleta (Cloudflare Workers)

### Métricas de Capacidade

| Fase | Eventos/s | Latência p99 | Infra |
|------|-----------|-------------|-------|
| MVP | ~40 | < 100ms | 1x Next.js |
| Crescimento | ~2.000 | < 10ms | Go + Kafka + PG |
| Enterprise | ~50.000+ | < 5ms | Go + Kafka + ClickHouse |

---

## 9. Filtro de Tráfego Interno

### Mecanismos

1. **Lista de IPs bloqueados** (tabela `blocked_ips`):
   - Suporte a CIDR (`192.168.0.0/16`, `10.0.0.0/8`)
   - Configurável no dashboard por site
   - Verificado no servidor, não no client

2. **Query param de exclusão**:
   - Adicionar `?claritypulse_ignore=true` exclui o evento
   - Útil para equipe interna bookmarkear versão com exclusão

3. **Filtro por hostname**:
   - Ignora `localhost`, `127.0.0.1`, `*.local`, `*.test`
   - Ignora ambientes de staging configurados

4. **Filtro de bots**:
   - Detecção via User-Agent (Googlebot, Bingbot, etc.)
   - `navigator.webdriver === true` → ignora
   - Viewport `0x0` → ignora

---

## 10. Performance

### No Browser

| Técnica | Impacto |
|---|---|
| `defer` no script tag | Não bloqueia parsing HTML |
| Zero dependências | Nenhum bundle extra |
| `sendBeacon()` para envio | Não bloqueia navegação |
| `requestIdleCallback` para init | Roda quando browser está idle |
| Payload minificado (chaves curtas) | < 500 bytes por evento |
| Nenhum DOM mutation | Zero layout thrashing |
| Event listeners passivos | Não bloqueia scroll |

### No Servidor

| Técnica | Impacto |
|---|---|
| Resposta 202 imediata | Client não espera processamento |
| Cache de tokens em memória | Evita query ao DB por request |
| CORS preflight cacheado (1h) | Reduz OPTIONS requests |
| Processamento assíncrono | Enriquecimento fora do hot path |
| Connection pooling | Reuso de conexões PostgreSQL |

### Métricas Alvo

- **Script size**: < 4kb gzipped
- **Time to first event**: < 50ms após DOMContentLoaded
- **Overhead no Core Web Vitals**: 0ms em LCP, 0ms em CLS, < 1ms em INP
- **Server response time**: < 50ms (p99) no MVP
