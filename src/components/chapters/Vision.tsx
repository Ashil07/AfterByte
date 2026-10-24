"use client";

import { useRef, useState } from "react";
import { Halftone } from "@/components/halftone/Halftone";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { possibilities } from "@/content/approach";
import { cn } from "@/lib/cn";

type PossibilityId = (typeof possibilities)[number]["id"];
const numerals = ["i", "ii", "iii"];
const neutral = "Wherever you start, we begin the same way: understand what you need, then build exactly that.";

/**
 * 02 — The vision. The second line inks in with scroll. Three starting points
 * reshape the halftone figure; choosing one is optional.
 */
export function Vision() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<PossibilityId | null>(null);
  const current = possibilities.find((p) => p.id === active);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-ink] > span", el);
        gsap.fromTo(
          words,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.5,
            scrollTrigger: { trigger: "[data-ink]", start: "top 78%", end: "top 38%", scrub: 0.6 },
          },
        );
        gsap.from("[data-option]", {
          opacity: 0,
          y: 18,
          stagger: 0.08,
          duration: 0.9,
          scrollTrigger: { trigger: "[data-options]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const second = "Now, let’s make it real.".split(" ");

  return (
    <section ref={root} id="vision" aria-labelledby="vision-title" className="relative pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="frame">
        <ChapterMark id="vision" />
        <h2 id="vision-title" className="display-xl mt-10 text-[clamp(3rem,7.4vw,8.75rem)] md:mt-14 lg:ml-[8.333%]">
          <span className="block">You’ve got the vision.</span>
          <span data-ink className="block italic text-paper">
            {second.map((w, i) => (
              <span key={i}>
                <span className="inline-block">{w}</span>{" "}
              </span>
            ))}
          </span>
        </h2>

        <div className="grid-12 mt-20 gap-y-12 md:mt-28">
          <div className="col-span-12 lg:col-span-6 lg:col-start-1">
            <p className="label mb-6 text-mute">Where are you starting from?</p>
            <ul data-options className="border-b border-line">
              {possibilities.map((p, i) => {
                const on = active === p.id;
                return (
                  <li key={p.id} data-option className="rule">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(p.id)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(p.id)}
                      onFocus={() => setActive(p.id)}
                      className="group flex w-full items-baseline gap-5 py-6 text-left md:py-7"
                    >
                      <span className={cn("label w-7 shrink-0 transition-colors", on ? "text-ice" : "text-mute")}>
                        {numerals[i]}.
                      </span>
                      <span
                        className={cn(
                          "font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] transition-[color,transform] duration-500 ease-out-soft",
                          on ? "translate-x-2 text-paper" : "text-paper/55 group-hover:text-paper/85",
                        )}
                      >
                        {p.title}
                      </span>
                    </button>
                    {/* Inline message on small screens */}
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-out-soft lg:hidden",
                        on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <p className="overflow-hidden pl-12 text-paper/70">
                        <span className="block pb-6">{p.message}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop only: on small screens the choices expand inline instead. */}
          <figure className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="relative aspect-[4/5] border border-line bg-ink-2/40">
              <Halftone shape={current?.shape ?? "seed"} spacing={10} seed={3} />
              <span aria-hidden className="label absolute left-4 top-4 text-mute">
                {current ? numerals[possibilities.indexOf(current)] : "—"}
              </span>
            </div>
            <figcaption aria-live="polite" className="mt-5 hidden min-h-[7.5rem] text-paper/70 lg:block">
              {current?.message ?? neutral}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
