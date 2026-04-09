export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email === "string" &&
    typeof password === "string" &&
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return new Response("OK", { status: 200 });
  }

  return new Response("Unauthorized", { status: 401 });
}
