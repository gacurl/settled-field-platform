import { NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);

  response.cookies.set({
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
    name: getAdminSessionCookieName(),
    value: "",
  });

  return response;
}
