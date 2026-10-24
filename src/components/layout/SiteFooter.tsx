import { Fragment } from "react";
import { WordmarkHalftone } from "@/components/halftone/WordmarkHalftone";
import { site } from "@/content/site";
import { Year } from "./Year";

/** Labels sit above their value on phones and beside it from `xs` up. */
const term = "label mt-3 text-mute first:mt-0 xs:mt-0 xs:pt-0.5";
/** Same underline-grow hover as the text buttons. */
const link =
  "relative inline-block py-2 text-paper/80 transition-colors hover:text-paper after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out-soft hover:after:scale-x-100";

/** "https://www.instagram.com/afterbyte.studio/" → "@afterbyte.studio" */
const handle = (href: string) => {
  const name = new URL(href).pathname.split("/").filter(Boolean)[0];
  return name ? `@${name}` : href;
};

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
          {/* Wide enough for the full email address at every breakpoint. */}
          <div className="col-span-12 sm:col-span-10 md:col-span-8 lg:col-span-5 lg:col-start-8">
            <p className="label mb-4 text-mute">Contact</p>
            <dl className="grid grid-cols-1 items-baseline gap-x-4 xs:grid-cols-[5.5rem_1fr]">
              {site.phone.tel && (
                <>
                  <dt className={term}>Phone</dt>
                  <dd>
                    <a href={`tel:${site.phone.tel}`} className={link}>
                      {site.phone.display}
                    </a>
                  </dd>
                </>
              )}
              {site.email && (
                <>
                  <dt className={term}>Email</dt>
                  <dd className="min-w-0">
                    <a href={`mailto:${site.email}`} className={`${link} [overflow-wrap:anywhere]`}>
                      {site.email}
                    </a>
                  </dd>
                </>
              )}
              {site.socials.map((s) => (
                <Fragment key={s.href}>
                  <dt className={term}>{s.label}</dt>
                  <dd>
                    <a href={s.href} rel="me noopener" target="_blank" className={link}>
                      {handle(s.href)} ↗
                    </a>
                  </dd>
                </Fragment>
              ))}
              <dt className={term}>Based in</dt>
              <dd className="py-2 text-paper/80">
                {site.location.city}, {site.location.region}
              </dd>
            </dl>
            <a href="#contact-form" className="label mt-4 inline-block py-3.5 text-ice transition-colors hover:text-paper">
              Start a project →
            </a>
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
