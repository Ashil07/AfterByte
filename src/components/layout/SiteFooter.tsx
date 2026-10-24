import { WordmarkHalftone } from "@/components/halftone/WordmarkHalftone";
import { navigation } from "@/content/chapters";
import { site } from "@/content/site";
import { Year } from "./Year";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="frame pb-8 pt-16 md:pt-24">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <p className="max-w-[22ch] font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]">
              Thoughtfully designed. <em className="text-ice">Intelligently built.</em>
            </p>
            <p className="mt-6 max-w-[44ch] text-[0.9375rem] text-paper/60">
              An independent web and app development studio in {site.location.city} ({site.location.cityAlt}),{" "}
              {site.location.region} — freelance designers and developers building websites, apps, business software
              and automations.
            </p>
          </div>
          <nav aria-label="Footer" className="col-span-12 sm:col-span-4 lg:col-span-2 lg:col-start-7">
            <p className="label mb-4 text-mute">Explore</p>
            <ul>
              {navigation.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-block py-2 text-paper/80 transition-colors hover:text-paper">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="inline-block py-2 text-paper/80 transition-colors hover:text-paper">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          {/* Wide enough for the full email address at every breakpoint. */}
          <div className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9">
            <p className="label mb-4 text-mute">Elsewhere</p>
            {site.email || site.phone.tel || site.socials.length ? (
              <ul>
                {site.phone.tel && (
                  <li>
                    <a href={`tel:${site.phone.tel}`} className="inline-block py-2 text-paper/80 hover:text-paper">
                      {site.phone.display}
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className="inline-block py-2 text-paper/80 [overflow-wrap:anywhere] hover:text-paper">
                      {site.email}
                    </a>
                  </li>
                )}
                {site.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} rel="me noopener" target="_blank" className="inline-block py-2 text-paper/80 hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-paper/60">The contact form is the best way to reach us.</p>
            )}
          </div>
        </div>

        <WordmarkHalftone />

        <div className="label mt-8 flex flex-wrap items-center justify-between gap-4 text-mute">
          <p>
            © <Year /> {site.name}
          </p>
          <a href="#top" className="inline-block py-3.5 transition-colors hover:text-paper">
            Back to the beginning ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
