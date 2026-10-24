export type ServiceId = "web" | "app" | "systems" | "automation";

export type Service = {
  id: ServiceId;
  number: string;
  title: string;
  /** One-word name for the phone deck's tabs. */
  short: string;
  /** Short serif line shown large. */
  tagline: string;
  summary: string;
  capabilities: string[];
  cta: string;
};

export const services: Service[] = [
  {
    id: "web",
    number: "01",
    title: "Web Design & Development",
    short: "Websites",
    tagline: "Make your first impression count.",
    summary:
      "A website that explains what you do in seconds, works on every phone, and gets people to call, book or order.",
    capabilities: [
      "Business and portfolio websites",
      "Landing pages",
      "E-commerce websites",
      "Custom web applications",
    ],
    cta: "Plan a website",
  },
  {
    id: "app",
    number: "02",
    title: "App Development",
    short: "Apps",
    tagline: "Put your idea in people’s hands.",
    summary:
      "We turn your idea into an app people can install, starting with the screens that matter most.",
    capabilities: [
      "Mobile applications",
      "Progressive Web Apps",
      "Cross-platform apps",
      "Custom applications",
    ],
    cta: "Talk about an app",
  },
  {
    id: "systems",
    number: "03",
    title: "Business Systems",
    short: "Systems",
    tagline: "Less manual work. More clarity.",
    summary:
      "One simple system for stock, bookings and billing, instead of scattered spreadsheets and notebooks.",
    capabilities: [
      "Inventory management",
      "Billing & invoicing",
      "Booking & rental systems",
      "Dashboards & internal tools",
    ],
    cta: "Map out a system",
  },
  {
    id: "automation",
    number: "04",
    title: "AI & Automation",
    short: "Automation",
    tagline: "Give your time back.",
    summary:
      "Reminders, data entry and follow-ups that run on their own, with AI only where it genuinely helps.",
    capabilities: [
      "Workflow & process automation",
      "Email & notification automation",
      "AI tools & chatbots",
      "API integrations",
    ],
    cta: "Automate a workflow",
  },
];

/** Options for the contact form’s service field. */
export const serviceOptions = [
  ...services.map((s) => ({ value: s.id, label: s.title })),
  { value: "unsure", label: "Not sure yet" },
] as const;
