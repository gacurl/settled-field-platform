import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/app/lib/stripe";
import { createPaymentRecord } from "@/lib/payment-store";
import { getRegistrationByNormalizedEmail } from "@/lib/registration-store";

export const runtime = "nodejs";

function getStripeWebhookConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!secretKey || !webhookSecret) {
    return null;
  }

  return {
    secretKey,
    webhookSecret,
  };
}

function getRegistrationEmail(session: Stripe.Checkout.Session) {
  const registrationEmail = session.metadata?.registration_email
    ?.trim()
    .toLowerCase();

  return registrationEmail || null;
}

function getPaymentIntentId(
  paymentIntent: Stripe.Checkout.Session["payment_intent"],
) {
  return typeof paymentIntent === "string"
    ? paymentIntent
    : paymentIntent?.id ?? null;
}

function getAmountTotal(session: Stripe.Checkout.Session) {
  return typeof session.amount_total === "number" ? session.amount_total : null;
}

export async function POST(req: Request) {
  const config = getStripeWebhookConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured for this environment." },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const rawBody = await req.text();
  const stripe = createStripeClient(config.secretKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationEmail = getRegistrationEmail(session);
    const amountTotal = getAmountTotal(session);
    const currency = session.currency?.trim().toLowerCase() ?? "";

    if (!registrationEmail) {
      console.error("Stripe webhook missing registration metadata", {
        eventId: event.id,
        sessionId: session.id,
      });
      return NextResponse.json(
        { error: "Missing registration metadata." },
        { status: 400 },
      );
    }

    if (amountTotal === null || !currency) {
      console.error("Stripe webhook missing payment totals", {
        amountTotal,
        currency,
        eventId: event.id,
        sessionId: session.id,
      });
      return NextResponse.json(
        { error: "Missing payment totals." },
        { status: 400 },
      );
    }

    const registration =
      await getRegistrationByNormalizedEmail(registrationEmail);

    if (!registration) {
      console.error("Stripe webhook registration lookup failed", {
        eventId: event.id,
        registrationEmail,
        sessionId: session.id,
      });
      return NextResponse.json(
        { error: "Registration not found for payment event." },
        { status: 400 },
      );
    }

    await createPaymentRecord({
      amountTotal,
      currency,
      paymentStatus: session.payment_status ?? "unpaid",
      registrationEmail: registration.normalizedEmail,
      stripeCheckoutSessionId: session.id,
      stripeEventId: event.id,
      stripePaymentIntentId: getPaymentIntentId(session.payment_intent),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    return NextResponse.json(
      { error: "Unable to process Stripe webhook." },
      { status: 500 },
    );
  }
}
