import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminSessionCookieName,
  isAdminSessionValueValid,
} from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionValue = request.cookies.get(getAdminSessionCookieName())?.value;

  if (isAdminSessionValueValid(sessionValue)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
