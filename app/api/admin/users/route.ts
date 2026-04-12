import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import { createHelperAdminUser } from "@/lib/admin-user-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.redirect(
      new URL("/admin/users?error=invalid", request.url),
      303,
    );
  }

  try {
    await createHelperAdminUser({
      email,
      password,
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
    new URL("/admin/users?status=helper-added", request.url),
    303,
  );
}
