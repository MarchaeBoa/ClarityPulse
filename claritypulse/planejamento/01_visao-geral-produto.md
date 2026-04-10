# ClarityPulse — Visão Geral do Produto

## O que é

ClarityPulse é uma plataforma de web analytics SaaS que substitui o modelo pesado e invasivo do Google Analytics por algo fundamentalmente diferente: um produto que respeita o usuário final, processa dados no servidor de forma anônima, entrega insights acionáveis gerados por IA e tem uma interface tão boa que vira argumento de venda.

A filosofia central é **"dados que você entende, decisões que você toma"**. Não é só coletar pageviews, é transformar comportamento de visitantes em ações concretas.

---

## Público-alvo

### Segmento primário — Founders de SaaS e produtos digitais
Entre 25–45 anos, acesso técnico mínimo (sabe o que é DNS, entende funil de conversão), mas prefere gastar tempo no produto ao invés de configurar dashboards. Receita mensal R$5k–R$500k, gerenciando 1–5 domínios.

### Segmento secundário — Agências de marketing e performance
Gerenciam múltiplos clientes, precisam de white-label ou acesso por cliente, querem entregar relatórios sem exportar dados manualmente.

### Segmento terciário — E-commerces DTC
Rodam Shopify, WooCommerce ou plataformas proprietárias. Precisam rastrear conversões, carrinho abandonado e UTMs de campanhas pagas.

### Segmento quaternário — Creators e newsletters
Precisam entender de onde vem tráfego, qual conteúdo converte assinantes, qual campanha de afiliados funciona.

---

## Principais Dores do Mercado

1. **Google Analytics é ilegível** — 90% das contas do GA4 ficam configuradas errado ou são ignoradas
2. **Privacidade virou risco legal** — LGPD/GDPR/CCPA exigem consentimento para coleta de PII
3. **Scripts lentos matam performance** — GA4 tem +80kb e bloqueia renderização
4. **Dados sem contexto são inúteis** — ver que "bounce rate caiu 5%" não ajuda ninguém
5. **Ferramentas privacy-first existentes são funcionais mas feias** — Plausible e Fathom têm interface genérica

---

## Proposta de Valor

ClarityPulse entrega o que nenhuma alternativa atual combina:
- Analytics de nível enterprise com **setup de 5 minutos**
- Design que você **quer mostrar para o cliente**
- IA que **transforma dados em ações**
- Conformidade com **LGPD/GDPR out-of-the-box**

---

## Diferenciais Competitivos

| Diferencial | Descrição |
|---|---|
| IA Insights reais | Não "visitas subiram 15%" — mas "a landing page que editou na terça-feira aumentou conversão em 31%" |
| Script < 5kb | Carregado async, não bloqueia renderização, sem cookies |
| Relatórios automáticos | Email semanal com narrativa em linguagem natural, toda segunda |
| Multi-site no Free | Até 3 sites no plano gratuito |
| Modo apresentação | 1 clique transforma dashboard em modo "cliente" com logo da agência |
| LGPD automático | Gera declaração de conformidade para política de privacidade do site |
| Integrações nativas | Webhooks para Slack, Zapier, Make, n8n; API pública documentada |

---

## Monetização e Planos

| Plano | Preço | Sites | Pageviews/mês | Membros |
|---|---|---|---|---|
| Free | Gratuito | 1 | 10.000 | 1 |
| Starter | R$49/mês | 3 | 100.000 | 2 |
| Pro | R$149/mês | 10 | 1.000.000 | 10 |
| Agency | R$399/mês | Ilimitado | 5.000.000 | Ilimitado |
| Enterprise | Sob consulta | Ilimitado | Customizado | Ilimitado |

---

## Stack Tecnológica

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Zustand, TanStack Query, Recharts, Framer Motion
- **Backend API:** Node.js com Fastify, TypeScript
- **Ingestão de eventos:** Go (endpoint `/collect` — latência < 5ms)
- **Fila:** Kafka / Redpanda
- **DB Transacional:** PostgreSQL (Supabase)
- **DB Analytics:** ClickHouse (OLAP)
- **Cache:** Redis
- **IA:** OpenAI GPT-4o
- **Infra:** AWS ou Hetzner, Kubernetes, CloudFront/BunnyCDN
- **Billing:** Stripe
- **Email:** Resend + React Email
