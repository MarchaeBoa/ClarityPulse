/**
 * Pulse AI — Analytics Data Layer
 *
 * Mock analytics data service that simulates what a real database query layer
 * would return. In production, replace these functions with actual PostgreSQL
 * queries scoped to the user's workspace.
 */

export interface KPIData {
  label: string;
  value: string;
  change: number;
  previous: string;
}

export interface PageData {
  path: string;
  title: string;
  views: number;
  change: number;
  avgTime: string;
  bounceRate: number;
}

export interface TrafficSource {
  name: string;
  visitors: number;
  percentage: number;
  conversions: number;
  conversionRate: number;
}

export interface CampaignData {
  name: string;
  source: string;
  medium: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  change: number;
}

export interface AudienceData {
  device: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
  avgDuration: string;
  conversions: number;
}

export interface DailyTraffic {
  date: string;
  visitors: number;
  pageviews: number;
  conversions: number;
}

export function getKPIs(): KPIData[] {
  return [
    { label: "Unique Visitors", value: "24,521", change: 12.5, previous: "21,797" },
    { label: "Page Views", value: "89,342", change: 8.3, previous: "82,491" },
    { label: "Bounce Rate", value: "38.2%", change: -3.1, previous: "41.3%" },
    { label: "Avg. Session Duration", value: "3m 42s", change: 15.7, previous: "3m 12s" },
    { label: "Conversions", value: "1,847", change: 22.4, previous: "1,509" },
    { label: "Revenue", value: "$48,290", change: 18.6, previous: "$40,717" },
  ];
}

export function getTopPages(): PageData[] {
  return [
    { path: "/pricing", title: "Pricing", views: 12840, change: 34.2, avgTime: "4m 12s", bounceRate: 22.1 },
    { path: "/blog/privacy-analytics", title: "Privacy Analytics Guide", views: 8920, change: 67.8, avgTime: "6m 45s", bounceRate: 18.3 },
    { path: "/features", title: "Features", views: 7650, change: 12.1, avgTime: "3m 30s", bounceRate: 31.5 },
    { path: "/", title: "Homepage", views: 6200, change: 5.4, avgTime: "2m 15s", bounceRate: 42.8 },
    { path: "/blog/gdpr-guide", title: "GDPR Compliance Guide", views: 5180, change: 89.3, avgTime: "7m 20s", bounceRate: 15.2 },
    { path: "/signup", title: "Sign Up", views: 4320, change: 28.9, avgTime: "2m 05s", bounceRate: 35.0 },
    { path: "/about", title: "About Us", views: 3100, change: -8.2, avgTime: "2m 50s", bounceRate: 48.3 },
    { path: "/contact", title: "Contact", views: 2450, change: 3.7, avgTime: "1m 40s", bounceRate: 52.1 },
    { path: "/blog/analytics-tips", title: "10 Analytics Tips", views: 2100, change: 145.2, avgTime: "5m 30s", bounceRate: 20.8 },
    { path: "/docs", title: "Documentation", views: 1890, change: 18.4, avgTime: "8m 10s", bounceRate: 12.5 },
  ];
}

export function getTrafficSources(): TrafficSource[] {
  return [
    { name: "Google Organic", visitors: 9808, percentage: 40, conversions: 589, conversionRate: 6.0 },
    { name: "Direct", visitors: 5393, percentage: 22, conversions: 378, conversionRate: 7.0 },
    { name: "Social Media", visitors: 3678, percentage: 15, conversions: 184, conversionRate: 5.0 },
    { name: "Email Marketing", visitors: 2452, percentage: 10, conversions: 221, conversionRate: 9.0 },
    { name: "Referral", visitors: 1716, percentage: 7, conversions: 120, conversionRate: 7.0 },
    { name: "Paid Search", visitors: 1474, percentage: 6, conversions: 147, conversionRate: 10.0 },
  ];
}

export function getCampaigns(): CampaignData[] {
  return [
    { name: "Brand Q1", source: "google", medium: "cpc", visitors: 3240, conversions: 324, conversionRate: 10.0, revenue: 12960, change: 24.5 },
    { name: "Content Q1", source: "linkedin", medium: "social", visitors: 2180, conversions: 131, conversionRate: 6.0, revenue: 5240, change: 18.2 },
    { name: "Promo March", source: "email", medium: "newsletter", visitors: 1850, conversions: 222, conversionRate: 12.0, revenue: 8880, change: 35.1 },
    { name: "Launch 2024", source: "twitter", medium: "social", visitors: 1420, conversions: 71, conversionRate: 5.0, revenue: 2840, change: -12.3 },
    { name: "Partner ABC", source: "referral", medium: "partner", visitors: 980, conversions: 108, conversionRate: 11.0, revenue: 4320, change: 42.8 },
    { name: "Retargeting Q1", source: "google", medium: "display", visitors: 760, conversions: 38, conversionRate: 5.0, revenue: 1520, change: -8.7 },
    { name: "Pricing Q1", source: "google", medium: "cpc", visitors: 640, conversions: 83, conversionRate: 13.0, revenue: 3320, change: 56.3 },
  ];
}

export function getAudienceByDevice(): AudienceData[] {
  return [
    { device: "Desktop", visitors: 14712, percentage: 60, bounceRate: 32.4, avgDuration: "4m 15s", conversions: 1293 },
    { device: "Mobile", visitors: 8087, percentage: 33, bounceRate: 48.7, avgDuration: "2m 30s", conversions: 443 },
    { device: "Tablet", visitors: 1722, percentage: 7, bounceRate: 39.1, avgDuration: "3m 45s", conversions: 111 },
  ];
}

export function getDailyTraffic(): DailyTraffic[] {
  const data: DailyTraffic[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 600 + Math.floor(Math.random() * 400);
    const weekday = date.getDay();
    const multiplier = weekday === 0 || weekday === 6 ? 0.7 : 1 + (i < 10 ? 0.15 : 0);
    data.push({
      date: date.toISOString().split("T")[0],
      visitors: Math.floor(base * multiplier),
      pageviews: Math.floor(base * multiplier * 3.2),
      conversions: Math.floor(base * multiplier * 0.075),
    });
  }
  return data;
}

export function getAnalyticsSummary() {
  return {
    kpis: getKPIs(),
    topPages: getTopPages(),
    trafficSources: getTrafficSources(),
    campaigns: getCampaigns(),
    audienceByDevice: getAudienceByDevice(),
    dailyTraffic: getDailyTraffic(),
    period: "last 30 days",
  };
}
