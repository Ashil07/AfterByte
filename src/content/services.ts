export type ServiceId = "web" | "app" | "systems" | "automation";

export type Service = {
  id: ServiceId;
  number: string;
  title: string;
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
    tagline: "Make your first impression count.",
    summary:
      "Most customers meet you on a screen first. We build sites that explain what you do in seconds, work on every phone, and make the next step — call, book, order — obvious.",
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
    tagline: "Put your idea in people’s hands.",
    summary:
      "From rough sketch to an app people can install. We start with the screens that matter most, test them early, and build a foundation that grows with you.",
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
    tagline: "Less manual work. More clarity.",
    summary:
      "Stock in one spreadsheet, bookings in another, invoices in a notebook. We replace the patchwork with one system your whole team can use.",
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
    tagline: "Give your time back.",
    summary:
      "Reminders, data entry, follow-ups: work that has to happen but doesn’t need you. We connect your tools so it runs on its own, and add AI where it genuinely helps.",
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
