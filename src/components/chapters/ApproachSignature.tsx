import Image from "next/image";
import { site } from "@/content/site";

/**
 * The sign-off under the principles: the wordmark written out left to right
 * like a signature, with a pale-blue flourish beneath it. Both are drawn by
 * ApproachMotion; their natural state is fully visible (no JS, reduced motion).
 */
export function ApproachSignature() {
  return (
    <figure className="mt-16 md:mt-24">
      <figcaption className="label text-mute">Our word on every project</figcaption>
      <div className="relative mt-6 w-[min(22rem,80%)]">
        <div data-signature>
          <Image src="/brand/wordmark.png" alt="AfterByte" width={1706} height={514} className="h-auto w-full" />
        </div>
        <svg aria-hidden viewBox="0 0 400 28" fill="none" className="mt-1 w-full overflow-visible text-ice">
          <path
            data-flourish
            pathLength={1}
            d="M4 20 C 70 6, 150 4, 228 14 S 338 26, 396 6"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="1"
          />
          {/* The pen tip: rides the end of the line while scrolling draws it. Hidden at rest. */}
          <circle data-nib r={4} fill="currentColor" opacity={0} />
        </svg>
      </div>
      <p className="label mt-4 text-mute/80">
        The AfterByte team · {site.location.city}
      </p>
    </figure>
  );
}
