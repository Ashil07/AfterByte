import type { ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { DemoShell } from "./DemoShell";

/** One block of the phone screen: a grey wireframe stacked over the real UI. */
function Block({ skel, children, className }: { skel: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`grid [grid-template-areas:'b'] *:[grid-area:b] ${className ?? ""}`}>
      <div data-a-skel className="opacity-0">
        {skel}
      </div>
      <div data-a-real>{children}</div>
    </div>
  );
}

const Bar = ({ w, h = "0.9em" }: { w: string; h?: string }) => (
  <span className="block rounded-[0.2em] bg-line-strong" style={{ width: w, height: h }} />
);

const classes = [
  { time: "07:00", name: "Morning flow", meta: "60 min · 4 spots left", state: "open" },
  { time: "12:30", name: "Lunch reset", meta: "30 min · Full", state: "full" },
  { time: "18:30", name: "Slow stretch", meta: "45 min · 9 spots left", state: "open" },
];

/**
 * Service demo 02 — a booking app evolving from wireframe to finished screen.
 * Fictional studio.
 */
export function AppDemo() {
  return (
    <DemoShell caption="Example screen · fictional studio" className="mx-auto max-w-[min(100%,24rem)]">
      <div className="mx-auto aspect-[9/18.5] w-[62%] min-w-[14rem] rounded-[2.2em] border border-line-strong bg-ink p-[0.6em] text-[1.9em]">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.7em] bg-ink-2 px-[1.1em] pb-[0.8em] pt-[0.9em] text-[0.5em]">
          <div className="flex justify-between font-mono text-[0.85em] text-mute">
            <span>9:41</span>
            <span>Stillwater</span>
          </div>

          <Block className="mt-[1.4em]" skel={<div className="space-y-[0.5em]"><Bar w="40%" h="0.7em" /><Bar w="75%" h="1.6em" /></div>}>
            <p className="text-[0.95em] text-mute">Thursday, 24 October</p>
            <p className="font-serif text-[2.1em] leading-[1.02]">Good morning, Asha</p>
          </Block>

          <Block className="mt-[1.2em]" skel={<div className="flex gap-[0.4em]">{[0, 1, 2, 3, 4].map((i) => <Bar key={i} w="18%" h="2.6em" />)}</div>}>
            <div className="flex gap-[0.4em]">
              {[
                ["Mon", "21"],
                ["Tue", "22"],
                ["Wed", "23"],
                ["Thu", "24"],
                ["Fri", "25"],
              ].map(([d, n]) => (
                <span
                  key={d}
                  className={`flex flex-1 flex-col items-center rounded-[0.5em] py-[0.45em] ${d === "Thu" ? "bg-paper text-ink" : "border border-line text-paper/70"}`}
                >
                  <span className="text-[0.8em]">{d}</span>
                  <span className="font-mono text-[1.05em]">{n}</span>
                </span>
              ))}
            </div>
          </Block>

          <div className="mt-[1.2em] space-y-[0.6em]">
            {classes.map((c) => (
              <Block key={c.time} skel={<div className="flex h-[3.6em] items-center gap-[0.8em] rounded-[0.6em] border border-dashed border-line-strong px-[0.8em]"><Bar w="18%" /><Bar w="50%" /></div>}>
                <div
                  className={`flex h-[3.6em] items-center gap-[0.9em] rounded-[0.6em] border px-[0.8em] ${c.time === "07:00" ? "border-ice/70 bg-ice/[0.07]" : "border-line"}`}
                >
                  <span className="font-mono text-[1em] text-paper/80">{c.time}</span>
                  <span className="flex-1">
                    <span className="block text-[1.05em]">{c.name}</span>
                    <span className={`block text-[0.85em] ${c.state === "full" ? "text-mute" : "text-paper/60"}`}>{c.meta}</span>
                  </span>
                  {c.time === "07:00" && <span className="size-[0.6em] rounded-full bg-ice" />}
                </div>
              </Block>
            ))}
          </div>

          <Block className="mt-auto" skel={<Bar w="100%" h="3em" />}>
            <div className="rounded-[0.6em] bg-paper py-[0.9em] text-center text-[1.05em] text-ink">Book 07:00 Morning flow</div>
          </Block>

          <Block className="mt-[0.8em]" skel={<div className="flex justify-around"><Bar w="16%" h="0.7em" /><Bar w="16%" h="0.7em" /><Bar w="16%" h="0.7em" /></div>}>
            <div className="flex justify-around border-t border-line pt-[0.6em] text-[0.85em]">
              <span className="text-paper">Classes</span>
              <span className="text-mute">Bookings</span>
              <span className="text-mute">Profile</span>
            </div>
          </Block>
        </div>
      </div>
    </DemoShell>
  );
}

export function assembleApp(root: Element) {
  const skel = root.querySelectorAll("[data-a-skel]");
  const real = root.querySelectorAll("[data-a-real]");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  tl.set(skel, { opacity: 1 })
    .set(real, { opacity: 0 })
    .to({}, { duration: 0.4 })
    .to(skel, { opacity: 0, duration: 0.6, stagger: 0.22 })
    .fromTo(real, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.22 }, "<0.15");
  return tl;
}
