"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { processEnd, processStart, processSteps } from "@/content/process";
import { cn } from "@/lib/cn";

/**
 * “From idea to launch” on the Contact page. A dotted path winds through the
 * steps (a straight line on the left below lg); as you scroll, a pale-blue copy
 * of it is revealed from the top and each node lights up when the line reaches
 * it. The path is computed from the nodes' real positions, so it follows the
 * layout at every width. Natural state (no JS, reduced motion): fully drawn,
 * every node lit.
 */
export function ProcessPath() {
  const track = useRef<HTMLDivElement>(null);
  const base = useRef<SVGPathElement>(null);
  const live = useRef<SVGPathElement>(null);
  const reveal = useRef<SVGRectElement>(null);
  const centres = useRef<number[]>([]);
  const clipId = useId().replace(/:/g, "");

  // Trace a smooth curve through every node's centre (vertical tangents).
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const draw = () => {
      const box = el.getBoundingClientRect();
      const pts = Array.from(el.querySelectorAll<HTMLElement>("[data-node]")).map((n) => {
        const r = n.getBoundingClientRect();
        return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top] as const;
      });
      if (pts.length < 2) return;
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const k = (y1 - y0) * 0.55;
        d += ` C ${x0} ${y0 + k}, ${x1} ${y1 - k}, ${x1} ${y1}`;
      }
      base.current?.setAttribute("d", d);
      live.current?.setAttribute("d", d);
      centres.current = pts.map((p) => p[1]);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, () => {
        const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
        const proxy = { y: 0 };
        const render = () => {
          reveal.current?.setAttribute("height", String(Math.max(0, proxy.y)));
          nodes.forEach((n, i) => {
            n.dataset.pending = String((centres.current[i] ?? 0) > proxy.y + 2);
          });
        };
        const target = (p: number) => p * el.offsetHeight;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 70%",
          onUpdate: (self) =>
            gsap.to(proxy, { y: target(self.progress), duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: render }),
          onRefresh: (self) => {
            proxy.y = target(self.progress);
            render();
          },
        });
        proxy.y = target(st.progress);
        render();
        return () => {
          st.kill();
          gsap.killTweensOf(proxy);
          reveal.current?.setAttribute("height", "100%");
          nodes.forEach((n) => delete n.dataset.pending);
        };
      });
      return () => mm.revert();
    },
    { scope: track },
  );

  // Node x on desktop: start and end centred, steps alternate right / left of
  // centre with their copy on the outer side.
  const node =
    "absolute left-5 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-colors duration-500 " +
    "border-ice bg-ice text-ink data-[pending=true]:border-line-strong data-[pending=true]:bg-ink data-[pending=true]:text-mute";

  return (
    <section aria-labelledby="process-title" className="relative border-t border-line py-24 md:py-36">
      <div className="frame">
        <p className="label text-mute">How a project runs</p>
        <RevealText id="process-title" className="display-l mt-8 max-w-[14ch]">
          From idea to <em className="italic">launch.</em>
        </RevealText>

        <div ref={track} className="relative mt-16 md:mt-24">
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <clipPath id={clipId}>
                <rect ref={reveal} x="-50%" y="0" width="200%" height="100%" />
              </clipPath>
            </defs>
            <path ref={base} fill="none" stroke="var(--color-line-strong)" strokeWidth={2} strokeDasharray="0.1 9" strokeLinecap="round" />
            <path
              ref={live}
              fill="none"
              stroke="var(--color-ice)"
              strokeWidth={2.5}
              strokeDasharray="0.1 9"
              strokeLinecap="round"
              clipPath={`url(#${clipId})`}
            />
          </svg>

          <ol className="relative">
            <li className="relative pb-14 pl-14 pt-2 lg:pb-20 lg:pl-0">
              <span data-node className={cn(node, "top-4 size-3 lg:left-1/2")} />
              <span className="label block text-mute lg:ml-[calc(50%+1.75rem)]">{processStart}</span>
            </li>

            {processSteps.map((step, i) => {
              const right = i % 2 === 0;
              return (
                <li key={step.title} className="relative pb-16 pl-14 lg:pb-24 lg:pl-0">
                  <span
                    data-node
                    aria-hidden
                    className={cn(node, "top-5 size-10 font-mono text-[0.75rem]", right ? "lg:left-[58%]" : "lg:left-[42%]")}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Copy sits outside its node, so the path only crosses the empty middle. */}
                  <div className={cn("max-w-[34rem]", right ? "lg:ml-[61%]" : "lg:ml-auto lg:mr-[61%] lg:text-right")}>
                    <h3 className="font-serif text-[clamp(1.75rem,2.6vw,2.375rem)] leading-[1.05]">{step.title}</h3>
                    <p className="mt-3 text-paper/70">{step.body}</p>
                    <p className="label mt-4 text-mute/80">{step.tags.join(" · ")}</p>
                  </div>
                </li>
              );
            })}

            <li className="relative pl-14 pt-2 lg:pl-0">
              <span data-node aria-hidden className={cn(node, "top-4 size-5 lg:left-1/2")} />
              <span className="label block text-ice lg:ml-[calc(50%+1.75rem)]">{processEnd}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
