# ClarityPulse — Documentação Completa

> Analytics premium, privacy-first, com IA integrada.
> Versão da documentação: 1.0.0

---

## Conteúdo deste pacote

```
claritypulse/
├── planejamento/
│   ├── 01_visao-geral-produto.md     Visão de produto, público, proposta de valor
│   ├── 02_funcionalidades.md         MVP, roadmap, fluxo do usuário, monetização
│   └── 03_arquitetura-sistema.md     Arquitetura técnica, fluxos, decisões
│
├── design/
│   ├── 01_design-brief.md            Guia completo para o frontend engineer
│   └── 02_tokens.css                 Design tokens CSS prontos para uso
│
├── banco-de-dados/
│   └── 01_arquitetura-banco.md       Decisões de arquitetura, multi-tenant, RLS
│
├── sql/
│   ├── 01_schema.sql                 Schema completo com todas as tabelas
│   ├── 02_rls_policies.sql           Políticas de Row Level Security
│   └── 03_maintenance.sql            Particionamento, retenção, cron jobs
│
└── README.md                         Este arquivo
```

---

## Quick Start

### 1. Banco de dados (Supabase)

```bash
# No Supabase SQL Editor, executar na ordem:
# 1. sql/01_schema.sql
# 2. sql/02_rls_policies.sql
# 3. sql/03_maintenance.sql
```

### 2. Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...

COLLECTOR_ENCRYPTION_KEY=... # Para integrações OAuth
```

### 3. Design Tokens

```css
/* Em globals.css */
@import './design/02_tokens.css';
```

---

## Stack Tecnológica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | App Router, SSR, performance |
| Estilização | Tailwind CSS + CSS Variables | Design system flexível |
| Animações | Framer Motion | Microinterações premium |
| Gráficos | Recharts | Leve, customizável |
| Backend API | Fastify + TypeScript | Performance superior ao Express |
| Ingestão | Go | p99 < 5ms para /collect |
| Fila | Kafka / Redpanda | Desacoplamento de ingestão |
| DB Principal | PostgreSQL (Supabase) | RLS nativo, auth integrado |
| Cache | Redis | TTL 60s para queries frequentes |
| IA | OpenAI GPT-4o | Insights em linguagem natural |
| Billing | Stripe | Assinaturas + metered billing |
| Email | Resend + React Email | Templates com código |
| Infra | AWS / Hetzner + Kubernetes | Escalabilidade horizontal |

---

## Planos e Preços

| Plano | Preço/mês | Sites | Pageviews/mês | Membros | IA |
|---|---|---|---|---|---|
| Free | Gratuito | 1 | 10.000 | 1 | — |
| Starter | R$49 | 3 | 100.000 | 2 | Básica |
| Pro | R$149 | 10 | 1.000.000 | 10 | Completa |
| Agency | R$399 | Ilimitado | 5.000.000 | Ilimitado | Completa |
| Enterprise | Consulta | Ilimitado | Customizado | Ilimitado | Completa |

---

## Contato

Documentação gerada por ClarityPulse Design System v1.0
