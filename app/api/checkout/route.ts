import { NextResponse } from "next/server";
import {
  buildRegistrationDraft,
  REGISTRATION_DRAFT_COOKIE,
  getRegistrationDraftCookieOptions,
  hasCheckoutReadyDraft,
  normalizeRegistrationValues,
  readRegistrationDraft,
  serializeRegistrationDraft,
} from "@/app/register/registration";
import { EMPTY_REGISTRATION_FORM_VALUES } from "@/app/register/types";
import { getStripeCheckoutConfig, buildStripeCheckoutSessionPayload } from "@/lib/stripe-checkout";

function redirectToRegister(request: Request, search: Record<string, string>) {
  const url = new URL("/register", request.url);

  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const submittedRegistrationFields = Object.keys(
    EMPTY_REGISTRATION_FORM_VALUES,
  ).some((fieldName) => formData.has(fieldName));
  const submittedValues = normalizeRegistrationValues(formData);
  const submittedDraft = hasCheckoutReadyDraft(submittedValues)
    ? buildRegistrationDraft(submittedValues)
    : null;

  if (submittedRegistrationFields && !submittedDraft) {
    return redirectToRegister(request, {
      error: "draft",
      step: "payment",
    });
  }

  const existingDraft = await readRegistrationDraft();
  const draft = submittedDraft ?? existingDraft;

  if (!draft || !hasCheckoutReadyDraft(draft)) {
    return redirectToRegister(request, {
      error: "draft",
      step: "payment",
    });
  }

  const stripeConfig = getStripeCheckoutConfig();

  if (!stripeConfig) {
    const response = redirectToRegister(request, {
      mode: "stub",
      step: "payment",
    });

    if (submittedDraft) {
      response.cookies.set(
        REGISTRATION_DRAFT_COOKIE,
        serializeRegistrationDraft(submittedDraft),
        getRegistrationDraftCookieOptions(),
      );
    }

    return response;
  }

  const sessionPayload = buildStripeCheckoutSessionPayload(draft, stripeConfig);
  void sessionPayload;
  // Stripe session creation is intentionally deferred until real credentials
  // and the SDK are introduced in a later issue.

  const response = redirectToRegister(request, {
    mode: "stripe-ready",
    step: "payment",
  });

  if (submittedDraft) {
    response.cookies.set(
      REGISTRATION_DRAFT_COOKIE,
      serializeRegistrationDraft(submittedDraft),
      getRegistrationDraftCookieOptions(),
    );
  }

  return response;
}
