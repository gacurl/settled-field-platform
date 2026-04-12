import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getCurrentAdminUser,
  isCurrentAdminOwner,
} from "@/lib/admin-auth-server";
import { listAdminUsers, type AdminUserRecord } from "@/lib/admin-user-store";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type AdminUsersPageProps = {
  searchParams?: Promise<{
    confirmRemove?: string;
    error?: string;
    status?: string;
  }>;
};

function formatCreatedAt(value: AdminUserRecord["createdAt"]) {
  return dateFormatter.format(new Date(value));
}

function getFeedbackCopy(status?: string, error?: string) {
  if (status === "helper-added") {
    return {
      tone: "status",
      title: "Helper added",
      body: "The new helper account is ready to sign in.",
    };
  }

  if (status === "helper-disabled") {
    return {
      tone: "status",
      title: "Helper disabled",
      body: "That account can no longer sign in.",
    };
  }

  if (error === "exists") {
    return {
      tone: "error",
      title: "That email already has access",
      body: "Use a different email for a new helper account.",
    };
  }

  if (error === "keep-owner") {
    return {
      tone: "error",
      title: "Keep one owner active",
      body: "This account stays active so the owner can still manage helper access.",
    };
  }

  if (status === "user-removed") {
    return {
      tone: "status",
      title: "User removed",
      body: "That account has been removed permanently.",
    };
  }

  if (
    error === "invalid" ||
    error === "disable-invalid" ||
    error === "remove-invalid"
  ) {
    return {
      tone: "error",
      title: "That action could not be completed",
      body: "Check the details and try again.",
    };
  }

  return null;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  if (!(await isCurrentAdminOwner())) {
    redirect("/admin");
  }

  const [adminUsers, currentAdminUser, resolvedSearchParams] = await Promise.all([
    listAdminUsers(),
    getCurrentAdminUser(),
    searchParams,
  ]);

  const activeUsers = adminUsers.filter((user) => user.isActive);
  const disabledUsers = adminUsers.filter((user) => !user.isActive);
  const activeOwners = activeUsers.filter((user) => user.role === "owner");
  const feedback = getFeedbackCopy(
    resolvedSearchParams?.status,
    resolvedSearchParams?.error,
  );
  const pendingRemoveEmail = resolvedSearchParams?.confirmRemove ?? null;
  const pendingRemoveUser = pendingRemoveEmail
    ? adminUsers.find((user) => user.normalizedEmail === pendingRemoveEmail) ?? null
    : null;
  const pendingRemoveIsLastActiveOwner =
    pendingRemoveUser?.role === "owner" &&
    pendingRemoveUser.isActive &&
    activeOwners.length === 1;

  return (
    <section className="admin-page">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Team access</h1>
          <p className="admin-page__lede">
            Add helper accounts, review who can sign in, and turn off access
            when someone should no longer enter the admin area.
          </p>
        </div>

        <Link className="admin-link-button" href="/admin">
          Back to Dashboard
        </Link>
      </section>

      <section className="admin-summary">
        <div className="admin-summary__item">
          <p className="admin-summary__label">Active</p>
          <p className="admin-summary__value">{activeUsers.length}</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Disabled</p>
          <p className="admin-summary__value">{disabledUsers.length}</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Owners</p>
          <p className="admin-summary__value">{activeOwners.length}</p>
        </div>
      </section>

      {feedback ? (
        <section className={`admin-panel admin-panel--${feedback.tone}`}>
          <h2>{feedback.title}</h2>
          <p>{feedback.body}</p>
        </section>
      ) : null}

      {pendingRemoveUser ? (
        <section className="admin-panel admin-panel--warning">
          <h2>Remove user</h2>
          <p>
            Remove access permanently for <strong>{pendingRemoveUser.email}</strong>.
            This cannot be undone from the app.
          </p>
          {pendingRemoveIsLastActiveOwner ? (
            <p>Keep one owner active before removing this account.</p>
          ) : (
            <form action="/api/admin/users/remove" method="post">
              <input
                type="hidden"
                name="normalizedEmail"
                value={pendingRemoveUser.normalizedEmail}
              />
              <input type="hidden" name="confirmation" value="remove" />
              <div className="admin-users__confirmation-actions">
                <button className="admin-button admin-button--danger" type="submit">
                  Remove access permanently
                </button>
                <Link className="admin-link-button" href="/admin/users">
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </section>
      ) : pendingRemoveEmail ? (
        <section className="admin-panel admin-panel--error">
          <h2>That action could not be completed</h2>
          <p>The selected user could not be found.</p>
        </section>
      ) : null}

      <section className="admin-grid" aria-label="User management">
        <section className="admin-panel">
          <h2>Add helper</h2>
          <p>
            Set up a helper account with its own email and password. Helper
            accounts can use the admin area, but this page stays owner-only.
          </p>

          <form action="/api/admin/users" method="post">
            <label className="admin-field" htmlFor="helper-email">
              <span>Email</span>
              <input
                id="helper-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="admin-field" htmlFor="helper-password">
              <span>Password</span>
              <input
                id="helper-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <button className="admin-button" type="submit">
              Add helper
            </button>
          </form>
        </section>

        <section className="admin-panel">
          <h2>Access rules</h2>
          <p>
            The owner keeps this page. Helpers can still sign in to the admin
            area, but they cannot manage team access.
          </p>
        </section>
      </section>

      <section className="admin-attendees admin-users">
        <div className="admin-attendees__table-wrap">
          <table className="admin-attendees__table">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Added</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((adminUser) => {
                const isLastActiveOwner =
                  adminUser.role === "owner" &&
                  adminUser.isActive &&
                  activeOwners.length === 1;
                const removeHref = `/admin/users?confirmRemove=${encodeURIComponent(
                  adminUser.normalizedEmail,
                )}`;

                return (
                  <tr key={adminUser.normalizedEmail}>
                    <td>{adminUser.email}</td>
                    <td>{adminUser.role === "owner" ? "Owner" : "Admin"}</td>
                    <td>
                      <span
                        className={`admin-status-badge ${
                          adminUser.isActive
                            ? "admin-status-badge--active"
                            : "admin-status-badge--disabled"
                        }`}
                      >
                        {adminUser.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>{formatCreatedAt(adminUser.createdAt)}</td>
                    <td>
                      <div className="admin-users__actions">
                        {adminUser.isActive ? (
                          <form
                            action="/api/admin/users/disable"
                            method="post"
                            className="admin-users__action-form"
                          >
                            <input
                              type="hidden"
                              name="normalizedEmail"
                              value={adminUser.normalizedEmail}
                            />
                            <button
                              className="admin-link-button admin-users__disable-button"
                              type="submit"
                            >
                              Disable
                            </button>
                          </form>
                        ) : (
                          <span className="admin-users__action-note">Disabled</span>
                        )}

                        {isLastActiveOwner ? (
                          <span className="admin-users__action-note">
                            Keep owner
                          </span>
                        ) : (
                          <Link
                            className="admin-link-button admin-users__remove-link"
                            href={removeHref}
                          >
                            Remove user
                          </Link>
                        )}

                        {currentAdminUser?.normalizedEmail === adminUser.normalizedEmail ? (
                          <span className="admin-users__action-note">
                            Signed in now
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
