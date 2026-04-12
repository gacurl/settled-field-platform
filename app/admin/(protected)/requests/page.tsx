import Link from "next/link";
import { redirect } from "next/navigation";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import {
  listAdminAccessRequests,
  type AdminAccessRequestRecord,
} from "@/lib/admin-access-request-store";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type AdminRequestsPageProps = {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
};

function formatCreatedAt(value: AdminAccessRequestRecord["createdAt"]) {
  return dateFormatter.format(new Date(value));
}

function getFeedbackCopy(status?: string, error?: string) {
  if (status === "approved") {
    return {
      tone: "status",
      title: "Request approved",
      body: "That request is now approved and the new admin account can sign in.",
    };
  }

  if (status === "denied") {
    return {
      tone: "status",
      title: "Request denied",
      body: "That request has been marked as denied.",
    };
  }

  if (error === "invalid") {
    return {
      tone: "error",
      title: "That action could not be completed",
      body: "Refresh the page and try again.",
    };
  }

  return null;
}

export default async function AdminRequestsPage({
  searchParams,
}: AdminRequestsPageProps) {
  if (!(await isCurrentAdminOwner())) {
    redirect("/admin");
  }

  const [requests, resolvedSearchParams] = await Promise.all([
    listAdminAccessRequests(),
    searchParams,
  ]);

  const pendingRequests = requests.filter((request) => request.status === "pending");
  const reviewedRequests = requests.filter((request) => request.status !== "pending");
  const approvedRequests = requests.filter((request) => request.status === "approved");
  const deniedRequests = requests.filter((request) => request.status === "denied");
  const feedback = getFeedbackCopy(
    resolvedSearchParams?.status,
    resolvedSearchParams?.error,
  );

  return (
    <section className="admin-page">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Access requests</h1>
          <p className="admin-page__lede">
            Review pending requests for admin access and decide whether to
            approve or deny them.
          </p>
        </div>

        <Link className="admin-link-button" href="/admin">
          Back to Dashboard
        </Link>
      </section>

      <section className="admin-summary">
        <div className="admin-summary__item">
          <p className="admin-summary__label">Pending</p>
          <p className="admin-summary__value">{pendingRequests.length}</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Approved</p>
          <p className="admin-summary__value">{approvedRequests.length}</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Denied</p>
          <p className="admin-summary__value">{deniedRequests.length}</p>
        </div>
      </section>

      {feedback ? (
        <section className={`admin-panel admin-panel--${feedback.tone}`}>
          <h2>{feedback.title}</h2>
          <p>{feedback.body}</p>
        </section>
      ) : null}

      {pendingRequests.length === 0 ? (
        <section className="admin-panel">
          <h2>No pending requests</h2>
          <p>New access requests will appear here when they are submitted.</p>
        </section>
      ) : (
        <section className="admin-requests">
          {pendingRequests.map((request) => (
            <section className="admin-request-card" key={request.id}>
              <div className="admin-request-card__details">
                <p className="admin-card__eyebrow">Pending review</p>
                <h2 className="admin-card__title">{request.fullName}</h2>
                <p className="admin-card__body">{request.email}</p>
                <p className="admin-card__body">
                  {request.organization || "No organization provided"}
                </p>
                <p className="admin-card__status">
                  Requested {formatCreatedAt(request.createdAt)}
                </p>
              </div>

              <div className="admin-request-card__actions">
                <form action="/api/admin/requests/approve" method="post">
                  <input type="hidden" name="requestId" value={request.id} />
                  <label className="admin-field" htmlFor={`password-${request.id}`}>
                    <span>Set password</span>
                    <input
                      id={`password-${request.id}`}
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </label>
                  <button className="admin-button" type="submit">
                    Approve request
                  </button>
                </form>

                <form action="/api/admin/requests/deny" method="post">
                  <input type="hidden" name="requestId" value={request.id} />
                  <button className="admin-link-button admin-users__remove-link" type="submit">
                    Deny
                  </button>
                </form>
              </div>
            </section>
          ))}
        </section>
      )}

      {reviewedRequests.length > 0 ? (
        <section className="admin-attendees">
          <div className="admin-attendees__table-wrap">
            <table className="admin-attendees__table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Organization</th>
                  <th scope="col">Status</th>
                  <th scope="col">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {reviewedRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.fullName}</td>
                    <td>{request.email}</td>
                    <td>{request.organization || "Not provided"}</td>
                    <td>{request.status === "approved" ? "Approved" : "Denied"}</td>
                    <td>{formatCreatedAt(request.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </section>
  );
}
