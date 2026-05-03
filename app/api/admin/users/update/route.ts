import { NextResponse } from "next/server";
import {
  getCurrentAdminUser,
  isCurrentAdminOwner,
} from "@/lib/admin-auth-server";
import {
  createAdminSessionValue,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth";
import {
  normalizeAdminEmail,
  updateAdminUserEmail,
} from "@/lib/admin-user-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const normalizedEmailEntry = formData.get("normalizedEmail");
  const nextEmail = formData.get("email");
  const normalizedEmail = normalizeAdminEmail(
    typeof normalizedEmailEntry === "string" ? normalizedEmailEntry : "",
  );

  if (!normalizedEmail || typeof nextEmail !== "string") {
    return NextResponse.redirect(
      new URL("/admin/users?error=update-invalid", request.url),
      303,
    );
  }

  try {
    const currentAdminUser = await getCurrentAdminUser();
    const updatedUser = await updateAdminUserEmail({
      normalizedEmail,
      nextEmail,
    });
    const response = NextResponse.redirect(
      new URL(
        `/admin/users?status=user-updated&manage=${encodeURIComponent(updatedUser.normalizedEmail)}`,
        request.url,
      ),
      303,
    );

    if (currentAdminUser?.normalizedEmail === normalizedEmail) {
      const sessionValue = createAdminSessionValue(updatedUser.normalizedEmail);

      if (!sessionValue) {
        return new Response("Unauthorized", { status: 401 });
      }

      response.cookies.set({
        ...getAdminSessionCookieOptions(),
        name: getAdminSessionCookieName(),
        value: sessionValue,
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "update-invalid";

    if (message === "That email already has access") {
      return NextResponse.redirect(
        new URL(
          `/admin/users?error=exists&manage=${encodeURIComponent(normalizedEmail)}`,
          request.url,
        ),
        303,
      );
    }

    return NextResponse.redirect(
      new URL(
        `/admin/users?error=update-invalid&manage=${encodeURIComponent(normalizedEmail)}`,
        request.url,
      ),
      303,
    );
  }
}
