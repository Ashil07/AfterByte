"use client";

import { Plus } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { services, type Service, type ServiceId } from "@/content/services";
import { cn } from "@/lib/cn";
import { selectService } from "@/lib/contact/events";
import { AppDemo, assembleApp } from "./demos/AppDemo";
import { AutomationFlow, assembleFlow } from "./demos/AutomationFlow";
import { SystemsDemo, assembleSystems } from "./demos/SystemsDemo";
import { WebDemo, assembleWeb } from "./demos/WebDemo";

/** Side padding of the `frame` utility; the deck bleeds to the screen edge. */
const BLEED = "-mx-[clamp(1.25rem,4vw,4rem)] px-[clamp(1.25rem,4vw,4rem)]";

const demos: Record<ServiceId, { view: ReactNode; assemble: (el: Element) => gsap.core.Timeline; duration?: number }> = {
  web: { view: <WebDemo />, assemble: assembleWeb },
  // Narrower phone so this card is not much taller than the others.
  app: { view: <div className="mx-auto max-w-[15rem]"><AppDemo /></div>, assemble: assembleApp },
  systems: { view: <SystemsDemo />, assemble: assembleSystems },
  automation: { view: <AutomationFlow compact />, assemble: assembleFlow, duration: 3.2 },
};

/** The capability list, folded away until asked for. */
function Included({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  return (
    <div className="mt-6 border-y border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-3 text-left text-[0.9375rem] text-paper/85"
      >
        What’s included
        <Plus
          aria-hidden
          className={cn("size-4 shrink-0 text-mute transition-transform duration-300 ease-out-soft", open && "rotate-45")}
        />
      </button>
      <div
        id={panel}
        inert={!open}
        className={cn("grid transition-[grid-template-rows] duration-300 ease-out-soft", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <ul className="overflow-hidden text-[0.9375rem] text-paper/70">
          {items.map((c) => (
            <li key={c} className="flex items-baseline gap-3 pb-2.5 first:pt-1">
              <span aria-hidden className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-ice/70" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ service }: { service: Service }) {
  return (
    <article
      id={`deck-${service.id}`}
      aria-labelledby={`deck-${service.id}-title`}
      className="w-[min(82vw,30rem)] shrink-0 snap-start"
    >
      <div className="label flex items-center gap-3 text-mute">
        <span className="text-ice">{service.number}</span>
        <span aria-hidden className="h-px w-6 bg-line-strong" />
        <h3 id={`deck-${service.id}-title`}>{service.title}</h3>
      </div>
      <p className="display-m mt-5 max-w-[14ch]">{service.tagline}</p>
      <p className="mt-4 text-paper/70">{service.summary}</p>
      <div data-deck-demo={service.id} className="mt-8">
        {demos[service.id].view}
      </div>
      <Included items={service.capabilities} />
      <ButtonLink href="#contact" variant="text" className="mt-4" onClick={() => selectService(service.id)}>
        {service.cta}
      </ButtonLink>
    </article>
  );
}

/**
 * 05 on phones and tablets: the four services as a swipeable deck instead of a
 * long stack. A tab row (sticky under the header while the deck is on screen)
 * shows where you are and jumps between cards; the next card peeks in so the
 * swipe is discoverable. Each demo assembles the first time its card is shown.
 * Native scroll-snap, no carousel library. Desktop keeps the scroll-driven panel.
 */
export function ServiceDeck() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const play = useRef<(i: number) => void>(() => {});

  // The card most in view is the active one.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = cards.indexOf(entry.target);
          activeRef.current = i;
          setActive(i);
          play.current(i);
        }
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.mobile, () => {
        const tls = gsap.utils.toArray<HTMLElement>("[data-deck-demo]", el).map((d) => {
          const demo = demos[d.dataset.deckDemo as ServiceId];
          const tl = demo.assemble(d).progress(1).progress(0);
          return demo.duration ? tl.duration(demo.duration) : tl;
        });
        // Demos wait until the deck itself is on screen, then play as cards are reached.
        let seen = false;
        play.current = (i) => {
          if (seen) tls[i]?.play();
        };
        ScrollTrigger.create({
          trigger: track.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            seen = true;
            tls[activeRef.current]?.play();
          },
        });
        return () => {
          play.current = () => {};
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const go = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const still = window.matchMedia(MOTION.reduced).matches;
    el.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: still ? "auto" : "smooth" });
  };

  return (
    <div ref={root} className="lg:hidden">
      <div className={cn("sticky top-[var(--header-h)] z-10 border-b border-line bg-ink-2/95", BLEED)}>
        <div className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-controls={`deck-${s.id}`}
              aria-current={active === i ? "true" : undefined}
              onClick={() => go(i)}
              className="relative h-12 shrink-0 text-[0.9375rem] text-mute transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ice after:transition-transform after:duration-300 after:ease-out-soft aria-[current=true]:text-paper aria-[current=true]:after:scale-x-100"
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        className={cn(
          "relative mt-10 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain scroll-px-[clamp(1.25rem,4vw,4rem)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          BLEED,
        )}
      >
        {services.map((s) => (
          <Card key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
