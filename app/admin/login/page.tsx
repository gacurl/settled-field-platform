import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth-server";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin");
  }

  const resolvedSearchParams = await searchParams;
  const showError = resolvedSearchParams?.error === "invalid";

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-login-card__eyebrow">Admin</p>
        <h1 className="admin-login-card__title">Sign in to continue.</h1>
        <p className="admin-login-card__lede">
          Use the configured admin credentials to access the protected control
          area.
        </p>

        {showError ? (
          <p className="admin-login-card__error">
            Invalid email or password.
          </p>
        ) : null}

        <form action="/api/admin/login" method="post">
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

          <label className="admin-field" htmlFor="password">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="admin-button admin-button--full" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
}
