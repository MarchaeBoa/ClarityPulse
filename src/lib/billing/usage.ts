// ============================================================
// ClarityPulse — Usage Limits & Checking
// ============================================================

import { type PlanSlug, type FeatureKey, PLANS, hasFeature, getNextPlan } from "./plans";

// ============================================================
// USAGE DATA SHAPE
// ============================================================

export interface WorkspaceUsage {
  pageviewsThisMonth: number;
  customEventsCount: number;       // distinct event types
  sitesCount: number;
  membersCount: number;
  aiMessagesToday: number;
  lastInsightAt: number | null;    // timestamp ms
}

// ============================================================
// LIMIT CHECK RESULTS
// ============================================================

export type LimitStatus = "ok" | "warning" | "exceeded";

export interface LimitCheckResult {
  status: LimitStatus;
  current: number;
  limit: number;
  percentage: number;             // 0–100+
  limitLabel: string;
  upgradeSlug: PlanSlug | null;
}

// ============================================================
// THRESHOLDS
// ============================================================

const WARNING_THRESHOLD = 80;     // show warning at 80% usage

// ============================================================
// LIMIT CHECKERS
// ============================================================

export function checkPageviewLimit(planSlug: PlanSlug, usage: WorkspaceUsage): LimitCheckResult {
  const plan = PLANS[planSlug];
  const limit = plan.maxPageviewsMonth;

  if (limit === -1) {
    return { status: "ok", current: usage.pageviewsThisMonth, limit: -1, percentage: 0, limitLabel: "Ilimitado", upgradeSlug: null };
  }

  const percentage = (usage.pageviewsThisMonth / limit) * 100;
  const status: LimitStatus = percentage >= 100 ? "exceeded" : percentage >= WARNING_THRESHOLD ? "warning" : "ok";

  return {
    status,
    current: usage.pageviewsThisMonth,
    limit,
    percentage: Math.round(percentage),
    limitLabel: formatNumber(limit),
    upgradeSlug: status !== "ok" ? getNextPlan(planSlug) : null,
  };
}

export function checkSiteLimit(planSlug: PlanSlug, usage: WorkspaceUsage): LimitCheckResult {
  const plan = PLANS[planSlug];
  const limit = plan.maxSites;

  if (limit === -1) {
    return { status: "ok", current: usage.sitesCount, limit: -1, percentage: 0, limitLabel: "Ilimitado", upgradeSlug: null };
  }

  const percentage = (usage.sitesCount / limit) * 100;
  const status: LimitStatus = percentage >= 100 ? "exceeded" : percentage >= WARNING_THRESHOLD ? "warning" : "ok";

  return {
    status,
    current: usage.sitesCount,
    limit,
    percentage: Math.round(percentage),
    limitLabel: `${limit} sites`,
    upgradeSlug: status !== "ok" ? getNextPlan(planSlug) : null,
  };
}

export function checkMemberLimit(planSlug: PlanSlug, usage: WorkspaceUsage): LimitCheckResult {
  const plan = PLANS[planSlug];
  const limit = plan.maxMembers;

  if (limit === -1) {
    return { status: "ok", current: usage.membersCount, limit: -1, percentage: 0, limitLabel: "Ilimitado", upgradeSlug: null };
  }

  const percentage = (usage.membersCount / limit) * 100;
  const status: LimitStatus = percentage >= 100 ? "exceeded" : percentage >= WARNING_THRESHOLD ? "warning" : "ok";

  return {
    status,
    current: usage.membersCount,
    limit,
    percentage: Math.round(percentage),
    limitLabel: `${limit} membros`,
    upgradeSlug: status !== "ok" ? getNextPlan(planSlug) : null,
  };
}

export function checkAIChatLimit(planSlug: PlanSlug, usage: WorkspaceUsage): LimitCheckResult {
  const plan = PLANS[planSlug];
  const limit = plan.ai.chatMessagesPerDay;

  if (!plan.ai.chatEnabled) {
    return { status: "exceeded", current: 0, limit: 0, percentage: 100, limitLabel: "Não disponível", upgradeSlug: getNextPlan(planSlug) };
  }

  if (limit === -1) {
    return { status: "ok", current: usage.aiMessagesToday, limit: -1, percentage: 0, limitLabel: "Ilimitado", upgradeSlug: null };
  }

  const percentage = (usage.aiMessagesToday / limit) * 100;
  const status: LimitStatus = percentage >= 100 ? "exceeded" : percentage >= WARNING_THRESHOLD ? "warning" : "ok";

  return {
    status,
    current: usage.aiMessagesToday,
    limit,
    percentage: Math.round(percentage),
    limitLabel: `${limit} msgs/dia`,
    upgradeSlug: status !== "ok" ? getNextPlan(planSlug) : null,
  };
}

// ============================================================
// FEATURE ACCESS CHECK
// ============================================================

export interface FeatureAccessResult {
  allowed: boolean;
  requiredPlan: PlanSlug | null;
}

export function checkFeatureAccess(planSlug: PlanSlug, feature: FeatureKey): FeatureAccessResult {
  const allowed = hasFeature(planSlug, feature);

  if (allowed) {
    return { allowed: true, requiredPlan: null };
  }

  // Find the cheapest plan that has this feature
  const plans: PlanSlug[] = ["starter", "growth", "team", "enterprise"];
  for (const slug of plans) {
    if (hasFeature(slug, feature)) {
      return { allowed: false, requiredPlan: slug };
    }
  }

  return { allowed: false, requiredPlan: "enterprise" };
}

// ============================================================
// AGGREGATE USAGE CHECK
// ============================================================

export interface UsageSummary {
  pageviews: LimitCheckResult;
  sites: LimitCheckResult;
  members: LimitCheckResult;
  aiChat: LimitCheckResult;
  hasAnyWarning: boolean;
  hasAnyExceeded: boolean;
  mostCritical: LimitCheckResult | null;
}

export function getUsageSummary(planSlug: PlanSlug, usage: WorkspaceUsage): UsageSummary {
  const pageviews = checkPageviewLimit(planSlug, usage);
  const sites = checkSiteLimit(planSlug, usage);
  const members = checkMemberLimit(planSlug, usage);
  const aiChat = checkAIChatLimit(planSlug, usage);

  const checks = [pageviews, sites, members, aiChat];
  const hasAnyWarning = checks.some((c) => c.status === "warning");
  const hasAnyExceeded = checks.some((c) => c.status === "exceeded");

  // Find most critical limit (highest percentage that is exceeded or warning)
  const critical = checks
    .filter((c) => c.status !== "ok")
    .sort((a, b) => b.percentage - a.percentage);

  return {
    pageviews,
    sites,
    members,
    aiChat,
    hasAnyWarning,
    hasAnyExceeded,
    mostCritical: critical[0] ?? null,
  };
}

// ============================================================
// HELPERS
// ============================================================

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}
