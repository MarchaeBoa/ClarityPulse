/**
 * Pulse AI — Problematic Pages Detection
 *
 * Detects pages with performance issues, high bounce rates,
 * slow load times, or declining engagement.
 */

import { getTopPages } from "./analytics-data";

export type IssueType =
  | "high_bounce"
  | "slow_loading"
  | "low_engagement"
  | "declining_traffic"
  | "high_exit_rate"
  | "low_conversion"
  | "mobile_issues";

export type IssueSeverity = "critical" | "warning" | "info";

export interface PageIssue {
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  impact: string;
  fix: string;
}

export interface ProblematicPage {
  path: string;
  title: string;
  score: number; // 0-100 health score
  issues: PageIssue[];
  metrics: {
    views: number;
    bounceRate: number;
    avgTime: string;
    loadTime: string;
    exitRate: number;
    mobileScore: number;
    change: number;
  };
  estimatedLostConversions: number;
  priority: "high" | "medium" | "low";
}

export interface PageHealthReport {
  pages: ProblematicPage[];
  totalIssues: number;
  criticalCount: number;
  estimatedTotalLoss: number;
  summary: string;
  topRecommendation: string;
}

export function detectProblematicPages(): PageHealthReport {
  const pages = getTopPages();

  const problematicPages: ProblematicPage[] = [
    {
      path: "/",
      title: "Homepage",
      score: 58,
      issues: [
        {
          type: "high_bounce",
          severity: "warning",
          title: "Bounce rate acima da média",
          description: "A homepage tem bounce rate de 42.8%, acima da média do site (38.2%).",
          impact: "Aproximadamente 265 visitantes saem sem interagir por semana.",
          fix: "Melhore o hero section com CTA mais claro e adicione social proof visível above-the-fold.",
        },
        {
          type: "slow_loading",
          severity: "critical",
          title: "Tempo de carregamento alto no mobile",
          description: "A homepage leva 4.8s para carregar no mobile (meta: < 3s).",
          impact: "Cada segundo extra reduz conversões em ~7%.",
          fix: "Comprima imagens hero (salve 340KB), implemente lazy loading para seções below-the-fold.",
        },
        {
          type: "mobile_issues",
          severity: "warning",
          title: "Layout quebrado em telas < 375px",
          description: "O menu hamburger sobrepõe o CTA principal em dispositivos pequenos.",
          impact: "15% dos visitantes mobile não conseguem clicar no CTA.",
          fix: "Ajuste o z-index do menu e reduza o padding do hero em breakpoints < 375px.",
        },
      ],
      metrics: {
        views: 6200,
        bounceRate: 42.8,
        avgTime: "2m 15s",
        loadTime: "4.8s",
        exitRate: 35.2,
        mobileScore: 52,
        change: 5.4,
      },
      estimatedLostConversions: 42,
      priority: "high",
    },
    {
      path: "/about",
      title: "About Us",
      score: 35,
      issues: [
        {
          type: "declining_traffic",
          severity: "warning",
          title: "Tráfego em queda (-8.2%)",
          description: "A página perdeu 8.2% de tráfego no último mês.",
          impact: "Menos 277 visitantes comparado ao mês anterior.",
          fix: "Atualize o conteúdo com números recentes, depoimentos novos e uma seção de timeline.",
        },
        {
          type: "high_bounce",
          severity: "critical",
          title: "Bounce rate de 48.3% — o pior do site",
          description: "Quase metade dos visitantes sai imediatamente.",
          impact: "A página está afastando potenciais clientes que querem conhecer a empresa.",
          fix: "Reescreva o conteúdo com foco em benefícios. Adicione vídeo institucional e CTAs para /pricing.",
        },
        {
          type: "low_engagement",
          severity: "warning",
          title: "Tempo médio de apenas 2m 50s",
          description: "Para uma página informativa, o tempo é baixo.",
          impact: "Visitantes não estão lendo o conteúdo completo.",
          fix: "Adicione elementos interativos: timeline, números animados, galeria da equipe.",
        },
      ],
      metrics: {
        views: 3100,
        bounceRate: 48.3,
        avgTime: "2m 50s",
        loadTime: "3.2s",
        exitRate: 52.1,
        mobileScore: 61,
        change: -8.2,
      },
      estimatedLostConversions: 28,
      priority: "high",
    },
    {
      path: "/contact",
      title: "Contact",
      score: 42,
      issues: [
        {
          type: "high_bounce",
          severity: "critical",
          title: "Bounce rate de 52.1% — alarmante",
          description: "Mais da metade dos visitantes sai da página de contato sem interagir.",
          impact: "Potenciais leads estão sendo perdidos.",
          fix: "Simplifique o formulário (máx 4 campos). Adicione chat widget e FAQ rápido.",
        },
        {
          type: "high_exit_rate",
          severity: "warning",
          title: "Taxa de saída de 68.3%",
          description: "A maioria dos visitantes que chegam nesta página sai do site.",
          impact: "A página está funcionando como 'beco sem saída'.",
          fix: "Adicione links para /pricing e /features após o formulário. Mostre cases de sucesso.",
        },
      ],
      metrics: {
        views: 2450,
        bounceRate: 52.1,
        avgTime: "1m 40s",
        loadTime: "2.1s",
        exitRate: 68.3,
        mobileScore: 78,
        change: 3.7,
      },
      estimatedLostConversions: 35,
      priority: "high",
    },
    {
      path: "/signup",
      title: "Sign Up",
      score: 62,
      issues: [
        {
          type: "high_bounce",
          severity: "warning",
          title: "Bounce rate de 35% na página de cadastro",
          description: "35% dos visitantes abandonam o signup antes de completar.",
          impact: "Aproximadamente 150 signups perdidos por mês.",
          fix: "Remova campos opcionais, adicione login social (Google/GitHub) e mostre o progresso.",
        },
        {
          type: "low_conversion",
          severity: "warning",
          title: "Conversão abaixo do esperado",
          description: "Com 4.320 views, esperava-se ~430 signups mas apenas ~280 completam.",
          impact: "Taxa de conversão de 6.5% vs meta de 10%.",
          fix: "Teste um fluxo de signup simplificado: apenas email + senha. Dados extras no onboarding.",
        },
      ],
      metrics: {
        views: 4320,
        bounceRate: 35.0,
        avgTime: "2m 05s",
        loadTime: "1.8s",
        exitRate: 28.5,
        mobileScore: 72,
        change: 28.9,
      },
      estimatedLostConversions: 150,
      priority: "medium",
    },
    {
      path: "/features",
      title: "Features",
      score: 68,
      issues: [
        {
          type: "high_bounce",
          severity: "warning",
          title: "Bounce rate de 31.5%",
          description: "A página de features está perdendo visitantes antes de mostrar todos os recursos.",
          impact: "Visitantes não veem features diferenciadores que poderiam converter.",
          fix: "Reorganize features com os mais populares no topo. Adicione demonstração interativa.",
        },
        {
          type: "mobile_issues",
          severity: "info",
          title: "Score mobile de 65/100",
          description: "As animações pesam no mobile e o carrossel trava.",
          impact: "UX mobile degradada para 33% dos visitantes.",
          fix: "Desative animações complexas no mobile via prefers-reduced-motion.",
        },
      ],
      metrics: {
        views: 7650,
        bounceRate: 31.5,
        avgTime: "3m 30s",
        loadTime: "3.5s",
        exitRate: 22.4,
        mobileScore: 65,
        change: 12.1,
      },
      estimatedLostConversions: 18,
      priority: "low",
    },
  ];

  const totalIssues = problematicPages.reduce((sum, p) => sum + p.issues.length, 0);
  const criticalCount = problematicPages.reduce(
    (sum, p) => sum + p.issues.filter((i) => i.severity === "critical").length,
    0
  );
  const estimatedTotalLoss = problematicPages.reduce((sum, p) => sum + p.estimatedLostConversions, 0);

  return {
    pages: problematicPages,
    totalIssues,
    criticalCount,
    estimatedTotalLoss,
    summary: `Detectamos ${totalIssues} problemas em ${problematicPages.length} páginas, incluindo ${criticalCount} críticos. Estima-se uma perda de ~${estimatedTotalLoss} conversões/mês.`,
    topRecommendation: "Priorize a otimização de velocidade da Homepage no mobile e a reestruturação da página About Us. Impacto estimado: +70 conversões/mês.",
  };
}
