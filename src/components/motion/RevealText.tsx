"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { MOTION, SplitText, gsap, useGSAP } from "./gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Delay in seconds after the trigger point is reached. */
  delay?: number;
};

/**
 * Line-by-line headline reveal. Lines rise out of a mask once, when the heading
 * reaches the lower third of the viewport. With reduced motion the text is
 * simply present. SplitText re-splits on resize (autoSplit) and keeps an
 * aria-label so screen readers read the sentence, not fragments.
 */
export function RevealText({ as: Tag = "h2", children, className, id, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: desktop ? 105 : 60,
              opacity: 0,
              duration: desktop ? 1.1 : 0.8,
              stagger: 0.09,
              delay,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
