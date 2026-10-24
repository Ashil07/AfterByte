"use client";

import { useRef, type ReactNode } from "react";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { services, type Service, type ServiceId } from "@/content/services";
import { selectService } from "@/lib/contact/events";
import { AppDemo, assembleApp } from "./demos/AppDemo";
import { AutomationFlow, assembleFlow } from "./demos/AutomationFlow";
import { SystemsDemo, assembleSystems } from "./demos/SystemsDemo";
import { WebDemo, assembleWeb } from "./demos/WebDemo";
import { ServiceDeck } from "./ServiceDeck";

const demos: Record<Exclude<ServiceId, "automation">, { View: () => ReactNode; assemble: (el: Element) => gsap.core.Timeline }> = {
  web: { View: WebDemo, assemble: assembleWeb },
  app: { View: AppDemo, assemble: assembleApp },
  systems: { View: SystemsDemo, assemble: assembleSystems },
};

function DemoView({ id }: { id: keyof typeof demos }) {
  const { View } = demos[id];
  return <View />;
}

function ServiceText({ service }: { service: Service }) {
  return (
    <div>
      <div className="label flex items-center gap-3 text-mute">
        <span className="text-ice">{service.number}</span>
        <span aria-hidden className="h-px w-6 bg-line-strong" />
        <h3 id={`svc-${service.id}`}>{service.title}</h3>
      </div>
      <p className="display-m mt-6 max-w-[14ch]">{service.tagline}</p>
      <p className="mt-6 max-w-[46ch] text-paper/70">{service.summary}</p>
      <ul className="mt-8 grid max-w-[30rem] grid-cols-1 border-t border-line text-[0.9375rem] xs:grid-cols-2 xs:gap-x-6">
        {service.capabilities.map((c) => (
          <li key={c} className="border-b border-line py-2.5 text-paper/85">
            {c}
          </li>
        ))}
      </ul>
      <ButtonLink href="#contact" variant="text" className="mt-6" onClick={() => selectService(service.id)}>
        {service.cta}
      </ButtonLink>
    </div>
  );
}

/**
 * 05 — What we build. Desktop: service copy scrolls on the left while a sticky
 * panel on the right shows the matching demo, assembled by scroll progress.
 * Automation follows as a full-width flow. Below lg the four services become a
 * swipeable deck (ServiceDeck). Reduced motion: demos in final state.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [web, app, systems, automation] = services;
  const sticky = [web, app, systems];

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      const prime = (tl: gsap.core.Timeline) => tl.progress(1).progress(0);

      // Which demo the sticky panel shows — needed with or without motion.
      mm.add("(min-width: 1024px)", () => {
        const panel = q<HTMLElement>("[data-panel]")[0];
        q<HTMLElement>("[data-service-block]").forEach((block) => {
          ScrollTrigger.create({
            trigger: block,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) panel.dataset.active = block.dataset.serviceBlock;
            },
          });
        });
      });

      mm.add(MOTION.desktop, () => {
        const panel = q<HTMLElement>("[data-panel]")[0];
        q<HTMLElement>("[data-service-block]").forEach((block) => {
          const id = block.dataset.serviceBlock as keyof typeof demos;
          const demoEl = panel.querySelector(`[data-demo="${id}"]`);
          if (!demoEl) return;
          const tl = prime(demos[id].assemble(demoEl));
          ScrollTrigger.create({
            trigger: block,
            start: "top 85%",
            end: "center 50%",
            scrub: 0.6,
            animation: tl,
          });
        });
        const flowEl = q("[data-flow]")[0];
        ScrollTrigger.create({
          trigger: flowEl,
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.6,
          animation: prime(assembleFlow(flowEl)),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="relative border-t border-line bg-ink-2 pb-28 pt-24 md:pb-40 md:pt-32">
      <div className="frame">
        {/* Heading and 01–03 share a column, so the sticky demo panel starts
            beside the heading instead of leaving that side empty. */}
        <div className="grid-12">
          {/* Bottom padding keeps the sticky panel in place while the last block is read. */}
          <div className="col-span-12 lg:col-span-5 lg:pb-[18vh]">
            <div className="mb-10 md:mb-14 lg:mb-0">
              <ChapterMark id="services" />
              <RevealText id="services-title" className="display-l mt-8 max-w-[13ch] md:mt-10">
                Four ways to get <em className="italic">there.</em>
              </RevealText>
            </div>
            {sticky.map((s) => (
              <article
                key={s.id}
                data-service-block={s.id}
                aria-labelledby={`svc-${s.id}`}
                className="hidden min-h-[88vh] flex-col justify-center py-20 lg:flex"
              >
                <ServiceText service={s} />
              </article>
            ))}
          </div>
          <div className="relative col-span-7 col-start-6 hidden lg:block">
            <div
              data-panel
              data-active="web"
              className="service-panel sticky top-[calc(var(--header-h)+6vh)] grid h-[calc(88vh-var(--header-h))] place-items-center [grid-template-areas:'d'] *:[grid-area:d]"
            >
              {sticky.map((s) => (
                <div key={s.id} data-demo={s.id} className="w-full pl-[8%]">
                  <DemoView id={s.id as keyof typeof demos} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <ServiceDeck />

        {/* 04: full-width automation flow */}
        <article aria-labelledby={`svc-${automation.id}`} className="mt-16 hidden border-t border-line pt-24 lg:block">
          <div className="grid-12 gap-y-8">
            <div className="label col-span-12 flex items-center gap-3 self-start text-mute lg:col-span-3">
              <span className="text-ice">{automation.number}</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              <h3 id={`svc-${automation.id}`}>{automation.title}</h3>
            </div>
            <p className="display-m col-span-12 max-w-[12ch] md:col-span-6 lg:col-span-4">{automation.tagline}</p>
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <p className="max-w-[48ch] text-paper/70">{automation.summary}</p>
              <ul className="mt-6 grid gap-x-6 gap-y-2 text-[0.9375rem] text-paper/85 xs:grid-cols-2">
                {automation.capabilities.map((c) => (
                  <li key={c} className="flex items-baseline gap-3">
                    <span aria-hidden className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-ice/70" />
                    {c}
                  </li>
                ))}
              </ul>
              <ButtonLink href="#contact" variant="text" className="mt-5" onClick={() => selectService("automation")}>
                {automation.cta}
              </ButtonLink>
            </div>
          </div>
          <div data-flow className="mt-14 md:mt-20">
            <AutomationFlow />
          </div>
        </article>
      </div>
    </section>
  );
}
