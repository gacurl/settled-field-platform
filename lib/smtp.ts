// lib/smtp.ts

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY missing; skipping email notification.");
    return;
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: "Settled on the Field <kruep@settledonthefield.com>",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send failed", error);
  }
}