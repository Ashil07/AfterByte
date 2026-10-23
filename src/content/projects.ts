/**
 * Selected work. Replace placeholders with real, client-approved projects.
 *
 * Rules (see CLAUDE.md §7):
 * - Only list projects that exist and that the client has agreed to show.
 * - `outcome` is optional and must be a verified, client-confirmed result.
 *   Leave it undefined rather than estimating.
 * - Keep `placeholder: true` until every field below is real; the UI labels it.
 * - For a real project whose case study isn't written yet, leave `problem`,
 *   `solution` and `technologies` out; the UI says the details are to be added.
 */
export type Project = {
  slug: string;
  name: string;
  category: string;
  problem?: string;
  solution?: string;
  technologies?: string[];
  /** `position` is a CSS object-position, for screenshots whose important part is off-centre. */
  image: { src: string; alt: string; position?: string };
  outcome?: string;
  url?: string;
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "dulhan",
    name: "Dulhan",
    category: "Business system · Luxury bridal rentals",
    image: {
      src: "/work/dulhan-signin.webp",
      alt: "Dulhan sign-in screen: “Bridal rentals, beautifully managed.”",
      position: "left center",
    },
    url: "https://dulhan-demo.vercel.app/",
  },
  {
    slug: "placeholder-website",
    name: "Project name",
    category: "Business website",
    problem:
      "Placeholder — describe the client’s problem in one or two sentences, in their words.",
    solution:
      "Placeholder — describe what was designed and built, and how it addressed the problem.",
    technologies: ["Add", "Real", "Stack"],
    image: { src: "/work/placeholder-1.webp", alt: "Placeholder halftone artwork" },
    placeholder: true,
  },
  {
    slug: "placeholder-system",
    name: "Project name",
    category: "Booking & billing system",
    problem:
      "Placeholder — for example: bookings arrived through calls and messages, and invoices were written by hand.",
    solution:
      "Placeholder — for example: a booking calendar, automatic confirmations and invoices generated from each booking.",
    technologies: ["Add", "Real", "Stack"],
    image: { src: "/work/placeholder-2.webp", alt: "Placeholder halftone artwork" },
    placeholder: true,
  },
  {
    slug: "placeholder-app",
    name: "Project name",
    category: "Mobile app",
    problem: "Placeholder — the problem this app was built to solve.",
    solution: "Placeholder — the app’s core features and how people use it.",
    technologies: ["Add", "Real", "Stack"],
    image: { src: "/work/placeholder-3.webp", alt: "Placeholder halftone artwork" },
    placeholder: true,
  },
];
