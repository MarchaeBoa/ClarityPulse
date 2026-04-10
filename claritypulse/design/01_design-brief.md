# ClarityPulse — Design Brief Completo

## Conceito Visual: "Jade Intelligence"

A identidade parte de um conceito central: **precisão com calor**. A marca não é fria como Vercel nem exuberante como Framer — fica no ponto de equilíbrio entre rigor analítico e produto humano.

O símbolo é um hexágono com ponto central — precisão geométrica e convergência de dados em um único foco.

**Referências estéticas:** Linear (densidade + micro-interactions), Stripe Dashboard (hierarquia tipográfica), Vercel (dark mode tokens + monospace em dados), Liveblocks (empty states + onboarding), Raycast (sidebar navigation).

---

## Paleta de Cores

### Cores Primárias

| Token | Hex | Uso |
|---|---|---|
| `--jade` | `#1AE5A0` | Accent primário, CTA, métricas positivas |
| `--jade-hover` | `#0FBF82` | Hover/ativo do jade |
| `--jade-dark` | `#0A9465` | Texto sobre backgrounds jade |
| `--jade-tint` | `#E6FDF5` | Background tint para cards accent |

### Neutrals (Ink + Mist)

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0A0B0D` | Foreground máximo, texto principal |
| `--ink-2` | `#1C1E23` | Texto secundário |
| `--ink-3` | `#2E3038` | Texto terciário |
| `--mist` | `#F7F8FA` | Background de página (light) |
| `--mist-2` | `#EDEEF2` | Surface de card |
| `--mist-3` | `#E2E4EA` | Dividers, bordas |
| `--ghost` | `#9BA0AE` | Labels, texto secundário |
| `--ghost-2` | `#C4C7D0` | Placeholders, ícones inativos |

### Cores Semânticas

| Token | Hex | Background | Uso |
|---|---|---|---|
| `--sapphire` | `#3B7BF8` | `#E8EFFF` | Info, links, UTMs |
| `--ember` | `#F5653A` | `#FEF0EC` | Danger, queda de métricas |
| `--gold` | `#F0A500` | `#FEF6E4` | Warning, atenção |

### Dark Mode

Background de página: `#0A0B0D`
Surface de card: `#111214`
Surface elevada: `#131416`
Input bg: `#1C1E23`
Borders: `rgba(255,255,255,.05)` a `rgba(255,255,255,.08)`
Texto primário: `#E8E9EC` | Secundário: `#9BA0AE` | Terciário: `#5A5E6B` | Ghost: `#3E4047`

> Cores semânticas (jade, sapphire, ember, gold) não mudam de valor entre modos.
> Versão `*-tint` vira `rgba(cor, .08)` no dark mode.

---

## Tipografia

### Fontes

```
Display:  Syne (Google Fonts) — pesos 500, 600, 700, 800
Body:     DM Sans (Google Fonts) — pesos 300, 400, 500
Mono:     DM Mono (Google Fonts) — pesos 400, 500
```

Importar via `next/font/google` com `display: 'swap'`.

### Escala Tipográfica

| Nome | Fonte | Size | Weight | Letter-spacing | Line-height | Uso |
|---|---|---|---|---|---|---|
| `display-xl` | Syne | 64px | 800 | -3px | 0.9 | Hero headline |
| `display-lg` | Syne | 48px | 800 | -2.5px | 0.92 | Landing sections |
| `display-md` | Syne | 32px | 700 | -1.5px | 1.0 | Page titles |
| `display-sm` | Syne | 22px | 700 | -0.8px | 1.1 | Section titles |
| `display-xs` | Syne | 16px | 600 | -0.3px | 1.2 | Card titles |
| `body-lg` | DM Sans | 16px | 400 | 0 | 1.7 | Landing copy |
| `body-md` | DM Sans | 14px | 400 | 0 | 1.6 | Body de app |
| `body-sm` | DM Sans | 12px | 400 | 0 | 1.5 | Texto secundário |
| `label` | DM Mono | 10px | 500 | 0.6px + uppercase | — | Labels de KPI |
| `mono-sm` | DM Mono | 11px | 400/500 | 0.3px | — | Valores, paths |
| `kpi-num` | Syne | 24–28px | 700 | -1px | 1 | Números de KPI |

---

## Spacing System

Base 4px. Nunca usar valores fora desta escala.

| Token | Valor | Uso |
|---|---|---|
| `--space-1` | 4px | Micro: entre ícone e label |
| `--space-2` | 8px | Tight: gap interno de componente |
| `--space-3` | 12px | Compact: gap entre elementos relacionados |
| `--space-4` | 16px | Base: padding padrão de card |
| `--space-6` | 24px | Comfortable: padding de seção |
| `--space-8` | 32px | Loose: entre grupos de componentes |
| `--space-12` | 48px | Section: entre seções de página |
| `--space-16` | 64px | Hero: padding de hero section |

---

## Border Radius

| Token | Valor | Uso |
|---|---|---|
| `--r-micro` | 4px | Badges, pills pequeníssimas |
| `--r-sm` | 6px | Botões pequenos, chips |
| `--r-base` | 8px | Botões, inputs, elementos base |
| `--r-card` | 12px | KPI cards |
| `--r-panel` | 16px | Cards principais, painéis |
| `--r-modal` | 20px | Modais, drawers |
| `--r-pill` | 999px | Pills, toggles, badges rounded |

---

## Grid Layout

### Dashboard App

```
┌──────────────────────────────────────────────────┐
│  Sidebar (200px fixo)  │  Main Content (flex: 1) │
│                        │  ┌────────────────────┐ │
│  Logo                  │  │ Topbar (56px)      │ │
│  Site Picker           │  └────────────────────┘ │
│  Nav Groups            │  ┌────────────────────┐ │
│                        │  │ Content (24px pad) │ │
│                        │  │                    │ │
└──────────────────────────────────────────────────┘
```

### Grid de KPIs: `grid-template-columns: repeat(4, 1fr)`, gap 12px
### Grid de Chart+Sidebar: `grid-template-columns: 1fr 320px`, gap 12px
### Grid de Bottom Row: `grid-template-columns: 1fr 1fr`, gap 12px

### Breakpoints

| Nome | Valor | Comportamento |
|---|---|---|
| `sm` | 640px | KPIs: 1 coluna, sem sidebar |
| `md` | 768px | KPIs: 2 colunas |
| `lg` | 1024px | Sidebar vira drawer |
| `xl` | 1280px | Dashboard padrão completo |
| `2xl` | 1536px | Dashboard largo (sidebar 240px) |

---

## Componentes

### Cards — Variantes

**Base Card**
```css
background: #fff (light) / #111214 (dark)
border: 1px solid rgba(0,0,0,.07) / rgba(255,255,255,.06)
border-radius: 16px
padding: 20px
```

**Elevated Card** — modais e destaques
```css
+ box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.04)
```

**Accent Card** — IA Insights, CTAs
```css
border: 1px solid rgba(26,229,160,.25)
box-shadow: 0 0 0 1px rgba(26,229,160,.08) inset
```

**Ghost Card** — informações secundárias
```css
background: var(--mist-2)
```

### Botões — Hierarquia

| Variante | Background | Texto | Border | Uso |
|---|---|---|---|---|
| Primary | `#0A0B0D` | `#fff` | — | Ação principal |
| Accent | `#1AE5A0` | `#022c1a` | — | CTA de conversão |
| Outline | transparent | `--ink` | 1.5px `--mist-3` | Ação secundária |
| Ghost | transparent | `--ghost` | — | Cancelar, dispensar |
| Danger | `#FEF0EC` | `#F5653A` | 1px ember/15% | Deletar |

**Tamanhos:**
- `sm`: padding 6px 12px, font 11px, radius 6px
- `base`: padding 9px 17px, font 13px, radius 8px
- `lg`: padding 12px 22px, font 14px weight 600, radius 12px

**Estados:**
```css
:hover { opacity: .85 (primary) / background-shift (outros) }
:active { transform: scale(0.97); transition: 0.1s }
:focus-visible { box-shadow: 0 0 0 3px rgba(26,229,160,.3) }
```

### Inputs

```css
height: 38px
border: 1.5px solid rgba(0,0,0,.11)
border-radius: 8px
padding: 0 12px
font-size: 13px
font-family: DM Sans
background: #fff / #1C1E23 (dark)
transition: border-color 0.15s, box-shadow 0.15s

:focus {
  border-color: #0FBF82
  box-shadow: 0 0 0 3px rgba(26,229,160,.12)
  outline: none
}

.error {
  border-color: #F5653A
  box-shadow: 0 0 0 3px rgba(245,101,58,.1)
}
```

Labels: DM Mono 10px uppercase, `letter-spacing: 0.6px`, `color: --ghost`, acima do input com `margin-bottom: 6px`.

### Badges

```css
font-family: DM Mono
font-size: 10px
font-weight: 500
padding: 3px 8px
border-radius: 999px
letter-spacing: 0.3px

.up   { background: #E6FDF5; color: #0A9465 }
.down { background: #FEF0EC; color: #F5653A }
.info { background: #E8EFFF; color: #3B7BF8 }
.warn { background: #FEF6E4; color: #B57A00 }
.neutral { background: --mist-2; color: --ghost }
```

### Sidebar

```css
background: #111214
width: 200px
border-right: 1px solid rgba(255,255,255,.05)

/* Nav item */
padding: 6px 8px
border-radius: 6px
font-size: 11.5px

/* Ativo */
background: rgba(26,229,160,.08)
color: #E8E9EC
font-weight: 500
dot: 4px, background: #1AE5A0

/* Hover */
background: rgba(255,255,255,.04)
color: #9BA0AE

/* Inativo */
color: #5A5E6B
dot: background: #2E3038
```

---

## Tabelas

```css
/* Wrapper */
border-radius: 12px
border: 1px solid rgba(0,0,0,.07)
overflow: hidden

/* Header */
font-family: DM Mono
font-size: 10px
font-weight: 500
letter-spacing: 0.5px
text-transform: uppercase
color: --ghost
padding: 10px 14px
border-bottom: 1px solid rgba(0,0,0,.07)

/* Cells */
font-size: 12.5px
padding: 10px 14px
border-bottom: 1px solid rgba(0,0,0,.05)

/* Hover */
tr:hover td { background: --mist }

/* Paths (URLs) */
font-family: DM Mono
font-size: 11.5px
```

---

## Gráficos

```css
/* Barras */
border-radius: 2px 2px 0 0
/* Recentes: jade sólido */
/* Históricas: rgba(26,229,160, 0.1 a 0.3) */

/* Grid lines */
horizontal: rgba(0,0,0,.04)
vertical: nenhuma

/* Axis labels */
font-family: DM Mono
font-size: 10px
color: --ghost
```

---

## Ícones

- **Biblioteca base:** Lucide Icons customizado
- **Stroke:** 1.4px
- **Linecap/join:** round
- **Tamanho base:** 16×16
- **Sempre stroke, nunca filled**
- Tamanhos permitidos: 12px, 16px, 20px, 24px

---

## Microinterações e Animações

### Page Load
```js
// Entrada de elementos
initial: { opacity: 0, y: 6 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
// Delay escalonado: KPIs 0ms, chart 100ms, bottom row 200ms
```

### Troca de Período
```js
// Saída
exit: { opacity: 0, y: -4 }
// Entrada
initial: { opacity: 0, y: 4 }
transition: { duration: 0.25 }
```

### Modais e Popovers
```js
initial: { scale: 0.96, opacity: 0 }
animate: { scale: 1, opacity: 1 }
transition: { duration: 0.2, ease: 'easeOut' }
// Dismiss
exit: { scale: 0.98, opacity: 0, transition: { duration: 0.15 } }
```

### Contadores de KPI
```js
// Counter animation ao carregar
// 0 → valor final em 400ms com requestAnimationFrame
```

### Barra de Progresso
```css
transition: width 0.6s cubic-bezier(.4, 0, .2, 1)
```

### Skeleton Loading
```css
background: #EDEEF2
border-radius: 4px
animation: shimmer 1.4s ease infinite
@keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
```

### Regra Global
- **Nenhuma animação acima de 500ms**
- Nada que bloqueie interação
- `useReducedMotion()` do Framer Motion em TODOS os componentes animados

---

## Empty States

### Empty Funcional (sem dados ainda)
```css
border: 2px dashed --mist-3
border-radius: 16px
padding: 40px 24px
display: flex
flex-direction: column
align-items: center
gap: 12px
text-align: center

Ícone: 48px, background --mist-2, border-radius 12px
Título: Syne 14px 600
Texto: DM Sans 12px --ghost, max-width 200px
CTA: botão accent sm
```

---

## Hero da Landing Page

```css
/* Container */
background: #0A0B0D

/* Layout */
display: grid
grid-template-columns: 45% 55%
gap: 40px
padding: 60px 32px

/* Headline */
font-family: Syne
font-size: 48–64px
font-weight: 800
letter-spacing: -2.5px
line-height: 0.92
color: #E8E9EC
/* Keyword em jade */

/* Preview do dashboard */
transform: perspective(1200px) rotateY(-6deg) rotateX(3deg)
/* Floating badges ancorados no preview */

/* Trust signals abaixo dos CTAs */
font-family: DM Mono
font-size: 10px
color: #3E4047
```

---

## Estrutura de Componentes (Next.js)

```
/components
  /ui
    Button.tsx
    Input.tsx
    Select.tsx
    Toggle.tsx
    Badge.tsx
    Card.tsx
    Modal.tsx
    Tooltip.tsx
    Skeleton.tsx
    EmptyState.tsx
  /charts
    Sparkline.tsx
    BarChart.tsx
    LineChart.tsx
    theme.ts          ← tokens do ClarityPulse para Recharts
  /layout
    Sidebar.tsx
    Topbar.tsx
    PageShell.tsx
    SitePicker.tsx
  /dashboard
    KPICard.tsx
    SourceRow.tsx
    PageTable.tsx
    AIInsightCard.tsx
    RealtimeDot.tsx

/styles
  tokens.css          ← CSS variables nativas (não só Tailwind)
  globals.css
```

---

## Implementação do Dark Mode

```css
/* tokens.css */
:root {
  --bg-page: #F7F8FA;
  --bg-card: #ffffff;
  --bg-surface: #EDEEF2;
  --text-primary: #0A0B0D;
  --text-secondary: #9BA0AE;
  --border: rgba(0,0,0,.07);
  /* ... */
}

[data-theme="dark"] {
  --bg-page: #0A0B0D;
  --bg-card: #111214;
  --bg-surface: #1C1E23;
  --text-primary: #E8E9EC;
  --text-secondary: #9BA0AE;
  --border: rgba(255,255,255,.06);
  /* ... */
}
```

Persistir em `localStorage` como `cp-theme`. Toggle via `document.documentElement.setAttribute('data-theme', theme)`.

---

## Acessibilidade

- `focus-visible` em TODOS os elementos interativos com focus ring jade
- `aria-label` em todos os ícones standalone
- Contraste mínimo 4.5:1 para texto body, 3:1 para elementos grandes
- `prefers-reduced-motion` aplicado globalmente via `useReducedMotion()`
- Ordem de tab lógica (sidebar → topbar → content)
- Roles semânticos: `nav`, `main`, `aside`, `button` vs `div`
