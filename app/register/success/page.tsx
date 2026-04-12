import Link from "next/link";
import { redirect } from "next/navigation";
import { readRegistrationDraft } from "../registration";
import { CheckoutButton } from "./checkout-button";

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
          Your details are in place.
        </h1>
        <p className="register-success-page__lede">
          {draft.firstName} {draft.lastName}, we have your registration details
          and the next step is payment. This page is here to make the handoff
          feel clear before checkout begins.
        </p>
      </div>

      <div className="register-success-page__grid">
        <section className="register-success-section">
          <h2>What happens next</h2>
          <ol className="register-success-list">
            <li>Your registration details stay ready for checkout.</li>
            <li>Payment is the next step in the summit flow.</li>
            <li>Confirmation comes after checkout is complete.</li>
          </ol>
        </section>

        <section className="register-success-section">
          <h2>Registration summary</h2>
          <p>{draft.email}</p>
          {draft.organization ? <p>{draft.organization}</p> : null}
          {draft.role ? <p>{draft.role}</p> : null}
          <p className="register-success-section__note">
            Need to adjust something before payment? Return to registration and
            update your details.
          </p>
        </section>
      </div>

      <section className="register-success-actions">
        <div className="register-success-actions__content">
          <h2>Continue when you&apos;re ready</h2>
          <p>
            Stripe is still operating through the current scaffold, so this
            continues into the existing payment-ready path without implying
            completed payment.
          </p>
        </div>
        <div className="register-success-actions__links">
          <CheckoutButton email={draft.email} />
          <Link className="register-success-actions__secondary" href="/register">
            Edit Registration
          </Link>
        </div>
      </section>
    </section>
  );
}
