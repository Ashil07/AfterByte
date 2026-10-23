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
      "Most customers meet your business on a screen before they meet you. We design and build sites that explain what you do in seconds, look right on every phone, and make the next step — a call, a booking, an order — obvious.",
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
      "We take an app from rough sketch to something people can install and use. We start with the few screens that matter most, test them early, and build on a foundation that can grow with you.",
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
      "Inventory in one spreadsheet, bookings in another, invoices in a notebook. We replace the patchwork with one system built around how your team already works, so the numbers are current and everyone sees the same thing.",
    capabilities: [
      "Inventory management",
      "Billing and invoicing",
      "Rental management",
      "Booking systems",
      "Dashboards and internal tools",
      "Custom business management software",
    ],
    cta: "Map out a system",
  },
  {
    id: "automation",
    number: "04",
    title: "AI & Automation",
    tagline: "Give your time back.",
    summary:
      "Confirmations, reminders, data entry, follow-ups: the work that has to happen but doesn’t need you. We connect your tools so routine steps run on their own, and add AI where it genuinely helps — answering common questions, sorting requests, drafting replies.",
    capabilities: [
      "Workflow automation",
      "Business process automation",
      "Email and notification automation",
      "AI-powered applications",
      "Chatbots",
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
