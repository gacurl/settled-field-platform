import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <section className="confirmation-page">
      <div className="confirmation-page__intro">
        <p className="confirmation-page__eyebrow">Confirmation</p>
        <h1 className="confirmation-page__title">You&apos;re on the list.</h1>
        <p className="confirmation-page__lede">
          We&apos;ve received your registration. We&apos;ll follow up with event
          details, updates, and next steps.
        </p>

        <div className="confirmation-status">
          <p className="confirmation-status__title">Registration received</p>
          <p className="confirmation-status__body">
            Early access and partner information will be shared soon.
          </p>
        </div>
      </div>

      <div className="confirmation-page__grid">
        <section className="confirmation-section">
          <h2>What happens next</h2>
          <ol className="confirmation-list">
            <li>Your registration is saved.</li>
            <li>We&apos;ll send updates as plans are finalized.</li>
            <li>You&apos;ll receive next steps from the summit team.</li>
          </ol>
        </section>

        <section className="confirmation-section">
          <h2>What this means</h2>
          <p>
            You have a confirmed place in the interest list for The Success
            Summit. Use this point as your calm next step while we prepare more
            event details.
          </p>
          <p className="confirmation-section__note">
            Return to the summit page if you want to review the event details
            again.
          </p>
        </section>
      </div>

      <section className="confirmation-actions">
        <h2>Keep moving</h2>
        <p>
          If you want to review the event again or update your registration,
          use either path below.
        </p>
        <div className="confirmation-actions__links">
          <Link className="confirmation-actions__primary" href="/summit">
            Back to Summit
          </Link>
          <Link className="confirmation-actions__secondary" href="/register">
            Update Registration
          </Link>
        </div>
      </section>
    </section>
  );
}
