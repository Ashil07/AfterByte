"use client";

import Image from "next/image";
import { useRef } from "react";
import { Halftone } from "@/components/halftone/Halftone";
import { MOTION, SplitText, gsap, useGSAP } from "@/components/motion/gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { site } from "@/content/site";

/**
 * 01 — Opening. A living version of the logo artwork: halftone light sweeps in
 * from the bottom-left, the wordmark rises, then the headline and actions.
 * Scrolling away recedes the whole scene into the next chapter.
 */
export function Opening() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const intro = q<HTMLElement>("[data-intro]");
        gsap.set(intro, { opacity: 0 });
        intro.forEach((n) => n.classList.add("is-revealed"));

        const headline = q<HTMLElement>("[data-headline]")[0];
        const split = SplitText.create(headline, { type: "lines", mask: "lines", linesClass: "split-line" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(q("[data-wordmark]"), { opacity: 0, y: desktop ? 28 : 16 }, { opacity: 1, y: 0, duration: 1.6 }, 0.25)
          .set(headline, { opacity: 1 }, 0.8)
          .from(split.lines, { yPercent: 105, duration: 1.2, stagger: 0.1 }, 0.8)
          .fromTo(q("[data-after]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 1.15);

        // Scroll: the opening recedes as the vision chapter arrives.
        const recede = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        recede
          .to(q("[data-content]"), { yPercent: desktop ? -14 : -8, opacity: 0, ease: "none" }, 0)
          .to(q("[data-field]"), { scale: 1.12, opacity: 0.2, ease: "none" }, 0);

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="opening-title"
      className="relative isolate h-[100svh] min-h-[620px] overflow-hidden"
    >
      <div data-field className="absolute inset-0 -z-10 origin-[30%_60%]">
        <Halftone shape="hero" interactive intro spacing={11} />
        {/* Soft hand-off into the next chapter’s background. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div
        data-content
        className="frame relative grid h-full grid-rows-[auto_1fr_auto] pb-28 pt-[calc(var(--header-h)+1.25rem)] lg:pb-12"
      >
        <div className="flex items-start justify-between gap-6">
          <div data-intro data-after className="lg:invisible">
            <ChapterMark id="top" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Image
            data-intro
            data-wordmark
            src="/brand/wordmark.png"
            alt="AfterByte"
            width={1706}
            height={514}
            priority
            sizes="(min-width: 1024px) 54vw, 84vw"
            className="h-auto w-[min(84vw,880px)] select-none lg:w-[54vw]"
          />
        </div>

        <div className="grid-12 items-end gap-y-8">
          <h1
            id="opening-title"
            data-intro
            data-headline
            className="display-l col-span-12 max-w-[11ch] text-balance md:col-span-8 lg:col-span-7"
          >
            Every big thing starts <em className="italic">somewhere.</em>
          </h1>
          <div className="col-span-12 md:col-span-4 lg:col-span-4 lg:col-start-9">
            <p data-intro data-after className="label mb-4 text-paper/80">
              Website &amp; app development · {site.location.city}
            </p>
            <p data-intro data-after className="max-w-[34ch] text-[1.0625rem] text-paper/75">
              An idea. A business. A problem waiting for a better solution.
            </p>
            <div data-intro data-after className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Magnetic>
                <ButtonLink href="#vision" arrow="down">
                  Let’s explore
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#services" variant="text" arrow="right">
                See what we build
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
