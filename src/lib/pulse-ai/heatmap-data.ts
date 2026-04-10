/**
 * Pulse AI — Heatmap Data (Premium)
 *
 * Simulates click/scroll/attention heatmap data
 * for premium plan users.
 */

export interface HeatmapPoint {
  x: number; // 0-100 percentage
  y: number;
  value: number; // 0-100 intensity
}

export interface HeatmapZone {
  id: string;
  label: string;
  selector: string;
  clicks: number;
  percentage: number;
  avgTimeVisible: string;
  engagement: "high" | "medium" | "low";
}

export interface ScrollDepthData {
  depth: number; // 0-100
  percentage: number; // % of users reaching this depth
}

export interface HeatmapPage {
  path: string;
  title: string;
  totalClicks: number;
  totalSessions: number;
  avgScrollDepth: number;
  zones: HeatmapZone[];
  clickPoints: HeatmapPoint[];
  scrollDepth: ScrollDepthData[];
}

export function getHeatmapPages(): HeatmapPage[] {
  return [
    {
      path: "/",
      title: "Homepage",
      totalClicks: 34520,
      totalSessions: 6200,
      avgScrollDepth: 62,
      zones: [
        { id: "hero-cta", label: "Hero CTA Button", selector: ".hero .cta-button", clicks: 4830, percentage: 14.0, avgTimeVisible: "8.2s", engagement: "high" },
        { id: "nav-menu", label: "Menu de Navegação", selector: "nav", clicks: 8920, percentage: 25.8, avgTimeVisible: "12.5s", engagement: "high" },
        { id: "pricing-link", label: "Link para Pricing", selector: ".pricing-link", clicks: 3210, percentage: 9.3, avgTimeVisible: "3.1s", engagement: "medium" },
        { id: "features-section", label: "Seção Features", selector: ".features", clicks: 2840, percentage: 8.2, avgTimeVisible: "15.3s", engagement: "high" },
        { id: "social-proof", label: "Social Proof", selector: ".testimonials", clicks: 1280, percentage: 3.7, avgTimeVisible: "6.8s", engagement: "medium" },
        { id: "footer", label: "Footer", selector: "footer", clicks: 890, percentage: 2.6, avgTimeVisible: "2.1s", engagement: "low" },
      ],
      clickPoints: generateClickPoints("homepage"),
      scrollDepth: [
        { depth: 0, percentage: 100 },
        { depth: 10, percentage: 95 },
        { depth: 20, percentage: 88 },
        { depth: 30, percentage: 78 },
        { depth: 40, percentage: 68 },
        { depth: 50, percentage: 58 },
        { depth: 60, percentage: 48 },
        { depth: 70, percentage: 38 },
        { depth: 80, percentage: 28 },
        { depth: 90, percentage: 18 },
        { depth: 100, percentage: 12 },
      ],
    },
    {
      path: "/pricing",
      title: "Pricing",
      totalClicks: 18940,
      totalSessions: 12840,
      avgScrollDepth: 78,
      zones: [
        { id: "plan-growth", label: "Plano Growth (CTA)", selector: ".plan-growth .cta", clicks: 5680, percentage: 30.0, avgTimeVisible: "22.4s", engagement: "high" },
        { id: "plan-starter", label: "Plano Starter (CTA)", selector: ".plan-starter .cta", clicks: 2840, percentage: 15.0, avgTimeVisible: "14.8s", engagement: "high" },
        { id: "plan-toggle", label: "Toggle Mensal/Anual", selector: ".billing-toggle", clicks: 4210, percentage: 22.2, avgTimeVisible: "5.2s", engagement: "high" },
        { id: "comparison-table", label: "Tabela Comparativa", selector: ".comparison", clicks: 3120, percentage: 16.5, avgTimeVisible: "35.6s", engagement: "high" },
        { id: "faq-section", label: "FAQ", selector: ".faq", clicks: 1890, percentage: 10.0, avgTimeVisible: "18.3s", engagement: "medium" },
        { id: "enterprise-cta", label: "Falar com Vendas", selector: ".enterprise-cta", clicks: 620, percentage: 3.3, avgTimeVisible: "3.8s", engagement: "low" },
      ],
      clickPoints: generateClickPoints("pricing"),
      scrollDepth: [
        { depth: 0, percentage: 100 },
        { depth: 10, percentage: 97 },
        { depth: 20, percentage: 94 },
        { depth: 30, percentage: 90 },
        { depth: 40, percentage: 85 },
        { depth: 50, percentage: 80 },
        { depth: 60, percentage: 74 },
        { depth: 70, percentage: 68 },
        { depth: 80, percentage: 55 },
        { depth: 90, percentage: 40 },
        { depth: 100, percentage: 28 },
      ],
    },
    {
      path: "/features",
      title: "Features",
      totalClicks: 12680,
      totalSessions: 7650,
      avgScrollDepth: 55,
      zones: [
        { id: "feature-ai", label: "Feature AI Insights", selector: ".feature-ai", clicks: 3240, percentage: 25.6, avgTimeVisible: "12.8s", engagement: "high" },
        { id: "feature-privacy", label: "Feature Privacy", selector: ".feature-privacy", clicks: 2180, percentage: 17.2, avgTimeVisible: "10.2s", engagement: "high" },
        { id: "feature-events", label: "Feature Events", selector: ".feature-events", clicks: 1890, percentage: 14.9, avgTimeVisible: "8.5s", engagement: "medium" },
        { id: "demo-video", label: "Botão Demo/Vídeo", selector: ".demo-cta", clicks: 1420, percentage: 11.2, avgTimeVisible: "4.2s", engagement: "medium" },
        { id: "signup-cta", label: "CTA Sign Up", selector: ".signup-cta", clicks: 980, percentage: 7.7, avgTimeVisible: "2.8s", engagement: "medium" },
        { id: "integration-logos", label: "Logos Integrações", selector: ".integrations", clicks: 540, percentage: 4.3, avgTimeVisible: "6.1s", engagement: "low" },
      ],
      clickPoints: generateClickPoints("features"),
      scrollDepth: [
        { depth: 0, percentage: 100 },
        { depth: 10, percentage: 92 },
        { depth: 20, percentage: 82 },
        { depth: 30, percentage: 72 },
        { depth: 40, percentage: 60 },
        { depth: 50, percentage: 50 },
        { depth: 60, percentage: 40 },
        { depth: 70, percentage: 30 },
        { depth: 80, percentage: 22 },
        { depth: 90, percentage: 15 },
        { depth: 100, percentage: 10 },
      ],
    },
  ];
}

function generateClickPoints(page: string): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];
  const seed = page === "homepage" ? 42 : page === "pricing" ? 84 : 126;

  // Generate cluster-based click points
  const clusters = page === "pricing"
    ? [
        { cx: 50, cy: 30, spread: 15, count: 40, intensity: 90 },
        { cx: 30, cy: 35, spread: 8, count: 25, intensity: 75 },
        { cx: 70, cy: 35, spread: 8, count: 20, intensity: 70 },
        { cx: 50, cy: 15, spread: 20, count: 30, intensity: 60 },
        { cx: 50, cy: 65, spread: 25, count: 15, intensity: 40 },
      ]
    : page === "homepage"
    ? [
        { cx: 50, cy: 20, spread: 12, count: 35, intensity: 95 },
        { cx: 50, cy: 8, spread: 25, count: 40, intensity: 70 },
        { cx: 30, cy: 45, spread: 10, count: 20, intensity: 60 },
        { cx: 70, cy: 45, spread: 10, count: 20, intensity: 55 },
        { cx: 50, cy: 70, spread: 20, count: 15, intensity: 35 },
      ]
    : [
        { cx: 50, cy: 25, spread: 15, count: 30, intensity: 85 },
        { cx: 25, cy: 40, spread: 10, count: 20, intensity: 65 },
        { cx: 75, cy: 40, spread: 10, count: 20, intensity: 60 },
        { cx: 50, cy: 55, spread: 12, count: 18, intensity: 50 },
        { cx: 50, cy: 80, spread: 20, count: 10, intensity: 30 },
      ];

  let s = seed;
  for (const cluster of clusters) {
    for (let i = 0; i < cluster.count; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const angle = (s / 0x7fffffff) * Math.PI * 2;
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const dist = (s / 0x7fffffff) * cluster.spread;
      const x = Math.max(2, Math.min(98, cluster.cx + Math.cos(angle) * dist));
      const y = Math.max(2, Math.min(98, cluster.cy + Math.sin(angle) * dist));
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const val = Math.max(10, cluster.intensity - (dist / cluster.spread) * 40 + ((s / 0x7fffffff) - 0.5) * 20);
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, value: Math.round(val) });
    }
  }

  return points;
}
