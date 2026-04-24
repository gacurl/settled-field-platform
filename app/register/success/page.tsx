import Link from "next/link";
import { redirect } from "next/navigation";
import { readRegistrationDraft } from "../registration";

export default async function RegisterSuccessPage() {
  const draft = await readRegistrationDraft();

  if (!draft) {
    redirect("/register?error=draft");
  }

  return (
    <section className="register-success-page">
      <div className="register-success-page__intro">
        <p className="register-success-page__eyebrow">Registration</p>
        <h1 className="register-success-page__title">
          You&apos;re on the list.
        </h1>
        <p className="register-success-page__lede">
          {draft.firstName} {draft.lastName}, we&apos;ve received your
          registration. We&apos;ll follow up with event details, updates, and
          next steps.
        </p>
      </div>

      <div className="register-success-page__grid">
        <section className="register-success-section">
          <h2>What happens next</h2>
          <ol className="register-success-list">
            <li>Your registration details are saved.</li>
            <li>We&apos;ll share updates as event planning progresses.</li>
            <li>You&apos;ll receive next steps directly from the summit team.</li>
          </ol>
        </section>

        <section className="register-success-section">
          <h2>Registration summary</h2>
          <p>{draft.email}</p>
          {draft.organization ? <p>{draft.organization}</p> : null}
          {draft.role ? <p>{draft.role}</p> : null}
          <p className="register-success-section__note">
            Need to adjust something? Return to registration and update your
            details.
          </p>
        </section>
      </div>

      <section className="register-success-actions">
        <div className="register-success-actions__content">
          <h2>Keep moving</h2>
          <p>
            Review the summit details again or return to registration if you
            want to change anything before we follow up.
          </p>
        </div>
        <div className="register-success-actions__links">
          <Link className="register-success-actions__primary" href="/confirmation">
            View Confirmation
          </Link>
          <Link className="register-success-actions__secondary" href="/register">
            Edit Registration
          </Link>
        </div>
      </section>
    </section>
  );
}
