'use server';

import { redirect } from "next/navigation";
import { reserveRegistrationEmail } from "@/lib/registration-email-store";
import {
  buildRegistrationDraft,
  isHoneypotSubmission,
  normalizeRegistrationValues,
  validateRegistrationValues,
  writeRegistrationDraft,
} from "./registration";
import type { RegisterFormState } from "./types";

export async function submitRegistration(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  if (isHoneypotSubmission(formData)) {
    return {
      formError:
        "We couldn't process that submission. Please review your details and try again.",
      fieldErrors: {},
    };
  }

  const values = normalizeRegistrationValues(formData);
  const fieldErrors = validateRegistrationValues(values);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      formError: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    const duplicateStatus = await reserveRegistrationEmail(values.email);

    if (duplicateStatus === "duplicate") {
      return {
        formError:
          "We already have registration details for this email address.",
        fieldErrors: {
          email:
            "This email address has already been submitted for the summit.",
        },
      };
    }
  } catch (error) {
    console.error("Unable to reserve registration email", error);

    return {
      formError:
        "We couldn't save your registration right now. Please try again.",
      fieldErrors: {},
    };
  }

  const draft = buildRegistrationDraft(values);
  await writeRegistrationDraft(draft);

  redirect("/register/success");
}
