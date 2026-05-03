import Link from "next/link";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import { countPaidPayments } from "@/lib/payment-store";
import { countRegistrations } from "@/lib/registration-store";

export default async function AdminPage() {
  const [isOwner, totalRegistrations, totalPaid] = await Promise.all([
    isCurrentAdminOwner(),
    countRegistrations(),
    countPaidPayments(),
  ]);

  return (
    <section className="admin-page">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Admin dashboard</h1>
        </div>

        <form action="/api/admin/logout" method="post">
          <button className="admin-button" type="submit">
            Log Out
          </button>
        </form>
      </section>

      <section className="admin-summary">
        <div className="admin-summary__item">
          <p className="admin-summary__label">Total registrations</p>
          <p className="admin-summary__value">{totalRegistrations}</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Total paid</p>
          <p className="admin-summary__value">{totalPaid}</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Access</p>
          <p className="admin-summary__value">Protected</p>
        </div>
      </section>

      <section className="admin-grid" aria-label="Admin areas">
        <section className="admin-card">
          <p className="admin-card__eyebrow">Interest</p>
          <h2 className="admin-card__title">Interest list</h2>
          <p className="admin-card__body">Review current registrations.</p>
          <Link className="admin-card__link" href="/admin/attendees">
            View interest
          </Link>
        </section>

        {isOwner ? (
          <section className="admin-card">
            <p className="admin-card__eyebrow">Team access</p>
            <h2 className="admin-card__title">Admin accounts</h2>
            <p className="admin-card__body">Manage owner and admin access.</p>
            <Link className="admin-card__link" href="/admin/users">
              Manage accounts
            </Link>
            <br />
            <Link className="admin-card__link" href="/admin/requests">
              Review requests
            </Link>
          </section>
        ) : null}

        <section className="admin-card">
          <p className="admin-card__eyebrow">Speakers</p>
          <h2 className="admin-card__title">Speaker coordination</h2>
          <p className="admin-card__body">Speaker operations are not live yet.</p>
          <p className="admin-card__status">Placeholder only</p>
        </section>

        <section className="admin-card">
          <p className="admin-card__eyebrow">Content</p>
          <h2 className="admin-card__title">Content links</h2>
          <p className="admin-card__body">Content tools are not live yet.</p>
          <p className="admin-card__status">Ready for future routes</p>
        </section>

        <section className="admin-card">
          <p className="admin-card__eyebrow">Settings</p>
          <h2 className="admin-card__title">Settings</h2>
          <p className="admin-card__body">Settings are not live yet.</p>
          <p className="admin-card__status">Not wired yet</p>
        </section>
      </section>
    </section>
  );
}
