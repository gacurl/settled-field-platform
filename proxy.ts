import { NextResponse, type NextRequest } from "next/server";
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

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
