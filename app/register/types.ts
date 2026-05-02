export type RegistrationFormValues = {
  name: string;
  email: string;
};

export type RegistrationDraft = RegistrationFormValues & {
  submittedAt: string;
};

export type RegisterFieldName = keyof RegistrationFormValues;

export type RegisterFormState = {
  formError?: string;
  fieldErrors: Partial<Record<RegisterFieldName, string>>;
};

export type DuplicateRegistrationStatus = "created" | "duplicate";
export const REGISTRATION_HONEYPOT_FIELD = "website";

export const EMPTY_REGISTRATION_FORM_VALUES: RegistrationFormValues = {
  name: "",
  email: "",
};
