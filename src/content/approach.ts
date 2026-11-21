/**
 * `heard` is the line a client has heard elsewhere and that this principle
 * replaces; it is shown struck through above the title. Keep it a familiar
 * phrase, never a claim about a named company.
 */
export type Principle = { title: string; body: string; heard: string };

export const principles: Principle[] = [
  {
    title: "Clear, practical pricing",
    heard: "“We’ll work out the cost as we go.”",
    body: "You pay only for what your business needs, with the scope, timeline and cost in writing before we start.",
  },
  {
    title: "Tailored solutions",
    heard: "“Pick a template and we’ll fill it in.”",
    body: "We design around how your business already runs, not around a template.",
  },
  {
    title: "Direct communication",
    heard: "“Your account manager will pass it on.”",
    body: "You talk to the people doing the work and see progress as it happens.",
  },
  {
    title: "Built to last",
    heard: "“Only we can make changes to it.”",
    body: "Modern, well-supported tools and clean code, so it stays fast, secure and easy to change — by us or anyone else.",
  },
];

/** Chapter 02 — the three starting points. `shape` selects the halftone figure. */
export const possibilities = [
  {
    id: "new",
    title: "Starting something new",
    shape: "sprout",
    message:
      "You have an idea. We shape the first version — a site people trust or an app they can try — without overbuilding.",
  },
  {
    id: "grow",
    title: "Growing an existing business",
    shape: "tree",
    message:
      "What worked at ten customers strains at a hundred. We build what lets you grow without the chaos.",
  },
  {
    id: "simplify",
    title: "Making everyday work simpler",
    shape: "cairn",
    message:
      "If the same tasks fill every week, we turn them into software that does them for you.",
  },
] as const;

export type PossibilityShape = (typeof possibilities)[number]["shape"];
