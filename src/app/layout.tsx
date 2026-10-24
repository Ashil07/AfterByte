import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { services } from "@/content/services";
import { site } from "@/content/site";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const title = site.seoTitle;
const { location } = site;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  category: "technology",
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Google Search Console's HTML-tag method: set GOOGLE_SITE_VERIFICATION to the token it gives you.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  other: {
    "geo.region": `${location.country}-KA`,
    "geo.placename": `${location.city} (${location.cityAlt}), ${location.region}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  // Lets the mobile action bar pad itself above the iPhone home indicator.
  viewportFit: "cover",
};

/**
 * Structured data for Google: the business (a local ProfessionalService with
 * its city, contact details and services) and the website. Only facts that are
 * also visible on the page belong here — no ratings, prices or street address
 * until they are real.
 */
const business = `${site.url}/#business`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": business,
      name: site.name,
      alternateName: [`${site.name} Studio`, "Afterbyte"],
      slogan: site.tagline,
      description: site.description,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.png`, width: 512, height: 512 },
      image: `${site.url}/opengraph-image.jpg`,
      ...(site.email ? { email: site.email } : {}),
      ...(site.phone.tel ? { telephone: site.phone.tel } : {}),
      ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: location.city,
        addressRegion: location.region,
        addressCountry: location.country,
      },
      areaServed: [
        { "@type": "City", name: location.city, alternateName: location.cityAlt },
        { "@type": "State", name: location.region },
        { "@type": "Country", name: location.countryName },
      ],
      knowsAbout: [
        "Website development",
        "Web design",
        "Mobile app development",
        "E-commerce websites",
        "Business management software",
        "Workflow automation",
        "AI automation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.summary,
            serviceType: s.capabilities.join(", "),
            areaServed: { "@type": "City", name: location.city },
            provider: { "@id": business },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      alternateName: `${site.name} Studio`,
      description: site.description,
      inLanguage: "en-IN",
      publisher: { "@id": business },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      // html.js is added before paint by the inline script below.
      suppressHydrationWarning
    >
      <head>
        <script
          // Flags JS availability so intro elements can start hidden without
          // risking invisible content when scripts are blocked.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed left-4 top-3 z-[100] -translate-y-20 bg-paper px-4 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
