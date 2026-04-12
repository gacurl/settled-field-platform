import Link from "next/link";
import {
  listRegistrations,
  type RegistrationRecord,
} from "@/lib/registration-store";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatCreatedAt(value: RegistrationRecord["createdAt"]) {
  return dateFormatter.format(new Date(value));
}

export default async function AdminAttendeesPage() {
  const registrations = await listRegistrations();

  return (
    <section className="admin-page">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Attendees</h1>
          <p className="admin-page__lede">
            Review who has registered so far and keep the summit operator view
            grounded in the current registration record.
          </p>
        </div>

        <Link className="admin-link-button" href="/admin">
          Back to Dashboard
        </Link>
      </section>

      <section className="admin-summary">
        <div className="admin-summary__item">
          <p className="admin-summary__label">Registered attendees</p>
          <p className="admin-summary__value">{registrations.length}</p>
        </div>
      </section>

      {registrations.length === 0 ? (
        <section className="admin-panel">
          <h2>No attendees yet</h2>
          <p>
            Registrations will appear here once people complete the current
            summit registration flow.
          </p>
        </section>
      ) : (
        <section className="admin-attendees">
          <div className="admin-attendees__table-wrap">
            <table className="admin-attendees__table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Organization</th>
                  <th scope="col">Registered</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.normalizedEmail}>
                    <td>{registration.fullName}</td>
                    <td>{registration.email}</td>
                    <td>
                      {registration.organizationOrAffiliation || "Not provided"}
                    </td>
                    <td>{formatCreatedAt(registration.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}
