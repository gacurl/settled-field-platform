export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-16">
      <div className="w-full rounded-xl border border-black/10 bg-white p-8">
        <h1 className="text-3xl font-semibold">Admin placeholder</h1>
        <p className="mt-3 text-sm text-black/60">Route: /admin</p>
        <form action="/api/admin/logout" method="post" className="mt-6">
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Log Out
          </button>
        </form>
      </div>
    </main>
  );
}
