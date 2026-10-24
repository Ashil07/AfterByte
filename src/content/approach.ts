export type Principle = { title: string; body: string };

export const principles: Principle[] = [
  {
    title: "Clear, practical pricing",
    body: "You pay only for what your business needs, with the scope, timeline and cost in writing before we start.",
  },
  {
    title: "Tailored solutions",
    body: "We design around how your business already runs, not around a template.",
  },
  {
    title: "Direct communication",
    body: "You talk to the people doing the work and see progress as it happens.",
  },
  {
    title: "Built to last",
    body: "Modern, well-supported tools and clean code, so it stays fast, secure and easy to change — by us or anyone else.",
  },
];

/** Chapter 02 — the three starting points. `shape` selects the halftone figure. */
export const possibilities = [
  {
    id: "new",
    title: "Starting something new",
    shape: "seed",
    message:
      "You have an idea. We shape the first version — a site people trust or an app they can try — without overbuilding.",
  },
  {
    id: "grow",
    title: "Growing an existing business",
    shape: "growth",
    message:
      "What worked at ten customers strains at a hundred. We build what lets you grow without the chaos.",
  },
  {
    id: "simplify",
    title: "Making everyday work simpler",
    shape: "order",
    message:
      "If the same tasks fill every week, we turn them into software that does them for you.",
  },
] as const;

export type PossibilityShape = (typeof possibilities)[number]["shape"];
