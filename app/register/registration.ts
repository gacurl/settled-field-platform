import { cookies } from "next/headers";
import {
  EMPTY_REGISTRATION_FORM_VALUES,
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

function normalizeMultiline(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function asRegistrationValues(
  value: Partial<Record<keyof RegistrationFormValues, unknown>>,
): RegistrationFormValues {
  return {
    firstName:
      typeof value.firstName === "string"
        ? normalizeSingleLine(value.firstName)
        : "",
    lastName:
      typeof value.lastName === "string" ? normalizeSingleLine(value.lastName) : "",
    email:
      typeof value.email === "string"
        ? normalizeSingleLine(value.email).toLowerCase()
        : "",
    phone:
      typeof value.phone === "string" ? normalizeSingleLine(value.phone) : "",
    organization:
      typeof value.organization === "string"
        ? normalizeSingleLine(value.organization)
        : "",
    role: typeof value.role === "string" ? normalizeSingleLine(value.role) : "",
    notes:
      typeof value.notes === "string" ? normalizeMultiline(value.notes) : "",
  };
}

export function normalizeRegistrationValues(
  formData: FormData,
): RegistrationFormValues {
  return asRegistrationValues({
    firstName: getStringValue(formData, "firstName"),
    lastName: getStringValue(formData, "lastName"),
    email: getStringValue(formData, "email"),
    phone: getStringValue(formData, "phone"),
    organization: getStringValue(formData, "organization"),
    role: getStringValue(formData, "role"),
    notes: getStringValue(formData, "notes"),
  });
}

export function validateRegistrationValues(
  values: RegistrationFormValues,
): RegisterFormState["fieldErrors"] {
  const fieldErrors: RegisterFormState["fieldErrors"] = {};

  if (!values.firstName) {
    fieldErrors.firstName = "Enter your first name.";
  }

  if (!values.lastName) {
    fieldErrors.lastName = "Enter your last name.";
  }

  if (!values.email) {
    fieldErrors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  return fieldErrors;
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
