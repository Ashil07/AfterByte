import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors } from "./schema";

const valid = {
  name: "Asha Menon",
  email: "asha@example.com",
  company: "",
  service: "systems",
  message: "We track rentals in a spreadsheet and keep double-booking equipment.",
  budget: "",
};

describe("contactSchema", () => {
  it("accepts a complete, valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims whitespace", () => {
    const r = contactSchema.parse({ ...valid, name: "  Asha  ", email: " asha@example.com " });
    expect(r.name).toBe("Asha");
    expect(r.email).toBe("asha@example.com");
  });

  it("treats company and budget as optional", () => {
    const r = contactSchema.parse({ name: valid.name, email: valid.email, service: valid.service, message: valid.message });
    expect(r.company).toBe("");
    expect(r.budget).toBe("");
  });

  it("reports a readable message per invalid field", () => {
    const r = contactSchema.safeParse({ name: "A", email: "nope", service: "spaceships", message: "short" });
    expect(r.success).toBe(false);
    if (r.success) return;
    const errors = fieldErrors(r.error);
    expect(errors.name).toMatch(/name/i);
    expect(errors.email).toMatch(/valid email/i);
    expect(errors.service).toMatch(/choose/i);
    expect(errors.message).toMatch(/20 characters/);
  });

  it("rejects unknown budget values", () => {
    expect(contactSchema.safeParse({ ...valid, budget: "a million" }).success).toBe(false);
  });
});
