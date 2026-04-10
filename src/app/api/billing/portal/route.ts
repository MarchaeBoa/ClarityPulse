// ============================================================
// POST /api/billing/portal
// Cria uma sessão do Stripe Customer Portal para gerenciar
// assinatura, cartão, faturas, cancelamento
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buildPortalConfig } from "@/lib/billing/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId } = body as { customerId: string };

    if (!customerId) {
      return NextResponse.json(
        { error: "Campo obrigatório: customerId" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const config = buildPortalConfig({ customerId, baseUrl });

    const session = await stripe.billingPortal.sessions.create({
      customer: config.customerId,
      return_url: config.returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[billing/portal] Error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Erro interno ao criar portal session: ${message}` },
      { status: 500 }
    );
  }
}
