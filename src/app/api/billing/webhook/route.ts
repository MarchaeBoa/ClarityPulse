// ============================================================
// POST /api/billing/webhook
// Processa webhooks do Stripe para manter billing sincronizado
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { HANDLED_EVENTS, mapStripeStatus, type StripeWebhookEvent } from "@/lib/billing/stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = event.type as StripeWebhookEvent;

  // Skip events we don't handle
  if (!HANDLED_EVENTS.includes(eventType)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (eventType) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_action_required":
        await handlePaymentActionRequired(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialEnding(event.data.object as Stripe.Subscription);
        break;
    }

    // Log the event
    await logPaymentEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[webhook] Error handling ${eventType}:`, error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

// ============================================================
// EVENT HANDLERS
// ============================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const workspaceId = session.metadata?.workspace_id;
  const planSlug = session.metadata?.plan_slug;
  const billingCycle = session.metadata?.billing_cycle;

  if (!workspaceId || !planSlug) {
    console.error("[webhook] Missing metadata in checkout session");
    return;
  }

  // TODO: Update database
  // 1. Find or create plan_id from planSlug
  // 2. Update subscription record: plan_id, stripe_subscription_id, stripe_customer_id, status, billing_cycle
  // 3. Update workspace: plan_id
  console.log(`[webhook] Checkout completed: workspace=${workspaceId} plan=${planSlug} cycle=${billingCycle}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id;
  if (!workspaceId) return;

  const status = mapStripeStatus(subscription.status);

  // TODO: Update database
  // 1. Update subscription: status, current_period_start, current_period_end, cancel_at_period_end
  // 2. If downgraded/canceled, update workspace plan_id
  console.log(`[webhook] Subscription updated: workspace=${workspaceId} status=${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id;
  if (!workspaceId) return;

  // TODO: Update database
  // 1. Set subscription status to 'canceled', set canceled_at
  // 2. Desativar workspace ou bloquear acesso ate reativar assinatura
  console.log(`[webhook] Subscription deleted: workspace=${workspaceId}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const sub = (invoice as unknown as Record<string, unknown>).subscription;
  const subscriptionId = typeof sub === "string" ? sub : (sub as { id?: string } | null)?.id;

  // TODO: Update database
  // 1. Update subscription status to 'active'
  // 2. Update current_period_start/end from invoice
  console.log(`[webhook] Invoice paid: subscription=${subscriptionId} amount=${invoice.amount_paid}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const sub2 = (invoice as unknown as Record<string, unknown>).subscription;
  const subscriptionId = typeof sub2 === "string" ? sub2 : (sub2 as { id?: string } | null)?.id;

  // TODO: Update database
  // 1. Update subscription status to 'past_due'
  // 2. Send notification email to workspace owner
  console.log(`[webhook] Payment failed: subscription=${subscriptionId}`);
}

async function handlePaymentActionRequired(invoice: Stripe.Invoice) {
  // TODO: Send email asking customer to complete payment authentication
  console.log(`[webhook] Payment action required: invoice=${invoice.id}`);
}

async function handleTrialEnding(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id;

  // TODO: Send trial ending email (3 days before)
  console.log(`[webhook] Trial ending soon: workspace=${workspaceId}`);
}

// ============================================================
// LOGGING
// ============================================================

async function logPaymentEvent(event: Stripe.Event) {
  // TODO: Insert into payment_events table
  // INSERT INTO payment_events (stripe_event_id, event_type, stripe_payload, workspace_id, amount_brl)
  console.log(`[webhook] Logged event: ${event.type} (${event.id})`);
}
