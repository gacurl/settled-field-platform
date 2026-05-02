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
          We&apos;ll share Summit updates as details are confirmed.
        </p>
      </div>

      <div className="register-success-page__grid">
        <section className="register-success-section">
          <h2>What happens next</h2>
          <ol className="register-success-list">
            <li>Your interest is saved in the registration system.</li>
            <li>We&apos;ll share Summit updates as details are confirmed.</li>
            <li>No payment step is required right now.</li>
          </ol>
        </section>

        <section className="register-success-section">
          <h2>Saved details</h2>
          <p>{draft.name}</p>
          <p>{draft.email}</p>
          <p className="register-success-section__note">
            Need to adjust something? Return to registration and submit again.
          </p>
        </section>
      </div>

      <section className="register-success-actions">
        <div className="register-success-actions__content">
          <h2>Keep moving</h2>
          <p>
            Review the Summit details again or return to registration if you
            want to change anything before we follow up.
          </p>
        </div>
        <div className="register-success-actions__links">
          <Link className="register-success-actions__primary" href="/summit">
            Back to Summit
          </Link>
          <Link className="register-success-actions__secondary" href="/register">
            Register Again
          </Link>
        </div>
      </section>
    </section>
  );
}
