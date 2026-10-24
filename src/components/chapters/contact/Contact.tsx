"use client";

import { useRef } from "react";
import { Halftone, type HalftoneHandle } from "@/components/halftone/Halftone";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

const steps = [
  "We read your message and reply by email.",
  "We talk through what you need and what can wait.",
  "You get a clear scope and price before any work starts.",
];

/**
 * 09 — Next chapter. The closing halftone mirrors the opening and brightens as
 * the visitor arrives, so the story ends where it began.
 */
export function Contact() {
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

      <div className="frame pb-28 pt-24 md:pb-36 md:pt-36">
        <ChapterMark id="contact" />
        <RevealText id="contact-title" className="display-xl mt-10 max-w-[11ch] md:mt-14">
          Your next chapter starts <em className="italic">here.</em>
        </RevealText>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30ch] font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-paper/85">
            You bring the idea. We’ll help you figure out what comes next.
          </p>
          <Magnetic>
            <ButtonLink href="#contact-form" arrow="down">
              Start a project
            </ButtonLink>
          </Magnetic>
        </div>

        <div className="grid-12 mt-28 gap-y-14 md:mt-40">
          <aside className="col-span-12 lg:col-span-4">
            <p className="label text-mute">What happens next</p>
            <ol className="mt-6 border-t border-line">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-line py-4 text-paper/80">
                  <span className="label pt-1 text-ice">{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ol>
            {site.phone.tel && (
              <p className="mt-8 text-paper/70">
                Prefer to talk?{" "}
                <a
                  href={`tel:${site.phone.tel}`}
                  className="inline-block py-2 text-paper underline decoration-line-strong underline-offset-4 hover:decoration-ice"
                >
                  {site.phone.display}
                </a>
              </p>
            )}
            {site.email && (
              <p className="mt-2 text-paper/70">
                Prefer email?{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="inline-block py-2 text-paper underline decoration-line-strong underline-offset-4 [overflow-wrap:anywhere] hover:decoration-ice"
                >
                  {site.email}
                </a>
              </p>
            )}
            {site.socials.length > 0 && (
              <p className="mt-2 text-paper/70">
                Follow us on:{" "}
                {site.socials.map((s, i) => (
                  <span key={s.href}>
                    {i > 0 && ", "}
                    <a
                      href={s.href}
                      target="_blank"
                      rel="me noopener"
                      className="inline-block py-2 text-paper underline decoration-line-strong underline-offset-4 hover:decoration-ice"
                    >
                      {s.label} ↗
                    </a>
                  </span>
                ))}
              </p>
            )}
          </aside>
          <div id="contact-form" className="col-span-12 scroll-mt-[calc(var(--header-h)+2rem)] lg:col-span-7 lg:col-start-6">
            <h3 className="sr-only">Project inquiry form</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
