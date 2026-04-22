import Link from "next/link";

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

type ConfirmationPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
  }>;
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const resolvedSearchParams = await searchParams;
  const mode = getSearchParamValue(resolvedSearchParams.mode);
  const fromCheckout = mode === "checkout";

  return (
    <section className="confirmation-page">
      <div className="confirmation-page__intro">
        <p className="confirmation-page__eyebrow">Confirmation</p>
        <h1 className="confirmation-page__title">
          Your next step is in place.
        </h1>
        <p className="confirmation-page__lede">
          {fromCheckout
            ? "You have returned from Stripe Checkout. Payment verification is handled server-side through Stripe webhooks."
            : "This page is the public return point for the summit flow. It does not use the browser redirect as proof of payment."}
        </p>

        <div className="confirmation-status">
          <p className="confirmation-status__title">
            {fromCheckout
              ? "Checkout return received"
              : "Return point ready"}
          </p>
          <p className="confirmation-status__body">
            {fromCheckout
              ? "Watch for summit follow-up details. If anything needs attention, we will use the registration information you provided."
              : "Use this page as the controlled destination after checkout, without claiming payment success from the redirect alone."}
          </p>
        </div>
      </div>

      <div className="confirmation-page__grid">
        <section className="confirmation-section">
          <h2>What happens next</h2>
          <ol className="confirmation-list">
            <li>Your checkout return has a stable place to land.</li>
            <li>Payment records come from verified Stripe webhook events.</li>
            <li>Summit follow-up can be added here without changing payment truth.</li>
          </ol>
        </section>

        <section className="confirmation-section">
          <h2>What this page means today</h2>
          <p>
            This is a calm handoff point after Stripe. It gives you a stable
            next step without treating the browser redirect as payment proof.
          </p>
          <p className="confirmation-section__note">
            Return to the summit page if you want to review the event details.
          </p>
        </section>
      </div>

      <section className="confirmation-actions">
        <h2>Keep moving</h2>
        <p>
          If you want to review the event again or start over from the public
          site, use either path below.
        </p>
        <div className="confirmation-actions__links">
          <Link className="confirmation-actions__primary" href="/summit">
            Back to Summit
          </Link>
          <Link className="confirmation-actions__secondary" href="/">
            Return Home
          </Link>
        </div>
      </section>
    </section>
  );
}
