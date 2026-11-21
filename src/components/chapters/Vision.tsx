"use client";

import { useRef, useState } from "react";
import { Halftone } from "@/components/halftone/Halftone";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { possibilities } from "@/content/approach";
import { cn } from "@/lib/cn";

type PossibilityId = (typeof possibilities)[number]["id"];
const numerals = ["i", "ii", "iii"];
/** Name of each illustration, and the card's resting tilt for it (degrees). */
const plates = [
  { name: "Seedling", tilt: -2.5 },
  { name: "Growth", tilt: 1.8 },
  { name: "Balance", tilt: -1.2 },
];
const neutral = "Wherever you start, we begin the same way: understand what you need, then build exactly that.";

/**
 * 02 — The vision. The second line inks in with scroll. Three starting points
 * reshape the halftone figure; choosing one is optional.
 */
export function Vision() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<PossibilityId | null>(null);
  const current = possibilities.find((p) => p.id === active);
  const index = current ? possibilities.indexOf(current) : 0;
  const card = useRef<HTMLDivElement>(null);

  // Each starting point gives the card its own resting angle.
  useGSAP(
    () => {
      if (!card.current) return;
      const still = window.matchMedia(MOTION.reduced).matches;
      gsap.to(card.current, { rotation: plates[index].tilt, duration: still ? 0 : 1, ease: "expo.out" });
    },
    { dependencies: [index] },
  );

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
        // The card leans gently toward the pointer (mouse only).
        const plate = card.current;
        const figure = plate?.parentElement;
        if (plate && figure && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          const toX = gsap.quickTo(plate, "x", { duration: 0.8, ease: "power3.out" });
          const toY = gsap.quickTo(plate, "y", { duration: 0.8, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const b = figure.getBoundingClientRect();
            toX(((e.clientX - b.left) / b.width - 0.5) * 14);
            toY(((e.clientY - b.top) / b.height - 0.5) * 10);
          };
          const leave = () => {
            toX(0);
            toY(0);
          };
          figure.addEventListener("pointermove", move);
          figure.addEventListener("pointerleave", leave);
          return () => {
            figure.removeEventListener("pointermove", move);
            figure.removeEventListener("pointerleave", leave);
          };
        }
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
                          "font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] transition-[color,translate] duration-500 ease-out-soft",
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
                      <div className="overflow-hidden pl-12">
                        <p className="text-paper/70">{p.message}</p>
                        {/* Phones: the illustration opens with its choice, compact and wide. */}
                        <div
                          aria-hidden
                          className="relative mb-7 mt-5 aspect-[16/10] -rotate-1 overflow-hidden rounded-[1rem] border border-line bg-ink-2"
                        >
                          <Halftone shape={p.shape} spacing={6} seed={3} />
                          <span className="label absolute bottom-3 left-4 text-paper/70">{plates[i].name}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop: one card whose illustration morphs between the starting
              points. Below lg each choice opens its own compact card inline. */}
          <figure className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div
              ref={card}
              data-card
              style={{ transform: `rotate(${plates[0].tilt}deg)` }}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-line bg-ink-2"
            >
              <Halftone shape={current?.shape ?? "sprout"} spacing={7} seed={3} />
              <span aria-hidden className="label absolute left-5 top-5 text-mute">
                {numerals[index]}.
              </span>
              <span aria-hidden className="label absolute bottom-5 left-5 text-paper/70">
                {plates[index].name}
              </span>
            </div>
            <figcaption aria-live="polite" className="mt-8 min-h-[7.5rem] text-paper/70">
              {current?.message ?? neutral}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
