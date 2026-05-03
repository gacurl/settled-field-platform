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
    confirmDisable?: string;
    confirmRemove?: string;
    error?: string;
    manage?: string;
    status?: string;
  }>;
};

function formatCreatedAt(value: AdminUserRecord["createdAt"]) {
  return dateFormatter.format(new Date(value));
}

function getFeedbackCopy(status?: string, error?: string) {
  if (status === "user-added") {
    return {
      tone: "status",
      title: "Admin account added",
      body: "The new account is ready to sign in.",
    };
  }

  if (status === "user-disabled") {
    return {
      tone: "status",
      title: "Admin account disabled",
      body: "That account can no longer sign in.",
    };
  }

  if (status === "user-updated") {
    return {
      tone: "status",
      title: "Email updated",
      body: "The sign-in email was updated successfully.",
    };
  }

  if (status === "password-reset") {
    return {
      tone: "status",
      title: "Password reset",
      body: "The new password is now active for that account.",
    };
  }

  if (error === "exists") {
    return {
      tone: "error",
      title: "That email already has access",
      body: "Use a different email address for this account.",
    };
  }

  if (error === "keep-owner") {
    return {
      tone: "error",
      title: "Keep one owner active",
      body: "This action is blocked because at least one active owner must remain.",
    };
  }

  if (status === "user-removed") {
    return {
      tone: "status",
      title: "Admin account removed",
      body: "That account has been removed permanently.",
    };
  }

  if (
    error === "invalid" ||
    error === "disable-invalid" ||
    error === "remove-invalid" ||
    error === "reset-invalid" ||
    error === "update-invalid"
  ) {
    return {
      tone: "error",
      title: "That action could not be completed",
      body: "Check the details and try again.",
    };
  }

  return null;
}

function FeedbackPanel({
  feedback,
}: {
  feedback: ReturnType<typeof getFeedbackCopy>;
}) {
  if (!feedback) {
    return null;
  }

  return (
    <section
      className={`admin-panel admin-panel--compact admin-panel--${feedback.tone}`}
      aria-live="polite"
    >
      <h2>{feedback.title}</h2>
      <p>{feedback.body}</p>
    </section>
  );
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
  const pendingDisableEmail = resolvedSearchParams?.confirmDisable ?? null;
  const pendingDisableUser = pendingDisableEmail
    ? adminUsers.find((user) => user.normalizedEmail === pendingDisableEmail) ?? null
    : null;
  const pendingDisableIsLastActiveOwner =
    pendingDisableUser?.role === "owner" &&
    pendingDisableUser.isActive &&
    activeOwners.length === 1;
  const managedEmail = resolvedSearchParams?.manage ?? null;
  const managedUser = managedEmail
    ? adminUsers.find((user) => user.normalizedEmail === managedEmail) ?? null
    : null;
  const pendingRemoveEmail = resolvedSearchParams?.confirmRemove ?? null;
  const pendingRemoveUser = pendingRemoveEmail
    ? adminUsers.find((user) => user.normalizedEmail === pendingRemoveEmail) ?? null
    : null;
  const pendingRemoveIsLastActiveOwner =
    pendingRemoveUser?.role === "owner" &&
    pendingRemoveUser.isActive &&
    activeOwners.length === 1;
  const managedFeedback =
    feedback &&
    (resolvedSearchParams?.status === "user-updated" ||
      resolvedSearchParams?.status === "password-reset" ||
      managedEmail !== null)
      ? feedback
      : null;
  const creationFeedback =
    feedback &&
    !managedFeedback &&
    !pendingDisableUser &&
    !pendingRemoveUser &&
    (resolvedSearchParams?.status === "user-added" ||
      resolvedSearchParams?.error === "exists" ||
      resolvedSearchParams?.error === "invalid")
      ? feedback
      : null;
  const accessFeedback =
    feedback && !managedFeedback && !creationFeedback ? feedback : null;

  return (
    <section className="admin-page">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Admin accounts</h1>
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

      {accessFeedback ? <FeedbackPanel feedback={accessFeedback} /> : null}

      {pendingDisableUser ? (
        <section className="admin-panel admin-panel--warning admin-panel--compact">
          <h2>Confirm disable</h2>
          <p>
            Disable <strong>{pendingDisableUser.email}</strong>?
          </p>
          {pendingDisableIsLastActiveOwner ? (
            <p>Keep one owner active before disabling this account.</p>
          ) : (
            <form action="/api/admin/users/disable" method="post">
              <input
                type="hidden"
                name="normalizedEmail"
                value={pendingDisableUser.normalizedEmail}
              />
              <div className="admin-users__confirmation-actions">
                <button className="admin-button admin-button--danger" type="submit">
                  Disable access
                </button>
                <Link className="admin-link-button" href="/admin/users">
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </section>
      ) : pendingDisableEmail ? (
        <section className="admin-panel admin-panel--error">
          <h2>That action could not be completed</h2>
          <p>The selected account could not be found.</p>
        </section>
      ) : null}

      {pendingRemoveUser ? (
        <section className="admin-panel admin-panel--warning admin-panel--compact">
          <h2>Confirm removal</h2>
          <p>
            Remove <strong>{pendingRemoveUser.email}</strong> permanently?
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
                  Remove account permanently
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

      {managedUser ? (
        <section className="admin-grid" aria-label="Selected user management">
          <section className="admin-panel admin-panel--compact">
            <h2>Update email</h2>
            {managedFeedback ? <FeedbackPanel feedback={managedFeedback} /> : null}

            <form action="/api/admin/users/update" method="post">
              <input
                type="hidden"
                name="normalizedEmail"
                value={managedUser.normalizedEmail}
              />

              <label className="admin-field" htmlFor="managed-email">
                <span>Email</span>
                <input
                  id="managed-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={managedUser.email}
                  required
                />
              </label>

              <button className="admin-button" type="submit">
                Update email
              </button>
            </form>
          </section>

          <section className="admin-panel admin-panel--compact">
            <h2>Reset password</h2>
            <form action="/api/admin/users/reset-password" method="post">
              <input
                type="hidden"
                name="normalizedEmail"
                value={managedUser.normalizedEmail}
              />

              <label className="admin-field" htmlFor="managed-password">
                <span>New password</span>
                <input
                  id="managed-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <button className="admin-button" type="submit">
                Reset password
              </button>
            </form>
          </section>
        </section>
      ) : managedEmail ? (
        <section className="admin-panel admin-panel--error">
          <h2>That action could not be completed</h2>
          <p>The selected user could not be found.</p>
        </section>
      ) : null}

      <section className="admin-grid" aria-label="User management">
        <section className="admin-panel admin-panel--compact">
          <h2>Create admin account</h2>
          {creationFeedback ? <FeedbackPanel feedback={creationFeedback} /> : null}

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

            <label className="admin-field" htmlFor="admin-role">
              <span>Role</span>
              <select id="admin-role" name="role" defaultValue="admin">
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </label>

            <button className="admin-button" type="submit">
              Create account
            </button>
          </form>
        </section>

        <section className="admin-panel admin-panel--compact">
          <h2>Access rules</h2>
          <p>
            Owners manage accounts. Admins can sign in but cannot change access.
          </p>
        </section>
      </section>

      <section className="admin-attendees admin-users">
        <div className="admin-attendees__table-wrap">
          <table className="admin-attendees__table admin-users__table">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Added</th>
                <th scope="col">Actions</th>
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
                    <td data-label="Email">
                      <div className="admin-users__identity">
                        <span className="admin-users__email">{adminUser.email}</span>
                        {currentAdminUser?.normalizedEmail === adminUser.normalizedEmail ? (
                          <span className="admin-users__action-note">Signed in now</span>
                        ) : null}
                      </div>
                    </td>
                    <td data-label="Role">
                      <span
                        className={`admin-role-badge ${
                          adminUser.role === "owner"
                            ? "admin-role-badge--owner"
                            : "admin-role-badge--admin"
                        }`}
                      >
                        {adminUser.role === "owner" ? "Owner" : "Admin"}
                      </span>
                    </td>
                    <td data-label="Status">
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
                    <td data-label="Added">{formatCreatedAt(adminUser.createdAt)}</td>
                    <td data-label="Actions">
                      <div className="admin-users__actions">
                        <Link
                          className="admin-link-button"
                          href={`/admin/users?manage=${encodeURIComponent(
                            adminUser.normalizedEmail,
                          )}`}
                        >
                          Update account
                        </Link>

                        {adminUser.isActive ? (
                          <Link
                            className="admin-link-button admin-users__disable-button"
                            href={`/admin/users?confirmDisable=${encodeURIComponent(
                              adminUser.normalizedEmail,
                            )}`}
                          >
                            Disable access
                          </Link>
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
                            Remove account
                          </Link>
                        )}
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
