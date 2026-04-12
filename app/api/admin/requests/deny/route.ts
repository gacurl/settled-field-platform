import { NextResponse } from "next/server";
import { isCurrentAdminOwner } from "@/lib/admin-auth-server";
import { denyAdminAccessRequest } from "@/lib/admin-access-request-store";

export async function POST(request: Request) {
  if (!(await isCurrentAdminOwner())) {
    return new Response("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const requestIdValue = formData.get("requestId");
  const requestId =
    typeof requestIdValue === "string" ? Number.parseInt(requestIdValue, 10) : NaN;

  if (!Number.isInteger(requestId)) {
    return NextResponse.redirect(
      new URL("/admin/requests?error=invalid", request.url),
      303,
    );
  }

  try {
    await denyAdminAccessRequest(requestId);
  } catch {
    return NextResponse.redirect(
      new URL("/admin/requests?error=invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/admin/requests?status=denied", request.url),
    303,
  );
}
