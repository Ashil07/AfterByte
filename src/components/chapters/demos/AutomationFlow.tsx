import { Fragment, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { cn } from "@/lib/cn";

function Node({ step, kind, title, children }: { step: string; kind: string; title: string; children: ReactNode }) {
  return (
    <li data-node className="flex min-w-0 flex-col border border-line bg-ink-2 transition-colors">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="label text-mute">
          <span data-node-num className="text-paper">
            {step}
          </span>{" "}
          · {kind}
        </span>
        <span data-node-dot className="size-1.5 rounded-full bg-line-strong" />
      </div>
      <div className="p-4">
        <p className="font-serif text-[1.5rem] leading-none">{title}</p>
        <div aria-hidden className="mt-4 text-[0.8125rem] leading-snug">
          {children}
        </div>
      </div>
    </li>
  );
}

function Connector() {
  return (
    <li aria-hidden className="flex items-center justify-center py-1 lg:px-1 lg:py-0">
      <span className="relative block h-8 w-px bg-line lg:h-px lg:w-10 xl:w-14">
        <span data-conn className="absolute inset-0 origin-top bg-ice lg:origin-left" />
      </span>
    </li>
  );
}

const slots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

/**
 * Service demo 04 — an example workflow: new booking → confirmation email →
 * updated availability → organised record. Fictional data; the real steps
 * depend on the tools a business already uses.
 */
export function AutomationFlow() {
  const nodes = [
    {
      kind: "Trigger",
      title: "New booking",
      body: (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="text-mute">Name</dt>
          <dd>Anika M.</dd>
          <dt className="text-mute">When</dt>
          <dd>Sat 26 Oct, 19:30</dd>
          <dt className="text-mute">Party</dt>
          <dd>Table for 4</dd>
        </dl>
      ),
    },
    {
      kind: "Action",
      title: "Confirmation email",
      body: (
        <div className="border border-line bg-ink p-3">
          <p className="text-mute">To: anika@…</p>
          <p className="mt-1 text-paper">You’re booked for Saturday</p>
          <div className="mt-2 space-y-1.5">
            <span data-email-line className="block h-1 w-[92%] origin-left bg-line-strong" />
            <span data-email-line className="block h-1 w-[78%] origin-left bg-line-strong" />
            <span data-email-line className="block h-1 w-[54%] origin-left bg-line-strong" />
          </div>
        </div>
      ),
    },
    {
      kind: "Action",
      title: "Updated availability",
      body: (
        <ul className="grid grid-cols-3 gap-1.5 font-mono text-[0.75rem]">
          {slots.map((s) => (
            <li
              key={s}
              className={cn(
                "relative grid border px-2 py-1.5 [grid-template-areas:'s'] *:[grid-area:s]",
                s === "19:30" ? "border-ice/60" : "border-line",
                s === "18:30" && "text-mute line-through",
              )}
            >
              <span data-slot-open={s === "19:30" ? "" : undefined} className={s === "19:30" ? "opacity-0" : ""}>
                {s}
              </span>
              {s === "19:30" && (
                <span data-slot-booked className="text-ice">
                  Booked
                </span>
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      kind: "Result",
      title: "Organised record",
      body: (
        <ul className="divide-y divide-line border-y border-line">
          <li data-record className="grid grid-cols-[1fr_auto] gap-2 py-1.5">
            <span className="text-paper">Anika M. · 4</span>
            <span className="font-mono text-[0.75rem] text-ice">Sat 19:30</span>
          </li>
          <li className="grid grid-cols-[1fr_auto] gap-2 py-1.5 text-paper/60">
            <span>Daniel R. · 2</span>
            <span className="font-mono text-[0.75rem]">Sat 18:00</span>
          </li>
          <li className="grid grid-cols-[1fr_auto] gap-2 py-1.5 text-paper/60">
            <span>Leila H. · 6</span>
            <span className="font-mono text-[0.75rem]">Fri 20:00</span>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <figure>
      <ol className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        {nodes.map((n, i) => (
          <Fragment key={n.title}>
            <Node step={String(i + 1).padStart(2, "0")} kind={n.kind} title={n.title}>
              {n.body}
            </Node>
            {i < nodes.length - 1 && <Connector />}
          </Fragment>
        ))}
      </ol>
      <figcaption className="label mt-4 text-mute">
        Example workflow · fictional data · the real steps depend on the tools you already use
      </figcaption>
    </figure>
  );
}

export function assembleFlow(root: Element) {
  const nodes = root.querySelectorAll("[data-node]");
  const conns = root.querySelectorAll("[data-conn]");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  const activate = (i: number, at: number | string) => {
    tl.fromTo(nodes[i], { opacity: 0.35 }, { opacity: 1, borderColor: "rgba(167,200,232,0.45)", duration: 0.5 }, at).fromTo(
      nodes[i].querySelector("[data-node-dot]"),
      { backgroundColor: "rgba(255,255,255,0.18)" },
      { backgroundColor: "#a7c8e8", duration: 0.3 },
      "<",
    );
  };
  tl.set(nodes, { opacity: 0.35 });
  activate(0, 0);
  tl.fromTo(conns[0], { scale: 0 }, { scale: 1, duration: 0.6, ease: "none" });
  activate(1, ">");
  tl.from(root.querySelectorAll("[data-email-line]"), { scaleX: 0, duration: 0.4, stagger: 0.1 }, "<0.1");
  tl.fromTo(conns[1], { scale: 0 }, { scale: 1, duration: 0.6, ease: "none" });
  activate(2, ">");
  tl.fromTo(root.querySelector("[data-slot-open]"), { opacity: 1 }, { opacity: 0, duration: 0.3 }, "<0.2").from(
    root.querySelector("[data-slot-booked]"),
    { opacity: 0, duration: 0.3 },
    "<",
  );
  tl.fromTo(conns[2], { scale: 0 }, { scale: 1, duration: 0.6, ease: "none" });
  activate(3, ">");
  tl.from(root.querySelector("[data-record]"), { opacity: 0, y: -10, duration: 0.5 }, "<0.1");
  // Settle: earlier steps stay lit but recede slightly so the result reads as the end point.
  tl.to([nodes[0], nodes[1], nodes[2]], { borderColor: "rgba(255,255,255,0.10)", duration: 0.4 });
  return tl;
}
