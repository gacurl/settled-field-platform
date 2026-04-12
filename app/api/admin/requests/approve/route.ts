import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import { approveAdminAccessRequest } from "@/lib/admin-access-request-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const requestIdValue = formData.get("requestId");
  const password = formData.get("password");
  const requestId =
    typeof requestIdValue === "string" ? Number.parseInt(requestIdValue, 10) : NaN;

  if (!Number.isInteger(requestId) || typeof password !== "string" || !password) {
    return NextResponse.redirect(
      new URL("/admin/requests?error=invalid", request.url),
      303,
    );
  }

  try {
    await approveAdminAccessRequest({
      password,
      requestId,
    });
  } catch {
    return NextResponse.redirect(
      new URL("/admin/requests?error=invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/admin/requests?status=approved", request.url),
    303,
  );
}
