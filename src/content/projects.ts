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
    slug: "placeholder-clothing-store",
    name: "Clothing store",
    category: "Product · E-commerce clothing store",
    problem:
      "Placeholder — the problem this store solves for shop owners and their customers, in one or two sentences.",
    solution:
      "Placeholder — what the product does: catalogue, checkout, orders and stock, and how it’s used.",
    technologies: ["Add", "Real", "Stack"],
    image: { src: "/work/placeholder-1.webp", alt: "Placeholder halftone artwork" },
    placeholder: true,
  },
];
