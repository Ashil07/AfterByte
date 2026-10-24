export type Principle = { title: string; body: string };

export const principles: Principle[] = [
  {
    title: "Practical pricing",
    body: "You pay for what your business needs, not for features you’ll never use.",
  },
  {
    title: "Clearly scoped projects",
    body: "Before we build, you get it in writing: what’s included, the timeline and the cost.",
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
    title: "Modern engineering",
    body: "Current, well-supported tools, so what we build is fast and secure.",
  },
  {
    title: "Maintainable software",
    body: "Clean code and a proper handover, so it stays easy to change — by us or anyone else.",
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
