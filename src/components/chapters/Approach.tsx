import { RevealText } from "@/components/motion/RevealText";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { principles } from "@/content/approach";

/**
 * 08 — Our approach. Deliberately quiet: a sticky statement on the left, six
 * principles on the right. Affordability is framed as precision, not discount.
 */
export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="relative border-t border-line bg-ink-2 pb-28 pt-24 md:pb-40 md:pt-36">
      <div aria-hidden className="dot-texture pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="frame relative grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <ChapterMark id="approach" />
            <RevealText id="approach-title" className="display-l mt-8 max-w-[12ch] md:mt-10">
              Great digital solutions should be within <em className="italic">reach.</em>
            </RevealText>
            <p className="mt-8 max-w-[42ch] text-paper/70">
              Affordable shouldn’t mean cutting corners. It means not paying for what you don’t need. We scope
              each project around the outcome you’re after, agree the price before work begins, and then build it
              properly.
            </p>
          </div>
        </div>

        <ol className="col-span-12 lg:col-span-6 lg:col-start-7">
          {principles.map((p, i) => (
            <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-9 last:border-b md:grid-cols-[5rem_1fr] md:py-11">
              <span aria-hidden className="font-serif text-[2.25rem] leading-none text-mute md:text-[2.75rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-[clamp(1.6rem,2.4vw,2.125rem)] leading-[1.05]">{p.title}</h3>
                <p className="mt-3 max-w-[48ch] text-paper/70">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
