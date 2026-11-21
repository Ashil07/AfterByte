/**
 * How a project runs, shown as the path on the Contact page (ProcessPath).
 * Every line restates something the site already promises (contact steps,
 * approach principles, service copy) — don't add timelines, guarantees or
 * response times here unless they are real.
 */
export type ProcessStep = { title: string; body: string; tags: string[] };

export const processStart = "Your idea";
export const processEnd = "Launch";

export const processSteps: ProcessStep[] = [
  {
    title: "A conversation",
    body: "You tell us what you’re trying to do and what’s getting in the way. We read it, reply by email, and talk through what you need.",
    tags: ["Call", "WhatsApp", "Email"],
  },
  {
    title: "Scope and price, in writing",
    body: "You get a clear scope, timeline and price before work starts, and you pay only for what your business needs.",
    tags: ["Scope", "Timeline", "Price"],
  },
  {
    title: "Design",
    body: "We design around how your business already runs, not around a template, starting with the screens that matter most.",
    tags: ["Layouts", "Screens", "Flows"],
  },
  {
    title: "Build",
    body: "You talk to the people doing the work and see progress as it happens, built with modern, well-supported tools.",
    tags: ["Websites", "Apps", "Systems", "Automation"],
  },
];
