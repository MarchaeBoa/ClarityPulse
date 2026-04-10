/**
 * ClarityPulse — Agency Mode
 *
 * Multi-client management for agencies.
 * Manage multiple client websites from a single dashboard.
 */

export type ClientStatus = "active" | "paused" | "onboarding" | "churned";

export interface AgencyClient {
  id: string;
  name: string;
  logo: string; // initials or URL
  domain: string;
  plan: string;
  status: ClientStatus;
  addedAt: string;
  metrics: {
    visitors: number;
    visitorsChange: number;
    conversions: number;
    conversionsChange: number;
    revenue: number;
    revenueChange: number;
    bounceRate: number;
    healthScore: number;
  };
  alerts: number;
  lastReport: string;
  tags: string[];
}

export interface AgencyOverview {
  totalClients: number;
  activeClients: number;
  totalVisitors: number;
  totalConversions: number;
  totalRevenue: number;
  avgHealthScore: number;
  clients: AgencyClient[];
  recentActivity: AgencyActivity[];
}

export interface AgencyActivity {
  id: string;
  client: string;
  type: "alert" | "report" | "milestone" | "issue";
  message: string;
  timestamp: string;
}

export function getAgencyOverview(): AgencyOverview {
  const clients = getAgencyClients();
  const activeClients = clients.filter((c) => c.status === "active");

  return {
    totalClients: clients.length,
    activeClients: activeClients.length,
    totalVisitors: clients.reduce((s, c) => s + c.metrics.visitors, 0),
    totalConversions: clients.reduce((s, c) => s + c.metrics.conversions, 0),
    totalRevenue: clients.reduce((s, c) => s + c.metrics.revenue, 0),
    avgHealthScore: Math.round(
      activeClients.reduce((s, c) => s + c.metrics.healthScore, 0) / (activeClients.length || 1)
    ),
    clients,
    recentActivity: getRecentActivity(),
  };
}

export function getAgencyClients(): AgencyClient[] {
  return [
    {
      id: "client-1",
      name: "TechStore Brasil",
      logo: "TS",
      domain: "techstore.com.br",
      plan: "Growth",
      status: "active",
      addedAt: "2025-08-15",
      metrics: {
        visitors: 45200,
        visitorsChange: 18.5,
        conversions: 3240,
        conversionsChange: 22.1,
        revenue: 89400,
        revenueChange: 15.3,
        bounceRate: 35.2,
        healthScore: 87,
      },
      alerts: 2,
      lastReport: "2026-04-07",
      tags: ["e-commerce", "premium"],
    },
    {
      id: "client-2",
      name: "Clínica Vida",
      logo: "CV",
      domain: "clinicavida.com.br",
      plan: "Starter",
      status: "active",
      addedAt: "2025-10-20",
      metrics: {
        visitors: 12800,
        visitorsChange: 8.2,
        conversions: 640,
        conversionsChange: 12.5,
        revenue: 32000,
        revenueChange: 9.8,
        bounceRate: 42.1,
        healthScore: 72,
      },
      alerts: 1,
      lastReport: "2026-04-07",
      tags: ["saúde", "lead-gen"],
    },
    {
      id: "client-3",
      name: "Edu Academy",
      logo: "EA",
      domain: "eduacademy.com.br",
      plan: "Growth",
      status: "active",
      addedAt: "2025-06-01",
      metrics: {
        visitors: 78500,
        visitorsChange: 32.4,
        conversions: 5890,
        conversionsChange: 28.7,
        revenue: 147250,
        revenueChange: 35.2,
        bounceRate: 28.4,
        healthScore: 94,
      },
      alerts: 0,
      lastReport: "2026-04-07",
      tags: ["educação", "premium", "saas"],
    },
    {
      id: "client-4",
      name: "Restaurante Sabor",
      logo: "RS",
      domain: "restaurantesabor.com.br",
      plan: "Starter",
      status: "active",
      addedAt: "2026-01-10",
      metrics: {
        visitors: 8400,
        visitorsChange: -5.3,
        conversions: 420,
        conversionsChange: -8.1,
        revenue: 16800,
        revenueChange: -3.2,
        bounceRate: 51.8,
        healthScore: 48,
      },
      alerts: 4,
      lastReport: "2026-04-07",
      tags: ["gastronomia", "local"],
    },
    {
      id: "client-5",
      name: "FinApp Pro",
      logo: "FA",
      domain: "finapp.pro",
      plan: "Team",
      status: "active",
      addedAt: "2025-04-20",
      metrics: {
        visitors: 124000,
        visitorsChange: 14.8,
        conversions: 8680,
        conversionsChange: 19.3,
        revenue: 434000,
        revenueChange: 24.1,
        bounceRate: 22.5,
        healthScore: 96,
      },
      alerts: 1,
      lastReport: "2026-04-07",
      tags: ["fintech", "premium", "enterprise"],
    },
    {
      id: "client-6",
      name: "Loja Flores",
      logo: "LF",
      domain: "lojaflores.com.br",
      plan: "Starter",
      status: "onboarding",
      addedAt: "2026-04-01",
      metrics: {
        visitors: 2100,
        visitorsChange: 0,
        conversions: 84,
        conversionsChange: 0,
        revenue: 4200,
        revenueChange: 0,
        bounceRate: 45.0,
        healthScore: 55,
      },
      alerts: 0,
      lastReport: "—",
      tags: ["e-commerce", "novo"],
    },
    {
      id: "client-7",
      name: "Gym Power",
      logo: "GP",
      domain: "gympower.com.br",
      plan: "Growth",
      status: "paused",
      addedAt: "2025-07-12",
      metrics: {
        visitors: 0,
        visitorsChange: -100,
        conversions: 0,
        conversionsChange: -100,
        revenue: 0,
        revenueChange: -100,
        bounceRate: 0,
        healthScore: 0,
      },
      alerts: 0,
      lastReport: "2026-02-28",
      tags: ["fitness", "pausado"],
    },
  ];
}

function getRecentActivity(): AgencyActivity[] {
  return [
    {
      id: "act-1",
      client: "TechStore Brasil",
      type: "alert",
      message: "Bounce rate mobile subiu para 48% — ação recomendada",
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: "act-2",
      client: "Edu Academy",
      type: "milestone",
      message: "Atingiu 5.000+ conversões no mês — novo recorde!",
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      id: "act-3",
      client: "Restaurante Sabor",
      type: "issue",
      message: "Tráfego em queda por 3 semanas consecutivas",
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    },
    {
      id: "act-4",
      client: "FinApp Pro",
      type: "report",
      message: "Relatório semanal enviado automaticamente",
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
    {
      id: "act-5",
      client: "Loja Flores",
      type: "milestone",
      message: "Onboarding iniciado — tracking script instalado",
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: "act-6",
      client: "Clínica Vida",
      type: "alert",
      message: "Taxa de conversão caiu 12% — revisar landing page",
      timestamp: new Date(Date.now() - 36 * 3600000).toISOString(),
    },
  ];
}
