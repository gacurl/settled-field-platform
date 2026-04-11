export type RegistrationFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  notes: string;
};

export type RegistrationDraft = RegistrationFormValues & {
  submittedAt: string;
};

export type RegisterFieldName = keyof RegistrationFormValues;

export type RegisterFormState = {
  formError?: string;
  fieldErrors: Partial<Record<RegisterFieldName, string>>;
};

export const EMPTY_REGISTRATION_FORM_VALUES: RegistrationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  notes: "",
};
