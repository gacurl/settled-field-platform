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
          autoComplete="name"
          defaultValue={defaultValues.name}
          error={state.fieldErrors.name}
          label="Name"
          name="name"
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
      </div>

      <div className="register-cta">
        <div className="register-cta__content">
          <h2>Register your interest</h2>
          <p>
            Share your name and email. We&apos;ll save your interest and follow up
            with Summit updates as details are confirmed.
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
