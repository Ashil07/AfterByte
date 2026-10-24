"use client";

import { useRef } from "react";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { problems } from "@/content/problems";
import { cleanFaces, messyFaces } from "./faces";

/**
 * 03 — Complications. The main storytelling moment.
 *
 * Desktop with motion: the stage pins for ~2.6 viewports. Fragments pile up one
 * by one in disarray (accumulation), the headline gives way to the statement,
 * then every fragment straightens into an aligned row and swaps its messy face
 * for a clean one, joined by a single line: one system.
 *
 * Mobile / reduced motion / no JS: natural flow. Headline, the five problems as
 * cards, then the statement. Clean versions appear in chapter 04.
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
        const chaos = problems.map((p) => p.chaos);
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
            end: () => `+=${window.innerHeight * 2.8}`,
            pin: stage,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.set(q("[data-clean]"), { opacity: 0 });
        gsap.set(q("[data-solution]"), { opacity: 0, y: 8 });
        gsap.set(q("[data-statement]"), { opacity: 0, y: 40 });
        gsap.set(q("[data-system-line]"), { scaleX: 0 });

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
            i * 0.9,
          );
        });

        // 2. The turn — the headline leaves and the fragments straighten into
        //    one aligned row. The statement only arrives once the top-right,
        //    where the lifted fragments were, is clear again.
        tl.to(q("[data-head]"), { opacity: 0, y: -40, duration: 1, ease: "power2.in" }, 5.4)
          .to(cards, { x: 0, y: 0, rotation: 0, duration: 2, ease: "power3.inOut", stagger: 0.12 }, 5.6)
          .to(q("[data-statement]"), { opacity: 1, y: 0, duration: 1.2 }, 7.9);

        // 3. Clarity — messy faces give way to clean ones, joined by a line.
        tl.to(q("[data-messy]"), { opacity: 0, duration: 0.8, stagger: 0.12 }, 7.0)
          .to(q("[data-clean]"), { opacity: 1, duration: 0.8, stagger: 0.12 }, 7.0)
          // Each caption is gone before its replacement starts, so the two never stack.
          .to(q("[data-problem]"), { opacity: 0, y: -8, duration: 0.45, stagger: 0.12 }, 7.1)
          .to(q("[data-solution]"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 7.6)
          .to(q("[data-system-line]"), { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 8.6)
          .to({}, { duration: 0.8 }); // brief hold before release

        return () => {
          delete el.dataset.pinned;
        };
      });

      mm.add(MOTION.mobile, () => {
        q<HTMLElement>("[data-card]").forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 36,
            rotation: problems[i].chaos.r * 0.7,
            duration: 0.9,
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });
        gsap.from(q("[data-statement]"), {
          opacity: 0,
          y: 24,
          duration: 1,
          scrollTrigger: { trigger: q("[data-statement]")[0], start: "top 85%", once: true },
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

        <ol data-fragments className="friction-grid mt-14 grid gap-x-4 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-5 lg:gap-y-0">
          <li aria-hidden className="friction-line hidden" data-system-line>
            <span className="label absolute -top-6 left-0 text-ice">One connected system</span>
          </li>
          {problems.map((p, i) => {
            const Messy = messyFaces[p.id];
            const Clean = cleanFaces[p.id];
            return (
              <li key={p.id} data-card className="relative will-change-transform">
                <div aria-hidden className="grid h-[13.5rem] grid-rows-[minmax(0,1fr)] [grid-template-areas:'face'] *:[grid-area:face]">
                  <div data-messy>
                    <Messy />
                  </div>
                  <div data-clean className="friction-clean hidden">
                    <Clean />
                  </div>
                </div>
                <div className="relative mt-4 grid [grid-template-areas:'cap'] *:[grid-area:cap]">
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

        <p data-statement className="friction-statement display-m mt-20 max-w-[20ch] text-balance md:mt-28 lg:ml-[41.66%]">
          You don’t need more complexity. <em className="text-ice">You need a better system.</em>
        </p>
      </div>
    </section>
  );
}
