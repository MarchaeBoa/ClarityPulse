# ClarityPulse — Funcionalidades

## MVP (V1)

### Onboarding e Coleta
- Cadastro com email ou OAuth (Google/GitHub)
- Criação de site com geração automática de script de tracking
- Instruções de instalação por framework (Next.js, WordPress, Wix, Shopify, HTML puro)
- Verificação de instalação em tempo real
- Painel populado dentro de 60s após o primeiro pageview

### Dashboard Principal
- Visitantes únicos, pageviews, sessões, bounce rate, tempo médio de sessão
- Comparativo de período anterior
- Sparklines por hora/dia/semana/mês
- Seletor de período customizado

### Páginas e Conteúdo
- Top páginas por views, por sessões, por tempo médio
- Tendência de crescimento/queda
- Filtro por URL pattern (ex: `/blog/*`)

### Origens de Tráfego
- Separação automática: Direct, Organic Search, Social, Referral, Email, Paid
- Drill-down por origem específica
- Rastreamento de UTMs completo (source, medium, campaign, content, term)

### Localização
- País, estado, cidade com mapa de calor
- Idioma do browser, timezone

### Dispositivos
- Tipo (mobile/desktop/tablet), OS, browser, resolução

### Conversões e Metas
- Metas por URL visitada, evento customizado, ou sequência de páginas
- Taxa de conversão por meta, por origem e por período

### Eventos Customizados
- API JavaScript: `window.cp.track('event', { props })`
- Propriedades customizadas (string, número, boolean)

### Multi-site
- Até 3 sites no Free, ilimitado nos planos pagos

### Equipe
- Convite por email com roles (Admin, Editor, Viewer)
- Remoção de membros, log de atividades básico

### Exportação
- Download CSV do período selecionado
- Relatório PDF automático

### Configurações
- Timezone do site
- Exclusão de IPs próprios
- Limite de retenção de dados
- Domínios permitidos para o script

---

## Funcionalidades Avançadas (V2+)

| Feature | Plano Mínimo | Descrição |
|---|---|---|
| IA Insights v2 | Pro | Previsão de tráfego, detecção de anomalias, sugestões de ações |
| Session Replay | Pro | Gravação de sessões com anonimização automática de formulários |
| Heatmaps | Pro | Clique e scroll sobre screenshots das páginas |
| Funis avançados | Pro | Multi-etapa com condições e análise de abandono |
| Segmentação | Pro | Audiências customizadas com comparativo |
| Alertas inteligentes | Pro | Condições: "se conversão cair abaixo de X%, notificar Slack" |
| White-label completo | Agency | Dashboard brandado com logo, cores e domínio customizado |
| API GraphQL v2 | Pro | Para integração com BigQuery, Snowflake, Metabase |
| Integração ads | Agency | Google Ads, Meta Ads, TikTok Ads — ROAS real sem pixel |
| Analytics de newsletter | Pro | Tracking de cliques de email com identificação de edição |
| Modo offline/PWA | Pro | Cache de 24h com sincronização automática |

---

## Fluxo do Usuário

1. Chega via busca orgânica → landing page com demo interativa sem cadastro
2. CTA "Instalar em 2 minutos — grátis" → cadastro com email ou OAuth
3. Onboarding: URL do site → geração do snippet de 3 linhas
4. Verificação de instalação em tempo real → primeiro pageview detectado
5. Dashboard populado → tooltips explicativos nos primeiros 7 dias
6. Sequência de emails de onboarding: 1 feature/dia por 7 dias
7. Relatório semanal automático traz usuário de volta todo domingo
8. Upgrade quando atinge limite de pageviews ou precisa de feature paga

---

## Estrutura das Páginas

### Site Público
- Landing page principal (hero, demo, comparativo, depoimentos, pricing, CTA)
- Blog (analytics, privacidade, performance web, otimização de conversão)
- Documentação pública (guias, referência de API, exemplos)
- Changelog público

### Aplicação (pós-login)
- Dashboard principal
- Tempo Real (atualização a cada 5s)
- Páginas com drill-down
- Origens com drill-down por UTM
- Conversões com visualização de funil
- Eventos com listagem e propriedades
- IA Insights com feed de análises
- Configurações de site
- Configurações de conta/equipe
- Billing

---

## Retenção e Viralização

| Mecanismo | Descrição |
|---|---|
| Relatório semanal | Email com narrativa gerada por IA todo domingo às 8h |
| Share público | Link read-only do dashboard com badge "Powered by ClarityPulse" |
| Badge HTML | Rodapé "Privacy-first analytics" com link para landing page |
| Programa de afiliados | 20% de comissão recorrente por 12 meses |
| Onboarding social | Tweet/LinkedIn pré-formatado na verificação de instalação |
| NPS in-app | No 14º dia: promotores recebem link de afiliado, detratores recebem contato do fundador |
