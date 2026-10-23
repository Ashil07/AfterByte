/**
 * Global site facts. Contact details and social links are intentionally empty
 * until real ones are supplied — components hide anything that is not set.
 */
export type SocialLink = { label: string; href: string };

export const site = {
  name: "AfterByte",
  tagline: "Thoughtfully designed. Intelligently built.",
  description:
    "AfterByte designs and builds websites, apps, business systems and automations for small businesses, startups and people with an idea — thoughtfully scoped and priced within reach.",
  /** Public URL used for canonical links, sitemap and structured data. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://afterbyte.example",
  /** Public contact email. Leave empty to hide it. */
  email: "",
  /** Public phone number. `tel` is the dialable form; leave both empty to hide it. */
  phone: { display: "+91 98456 35981", tel: "+919845635981" },
  /** Real profiles only. */
  socials: [{ label: "Instagram", href: "https://www.instagram.com/afterbyte.studio/" }] as SocialLink[],
} as const;
