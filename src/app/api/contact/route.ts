import { deliver } from "@/lib/contact/deliver";
import { rateLimit } from "@/lib/contact/rate-limit";
import { HONEYPOT, contactSchema, fieldErrors, type ContactResponse } from "@/lib/contact/schema";

const MAX_BYTES = 20_000;

function reply(body: ContactResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  // Reject cross-site posts when the browser tells us the origin.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return reply({ ok: false, error: "forbidden" }, 403);

  const raw = await request.text();
  if (raw.length > MAX_BYTES) return reply({ ok: false, error: "bad_request" }, 413);

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed;
  } catch {
    return reply({ ok: false, error: "bad_request" }, 400);
  }

  // Honeypot filled: almost certainly a bot. Drop it without telling the bot.
  if (typeof body[HONEYPOT] === "string" && body[HONEYPOT]) return reply({ ok: true }, 200);

  const result = contactSchema.safeParse(body);
  if (!result.success) return reply({ ok: false, error: "invalid", fields: fieldErrors(result.error) }, 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) return reply({ ok: false, error: "rate_limited" }, 429);

  const delivery = await deliver(result.data);
  if (!delivery.ok) {
    return delivery.reason === "not_configured"
      ? reply({ ok: false, error: "not_configured" }, 503)
      : reply({ ok: false, error: "delivery_failed" }, 502);
  }
  return reply({ ok: true }, 200);
}
