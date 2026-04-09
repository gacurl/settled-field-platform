import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return null;
  }

  return process.env.ADMIN_SESSION_SECRET ?? `${adminEmail}:${adminPassword}`;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function areAdminCredentialsValid(email: unknown, password: unknown) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !adminEmail ||
    !adminPassword
  ) {
    return false;
  }

  return safeEqual(email, adminEmail) && safeEqual(password, adminPassword);
}

export function createAdminSessionValue() {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  const payload = JSON.stringify({
    exp: Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000,
    sub: "admin",
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function isAdminSessionValueValid(value: string | undefined) {
  if (!value) {
    return false;
  }

  const secret = getSessionSecret();

  if (!secret) {
    return false;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signValue(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as {
      exp?: number;
      sub?: string;
    };

    return payload.sub === "admin" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
