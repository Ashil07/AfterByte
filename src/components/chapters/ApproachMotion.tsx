"use client";

import { useRef, type ReactNode } from "react";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";

/**
 * Motion for 08 — Approach. Everywhere: each struck-through line is crossed out
 * as it is reached, and the signature is written out at the end. Mobile only:
 * the principles stack into one long read, so each arrives as it is reached —
 * its rule draws across, the numeral rises, then the copy.
 */
export function ApproachMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, () => {
        // The excuse each principle replaces gets crossed out as it is reached.
        gsap.utils.toArray<HTMLElement>("[data-strike]", el).forEach((line) => {
          gsap.from(line, {
            scaleX: 0,
            duration: 0.7,
            delay: 0.35,
            ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 72%", once: true },
          });
        });
        // Sign-off: scrolling is the pen. The wordmark is written left to right,
        // then the underline is drawn with the pen tip riding its end, which
        // lifts off when done. Scroll back and it rewinds.
        const signature = el.querySelector<HTMLElement>("[data-signature]");
        const flourish = el.querySelector<SVGPathElement>("[data-flourish]");
        const nib = el.querySelector<SVGCircleElement>("[data-nib]");
        if (signature && flourish && nib) {
          const length = flourish.getTotalLength();
          const pen = { p: 0 };
          const render = () => {
            const pt = flourish.getPointAtLength(pen.p * length);
            flourish.style.strokeDashoffset = String(1 - pen.p);
            nib.setAttribute("cx", String(pt.x));
            nib.setAttribute("cy", String(pt.y));
            // Pen touches down as drawing starts and lifts off at the end.
            nib.setAttribute("opacity", String(pen.p <= 0 ? 0 : Math.min(1, (1 - pen.p) * 12)));
          };
          render();
          gsap
            .timeline({ scrollTrigger: { trigger: signature, start: "top 85%", end: "top 25%", scrub: 0.8 } })
            .fromTo(signature, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "none" })
            .to(pen, { p: 1, duration: 0.4, ease: "none", onUpdate: render });
          return () => {
            signature.style.clipPath = "";
            flourish.style.strokeDashoffset = "";
            nib.setAttribute("opacity", "0");
          };
        }
      });
      mm.add(MOTION.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-principle]", el).forEach((item) => {
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 85%", once: true } })
            .from(item.querySelector("[data-rule]"), { scaleX: 0, duration: 0.9, ease: "expo.out" })
            .from(item.querySelector("[data-numeral]"), { yPercent: 40, opacity: 0, duration: 0.7 }, 0.1)
            .from(item.querySelectorAll("[data-copy] > *"), { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.15);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
