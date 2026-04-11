import { RegisterForm } from "./register-form";
import { readRegistrationDraft } from "./registration";
import { EMPTY_REGISTRATION_FORM_VALUES } from "./types";

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    mode?: string | string[];
    step?: string | string[];
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const draft = await readRegistrationDraft();
  const step = getSearchParamValue(resolvedSearchParams.step);
  const mode = getSearchParamValue(resolvedSearchParams.mode);
  const error = getSearchParamValue(resolvedSearchParams.error);
  const paymentReady = step === "payment" && draft !== null;

  return (
    <section className="register-page">
      <div className="register-page__intro">
        <p className="register-page__eyebrow">Registration</p>
        <h1 className="register-page__title">
          Take your next step with intention.
        </h1>
        <p className="register-page__lede">
          Share a few details so we can hold your place and carry you into the
          payment step with clarity. This is a focused summit for people
          navigating transition and looking for practical direction.
        </p>

        {error === "draft" ? (
          <div className="register-status register-status--error">
            <p className="register-status__title">
              Save your registration details before payment
            </p>
            <p className="register-status__body">
              A valid registration draft was not available for checkout. Review
              your details and continue again.
            </p>
          </div>
        ) : null}

        {paymentReady ? (
          <div className="register-status register-status--success">
            <p className="register-status__title">Registration details saved</p>
            <p className="register-status__body">
              {draft?.firstName} {draft?.lastName} is ready for the payment
              handoff with {draft?.email}.
            </p>
          </div>
        ) : null}

        {mode === "stub" ? (
          <div className="register-status">
            <p className="register-status__title">Checkout stub mode</p>
            <p className="register-status__body">
              Stripe checkout is not live in this environment yet. Your payment
              handoff is wired and ready for keys to be added later.
            </p>
          </div>
        ) : null}

        {mode === "stripe-ready" ? (
          <div className="register-status">
            <p className="register-status__title">
              Stripe configuration detected
            </p>
            <p className="register-status__body">
              Checkout session scaffolding is in place. The final Stripe API
              call can be added with minimal change once live integration work
              begins.
            </p>
          </div>
        ) : null}
      </div>

      <div className="register-page__grid">
        <RegisterForm
          defaultValues={draft ?? EMPTY_REGISTRATION_FORM_VALUES}
          paymentReady={paymentReady}
        />

        <aside className="register-sidebar">
          <section className="register-panel">
            <h2>Summit snapshot</h2>
            <p>
              Settled on the Field is built for athletes, veterans, and
              professionals navigating a meaningful transition with more
              questions than certainty.
            </p>
            <ul>
              <li>Focused speakers and practical conversations</li>
              <li>Space to reflect, connect, and move forward</li>
              <li>A calm structure built around clarity, not noise</li>
            </ul>
          </section>

          <section className="register-panel">
            <h2>What happens next</h2>
            <ol>
              <li>Complete your registration details.</li>
              <li>Review the payment step.</li>
              <li>Receive confirmation once checkout is live.</li>
            </ol>
            <p className="register-panel__note">
              Questions or hesitation are normal. This step is here to make the
              path feel clear before payment is introduced.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}
