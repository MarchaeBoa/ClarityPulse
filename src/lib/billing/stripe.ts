// ============================================================
// ClarityPulse — Stripe Integration Utilities
// ============================================================

import type { PlanSlug, BillingCycle } from "./plans";
import { PLANS, PURCHASABLE_PLANS } from "./plans";

// ============================================================
// STRIPE PRICE IDS (configurar via env ou Stripe Dashboard)
// ============================================================

/**
 * Mapeia cada plano + ciclo para o Price ID do Stripe.
 * Em produção, esses IDs vêm do Stripe Dashboard.
 * O formato é: price_<plan>_<cycle>
 */
interface StripePriceMap {
  monthly: string;
  yearly: string;
}

const STRIPE_PRICES: Record<string, StripePriceMap> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    yearly:  process.env.STRIPE_PRICE_STARTER_YEARLY ?? "",
  },
  growth: {
    monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY ?? "",
    yearly:  process.env.STRIPE_PRICE_GROWTH_YEARLY ?? "",
  },
  team: {
    monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "",
    yearly:  process.env.STRIPE_PRICE_TEAM_YEARLY ?? "",
  },
};

export function getStripePriceId(plan: PlanSlug, cycle: BillingCycle): string | null {
  const prices = STRIPE_PRICES[plan];
  if (!prices) return null;
  return prices[cycle] || null;
}

// ============================================================
// CHECKOUT SESSION CONFIG
// ============================================================

export interface CheckoutConfig {
  priceId: string;
  workspaceId: string;
  customerId?: string;
  customerEmail?: string;
  trialDays: number;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}

export function buildCheckoutConfig(params: {
  plan: PlanSlug;
  cycle: BillingCycle;
  workspaceId: string;
  customerId?: string;
  customerEmail?: string;
  baseUrl: string;
}): CheckoutConfig | null {
  if (!PURCHASABLE_PLANS.includes(params.plan)) return null;

  const priceId = getStripePriceId(params.plan, params.cycle);
  if (!priceId) return null;

  const planDef = PLANS[params.plan];

  return {
    priceId,
    workspaceId: params.workspaceId,
    customerId: params.customerId,
    customerEmail: params.customerEmail,
    trialDays: planDef.trialDays,
    successUrl: `${params.baseUrl}/dashboard?upgrade=success&plan=${params.plan}`,
    cancelUrl: `${params.baseUrl}/dashboard?upgrade=canceled`,
    metadata: {
      workspace_id: params.workspaceId,
      plan_slug: params.plan,
      billing_cycle: params.cycle,
    },
  };
}

// ============================================================
// STRIPE WEBHOOK EVENT TYPES WE HANDLE
// ============================================================

export const HANDLED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "customer.subscription.trial_will_end",
] as const;

export type StripeWebhookEvent = (typeof HANDLED_EVENTS)[number];

// ============================================================
// SUBSCRIPTION STATUS MAPPING
// ============================================================

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
  const mapping: Record<string, SubscriptionStatus> = {
    trialing: "trialing",
    active: "active",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "unpaid",
    paused: "paused",
    incomplete: "unpaid",
    incomplete_expired: "canceled",
  };
  return mapping[stripeStatus] ?? "unpaid";
}

// ============================================================
// CUSTOMER PORTAL CONFIG
// ============================================================

export interface PortalConfig {
  customerId: string;
  returnUrl: string;
}

export function buildPortalConfig(params: {
  customerId: string;
  baseUrl: string;
}): PortalConfig {
  return {
    customerId: params.customerId,
    returnUrl: `${params.baseUrl}/dashboard/settings/billing`,
  };
}

// ============================================================
// BILLING HELPERS
// ============================================================

/** Convert BRL integer (centavos) to display string */
export function formatCentavos(centavos: number): string {
  return `R$${(centavos / 100).toFixed(2).replace(".", ",")}`;
}

/** Calculate prorated amount for mid-cycle upgrade */
export function calculateProration(params: {
  currentPlanMonthly: number;
  newPlanMonthly: number;
  daysRemaining: number;
  totalDaysInPeriod: number;
}): number {
  const dailyDiff = (params.newPlanMonthly - params.currentPlanMonthly) / params.totalDaysInPeriod;
  return Math.max(0, Math.round(dailyDiff * params.daysRemaining * 100)); // centavos
}
