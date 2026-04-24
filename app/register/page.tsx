import { RegisterForm } from "./register-form";
import { readRegistrationDraft } from "./registration";
import { EMPTY_REGISTRATION_FORM_VALUES } from "./types";

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const draft = await readRegistrationDraft();
  const error = getSearchParamValue(resolvedSearchParams.error);

  return (
    <section className="register-page">
      <div className="register-page__intro">
        <p className="register-page__eyebrow">Registration</p>
        <h1 className="register-page__title">
          Register your interest.
        </h1>
        <p className="register-page__lede">
          Share a few details to reserve your spot. We&apos;ll follow up with
          event details, updates, and next steps for the summit.
        </p>

        {error === "draft" ? (
          <div className="register-status register-status--error">
            <p className="register-status__title">Review your registration details</p>
            <p className="register-status__body">
              We couldn&apos;t find a saved registration summary for that step.
              Review your details and submit again.
            </p>
          </div>
        ) : null}
      </div>

      <div className="register-page__grid">
        <RegisterForm
          defaultValues={draft ?? EMPTY_REGISTRATION_FORM_VALUES}
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
              <li>We save your interest and reserve your spot.</li>
              <li>We follow up with details, updates, and next steps.</li>
            </ol>
            <p className="register-panel__note">
              If you&apos;re still deciding, that&apos;s fine. This form keeps the
              next step simple and gives us a clear way to follow up.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}
