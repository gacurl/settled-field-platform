import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getAdminSessionSecret() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!sessionSecret) {
    return null;
  }

  return sessionSecret;
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

export function createAdminSessionValue(subject: string) {
  const sessionSecret = getAdminSessionSecret();

  if (!sessionSecret || !subject) {
    return null;
  }

  const payload = JSON.stringify({
    exp: Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000,
    sub: subject,
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signValue(encodedPayload, sessionSecret);

  return `${encodedPayload}.${signature}`;
}

export function getAdminSessionSubject(value: string | undefined) {
  if (!value) {
    return null;
  }

  const sessionSecret = getAdminSessionSecret();

  if (!sessionSecret) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload, sessionSecret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as {
      exp?: number;
      sub?: string;
    };

    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) {
      return null;
    }

    return typeof payload.sub === "string" && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}

export function isAdminSessionValueValid(value: string | undefined) {
  return getAdminSessionSubject(value) !== null;
}
