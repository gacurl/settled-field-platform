import { NextResponse } from "next/server";
import { createAdminAccessRequest } from "@/lib/admin-access-request-store";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const organization = formData.get("organization");

  if (typeof fullName !== "string" || typeof email !== "string") {
    return NextResponse.redirect(
      new URL("/admin/request-access?error=invalid", request.url),
      303,
    );
  }

  try {
    const status = await createAdminAccessRequest({
      email,
      fullName,
      organization: typeof organization === "string" ? organization : "",
    });

    if (status === "already-has-access") {
      return NextResponse.redirect(
        new URL("/admin/request-access?error=access", request.url),
        303,
      );
    }

    if (status === "pending") {
      return NextResponse.redirect(
        new URL("/admin/request-access?status=pending", request.url),
        303,
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL("/admin/request-access?error=invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/admin/request-access?status=pending", request.url),
    303,
  );
}
