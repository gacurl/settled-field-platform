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
            ? "Your checkout flow has reached its confirmation destination. Final live payment verification will be connected when Stripe is fully enabled."
            : "This page is the public confirmation destination for the summit flow. It is ready for the live checkout return, while staying clear that payment confirmation is not active in this environment."}
        </p>

        <div className="confirmation-status">
          <p className="confirmation-status__title">
            {fromCheckout
              ? "Checkout return structure is ready"
              : "Controlled confirmation placeholder"}
          </p>
          <p className="confirmation-status__body">
            {fromCheckout
              ? "You are seeing the live-ready confirmation structure used after checkout returns. This confirms the route and page shape, not a verified payment result."
              : "Stripe is not live yet, so this page does not claim a completed payment. It exists to complete the public flow shape and support the real return step later with minimal change."}
          </p>
        </div>
      </div>

      <div className="confirmation-page__grid">
        <section className="confirmation-section">
          <h2>What happens next</h2>
          <ol className="confirmation-list">
            <li>Your registration and checkout path can end here cleanly.</li>
            <li>Summit details and follow-up instructions can be added here later.</li>
            <li>Live payment confirmation can plug into this structure once Stripe is enabled.</li>
          </ol>
        </section>

        <section className="confirmation-section">
          <h2>What this page means today</h2>
          <p>
            This is a calm handoff point for the current demo and stub flow. It
            shows the intended post-commit destination without overstating what
            has happened behind the scenes.
          </p>
          <p className="confirmation-section__note">
            Details, attendance instructions, or payment-specific messaging can
            be layered in later without replacing the route.
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
