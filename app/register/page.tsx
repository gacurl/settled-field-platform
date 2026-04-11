import { RegisterForm } from "./register-form";
import { readRegistrationDraft } from "./registration";
import { EMPTY_REGISTRATION_FORM_VALUES } from "./types";

type RegisterPageProps = {
  searchParams: Promise<{
    step?: string | string[];
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const draft = await readRegistrationDraft();
  const paymentReady =
    resolvedSearchParams.step === "payment" && draft !== null;

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

        {paymentReady ? (
          <div className="register-status register-status--success">
            <p className="register-status__title">Registration details saved</p>
            <p className="register-status__body">
              {draft?.firstName} {draft?.lastName} is ready for the payment
              handoff with {draft?.email}.
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
