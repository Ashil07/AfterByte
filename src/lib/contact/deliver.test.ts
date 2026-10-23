import { describe, expect, it } from "vitest";
import { compose, deliver, provider } from "./deliver";

const input = {
  name: "Asha\r\nBcc: evil@example.com",
  email: "asha@example.com",
  company: "",
  service: "web" as const,
  message: "<script>alert(1)</script> We need a site.",
  budget: "",
};

describe("provider", () => {
  it("is null without recipient and sender", () => {
    expect(provider({ RESEND_API_KEY: "x" })).toBeNull();
  });
  it("prefers Resend when its key is present", () => {
    expect(provider({ CONTACT_TO_EMAIL: "a@b.c", CONTACT_FROM_EMAIL: "d@e.f", RESEND_API_KEY: "k", SMTP_HOST: "h", SMTP_USER: "u", SMTP_PASS: "p" })).toBe("resend");
  });
  it("uses SMTP when fully configured", () => {
    expect(provider({ CONTACT_TO_EMAIL: "a@b.c", CONTACT_FROM_EMAIL: "d@e.f", SMTP_HOST: "h", SMTP_USER: "u", SMTP_PASS: "p" })).toBe("smtp");
  });
  it("ignores partial SMTP config", () => {
    expect(provider({ CONTACT_TO_EMAIL: "a@b.c", CONTACT_FROM_EMAIL: "d@e.f", SMTP_HOST: "h" })).toBeNull();
  });
});

describe("compose", () => {
  it("keeps the subject on one line (no header injection)", () => {
    expect(compose(input).subject).not.toMatch(/[\r\n]/);
  });
  it("escapes HTML in the message body", () => {
    const { html } = compose(input);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("deliver", () => {
  it("reports not_configured instead of pretending to send", async () => {
    await expect(deliver(input, {})).resolves.toEqual({ ok: false, reason: "not_configured" });
  });
});
