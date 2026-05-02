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
          <h1 className="admin-page__title">Summit control is ready.</h1>
          <p className="admin-page__lede">
            This shell gives Settled on the Field a protected operator space for
            attendee status, speaker coordination, content links, and settings
            work that will come online in later issues.
          </p>
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
        <div className="admin-summary__item">
          <p className="admin-summary__label">Operator model</p>
          <p className="admin-summary__value">Small team</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Current phase</p>
          <p className="admin-summary__value">Dashboard shell</p>
        </div>
      </section>

      <section className="admin-grid" aria-label="Admin areas">
        <section className="admin-card">
          <p className="admin-card__eyebrow">Interest</p>
          <h2 className="admin-card__title">Captured registrations</h2>
          <p className="admin-card__body">
            View the current interest list and confirm who has submitted name,
            email, and registration time.
          </p>
          <Link className="admin-card__link" href="/admin/attendees">
            View Interest List
          </Link>
        </section>

        {isOwner ? (
          <section className="admin-card">
            <p className="admin-card__eyebrow">Team access</p>
            <h2 className="admin-card__title">Helper account management</h2>
            <p className="admin-card__body">
              Add helper accounts, review current access, and disable sign-in
              when someone should no longer use the admin area.
            </p>
            <Link className="admin-card__link" href="/admin/users">
              Manage Team Access
            </Link>
            <br />
            <Link className="admin-card__link" href="/admin/requests">
              Review Access Requests
            </Link>
          </section>
        ) : null}

        <section className="admin-card">
          <p className="admin-card__eyebrow">Speakers</p>
          <h2 className="admin-card__title">Speaker coordination</h2>
          <p className="admin-card__body">
            Reserved for speaker details, scheduling notes, and operational
            visibility. CRUD and persistence are intentionally out of scope here.
          </p>
          <p className="admin-card__status">Placeholder only</p>
        </section>

        <section className="admin-card">
          <p className="admin-card__eyebrow">Content</p>
          <h2 className="admin-card__title">Links and publishing surfaces</h2>
          <p className="admin-card__body">
            This shell keeps a clear home for content links, summit resources,
            and future publishing controls without wiring those features yet.
          </p>
          <p className="admin-card__status">Ready for future routes</p>
        </section>

        <section className="admin-card">
          <p className="admin-card__eyebrow">Settings</p>
          <h2 className="admin-card__title">Operational configuration</h2>
          <p className="admin-card__body">
            Intended for low-frequency admin controls such as environment-backed
            operational settings. Nothing is editable in this issue.
          </p>
          <p className="admin-card__status">Not wired yet</p>
        </section>
      </section>

      <section className="admin-panel">
        <h2>Next actions</h2>
        <p>
          The admin foundation is now protected and structured. Future issues
          can add attendee and status features into these sections without
          reshaping the shell.
        </p>
      </section>
    </section>
  );
}
