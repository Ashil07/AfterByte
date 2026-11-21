"use client";

import { useRef } from "react";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { problems } from "@/content/problems";
import { cn } from "@/lib/cn";
import { cleanFaces, messyFaces } from "./faces";

/** Each card's place on the phone pile: alternating sides, tilts and small drops. */
const pile = [
  "max-lg:left-0 max-lg:-rotate-3",
  "max-lg:right-0 max-lg:translate-y-3 max-lg:rotate-2",
  "max-lg:left-1 max-lg:translate-y-6 max-lg:-rotate-1",
  "max-lg:right-1 max-lg:translate-y-9 max-lg:rotate-3",
];

/**
 * 03 — Complications. The main storytelling moment.
 *
 * Desktop with motion: the stage pins for ~1.8 viewports. Four fragments pile
 * up in disarray (accumulation), the headline leaves, every fragment
 * straightens into an aligned row and swaps its messy face for a clean one,
 * joined by a single line: one system. Then “Where we come in” rises with the
 * one closing sentence.
 *
 * Below lg: the fragments land on one messy pile (a single card's height)
 * with the four problems as a short list beneath, then the same sentence.
 * Desktop with reduced motion or no JS: the row and the sentence, unpinned.
 */
export function Friction() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        el.dataset.pinned = "true";
        const stage = q<HTMLElement>("[data-stage]")[0];
        const grid = q<HTMLElement>("[data-fragments]")[0];
        const cards = q<HTMLElement>("[data-card]");
        const where = q<HTMLElement>("[data-where]")[0];
        const chaos = problems.map((p) => p.chaos);
        // “Where we come in” takes the headline’s place while pinned. Set inline
        // so the placement travels with this script and is undone on revert.
        Object.assign(where.style, {
          gridRow: "2",
          gridColumn: "1",
          alignSelf: "start",
          marginTop: "clamp(1.5rem, 4vh, 2.5rem)",
          position: "relative",
          zIndex: "2",
        });
        /** Free height above the card row, so lifted cards never leave the stage on short screens. */
        const lift = () =>
          grid.getBoundingClientRect().top -
          stage.getBoundingClientRect().top -
          parseFloat(getComputedStyle(stage).paddingTop);

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.8}`,
            pin: stage,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.set(q("[data-clean]"), { opacity: 0 });
        gsap.set(q("[data-solution]"), { opacity: 0, y: 8 });
        gsap.set(q("[data-system-line]"), { scaleX: 0 });
        gsap.set(q("[data-where] > *"), { opacity: 0, y: 30 });

        // 1. Accumulation — each fragment lands somewhere it doesn’t belong.
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            {
              opacity: 0,
              scale: 0.94,
              x: () => (chaos[i].x / 100) * stage.clientWidth + (i % 2 ? 24 : -24),
              y: () => (chaos[i].y / 100) * lift() + 30,
              rotation: chaos[i].r * 1.4,
            },
            {
              opacity: 1,
              scale: 1,
              x: () => (chaos[i].x / 100) * stage.clientWidth,
              y: () => (chaos[i].y / 100) * lift(),
              rotation: chaos[i].r,
              duration: 1.2,
            },
            i * 0.8,
          );
        });

        // 2. The turn — the headline leaves and the fragments straighten into
        //    one aligned row.
        tl.to(q("[data-head]"), { opacity: 0, y: -40, duration: 1, ease: "power2.in" }, 3.6).to(
          cards,
          { x: 0, y: 0, rotation: 0, duration: 1.8, ease: "power3.inOut", stagger: 0.1 },
          3.8,
        );

        // 3. Clarity — messy faces give way to clean ones, joined by a line.
        tl.to(q("[data-messy]"), { opacity: 0, duration: 0.8, stagger: 0.1 }, 4.9)
          .to(q("[data-clean]"), { opacity: 1, duration: 0.8, stagger: 0.1 }, 4.9)
          // Each caption is gone before its replacement starts, so the two never stack.
          .to(q("[data-problem]"), { opacity: 0, y: -8, duration: 0.45, stagger: 0.1 }, 5.0)
          .to(q("[data-solution]"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 5.4)
          .to(q("[data-system-line]"), { scaleX: 1, duration: 1, ease: "power2.inOut" }, 5.8);

        // 4. Where we come in — one sentence rises where the headline was.
        tl.to(q("[data-where] > *"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 }, 6.6).to({}, { duration: 0.6 }); // brief hold before release

        return () => {
          delete el.dataset.pinned;
          where.style.cssText = "";
        };
      });

      mm.add(MOTION.mobile, () => {
        // Fragments drop onto the pile one after another, then the list follows.
        const pileEl = q<HTMLElement>("[data-fragments]")[0];
        gsap.from(q("[data-card]"), {
          opacity: 0,
          y: -48,
          rotation: (i: number) => (i % 2 ? 8 : -8),
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.22,
          scrollTrigger: { trigger: pileEl, start: "top 80%", once: true },
        });
        gsap.from(q("[data-pile-caption]"), {
          opacity: 0,
          y: 12,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-pile-captions]")[0], start: "top 88%", once: true },
        });
        gsap.from(q("[data-where] > *"), {
          opacity: 0,
          y: 24,
          duration: 1,
          stagger: 0.15,
          scrollTrigger: { trigger: q("[data-where]")[0], start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="friction" aria-labelledby="friction-title" className="friction relative bg-ink">
      <div data-stage className="friction-stage frame pb-24 pt-24 md:pb-32">
        <div data-mark className="friction-mark">
          <ChapterMark id="friction" />
        </div>

        <h2 id="friction-title" data-head className="friction-head display-l mt-8 max-w-[15ch] text-balance md:mt-10">
          But somewhere along the way, things get <em>complicated.</em>
        </h2>

        {/* Below lg the cards stack into one messy pile; from lg they form a row. */}
        <ol
          data-fragments
          className="friction-grid relative mx-auto mt-12 h-[16rem] max-w-[28rem] md:mt-16 lg:mx-0 lg:grid lg:h-auto lg:max-w-none lg:grid-cols-4 lg:gap-x-4"
        >
          <li aria-hidden className="friction-line hidden" data-system-line>
            <span className="label absolute -top-6 left-0 text-ice">One connected system</span>
          </li>
          {problems.map((p, i) => {
            const Messy = messyFaces[p.id];
            const Clean = cleanFaces[p.id];
            return (
              <li key={p.id} data-card className={cn("relative max-lg:absolute max-lg:top-0 max-lg:w-[88%]", pile[i])}>
                <div aria-hidden className="grid h-[13.5rem] grid-rows-[minmax(0,1fr)] [grid-template-areas:'face'] *:[grid-area:face]">
                  <div data-messy>
                    <Messy />
                  </div>
                  <div data-clean className="friction-clean hidden">
                    <Clean />
                  </div>
                </div>
                <div className="relative mt-4 hidden [grid-template-areas:'cap'] *:[grid-area:cap] lg:grid">
                  <p data-problem className="text-[0.9375rem] leading-snug text-paper/80">
                    <span className="label mr-2 text-mute">{String(i + 1).padStart(2, "0")}</span>
                    {p.problem}
                  </p>
                  <p data-solution className="friction-solution hidden text-[0.9375rem] leading-snug text-ice">
                    <span className="label mr-2 text-ice/70">{String(i + 1).padStart(2, "0")}</span>
                    {p.solution}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* The pile's captions, as one short list (below lg only). */}
        <ol data-pile-captions className="mt-10 space-y-3 lg:hidden">
          {problems.map((p, i) => (
            <li key={p.id} data-pile-caption className="flex gap-3 text-[0.9375rem] leading-snug text-paper/80">
              <span className="label pt-0.5 text-mute">{String(i + 1).padStart(2, "0")}</span>
              {p.problem}
            </li>
          ))}
        </ol>
        <figure data-where className="friction-where grid-12 mt-20 gap-y-5 md:mt-28">
          <figcaption className="label col-span-12 text-mute lg:col-span-2 lg:pt-4">Where we come in</figcaption>
          <p className="display-m col-span-12 max-w-[32ch] text-balance lg:col-span-10">
            You need a better system, built around how your business <em className="text-ice">actually works.</em>
          </p>
        </figure>
      </div>
    </section>
  );
}
