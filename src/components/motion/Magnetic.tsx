"use client";

import { useRef, type ReactNode } from "react";
import { FINE_POINTER, gsap, useGSAP } from "./gsap";

/**
 * Subtle magnetic pull for selected desktop CTAs. Max travel is a few pixels so
 * the hit area never moves away from the cursor. Disabled for touch and
 * reduced motion.
 */
export function Magnetic({ children, strength = 6 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER} and (prefers-reduced-motion: no-preference)`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          xTo(dx * strength);
          yTo(dy * strength * 0.6);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  );
}
