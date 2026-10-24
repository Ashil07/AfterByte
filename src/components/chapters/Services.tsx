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
 * Automation follows as a full-width flow. Mobile: each demo sits under its
 * copy and assembles once on entry. Reduced motion: demos in final state.
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

      mm.add(MOTION.mobile, () => {
        q<HTMLElement>("[data-inline-demo]").forEach((demoEl) => {
          const id = demoEl.dataset.inlineDemo as keyof typeof demos;
          const tl = prime(demos[id].assemble(demoEl));
          ScrollTrigger.create({ trigger: demoEl, start: "top 75%", once: true, onEnter: () => tl.play() });
        });
        const flowEl = q("[data-flow]")[0];
        const flow = prime(assembleFlow(flowEl));
        ScrollTrigger.create({ trigger: flowEl, start: "top 70%", once: true, onEnter: () => flow.duration(3.2).play() });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="relative border-t border-line bg-ink-2 pb-28 pt-24 md:pb-40 md:pt-32">
      <div className="frame">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <ChapterMark id="services" />
            <RevealText id="services-title" className="display-l mt-8 max-w-[13ch] md:mt-10">
              Four ways to get <em className="italic">there.</em>
            </RevealText>
          </div>
          <p className="col-span-12 max-w-[40ch] self-end text-paper/70 md:col-span-6 lg:col-span-4 lg:col-start-9">
            We start with the problem, not the technology. Website development, app development, business software
            and automation — often combined.
          </p>
        </div>

        {/* 01–03: copy + sticky demo panel */}
        <div className="grid-12 mt-16 md:mt-24">
          {/* Bottom padding keeps the sticky panel in place while the last block is read. */}
          <div className="col-span-12 lg:col-span-5 lg:pb-[18vh]">
            {sticky.map((s) => (
              <article
                key={s.id}
                data-service-block={s.id}
                aria-labelledby={`svc-${s.id}`}
                className="flex flex-col gap-10 border-t border-line py-14 lg:min-h-[88vh] lg:justify-center lg:border-0 lg:py-20"
              >
                <ServiceText service={s} />
                <div data-inline-demo={s.id} className="lg:hidden">
                  <DemoView id={s.id as keyof typeof demos} />
                </div>
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

        {/* 04: full-width automation flow */}
        <article aria-labelledby={`svc-${automation.id}`} className="mt-10 border-t border-line pt-14 md:mt-16 lg:pt-24">
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
