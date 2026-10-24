import { z } from "zod";

/** Shared by the form (client-side hints) and the API route (authoritative). */
export const serviceValues = ["web", "app", "systems", "automation", "unsure"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(100, "That name is a little long."),
  email: z.string().trim().max(200, "That email address is too long.").pipe(z.email("Please enter a valid email address.")),
  company: z.string().trim().max(120, "Please keep this under 120 characters.").optional().default(""),
  service: z.enum(serviceValues, "Choose the kind of help you need."),
  message: z
    .string()
    .trim()
    .min(20, "A few more details help — at least 20 characters.")
    .max(5000, "Please keep this under 5,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Name of the hidden honeypot field. Humans never fill it in. */
export const HONEYPOT = "website";

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: "invalid"; fields: Partial<Record<ContactField, string>> }
  | { ok: false; error: "rate_limited" | "not_configured" | "delivery_failed" | "bad_request" | "forbidden" };

/** First error message per field, for inline display. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
