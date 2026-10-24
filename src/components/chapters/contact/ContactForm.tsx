"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { serviceOptions } from "@/content/services";
import { site } from "@/content/site";
import { SERVICE_EVENT } from "@/lib/contact/events";
import {
  HONEYPOT,
  budgetOptions,
  contactSchema,
  fieldErrors,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact/schema";
import { cn } from "@/lib/cn";

type Values = Record<ContactField, string>;
type Status = "idle" | "submitting" | "success" | "error";

const empty: Values = { name: "", email: "", company: "", service: "", message: "", budget: "" };
const order: ContactField[] = ["name", "email", "company", "service", "message", "budget"];

const failureCopy: Record<string, string> = {
  not_configured: "The form isn’t connected to our inbox yet, so your message was not sent.",
  delivery_failed: "Something went wrong on our side and your message was not sent. Please try again in a moment.",
  rate_limited: "That’s a few too many attempts. Please wait a few minutes and try again.",
  network: "We couldn’t reach the server. Check your connection and try again.",
  default: "Your message was not sent. Please check the form and try again.",
};

function Field({
  id,
  label,
  optional,
  error,
  children,
  className,
}: {
  id: ContactField;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={`f-${id}`} className="label flex justify-between text-mute">
        <span>{label}</span>
        {optional && <span className="normal-case tracking-normal text-mute/70">Optional</span>}
      </label>
      {children}
      <p id={`f-${id}-error`} className={cn("mt-2 min-h-[1.25rem] text-[0.875rem] text-[#f0b9a8]", !error && "invisible")}>
        {error}
      </p>
    </div>
  );
}

const control =
  "mt-2 w-full rounded-none border-0 border-b border-line-strong bg-transparent px-0 py-3 text-[1.0625rem] text-paper placeholder:text-mute/60 transition-colors duration-300 focus:border-ice focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[#f0b9a8]";

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Service CTAs elsewhere on the page preselect the service field.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, service: id }));
    };
    window.addEventListener(SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SERVICE_EVENT, onSelect);
  }, []);

  const validate = (next: Values) => {
    const r = contactSchema.safeParse(next);
    return r.success ? {} : fieldErrors(r.error);
  };

  const update = (key: ContactField, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const onBlur = (key: ContactField) => {
    if (!values[key] && !attempted) return;
    const e = validate(values);
    setErrors((prev) => ({ ...prev, [key]: e[key] }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = order.find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#f-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    setFailure("");
    const honeypot = (formRef.current?.elements.namedItem(HONEYPOT) as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT]: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      if (data && !data.ok && data.error === "invalid") {
        setErrors(data.fields);
        setFailure(failureCopy.default);
      } else {
        setFailure(failureCopy[(data && !data.ok && data.error) || "default"] ?? failureCopy.default);
      }
      setStatus("error");
    } catch {
      setFailure(failureCopy.network);
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t border-line pt-8 outline-none">
        <p className="label text-ice">Message sent</p>
        <p className="mt-4 font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1.02]">Thank you, {values.name.split(" ")[0]}.</p>
        <p className="mt-4 max-w-[44ch] text-paper/70">
          Your message reached us. We’ll reply to {values.email}.
        </p>
        <Button
          variant="text"
          arrow="none"
          className="mt-6"
          onClick={() => {
            setValues(empty);
            setErrors({});
            setAttempted(false);
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const describe = (k: ContactField) => (errors[k] ? `f-${k}-error` : undefined);
  const submitting = status === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-status" className="relative">
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            className={control}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => onBlur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            required
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={control}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={describe("email")}
            required
          />
        </Field>
        <Field id="company" label="Company" optional error={errors.company}>
          <input
            id="f-company"
            name="company"
            autoComplete="organization"
            className={control}
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            onBlur={() => onBlur("company")}
            aria-invalid={!!errors.company}
            aria-describedby={describe("company")}
          />
        </Field>
        <Field id="service" label="What do you need?" error={errors.service}>
          <select
            id="f-service"
            name="service"
            className={cn(control, "appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat", !values.service && "text-mute/80")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%2392949d' stroke-width='1.4'%3E%3Cpath d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")",
            }}
            value={values.service}
            onChange={(e) => update("service", e.target.value)}
            onBlur={() => onBlur("service")}
            aria-invalid={!!errors.service}
            aria-describedby={describe("service")}
            required
          >
            <option value="" disabled className="bg-ink-2">
              Choose one
            </option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-ink-2 text-paper">
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="message" label="Tell us about the project" error={errors.message} className="sm:col-span-2">
          <textarea
            id="f-message"
            name="message"
            rows={5}
            className={cn(control, "resize-y")}
            placeholder="What are you trying to do, and what’s getting in the way?"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            onBlur={() => onBlur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describe("message")}
            required
          />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="label flex w-full justify-between text-mute">
            <span>Budget range</span>
            <span className="normal-case tracking-normal text-mute/70">Optional</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {budgetOptions.map((b) => {
              const on = values.budget === b.value;
              return (
                <label
                  key={b.value || "none"}
                  className={cn(
                    "cursor-pointer border px-3 py-2.5 text-[0.875rem] transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ice",
                    on ? "border-ice/70 bg-ice/10 text-paper" : "border-line text-paper/70 hover:border-line-strong hover:text-paper",
                  )}
                >
                  <input
                    type="radio"
                    name="budget"
                    value={b.value}
                    checked={on}
                    onChange={() => update("budget", b.value)}
                    className="sr-only"
                  />
                  {b.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={submitting} arrow={submitting ? "none" : "right"} aria-disabled={submitting}>
          {submitting ? "Sending…" : "Send project details"}
        </Button>
      </div>

      <div id="form-status" ref={statusRef} tabIndex={-1} role="alert" aria-live="assertive" className="outline-none">
        {status === "error" && (
          <div className="mt-8 border-l-2 border-[#f0b9a8] pl-4">
            <p className="text-paper">{failure}</p>
            {site.email && (
              <p className="mt-1 text-paper/70">
                You can also email us directly at{" "}
                <a className="text-ice underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            )}
            {site.phone.tel && (
              <p className="mt-1 text-paper/70">
                Or call us on{" "}
                <a className="text-ice underline underline-offset-4" href={`tel:${site.phone.tel}`}>
                  {site.phone.display}
                </a>
                .
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
