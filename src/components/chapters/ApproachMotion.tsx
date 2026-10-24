"use client";

import { useRef, type ReactNode } from "react";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";

/**
 * Mobile-only entrances for 08 — Approach. On small screens the principles
 * stack into one long read, so each arrives as it is reached: its rule draws
 * across, the numeral rises, then the copy. Desktop stays still by design.
 */
export function ApproachMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
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
