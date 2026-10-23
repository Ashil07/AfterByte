import "server-only";
import { serviceOptions } from "@/content/services";
import { budgetOptions, type ContactInput } from "./schema";

/**
 * Delivers contact submissions by email. Server-only: credentials are read
 * from environment variables and never reach the browser.
 *
 * Providers (first configured wins):
 *   resend — RESEND_API_KEY (HTTPS API, no SDK)
 *   smtp   — SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, optional SMTP_SECURE
 * Both need CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.
 */
export type Env = Record<string, string | undefined>;
export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export function provider(env: Env = process.env): "resend" | "smtp" | null {
  if (!env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) return null;
  if (env.RESEND_API_KEY) return "resend";
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) return "smtp";
  return null;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function compose(input: ContactInput) {
  const service = serviceOptions.find((s) => s.value === input.service)?.label ?? input.service;
  const budget = budgetOptions.find((b) => b.value === input.budget)?.label ?? "Not given";
  const fields: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company || "—"],
    ["Service", service],
    ["Budget", budget],
  ];
  const subject = oneLine(`New project inquiry — ${input.name} (${service})`);
  const text = `${fields.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${input.message}\n`;
  const html = `<table cellpadding="4">${fields
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`;
  return { subject, text, html };
}

export async function deliver(input: ContactInput, env: Env = process.env): Promise<DeliveryResult> {
  const which = provider(env);
  if (!which) return { ok: false, reason: "not_configured" };
  const { subject, text, html } = compose(input);
  const to = env.CONTACT_TO_EMAIL!;
  const from = env.CONTACT_FROM_EMAIL!;

  try {
    if (which === "resend") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], reply_to: input.email, subject, text, html }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error("[contact] Resend rejected the message", res.status);
        return { ok: false, reason: "failed" };
      }
      return { ok: true };
    }

    const nodemailer = await import("nodemailer");
    const port = Number(env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 10_000,
    });
    const info = await transport.sendMail({ from, to, replyTo: input.email, subject, text, html });
    if (info.rejected?.length) {
      console.error("[contact] SMTP server rejected the recipient");
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] Delivery error:", err instanceof Error ? err.message : err);
    return { ok: false, reason: "failed" };
  }
}
