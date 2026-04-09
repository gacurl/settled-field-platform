type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const showError = resolvedSearchParams?.error === "invalid";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backgroundColor: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2rem",
          border: "1px solid #d0d7de",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 0.5rem",
            fontSize: "1.75rem",
            lineHeight: 1.2,
          }}
        >
          Admin Login
        </h1>
        <p
          style={{
            margin: "0 0 1.5rem",
            color: "#4b5563",
            lineHeight: 1.5,
          }}
        >
          Sign in to access the admin area.
        </p>

        {showError ? (
          <p
            style={{
              margin: "0 0 1rem",
              color: "#b91c1c",
              lineHeight: 1.5,
            }}
          >
            Invalid email or password.
          </p>
        ) : null}

        <form action="/api/admin/login" method="post">
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.875rem",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
