# ClarityPulse — Arquitetura do Banco de Dados

## Tecnologia

- **PostgreSQL 15+** via Supabase
- **Extensões:** pgcrypto, pg_cron, pg_stat_statements
- **Particionamento:** RANGE por occurred_at (mensal)
- **Cache:** Materialized Views com refresh automático via pg_cron

---

## Domínios e Tabelas

### Domínio: Identidade e Acesso
| Tabela | Linhas estimadas | Crescimento |
|---|---|---|
| `users` | 100k–1M | Baixo |
| `workspace_members` | 500k–5M | Baixo |
| `workspace_invites` | 10k–100k | Baixo |

### Domínio: Organização
| Tabela | Linhas estimadas | Crescimento |
|---|---|---|
| `workspaces` | 50k–500k | Baixo |
| `sites` | 150k–1M | Baixo |

### Domínio: Billing
| Tabela | Linhas estimadas | Crescimento |
|---|---|---|
| `plans` | < 10 | Estático |
| `subscriptions` | 50k–500k | Baixo |
| `payment_events` | 500k–5M | Médio (imutável) |

### Domínio: Analytics (ALTO VOLUME)
| Tabela | Linhas estimadas | Crescimento |
|---|---|---|
| `pageviews` | Bilhões | **Muito alto** |
| `custom_events` | Centenas de milhões | **Alto** |
| `goals` | 1M–10M | Baixo |
| `goal_conversions` | 100M–1B | **Alto** |

### Domínio: Operações
| Tabela | Linhas estimadas | Crescimento |
|---|---|---|
| `blocked_ips` | 100k | Baixo |
| `api_keys` | 500k | Baixo |
| `scheduled_reports` | 1M | Baixo |
| `ai_insights` | 50M | Médio (TTL 24h) |
| `integrations` | 500k | Baixo |
| `admin_logs` | 1B+ | **Alto (imutável)** |
| `usage_snapshots` | 50M/ano | Médio |

---

## Estrutura Multi-Tenant

### Modelo: Tenant-per-Row

Cada tabela que armazena dados de workspace tem `workspace_id` como discriminador.
Tabelas de analytics usam `site_id` (que pertence a um workspace).

```
workspace_id
    └── sites.workspace_id
            └── pageviews.site_id
            └── custom_events.site_id
            └── goals.site_id
                    └── goal_conversions.site_id
```

### Garantias de Isolamento

**Nível 1 — RLS (PostgreSQL):**
- Toda query autenticada passa pela função `user_workspace_role(workspace_id)`
- Se o usuário não é membro ativo, RLS retorna zero linhas
- Endpoint de coleta usa `service_role` com permissão apenas de INSERT

**Nível 2 — Aplicação (middleware):**
- JWT contém `workspace_id` e `role`
- Middleware injeta `workspace_id` em todas as queries como parâmetro obrigatório
- Nunca confiar apenas no RLS — defesa em profundidade

**Nível 3 — API Keys:**
- Validação de `allowed_domains` no endpoint de coleta
- Token público do site é inútil fora dos domínios autorizados

---

## Índices Críticos

### Por que os índices de pageviews são compostos?

```sql
CREATE INDEX idx_pv_site_time ON public.pageviews(site_id, occurred_at DESC);
```

**Toda query de analytics começa com** `WHERE site_id = $1 AND occurred_at BETWEEN $2 AND $3`.
Um índice em `site_id` separado de `occurred_at` força dois scans. O índice composto `(site_id, occurred_at DESC)` resolve ambas as condições em um único scan de índice — diferença de 10–100x em tabelas bilionárias.

### Índices parciais para colunas booleanas/nullable

```sql
CREATE INDEX idx_pv_utm_campaign ON public.pageviews(site_id, utm_campaign, occurred_at DESC)
  WHERE utm_campaign IS NOT NULL;
```

Apenas ~30% dos pageviews têm `utm_campaign`. Um índice parcial é 70% menor, cabe mais em memória, e é usado nas queries de análise de campanhas — as mais frequentes no plano Pro+.

---

## Estratégia de Alto Volume

### Write Path Desacoplado

```
Browser → POST /collect (Go, p99 < 5ms)
              └── Redis LPUSH (0.1ms)
                     └── Worker Go (batch COPY 1000/2s)
                                └── PostgreSQL pageviews
```

O `COPY` é 10–50x mais rápido que `INSERT`. Desacoplar ingestão do write elimina picos de latência causados por lock contention em tabelas grandes.

### Materialized Views para Hot Queries

As 5 queries mais frequentes do dashboard são servidas de materialized views:

| View | Refresh | Benefício |
|---|---|---|
| `mv_daily_pageviews` | A cada 5min | KPIs diários — elimina full-scan |
| `mv_top_pages` | A cada 5min | Top páginas — elimina GROUP BY bilionário |
| `mv_referrers` | A cada 5min | Origens — elimina parsing de UTM no hot path |

`REFRESH MATERIALIZED VIEW CONCURRENTLY` — não bloqueia leituras durante refresh.

### Upgrade para TimescaleDB (Enterprise)

Para workspaces com >100M pageviews/mês:

```sql
-- Converter em hypertable
SELECT create_hypertable('pageviews', 'occurred_at',
  chunk_time_interval => INTERVAL '1 week');

-- Compressão automática após 7 dias (redução de 90% no disco)
SELECT add_compression_policy('pageviews', INTERVAL '7 days');

-- Continuous aggregates (refresh incremental automático)
CREATE MATERIALIZED VIEW pv_hourly
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', occurred_at) AS bucket,
       site_id,
       count(*) AS pageviews,
       count(DISTINCT session_hash) AS sessions
FROM pageviews
GROUP BY bucket, site_id;
```

---

## Retenção de Dados

| Tipo de dado | Retenção | Motivo |
|---|---|---|
| `pageviews` / `custom_events` | Por plano (90–1825 dias) | Configurável via `plans.data_retention_days` |
| `goal_conversions` | Por plano | Mesmo padrão |
| `ai_insights` | TTL 24h | Regenerados automaticamente |
| `workspace_invites` expirados | 30 dias após expiração | Cleanup automático |
| `usage_snapshots` | 2 anos fixo | Necessário para análise de billing |
| `admin_logs` | Nunca deletado | Obrigação de auditoria |
| `payment_events` | Nunca deletado | Obrigação fiscal |

### Processo LGPD — Exclusão de Usuário

1. `public.anonymize_deleted_user(user_id)` — função SQL
2. `users.is_deleted = true` + campos pessoais anulados
3. `admin_logs.actor_id = NULL` — logs mantidos, identificação removida
4. `payment_events` — mantidos (obrigação fiscal, sem PII de visitante)
5. `pageviews`/`custom_events` dos sites do usuário — deletados (não contêm PII, mas é boa prática)

---

## Particionamento

### Por que RANGE por occurred_at?

100% das queries de analytics incluem filtro de período (`WHERE occurred_at BETWEEN $1 AND $2`).
Com particionamento mensal, o PostgreSQL faz **partition pruning** automático — uma query de abril lê apenas a partição `pageviews_2025_04`, ignorando outras 11+ partições.

### Criação Automática

A função `create_monthly_partitions(3)` é executada via `pg_cron` no dia 1 de cada mês, criando partições para os próximos 3 meses.

### Deleção de Partições

Para workspaces enterprise (particionamento por tenant no futuro):
```sql
-- Instantâneo, não gera bloat no tablespace
DROP TABLE pageviews_2022_01;
-- vs.
DELETE FROM pageviews WHERE occurred_at < '2023-01-01'; -- lento, fragmenta tablespace
```

Para o modelo atual (multi-tenant por linha), a deleção é via `DELETE` filtrado por `site_id`.

---

## Segurança do Banco

### API Keys — nunca em texto claro

```sql
-- Armazenar apenas o hash
key_hash TEXT -- SHA-256(chave_completa)
key_prefix TEXT -- ex: 'cp_live_abc1' — para identificação visual pelo usuário
```

Na verificação: `WHERE key_hash = encode(sha256($key::bytea), 'hex')`.

### Integrações — config criptografada

```sql
config_encrypted BYTEA -- pgp_sym_encrypt(config::text, encryption_key)
```

A chave de criptografia é armazenada no Vault do Supabase ou AWS Secrets Manager — nunca no banco.

### session_hash — privacidade de visitante

```
session_hash = FNV-1a(
  ip_truncado_2_octetos +   -- ex: '200.10' (não '200.10.5.1')
  user_agent_hash +
  data_atual                -- muda a cada dia — sessão não persiste entre dias
)
```

É um hash de 64 bits não-reversível. Não é possível reconstruir o IP, identificar o dispositivo ou rastrear o visitante entre dias. Compliance total com LGPD/GDPR.
