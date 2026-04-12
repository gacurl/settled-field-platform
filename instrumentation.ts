export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) {
    return;
  }

  const { initializeRegistrationEmailStore } = await import(
    "@/lib/registration-email-store"
  );
  const { initializeRegistrationStore } = await import(
    "@/lib/registration-store"
  );

  await initializeRegistrationEmailStore();
  await initializeRegistrationStore();
}
