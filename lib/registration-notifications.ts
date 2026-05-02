import type { RegistrationDraft, RegistrationFormValues } from "@/app/register/types";
import { sendOwnerNotificationEmail } from "@/lib/smtp";

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
  await sendOwnerNotificationEmail({
    subject: "New Settled on the Field interest registration",
    text: buildNotificationBody(values, draft.submittedAt),
  });
}
