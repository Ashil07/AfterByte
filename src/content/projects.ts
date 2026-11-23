/**
 * Selected work. Replace placeholders with real, client-approved projects.
 *
 * Rules (see CLAUDE.md §7):
 * - Only list projects that exist and that the client has agreed to show.
 * - `outcome` is optional and must be a verified, client-confirmed result.
 *   Leave it undefined rather than estimating.
 * - Keep `placeholder: true` until every field below is real; the UI labels it.
 * - For a real project whose case study isn't written yet, leave `problem`,
 *   `solution` and `technologies` out; the entry then shows just its name and link.
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
    slug: "shop-platform",
    name: "Shop platform",
    category: "Product · Online store, admin and billing for clothing shops",
    image: {
      src: "/work/shop-platform.webp",
      alt: "AfterByte Shop platform page: “One shop platform. Any look you want.” beside a storefront preview",
      position: "left top",
    },
    url: "https://cloth-store-gold.vercel.app/platform",
  },
];
