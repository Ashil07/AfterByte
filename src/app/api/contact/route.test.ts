import { beforeEach, describe, expect, it, vi } from "vitest";

const deliver = vi.fn();
vi.mock("@/lib/contact/deliver", () => ({ deliver: (...args: unknown[]) => deliver(...args) }));

const { POST } = await import("./route");
const { resetRateLimit } = await import("@/lib/contact/rate-limit");

const valid = {
  name: "Asha Menon",
  email: "asha@example.com",
  service: "app",
  message: "We want customers to book classes from their phones.",
};

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost:3000", "x-forwarded-for": "203.0.113.7", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  deliver.mockReset();
  resetRateLimit();
});

describe("POST /api/contact", () => {
  it("returns 200 only when delivery succeeds", async () => {
    deliver.mockResolvedValue({ ok: true });
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deliver).toHaveBeenCalledOnce();
  });

  it("returns 503 when no email provider is configured", async () => {
    deliver.mockResolvedValue({ ok: false, reason: "not_configured" });
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "not_configured" });
  });

  it("returns 502 when the provider fails", async () => {
    deliver.mockResolvedValue({ ok: false, reason: "failed" });
    const res = await POST(request(valid));
    expect(res.status).toBe(502);
  });

  it("returns field errors for invalid input without delivering", async () => {
    const res = await POST(request({ ...valid, email: "not-an-email" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid");
    expect(body.fields.email).toBeTruthy();
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const res = await POST(request("{nope"));
    expect(res.status).toBe(400);
  });

  it("silently drops honeypot submissions", async () => {
    const res = await POST(request({ ...valid, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rejects cross-origin posts", async () => {
    const res = await POST(request(valid, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("rate limits repeated submissions from one address", async () => {
    deliver.mockResolvedValue({ ok: true });
    for (let i = 0; i < 5; i++) expect((await POST(request(valid))).status).toBe(200);
    expect((await POST(request(valid))).status).toBe(429);
  });
});
