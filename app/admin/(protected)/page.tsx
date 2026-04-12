import Link from "next/link";

export default function AdminPage() {
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
          <p className="admin-summary__label">Access</p>
          <p className="admin-summary__value">Protected</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Operator model</p>
          <p className="admin-summary__value">Single admin</p>
        </div>
        <div className="admin-summary__item">
          <p className="admin-summary__label">Current phase</p>
          <p className="admin-summary__value">Dashboard shell</p>
        </div>
      </section>

      <section className="admin-grid" aria-label="Admin areas">
        <section className="admin-card">
          <p className="admin-card__eyebrow">Attendees</p>
          <h2 className="admin-card__title">Registration oversight</h2>
          <p className="admin-card__body">
            View the current registration record and see who has already entered
            the summit pipeline.
          </p>
          <Link className="admin-card__link" href="/admin/attendees">
            View Attendees
          </Link>
        </section>

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
