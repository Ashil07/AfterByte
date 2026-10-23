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

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  // Lets the mobile action bar pad itself above the iPhone home indicator.
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  slogan: site.tagline,
  description: site.description,
  url: site.url,
  logo: `${site.url}/brand/wordmark.png`,
  ...(site.email ? { email: site.email } : {}),
  ...(site.phone.tel ? { telephone: site.phone.tel } : {}),
  ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.summary },
    })),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
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
