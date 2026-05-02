import { cookies } from "next/headers";
import {
  EMPTY_REGISTRATION_FORM_VALUES,
  REGISTRATION_HONEYPOT_FIELD,
  type RegisterFormState,
  type RegistrationDraft,
  type RegistrationFormValues,
} from "./types";

export const REGISTRATION_DRAFT_COOKIE = "settled-registration-draft";
export const REGISTRATION_DRAFT_MAX_AGE = 60 * 60 * 24;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getStringValue(formData: FormData, key: keyof RegistrationFormValues) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeSingleLine(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function asRegistrationValues(
  value: Partial<Record<keyof RegistrationFormValues, unknown>>,
): RegistrationFormValues {
  return {
    name: typeof value.name === "string" ? normalizeSingleLine(value.name) : "",
    email:
      typeof value.email === "string"
        ? normalizeSingleLine(value.email).toLowerCase()
        : "",
  };
}

export function normalizeRegistrationValues(
  formData: FormData,
): RegistrationFormValues {
  return asRegistrationValues({
    name: getStringValue(formData, "name"),
    email: getStringValue(formData, "email"),
  });
}

export function validateRegistrationValues(
  values: RegistrationFormValues,
): RegisterFormState["fieldErrors"] {
  const fieldErrors: RegisterFormState["fieldErrors"] = {};

  if (!values.name) {
    fieldErrors.name = "Enter your name.";
  }

  if (!values.email) {
    fieldErrors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  return fieldErrors;
}

export function isHoneypotSubmission(formData: FormData) {
  const honeypotValue = formData.get(REGISTRATION_HONEYPOT_FIELD);

  return typeof honeypotValue === "string" && honeypotValue.trim().length > 0;
}

export function buildRegistrationDraft(
  values: RegistrationFormValues,
): RegistrationDraft {
  return {
    ...values,
    submittedAt: new Date().toISOString(),
  };
}

export function hasCheckoutReadyDraft(values: RegistrationFormValues) {
  return Object.keys(validateRegistrationValues(values)).length === 0;
}

export function serializeRegistrationDraft(draft: RegistrationDraft) {
  return encodeURIComponent(JSON.stringify(draft));
}

export function getRegistrationDraftCookieOptions() {
  return {
    httpOnly: true,
    maxAge: REGISTRATION_DRAFT_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function writeRegistrationDraft(draft: RegistrationDraft) {
  const cookieStore = await cookies();

  cookieStore.set(
    REGISTRATION_DRAFT_COOKIE,
    serializeRegistrationDraft(draft),
    getRegistrationDraftCookieOptions(),
  );
}

export async function readRegistrationDraft() {
  const cookieStore = await cookies();
  const draftCookie = cookieStore.get(REGISTRATION_DRAFT_COOKIE);

  if (!draftCookie) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(
      decodeURIComponent(draftCookie.value),
    ) as Partial<RegistrationDraft>;

    if (typeof parsedDraft.submittedAt !== "string") {
      return null;
    }

    return {
      ...EMPTY_REGISTRATION_FORM_VALUES,
      ...asRegistrationValues(parsedDraft),
      submittedAt: parsedDraft.submittedAt,
    };
  } catch {
    return null;
  }
}
