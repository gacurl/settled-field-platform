import { cookies } from "next/headers";
import {
  getAdminSessionCookieName,
  isAdminSessionValueValid,
} from "@/lib/admin-auth";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return isAdminSessionValueValid(
    cookieStore.get(getAdminSessionCookieName())?.value,
  );
}
