import type { RegistrationDraft, RegistrationFormValues } from "@/app/register/types";
import { sendEmail } from "@/lib/smtp";

function buildNotificationBody(
  values: RegistrationFormValues,
  submittedAt: string,
) {
  return [
    "New Settled on the Field interest registration",
    "",
    `Name: ${values.name || "Not provided"}`,
    `Email: ${values.email || "Not provided"}`,
    "Phone: Not provided",
    "Affiliation / background: Not provided",
    `Timestamp: ${submittedAt}`,
    "",
    "This notification came from the Settled on the Field site.",
  ].join("\n");
}

export async function notifyOwnerOfRegistration(
  values: RegistrationFormValues,
  draft: RegistrationDraft,
) {
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;

  if (!ownerEmail) {
    console.warn("OWNER_NOTIFICATION_EMAIL missing; skipping email notification.");
    return;
  }

  const body = buildNotificationBody(values, draft.submittedAt);

  await sendEmail({
    to: ownerEmail,
    subject: "New Settled on the Field interest registration",
    html: body.replace(/\n/g, "<br />"),
  });
}
