import { NextResponse } from "next/server";
import {
  createAdminSessionValue,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth";
import { authenticateAdminUser } from "@/lib/admin-user-store";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const adminUser = await authenticateAdminUser(email, password);

  if (adminUser) {
    const sessionValue = createAdminSessionValue(adminUser.normalizedEmail);

    if (!sessionValue) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = NextResponse.redirect(new URL("/admin", request.url), 303);

    response.cookies.set({
      ...getAdminSessionCookieOptions(),
      name: getAdminSessionCookieName(),
      value: sessionValue,
    });

    return response;
  }

  return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
}
