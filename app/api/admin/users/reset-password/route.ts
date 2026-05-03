import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import {
  normalizeAdminEmail,
  resetAdminUserPassword,
} from "@/lib/admin-user-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const normalizedEmailEntry = formData.get("normalizedEmail");
  const password = formData.get("password");
  const normalizedEmail = normalizeAdminEmail(
    typeof normalizedEmailEntry === "string" ? normalizedEmailEntry : "",
  );

  if (!normalizedEmail || typeof password !== "string") {
    return NextResponse.redirect(
      new URL("/admin/users?error=reset-invalid", request.url),
      303,
    );
  }

  try {
    await resetAdminUserPassword({
      normalizedEmail,
      password,
    });
  } catch {
    return NextResponse.redirect(
      new URL(
        `/admin/users?error=reset-invalid&manage=${encodeURIComponent(normalizedEmail)}`,
        request.url,
      ),
      303,
    );
  }

  return NextResponse.redirect(
    new URL(
      `/admin/users?status=password-reset&manage=${encodeURIComponent(normalizedEmail)}`,
      request.url,
    ),
    303,
  );
}
