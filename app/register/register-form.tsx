'use client';

import { useActionState, type InputHTMLAttributes } from "react";
import { submitRegistration } from "./actions";
import type {
  RegisterFormState,
  RegistrationFormValues,
} from "./types";
import { REGISTRATION_HONEYPOT_FIELD } from "./types";

const INITIAL_STATE: RegisterFormState = {
  fieldErrors: {},
};

type RegisterFormProps = {
  defaultValues: RegistrationFormValues;
};

type RegisterFieldProps = {
  autoComplete?: string;
  defaultValue: string;
  error?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  label: string;
  name: keyof RegistrationFormValues;
  required?: boolean;
  rows?: number;
  type?: string;
};

function RegisterField({
  autoComplete,
  defaultValue,
  error,
  inputMode,
  label,
  name,
  required = false,
  rows,
  type = "text",
}: RegisterFieldProps) {
  const errorId = `${name}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <label
      className={`register-field${rows ? " register-field--full" : ""}`}
      htmlFor={name}
    >
      <span className="register-field__label">
        {label}
        {required ? (
          <span aria-hidden="true" className="register-field__required">
            {" "}
            *
          </span>
        ) : null}
      </span>

      {rows ? (
        <textarea
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          id={name}
          name={name}
          rows={rows}
        />
      ) : (
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          id={name}
          inputMode={inputMode}
          name={name}
          required={required}
          type={type}
        />
      )}

      {error ? (
        <p className="register-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}

export function RegisterForm({
  defaultValues,
}: RegisterFormProps) {
  const [state, formAction, pending] = useActionState(
    submitRegistration,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="register-form">
      <div
        aria-hidden="true"
        className="register-honeypot"
      >
        <label htmlFor={REGISTRATION_HONEYPOT_FIELD}>
          Leave this field empty
        </label>
        <input
          autoComplete="off"
          id={REGISTRATION_HONEYPOT_FIELD}
          name={REGISTRATION_HONEYPOT_FIELD}
          tabIndex={-1}
          type="text"
        />
      </div>

      <p className="register-form__required-note">
        Required fields are marked with *
      </p>

      {state.formError ? (
        <p className="register-form__feedback" role="alert">
          {state.formError}
        </p>
      ) : null}

      <div className="register-form__grid">
        <RegisterField
          autoComplete="given-name"
          defaultValue={defaultValues.firstName}
          error={state.fieldErrors.firstName}
          label="First name"
          name="firstName"
          required
        />

        <RegisterField
          autoComplete="family-name"
          defaultValue={defaultValues.lastName}
          error={state.fieldErrors.lastName}
          label="Last name"
          name="lastName"
          required
        />

        <RegisterField
          autoComplete="email"
          defaultValue={defaultValues.email}
          error={state.fieldErrors.email}
          inputMode="email"
          label="Email"
          name="email"
          required
          type="email"
        />

        <RegisterField
          autoComplete="tel"
          defaultValue={defaultValues.phone}
          inputMode="tel"
          label="Phone"
          name="phone"
          type="tel"
        />

        <RegisterField
          defaultValue={defaultValues.organization}
          label="Organization / School / Team"
          name="organization"
        />

        <RegisterField
          defaultValue={defaultValues.role}
          label="Role or affiliation"
          name="role"
        />

        <RegisterField
          defaultValue={defaultValues.notes}
          label="What are you hoping to get from the summit?"
          name="notes"
          rows={5}
        />
      </div>

      <div className="register-cta">
        <div className="register-cta__content">
          <h2>Reserve your spot</h2>
          <p>
            Register your interest now. We&apos;ll save your details and follow
            up with event information, updates, and next steps.
          </p>
        </div>
        <button
          className="register-cta__button"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving your details..." : "Register Interest"}
        </button>
      </div>
    </form>
  );
}
