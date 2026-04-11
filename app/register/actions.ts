'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  REGISTRATION_DRAFT_COOKIE,
  buildRegistrationDraft,
  normalizeRegistrationValues,
  validateRegistrationValues,
} from "./registration";
import type { RegisterFormState } from "./types";

export async function submitRegistration(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const values = normalizeRegistrationValues(formData);
  const fieldErrors = validateRegistrationValues(values);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      formError: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const cookieStore = await cookies();
  const draft = buildRegistrationDraft(values);

  cookieStore.set(REGISTRATION_DRAFT_COOKIE, encodeURIComponent(JSON.stringify(draft)), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/register?step=payment");
}
