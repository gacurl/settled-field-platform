import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import {
  createManagedAdminUser,
  parseAdminUserRole,
} from "@/lib/admin-user-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const roleValue = formData.get("role");
  const role = parseAdminUserRole(roleValue);

  if (typeof email !== "string" || typeof password !== "string" || !role) {
    return NextResponse.redirect(
      new URL("/admin/users?error=invalid", request.url),
      303,
    );
  }

  try {
    await createManagedAdminUser({
      email,
      password,
      role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid";

    if (message === "That email already has access") {
      return NextResponse.redirect(
        new URL("/admin/users?error=exists", request.url),
        303,
      );
    }

    return NextResponse.redirect(
      new URL("/admin/users?error=invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/admin/users?status=user-added", request.url),
    303,
  );
}
