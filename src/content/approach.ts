export type Principle = { title: string; body: string };

export const principles: Principle[] = [
  {
    title: "Practical pricing",
    body: "We price for what your business actually needs, not for a feature list you’ll never use. Small businesses and first-time founders are exactly who we build for.",
  },
  {
    title: "Clearly scoped projects",
    body: "Before anything is built you get a written scope: what’s included, what isn’t, the timeline and the cost. No surprises at the end.",
  },
  {
    title: "Tailored solutions",
    body: "We start with how your business runs today — the steps, the people, the workarounds — and design around that instead of forcing a template.",
  },
  {
    title: "Direct communication",
    body: "You talk to the people doing the work. Questions get straight answers, and you see progress as it happens.",
  },
  {
    title: "Modern engineering",
    body: "Current, well-supported tools, so what we build is fast, secure and ready to grow with you.",
  },
  {
    title: "Maintainable software",
    body: "Clean code, sensible documentation and a proper handover, so your software stays easy to change — by us or by anyone else.",
  },
];

/** Chapter 02 — the three starting points. `shape` selects the halftone figure. */
export const possibilities = [
  {
    id: "new",
    title: "Starting something new",
    shape: "seed",
    message:
      "You have a name and an idea. We help shape the first version — a site people trust, or an app people can actually try — without building more than you need.",
  },
  {
    id: "grow",
    title: "Growing an existing business",
    shape: "growth",
    message:
      "What worked at ten customers strains at a hundred. We build the website, booking flow or system that lets you take on more without more chaos.",
  },
  {
    id: "simplify",
    title: "Making everyday work simpler",
    shape: "order",
    message:
      "If your week runs on spreadsheets, copy-paste and reminders, we can turn that routine into software that does the repetitive part for you.",
  },
] as const;

export type PossibilityShape = (typeof possibilities)[number]["shape"];
