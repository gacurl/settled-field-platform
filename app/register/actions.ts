'use server';

import { redirect } from "next/navigation";
import {
  buildRegistrationDraft,
  normalizeRegistrationValues,
  validateRegistrationValues,
  writeRegistrationDraft,
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

  const draft = buildRegistrationDraft(values);
  await writeRegistrationDraft(draft);

  redirect("/register?step=payment");
}
