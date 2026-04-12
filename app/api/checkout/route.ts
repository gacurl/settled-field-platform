import { NextResponse } from "next/server";
import { createStripeClient } from "@/app/lib/stripe";
import { getStripeCheckoutConfig } from "@/lib/stripe-checkout";

type CheckoutRequestBody = {
  email?: unknown;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { error: "A registration email is required to start checkout." },
        { status: 400 },
      );
    }

    const config = getStripeCheckoutConfig();

    if (!config) {
      return NextResponse.json(
        { error: "Stripe checkout is not configured for this environment." },
        { status: 503 },
      );
    }

    const stripe = createStripeClient(config.secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${config.appUrl}/confirmation?mode=checkout`,
      cancel_url: `${config.appUrl}/register/success`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 },
    );
  }
}
