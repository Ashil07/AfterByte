"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION, gsap, useGSAP } from "@/components/motion/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

/** Three compositions rotate so the portfolio never becomes a card grid. */
const layouts = [
  {
    image: "col-span-12 md:col-span-7 aspect-[4/3]",
    text: "col-span-12 md:col-span-4 md:col-start-9 md:self-end",
    hover: "group-hover/p:scale-[1.035]",
  },
  {
    image: "col-span-12 md:col-span-7 md:col-start-6 md:row-start-1 aspect-[16/10]",
    text: "col-span-12 md:col-span-4 md:col-start-1 md:row-start-1 md:self-center",
    hover: "group-hover/p:-translate-x-[1.5%] scale-[1.03]",
  },
  {
    image: "col-span-12 aspect-[16/10] md:aspect-[21/9]",
    text: "col-span-12 md:grid md:grid-cols-12 md:gap-x-8",
    hover: "group-hover/p:translate-y-[-1.5%] scale-[1.03]",
  },
];

function Entry({ project, index }: { project: Project; index: number }) {
  const l = layouts[index % layouts.length];
  const wide = index % layouts.length === 2;
  const rows: [string, string][] = [];
  if (project.problem) rows.push(["Problem", project.problem]);
  if (project.solution) rows.push(["Solution", project.solution]);
  if (project.technologies?.length) rows.push(["Built with", project.technologies.join(" · ")]);
  if (project.outcome) rows.push(["Outcome", project.outcome]);
  const pending = !project.placeholder && (!project.problem || !project.solution || !project.technologies?.length);

  return (
    <article data-project aria-labelledby={`p-${project.slug}`} className="group/p grid-12 gap-y-8">
      <div data-clip className={cn("relative overflow-hidden bg-ink-2", l.image)}>
        <div className={cn("absolute inset-0 transition-transform duration-[1.2s] ease-out-soft", l.hover)}>
          <div data-img className="absolute inset-0">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              style={project.image.position ? { objectPosition: project.image.position } : undefined}
            />
          </div>
        </div>
        {project.placeholder && <span className="label absolute bottom-3 left-3 bg-ink/80 px-2 py-1 text-mute">Placeholder image</span>}
      </div>

      <div className={l.text}>
        <div className={cn(wide && "md:col-span-4")}>
          <div data-line className="label flex flex-wrap items-center gap-3 text-mute">
            <span className="text-paper">P—{String(index + 1).padStart(2, "0")}</span>
            <span>{project.category}</span>
            {project.placeholder && <span className="border border-line-strong px-1.5 py-0.5 text-ice">Placeholder</span>}
          </div>
          <h3 id={`p-${project.slug}`} data-line className="mt-4 font-serif text-[clamp(2rem,3.4vw,3rem)] leading-none">
            {project.name}
          </h3>
          {project.url && (
            <a data-line href={project.url} target="_blank" rel="noopener" className="label mt-4 inline-block py-2 text-ice hover:text-paper">
              Visit project ↗
            </a>
          )}
        </div>
        {rows.length > 0 && (
          <dl className={cn("mt-6 space-y-4 text-[0.9375rem]", wide && "md:col-span-8 md:mt-0 md:grid md:grid-cols-3 md:gap-x-8 md:space-y-0")}>
            {rows.map(([k, v]) => (
              <div key={k} data-line className="border-t border-line pt-3">
                <dt className="label text-mute">{k}</dt>
                <dd className="mt-1.5 text-paper/75">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {pending && (
          <p data-line className={cn("label mt-6 border-t border-line pt-3 text-mute", wide && "md:col-span-8")}>
            Case study details to be added
          </p>
        )}
      </div>
    </article>
  );
}

/** 06 — Selected work. Content comes from src/content/projects.ts. */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const hasPlaceholders = projects.some((p) => p.placeholder);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        gsap.utils.toArray<HTMLElement>("[data-project]", el).forEach((project) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: project, start: "top 78%", once: true } });
          tl.fromTo(
            project.querySelector("[data-clip]"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: desktop ? 1.4 : 1, ease: "expo.inOut" },
          )
            .from(project.querySelector("[data-img]"), { scale: desktop ? 1.18 : 1.1, duration: 1.8, ease: "expo.out" }, "<0.2")
            .from(project.querySelectorAll("[data-line]"), { opacity: 0, y: 16, stagger: 0.07, duration: 0.8 }, "<0.3");
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="frame">
        <ChapterMark id="work" />
        <div className="grid-12 mt-8 gap-y-8 md:mt-10">
          <RevealText id="work-title" className="display-l col-span-12 max-w-[16ch] lg:col-span-9">
            Ideas are good. <em className="italic text-paper/60">Working solutions are better.</em>
          </RevealText>
          {hasPlaceholders && (
            <p className="col-span-12 max-w-[36ch] self-end text-paper/70 md:col-span-6 lg:col-span-3">
              We’re preparing detailed case studies. Until they’re published here, ask us and we’ll walk you
              through recent work.
            </p>
          )}
        </div>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-36">
          {projects.map((p, i) => (
            <Entry key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
