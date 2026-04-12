export default function AdminPage() {
  return (
    <section className="admin-page">
      <div className="admin-page__intro">
        <p className="admin-page__eyebrow">Admin</p>
        <h1 className="admin-page__title">Admin access is active.</h1>
        <p className="admin-page__lede">
          This is the protected admin baseline for Settled on the Field. The
          dashboard work comes next, but access is now limited to the configured
          admin session.
        </p>
      </div>

      <section className="admin-panel">
        <h2>Current scope</h2>
        <p>
          This placeholder confirms the lock on the door is working without
          expanding into dashboard features ahead of scope.
        </p>

        <form action="/api/admin/logout" method="post">
          <button className="admin-button" type="submit">
            Log Out
          </button>
        </form>
      </section>
    </section>
  );
}
