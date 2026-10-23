"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { team } from "@/content/team";
import { cn } from "@/lib/cn";

/** 07 — The team. Content comes from src/content/team.ts; nobody is invented. */
export function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, () => {
        gsap.utils.toArray<HTMLElement>("[data-member]", el).forEach((m, i) => {
          gsap.from(m.querySelector("[data-portrait]"), {
            opacity: 0,
            scale: 1.06,
            duration: 1.4,
            delay: (i % 3) * 0.12,
            ease: "expo.out",
            scrollTrigger: { trigger: m, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="team" aria-labelledby="team-title" className="relative border-t border-line pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="frame">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <ChapterMark id="team" />
            <RevealText id="team-title" className="display-l mt-8 max-w-[14ch] md:mt-10">
              Built by people who care about getting it <em className="italic">right.</em>
            </RevealText>
          </div>
          <p className="col-span-12 max-w-[34ch] self-end text-paper/70 md:col-span-6 lg:col-span-3 lg:col-start-10">
            You’ll work directly with the people designing and building your project — no hand-offs, no account
            managers in between.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-[clamp(1rem,2vw,2rem)] gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {team.map((m, i) => (
            <li key={`${m.name}-${i}`} data-member className={cn("group/m", i % 3 === 1 && "lg:mt-24", i % 3 === 2 && "lg:mt-10")}>
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                <div data-portrait className="absolute inset-0">
                  <Image
                    src={m.photo.src}
                    alt={m.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover/m:scale-[1.035]"
                  />
                </div>
                {m.placeholder && <span className="label absolute left-3 top-3 bg-ink/80 px-2 py-1 text-ice">Placeholder</span>}
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="relative font-serif text-[1.875rem] leading-none">
                  {m.name}
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-ice transition-transform duration-500 ease-out-soft group-hover/m:scale-x-100"
                  />
                </h3>
                <p className="label shrink-0 text-mute">{m.role}</p>
              </div>
              <p className="mt-3 max-w-[40ch] text-[0.9375rem] text-paper/65">{m.bio}</p>
              {m.links && m.links.length > 0 && (
                <ul className="mt-3 flex gap-4">
                  {m.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener" className="label inline-block py-2 text-paper/80 hover:text-ice">
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
