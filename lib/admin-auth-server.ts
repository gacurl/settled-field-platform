import { cookies } from "next/headers";
import {
  getAdminSessionSubject,
  getAdminSessionCookieName,
} from "@/lib/admin-auth";
import { findAdminUserByNormalizedEmail } from "@/lib/admin-user-store";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const subject = getAdminSessionSubject(
    cookieStore.get(getAdminSessionCookieName())?.value,
  );

  if (!subject) {
    return false;
  }

  return (await findAdminUserByNormalizedEmail(subject)) !== null;
}
