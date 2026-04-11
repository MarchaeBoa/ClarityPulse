"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DashboardKPI {
  uniqueVisitors: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number; // seconds
  conversions: number;
  revenue: number;
  // previous period for % change
  prevUniqueVisitors: number;
  prevPageviews: number;
  prevBounceRate: number;
  prevAvgDuration: number;
  prevConversions: number;
  prevRevenue: number;
}

export interface DailyTraffic {
  date: string;
  visitors: number;
  pageviews: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface TopPage {
  path: string;
  views: number;
  uniques: number;
  bounceRate: number;
  avgDuration: number;
}

export interface RecentEvent {
  id: string;
  eventName: string;
  pagePath: string;
  occurredAt: string;
  properties: Record<string, unknown> | null;
}

export interface GeoEntry {
  countryCode: string;
  countryName: string;
  visitors: number;
  percentage: number;
}

export interface UTMEntry {
  name: string;
  visitors: number;
  conversions: number;
  convRate: number;
}

export interface GoalProgress {
  id: string;
  name: string;
  current: number;
  target: number;
}

export interface DashboardData {
  kpis: DashboardKPI;
  dailyTraffic: DailyTraffic[];
  trafficSources: TrafficSource[];
  topPages: TopPage[];
  recentEvents: RecentEvent[];
  geoBreakdown: GeoEntry[];
  utmSources: UTMEntry[];
  utmMediums: UTMEntry[];
  utmCampaigns: UTMEntry[];
  goals: GoalProgress[];
  totalCountries: number;
}

interface SiteInfo {
  id: string;
  name: string;
  domain: string;
}

interface DashboardContextType {
  dateRange: string;
  setDateRange: (range: string) => void;
  siteId: string | null;
  setSiteId: (id: string) => void;
  sites: SiteInfo[];
  sitesLoading: boolean;
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Date range helpers                                                 */
/* ------------------------------------------------------------------ */

function getDateBounds(range: string): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().slice(0, 10);

  const sub = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  };

  switch (range) {
    case "today":
      return { from: to, to };
    case "yesterday": {
      const y = sub(1);
      return { from: y, to: y };
    }
    case "7d":
      return { from: sub(6), to };
    case "30d":
      return { from: sub(29), to };
    case "90d":
      return { from: sub(89), to };
    case "month": {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: first.toISOString().slice(0, 10), to };
    }
    case "year": {
      const jan1 = new Date(now.getFullYear(), 0, 1);
      return { from: jan1.toISOString().slice(0, 10), to };
    }
    default:
      return { from: sub(29), to };
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState("30d");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [sitesLoading, setSitesLoading] = useState(true);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdRef = useRef(0);

  // ---- Fetch user sites ----
  useEffect(() => {
    async function loadSites() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          setSites([]);
          return;
        }
        const list = await res.json();
        const mapped: SiteInfo[] = list.map(
          (p: { id: string; name: string; domain: string }) => ({
            id: p.id,
            name: p.name,
            domain: p.domain,
          })
        );
        setSites(mapped);
        if (mapped.length > 0 && !siteId) {
          setSiteId(mapped[0].id);
        }
      } catch {
        setSites([]);
      } finally {
        setSitesLoading(false);
      }
    }
    loadSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Fetch dashboard data ----
  const fetchData = useCallback(async () => {
    if (!siteId) {
      setLoading(false);
      setData(null);
      return;
    }

    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const { from, to } = getDateBounds(dateRange);
      const params = new URLSearchParams({ siteId, from, to });
      const res = await fetch(`/api/analytics/overview?${params}`);

      if (id !== fetchIdRef.current) return; // stale

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to fetch analytics");
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      if (id === fetchIdRef.current) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      }
    } finally {
      if (id === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [siteId, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContext.Provider
      value={{
        dateRange,
        setDateRange,
        siteId,
        setSiteId,
        sites,
        sitesLoading,
        data,
        loading,
        error,
        refresh: fetchData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
