// ============================================================
// POST /api/billing/checkout
// Cria uma Stripe Checkout Session para upgrade de plano
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buildCheckoutConfig } from "@/lib/billing/stripe";
import { PURCHASABLE_PLANS, type PlanSlug, type BillingCycle } from "@/lib/billing/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, cycle, workspaceId, customerEmail } = body as {
      plan: PlanSlug;
      cycle: BillingCycle;
      workspaceId: string;
      customerEmail: string;
    };

    // Validation
    if (!plan || !cycle || !workspaceId || !customerEmail) {
      return NextResponse.json(
        { error: "Campos obrigatórios: plan, cycle, workspaceId, customerEmail" },
        { status: 400 }
      );
    }

    if (!PURCHASABLE_PLANS.includes(plan)) {
      return NextResponse.json(
        { error: "Plano inválido para compra self-serve" },
        { status: 400 }
      );
    }

    if (!["monthly", "yearly"].includes(cycle)) {
      return NextResponse.json(
        { error: "Ciclo deve ser 'monthly' ou 'yearly'" },
        { status: 400 }
      );
    }

    // Build checkout config
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const config = buildCheckoutConfig({
      plan,
      cycle,
      workspaceId,
      customerEmail,
      baseUrl,
    });

    if (!config || !config.priceId) {
      return NextResponse.json(
        { error: "Configuração de preço não encontrada. Contate o suporte." },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: config.customerId ? undefined : config.customerEmail,
      customer: config.customerId || undefined,
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: config.trialDays > 0 ? config.trialDays : undefined,
        metadata: config.metadata,
      },
      metadata: config.metadata,
      success_url: config.successUrl,
      cancel_url: config.cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      tax_id_collection: { enabled: true },
      locale: "pt-BR",
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("[billing/checkout] Error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Erro interno ao criar checkout session: ${message}` },
      { status: 500 }
    );
  }
}
