import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import {
  disableAdminUser,
  normalizeAdminEmail,
} from "@/lib/admin-user-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const normalizedEmailEntry = formData.get("normalizedEmail");
  const normalizedEmail = normalizeAdminEmail(
    typeof normalizedEmailEntry === "string" ? normalizedEmailEntry : "",
  );

  if (!normalizedEmail) {
    return NextResponse.redirect(
      new URL("/admin/users?error=disable-invalid", request.url),
      303,
    );
  }

  try {
    await disableAdminUser(normalizedEmail);
  } catch (error) {
    const message = error instanceof Error ? error.message : "disable-invalid";

    if (message === "Keep at least one active owner") {
      return NextResponse.redirect(
        new URL("/admin/users?error=keep-owner", request.url),
        303,
      );
    }

    return NextResponse.redirect(
      new URL("/admin/users?error=disable-invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/admin/users?status=helper-disabled", request.url),
    303,
  );
}
