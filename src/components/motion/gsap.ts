"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 0.9 });

/**
 * Shared matchMedia conditions. Every animated component branches on these so
 * pinning/scrub only run on large screens with motion allowed. See CLAUDE.md §5.
 */
export const MOTION = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** True when a fine pointer can hover — gates pointer-following effects. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
