import { RevealText } from "@/components/motion/RevealText";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { principles } from "@/content/approach";
import { ApproachMotion } from "./ApproachMotion";
import { ApproachPrinciple } from "./ApproachPrinciple";
import { ApproachSignature } from "./ApproachSignature";

/**
 * 08 — Our approach. A sticky statement on the left; on the right four
 * principles, each replacing a line clients have heard elsewhere (struck through
 * as it is reached), signed off with the wordmark written like a signature.
 * Affordability is framed as precision, not discount. On mobile the principles
 * also enter one by one and each opens on tap (ApproachPrinciple).
 */
export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="relative border-t border-line bg-ink pb-28 pt-24 md:pb-40 md:pt-36">
      <div aria-hidden className="dot-texture pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <ApproachMotion className="frame relative grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <ChapterMark id="approach" />
            <RevealText id="approach-title" className="display-l mt-8 max-w-[12ch] md:mt-10">
              Great digital solutions should be within <em className="italic">reach.</em>
            </RevealText>
            <p className="mt-6 max-w-[30ch] text-paper/60 md:mt-8">
              Four promises we make in writing, so you can hold us to them.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <ol>
            {principles.map((p, i) => (
              <ApproachPrinciple key={p.title} principle={p} index={i} />
            ))}
          </ol>
          <ApproachSignature />
        </div>
      </ApproachMotion>
    </section>
  );
}
