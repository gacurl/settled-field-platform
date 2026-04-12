import Link from "next/link";

type AdminRequestAccessPageProps = {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
};

function getFeedbackCopy(status?: string, error?: string) {
  if (status === "pending") {
    return {
      title: "Pending review",
      body: "Your request has been recorded. An owner can review it from the admin area.",
    };
  }

  if (error === "access") {
    return {
      title: "That email already has access",
      body: "Use the admin sign-in page with the credentials provided to you.",
    };
  }

  if (error === "invalid") {
    return {
      title: "That request could not be submitted",
      body: "Check your details and try again.",
    };
  }

  return null;
}

export default async function AdminRequestAccessPage({
  searchParams,
}: AdminRequestAccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const feedback = getFeedbackCopy(
    resolvedSearchParams?.status,
    resolvedSearchParams?.error,
  );

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-login-card__eyebrow">Admin</p>
        <h1 className="admin-login-card__title">Request admin access.</h1>
        <p className="admin-login-card__lede">
          Share a few details so the owner can review your request for access to
          the internal operator area.
        </p>

        {feedback ? (
          <div className="admin-request-access__feedback">
            <p className="admin-login-card__error">{feedback.title}</p>
            <p className="admin-login-card__lede">{feedback.body}</p>
          </div>
        ) : null}

        <form action="/api/admin/request-access" method="post">
          <label className="admin-field" htmlFor="fullName">
            <span>Full name</span>
            <input id="fullName" name="fullName" type="text" required />
          </label>

          <label className="admin-field" htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="admin-field" htmlFor="organization">
            <span>Organization (optional)</span>
            <input id="organization" name="organization" type="text" />
          </label>

          <button className="admin-button admin-button--full" type="submit">
            Request admin access
          </button>
        </form>

        <p className="admin-request-access__links">
          <Link className="admin-link-button" href="/admin/login">
            Back to admin sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
