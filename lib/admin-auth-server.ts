import { cookies } from "next/headers";
import {
  getAdminSessionSubject,
  getAdminSessionCookieName,
} from "@/lib/admin-auth";
import {
  type AdminUserRecord,
  findAdminUserByNormalizedEmail,
} from "@/lib/admin-user-store";

async function getCurrentAdminUser(): Promise<AdminUserRecord | null> {
  const cookieStore = await cookies();
  const subject = getAdminSessionSubject(
    cookieStore.get(getAdminSessionCookieName())?.value,
  );

  if (!subject) {
    return null;
  }

  const adminUser = await findAdminUserByNormalizedEmail(subject);

  if (!adminUser?.isActive) {
    return null;
  }

  return adminUser;
}

export { getCurrentAdminUser };

export async function isAdminAuthenticated() {
  return (await getCurrentAdminUser()) !== null;
}

export async function getCurrentAdminRole() {
  return (await getCurrentAdminUser())?.role ?? null;
}

export async function isCurrentAdminOwner() {
  return (await getCurrentAdminRole()) === "owner";
}
