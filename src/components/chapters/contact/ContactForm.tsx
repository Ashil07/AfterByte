"use client";

import { startTransition, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { MOTION, gsap } from "@/components/motion/gsap";
import { Button } from "@/components/ui/Button";
import { serviceOptions } from "@/content/services";
import { site, whatsappHref } from "@/content/site";
import { serviceFromUrl } from "@/lib/contact/events";
import {
  HONEYPOT,
  contactSchema,
  timelineOptions,
  fieldErrors,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact/schema";
import { cn } from "@/lib/cn";

type Values = Record<ContactField, string>;
type Status = "idle" | "submitting" | "success" | "error";

const empty: Values = { name: "", email: "", company: "", service: "", timeline: "", message: "" };
const order: ContactField[] = ["service", "timeline", "name", "email", "company", "message"];

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
      <p id={`f-${id}-error`} className={cn("mt-2 min-h-[1.25rem] text-[0.875rem] text-error", !error && "invisible")}>
        {error}
      </p>
    </div>
  );
}

/** A row of tappable options (radio buttons styled as rectangular chips). */
function Choices({
  id,
  legend,
  hint,
  options,
  value,
  error,
  onChange,
}: {
  id: ContactField;
  legend: string;
  hint: string;
  options: readonly { value: string; label: string }[];
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset
      className="min-w-0"
      aria-invalid={!!error || undefined}
      aria-describedby={error ? `f-${id}-error` : undefined}
    >
      <legend className="label text-mute">
        {legend} <span className="ml-2 normal-case tracking-normal text-mute/70">{hint}</span>
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.value} className="relative">
            <input
              id={i === 0 ? `f-${id}` : undefined}
              type="radio"
              name={id}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer absolute inset-0 cursor-pointer appearance-none rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
            />
            <span className="pointer-events-none flex min-h-11 items-center rounded-[2px] border border-line-strong px-4 text-[0.9375rem] text-paper/80 transition-colors duration-200 peer-checked:border-ice peer-checked:bg-ice/10 peer-checked:text-paper peer-hover:border-paper/40">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <p id={`f-${id}-error`} className={cn("mt-2 min-h-[1.25rem] text-[0.875rem] text-error", !error && "invisible")}>
        {error}
      </p>
    </fieldset>
  );
}

const control =
  "mt-2 w-full rounded-none border-0 border-b border-line-strong bg-transparent px-0 py-3 text-[1.0625rem] text-paper placeholder:text-mute/85 transition-colors duration-300 focus:border-ice focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-error";

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Service CTAs link to /contact?service=<id>; preselect that choice.
  useEffect(() => {
    const id = serviceFromUrl(window.location.search);
    if (id) startTransition(() => setValues((v) => (v.service ? v : { ...v, service: id })));
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

  // The thank-you note rises in instead of replacing the form in one frame.
  useEffect(() => {
    const note = statusRef.current;
    if (status !== "success" || !note) return;
    const still = window.matchMedia(MOTION.reduced).matches;
    gsap.from(note.children, { opacity: 0, y: still ? 0 : 10, duration: 0.5, stagger: 0.06, ease: "expo.out" });
  }, [status]);

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
      <div className="mb-6 grid gap-y-6">
        <Choices
          id="service"
          legend="What can we build for you?"
          hint="Pick the closest"
          options={serviceOptions}
          value={values.service}
          error={errors.service}
          onChange={(v) => update("service", v)}
        />
        <Choices
          id="timeline"
          legend="When would you like to launch?"
          hint="Optional · a rough idea is fine"
          options={timelineOptions}
          value={values.timeline}
          error={errors.timeline}
          onChange={(v) => update("timeline", v)}
        />
      </div>
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
        <Field id="message" label="Anything else we should know?" optional error={errors.message} className="sm:col-span-2">
          <textarea
            id="f-message"
            name="message"
            className={cn(control, "resize-y")}
            rows={4}
            placeholder="A sentence or two is plenty: what you’re trying to do, or what’s getting in the way."
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            onBlur={() => onBlur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describe("message")}
          />
        </Field>
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
          <div className="mt-8 border-l-2 border-error pl-4">
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
            {whatsappHref && (
              <p className="mt-1 text-paper/70">
                Or{" "}
                <a className="text-ice underline underline-offset-4" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  message us on WhatsApp
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
