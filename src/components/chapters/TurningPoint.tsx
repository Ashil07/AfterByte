"use client";

import { useRef } from "react";
import { cleanFaces } from "@/components/chapters/friction/faces";
import { Halftone, type HalftoneHandle } from "@/components/halftone/Halftone";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { problems } from "@/content/problems";

const parts = [
  {
    title: "A website that does its job",
    body: "Customers find you, understand what you offer, and can book, buy or get in touch without sending a message first.",
  },
  {
    title: "Software shaped around your work",
    body: "Stock, bookings, billing and records live in one place, updated as things happen and visible to whoever needs them.",
  },
  {
    title: "Automation for the repetitive parts",
    body: "Confirmations, reminders, invoices and follow-ups go out on their own, so your time goes to the work only you can do.",
  },
];

/**
 * 04 — Turning point. Scattered halftone resolves into three illuminated bands
 * as the visitor reads the three parts of a better system beside it.
 */
export function TurningPoint() {
  const root = useRef<HTMLElement>(null);
  const field = useRef<HalftoneHandle>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: MOTION.reduced }, (ctx) => {
        const { reduced } = ctx.conditions as { reduced: boolean };
        if (reduced) {
          field.current?.setMorph(1);
          return;
        }
        const st = ScrollTrigger.create({
          trigger: el.querySelector("[data-parts]"),
          start: "top 80%",
          end: "bottom 65%",
          scrub: true,
          onUpdate: (self) => field.current?.setMorph(self.progress),
        });
        gsap.from(el.querySelectorAll("[data-part]"), {
          opacity: 0,
          y: 24,
          stagger: 0.15,
          duration: 1,
          scrollTrigger: { trigger: el.querySelector("[data-parts]"), start: "top 75%", once: true },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="turning-point" aria-labelledby="turning-title" className="relative pb-28 pt-10 md:pb-40 md:pt-16">
      <div className="frame">
        <ChapterMark id="turning-point" />
        <RevealText id="turning-title" className="display-l mt-8 max-w-[12ch] md:mt-10">
          What if everything just <em className="italic">worked?</em>
        </RevealText>

        {/* Clean versions of chapter 03's fragments, for layouts where the pinned
            sequence does not run (mobile, reduced motion, no JS). */}
        <ul className="system-fallback mt-14 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {problems.map((p) => {
            const Clean = cleanFaces[p.id];
            return (
              <li key={p.id}>
                <div aria-hidden className="h-[13.5rem]">
                  <Clean />
                </div>
                <p className="mt-3 text-[0.9375rem] text-ice">{p.solution}</p>
              </li>
            );
          })}
        </ul>

        <div className="grid-12 mt-20 gap-y-12 md:mt-28">
          <ol data-parts className="col-span-12 grid grid-rows-3 md:col-span-7 lg:col-span-6">
            {parts.map((p, i) => (
              <li key={p.title} data-part className="rule flex flex-col justify-center gap-3 py-8 md:py-10">
                <div className="flex items-baseline gap-5">
                  <span className="label w-6 text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.05]">{p.title}</h3>
                </div>
                <p className="max-w-[46ch] pl-11 text-paper/70">{p.body}</p>
              </li>
            ))}
          </ol>
          <div aria-hidden className="relative col-span-12 h-72 md:col-span-5 md:h-auto lg:col-span-5 lg:col-start-8">
            <Halftone ref={field} shape="scatter" morphTo="strata" spacing={10} seed={13} className="absolute inset-0" />
          </div>
        </div>

        <figure className="grid-12 mt-28 gap-y-6 md:mt-40">
          <figcaption className="label col-span-12 pt-3 text-mute md:col-span-2">Where we come in</figcaption>
          <blockquote className="col-span-12 md:col-span-10 lg:col-span-9">
            <p className="display-m text-balance">
              We design and build digital solutions around the way your business <em className="text-ice">actually works.</em>
            </p>
            <p className="mt-8 max-w-[52ch] text-paper/70">
              AfterByte is a design and development studio for businesses that want technology to make their work
              simpler, not more complicated. We listen first, scope honestly, and build only what moves you forward.
            </p>
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
