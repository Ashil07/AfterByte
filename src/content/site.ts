/**
 * Global site facts. Contact details and social links are intentionally empty
 * until real ones are supplied — components hide anything that is not set.
 */
export type SocialLink = { label: string; href: string };

export const site = {
  name: "AfterByte",
  tagline: "Thoughtfully designed. Intelligently built.",
  /** Search-result title: what we do and where, ahead of the brand line. */
  seoTitle: "AfterByte — Website & App Development in Mangalore",
  /** Meta description (~160 characters shows in full on Google). */
  description:
    "Website and app development in Mangalore (Mangaluru). AfterByte designs and builds websites, mobile apps, business software and AI automation at fair prices.",
  /** Where we are. Used in structured data and the visible location lines. */
  location: { city: "Mangaluru", cityAlt: "Mangalore", region: "Karnataka", country: "IN", countryName: "India" },
  /** Phrases people search for. Each should also appear in the visible copy. */
  keywords: [
    "AfterByte",
    "website development Mangalore",
    "web design Mangalore",
    "app development Mangalore",
    "mobile app developers Mangaluru",
    "freelance web developer Mangalore",
    "freelancers in Mangalore",
    "software development company Mangalore",
    "business management software",
    "e-commerce website development",
    "AI automation for small business",
    "web development Karnataka",
  ],
  /**
   * Public URL used for canonical links, sitemap and structured data.
   * NEXT_PUBLIC_SITE_URL wins (set it once a custom domain is live); on Vercel
   * the project's production domain is used automatically.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://afterbyte.example"),
  /** Public contact email. Leave empty to hide it. */
  email: "afterbytestudio.business@gmail.com",
  /** Public phone number. `tel` is the dialable form; leave both empty to hide it. */
  phone: { display: "+91 98456 35981", tel: "+919845635981" },
  /** Real profiles only. */
  socials: [{ label: "Instagram", href: "https://www.instagram.com/afterbyte.studio/" }] as SocialLink[],
} as const;
