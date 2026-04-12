export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) {
    return;
  }

  const { initializeAdminUserStore } = await import("@/lib/admin-user-store");
  const { initializeRegistrationEmailStore } = await import(
    "@/lib/registration-email-store"
  );
  const { initializeRegistrationStore } = await import(
    "@/lib/registration-store"
  );

  await initializeAdminUserStore();
  await initializeRegistrationEmailStore();
  await initializeRegistrationStore();
}
