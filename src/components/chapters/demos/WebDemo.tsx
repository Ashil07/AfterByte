import Image from "next/image";
import { gsap } from "@/components/motion/gsap";
import { DemoShell } from "./DemoShell";

/**
 * Service demo 01 — a small business website assembling itself: a wireframe
 * gives way to real sections, top to bottom. Fictional business.
 */
export function WebDemo() {
  return (
    <DemoShell caption="Example layout · fictional business" className="aspect-[16/11]">
      <div className="flex h-full flex-col border border-line-strong bg-ink">
        {/* browser chrome */}
        <div className="flex items-center gap-[0.8em] border-b border-line px-[1em] py-[0.6em]">
          <span className="flex gap-[0.35em]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[0.55em] rounded-full bg-line-strong" />
            ))}
          </span>
          <span className="flex-1 border border-line px-[0.8em] py-[0.25em] font-mono text-[0.85em] text-mute">
            juniperandrye.com
          </span>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          {/* wireframe layer */}
          <div data-wire className="absolute inset-0 grid grid-rows-[auto_1fr_auto_auto] gap-[1em] p-[1.4em] opacity-0">
            <div className="h-[1.6em] border border-dashed border-line-strong" />
            <div className="grid grid-cols-2 gap-[1em]">
              <div className="border border-dashed border-line-strong" />
              <div className="border border-dashed border-line-strong" />
            </div>
            <div className="grid h-[5em] grid-cols-3 gap-[1em]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border border-dashed border-line-strong" />
              ))}
            </div>
            <div className="h-[1.6em] border border-dashed border-line-strong" />
          </div>

          {/* real site */}
          <div className="relative grid h-full grid-rows-[auto_1fr_auto_auto] gap-[1em] p-[1.4em]">
            <nav data-w className="flex items-center justify-between">
              <span className="font-serif text-[1.5em] leading-none">Juniper &amp; Rye</span>
              <span className="flex items-center gap-[1.4em] text-[0.95em] text-paper/70">
                <span>Menu</span>
                <span>Visit</span>
                <span className="bg-paper px-[0.9em] py-[0.35em] text-ink">Order</span>
              </span>
            </nav>
            <div className="grid min-h-0 grid-cols-2 gap-[1.4em]">
              <div data-w className="flex flex-col justify-center">
                <p className="font-mono text-[0.8em] uppercase tracking-[0.14em] text-mute">Bakery · Rose Street</p>
                <p className="mt-[0.5em] font-serif text-[2.9em] leading-[0.95]">Bread worth waking up for.</p>
                <p className="mt-[0.8em] max-w-[28ch] text-[1em] text-paper/70">
                  Sourdough, pastries and celebration cakes, baked every morning.
                </p>
                <span className="mt-[1.1em] self-start bg-paper px-[1em] py-[0.5em] text-[0.95em] text-ink">
                  Order for pickup →
                </span>
              </div>
              <div data-w className="relative min-h-0 overflow-hidden">
                <Image src="/work/placeholder-1.webp" alt="" fill sizes="30vw" className="object-cover object-[30%_40%]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[1em]">
              {[
                ["Country sourdough", "Daily"],
                ["Cardamom buns", "Weekends"],
                ["Celebration cakes", "48h notice"],
              ].map(([n, d]) => (
                <div key={n} data-w className="border-t border-line-strong pt-[0.6em]">
                  <p className="font-serif text-[1.25em] leading-tight">{n}</p>
                  <p className="text-[0.85em] text-mute">{d}</p>
                </div>
              ))}
            </div>
            <div data-w className="flex justify-between border-t border-line pt-[0.6em] text-[0.85em] text-mute">
              <span>Open Tue–Sun · 7:00–15:00</span>
              <span>12 Rose Street</span>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export function assembleWeb(root: Element) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 1 } });
  tl.fromTo(root.querySelector("[data-wire]"), { opacity: 1 }, { opacity: 1, duration: 0.4 })
    .from(root.querySelectorAll("[data-w]"), { opacity: 0, y: 28, stagger: 0.28 })
    .to(root.querySelector("[data-wire]"), { opacity: 0, duration: 1.2 }, "-=1.2");
  return tl;
}
