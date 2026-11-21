import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { contactHref } from "@/lib/contact/events";
import { principles } from "@/content/approach";
import { services } from "@/content/services";
import { site, whatsappHref } from "@/content/site";

/**
 * One page per service, so each can rank for its own search ("app development
 * Mangalore"…). Copy comes from content/services.ts and content/approach.ts;
 * the home page stays the story, these are the plain reference versions.
 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

const find = (slug: string) => services.find((s) => s.slug === slug);
const city = site.location.city;

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = find((await params).slug);
  if (!service) return {};
  const title = `${service.title} in ${site.location.cityAlt} (${city})`;
  const description = `${service.summary} AfterByte, ${city}, ${site.location.region}.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${title} — AfterByte`, description, url: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = find((await params).slug);
  if (!service) notFound();
  const others = services.filter((s) => s.id !== service.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    url: `${site.url}/services/${service.slug}`,
    areaServed: { "@type": "City", name: city },
    provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="frame pb-20 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+6rem)]">
        <nav aria-label="Breadcrumb" className="label text-mute">
          <Link href="/#services" className="transition-colors hover:text-paper">
            Services
          </Link>
          <span aria-hidden className="mx-3">/</span>
          <span aria-current="page" className="text-paper">
            {service.short}
          </span>
        </nav>

        <div className="grid-12 mt-10 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="display-l max-w-[16ch]">
              {service.title} <em className="text-ice">in {city}</em>
            </h1>
            <p className="mt-8 font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1]">{service.tagline}</p>
            <p className="mt-4 max-w-[48ch] text-paper/70">{service.summary}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={contactHref(service.id)}>{service.cta}</ButtonLink>
              {whatsappHref && (
                <ButtonLink href={whatsappHref} variant="outline" target="_blank" rel="noopener noreferrer">
                  Message us on WhatsApp
                </ButtonLink>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <h2 className="label mb-4 text-mute">What’s included</h2>
            <ul className="border-t border-line">
              {service.capabilities.map((c) => (
                <li key={c} className="border-b border-line py-4 text-paper/85">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-2">
        <div className="frame grid-12 gap-y-10 py-20">
          <h2 className="display-m col-span-12 max-w-[14ch] lg:col-span-4">
            How we <em className="text-ice">work</em>
          </h2>
          <ol className="col-span-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {principles.map((p, i) => (
              <li key={p.title} className="border-t border-line-strong pt-5">
                <p className="label text-mute">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-serif text-[1.5rem] leading-tight">{p.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-paper/70">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="frame py-20">
        <h2 className="label mb-6 text-mute">Other services</h2>
        <ul className="grid gap-px border-y border-line sm:grid-cols-3">
          {others.map((s) => (
            <li key={s.id}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col gap-2 py-6 pr-6 transition-colors hover:text-ice"
              >
                <span className="font-serif text-[1.5rem] leading-tight">{s.title}</span>
                <span className="text-[0.9375rem] text-paper/60">{s.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
