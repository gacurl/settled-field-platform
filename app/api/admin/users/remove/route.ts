import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import {
  normalizeAdminEmail,
  removeAdminUser,
} from "@/lib/admin-user-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const normalizedEmailEntry = formData.get("normalizedEmail");
  const confirmationEntry = formData.get("confirmation");
  const normalizedEmail = normalizeAdminEmail(
    typeof normalizedEmailEntry === "string" ? normalizedEmailEntry : "",
  );
  const confirmation =
    typeof confirmationEntry === "string" ? confirmationEntry : "";

  if (!normalizedEmail || confirmation !== "remove") {
    return NextResponse.redirect(
      new URL("/admin/users?error=remove-invalid", request.url),
      303,
    );
  }

  try {
    await removeAdminUser(normalizedEmail);
  } catch (error) {
    const message = error instanceof Error ? error.message : "remove-invalid";

    if (message === "Keep at least one active owner") {
      return NextResponse.redirect(
        new URL("/admin/users?error=keep-owner", request.url),
        303,
      );
    }

    return NextResponse.redirect(
      new URL("/admin/users?error=remove-invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/admin/users?status=user-removed", request.url),
    303,
  );
}
