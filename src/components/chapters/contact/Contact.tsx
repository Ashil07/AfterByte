"use client";

import { Fragment, useRef } from "react";
import { Halftone, type HalftoneHandle } from "@/components/halftone/Halftone";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { site, whatsappHref } from "@/content/site";
import { cn } from "@/lib/cn";
import { ContactForm } from "./ContactForm";
import { ProcessPath } from "./ProcessPath";

/** Every direct way to reach us; empty values in site.ts are skipped. */
const direct = (
  [
    ["Phone", site.phone.display, site.phone.tel && `tel:${site.phone.tel}`],
    ["WhatsApp", whatsappHref && "Message us ↗", whatsappHref],
    ["Email", site.email, site.email && `mailto:${site.email}`],
    ...site.socials.map((s) => [s.label, s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), s.href]),
    ["Based in", `${site.location.city}, ${site.location.region}`, ""],
  ] as [string, string, string][]
).filter(([, value]) => value);

/**
 * Contact. The closing halftone mirrors the opening and brightens as the
 * visitor arrives, so the story ends where it began. On the home page it is
 * the closing scene and leads to /contact; on /contact (`page`) it opens the
 * page, followed by the “From idea to launch” path (ProcessPath), every direct
 * way to reach us and the form.
 */
export function Contact({ page = false }: { page?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const field = useRef<HalftoneHandle>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: MOTION.reduced }, (ctx) => {
        if ((ctx.conditions as { reduced: boolean }).reduced) return;
        field.current?.setIllumination(0.2);
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          end: "top 15%",
          scrub: true,
          onUpdate: (self) => field.current?.setIllumination(0.2 + 0.8 * self.progress),
        });
        return () => {
          st.kill();
          field.current?.setIllumination(1);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[88vh] min-h-[560px]">
        <Halftone ref={field} shape="closing" interactive spacing={11} seed={21} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className={cn("frame", page ? "pb-24 pt-[calc(var(--header-h)+4rem)] md:pb-32 md:pt-[calc(var(--header-h)+6rem)]" : "pb-28 pt-24 md:pb-36 md:pt-36")}>
        {page ? <p className="label text-mute">Contact</p> : <ChapterMark id="contact" />}
        <RevealText as={page ? "h1" : "h2"} id="contact-title" className="display-xl mt-10 max-w-[11ch] md:mt-14">
          Your next chapter starts <em className="italic">here.</em>
        </RevealText>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30ch] font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-paper/85">
            You bring the idea. We’ll help you figure out what comes next.
          </p>
          <Magnetic>
            <ButtonLink href={page ? "#contact-form" : "/contact"} arrow={page ? "down" : "right"}>
              Start a project
            </ButtonLink>
          </Magnetic>
        </div>
      </div>
      {page && (
        <>
          <ProcessPath />
          <div id="contact-form-section" className="frame border-t border-line pb-28 pt-20 md:pb-36 md:pt-28">
            <div className="grid-12 gap-y-14">
              <aside className="col-span-12 lg:col-span-4">
                <p className="label text-mute">Reach us directly</p>
                <dl className="mt-6 grid grid-cols-[6rem_1fr] gap-y-3 text-paper/80">
                  {direct.map(([label, value, href]) => (
                    <Fragment key={label}>
                      <dt className="label pt-1 text-mute">{label}</dt>
                      <dd>
                        {href ? (
                          <a
                            href={href}
                            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="[overflow-wrap:anywhere] underline decoration-line-strong underline-offset-4 transition-colors hover:text-ice"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </aside>
              <div id="contact-form" className="col-span-12 scroll-mt-[calc(var(--header-h)+2rem)] lg:col-span-7 lg:col-start-6">
                <h3 className="sr-only">Project inquiry form</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
