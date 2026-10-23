import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Wrapper for service demos. Sizes everything inside in `em`, derived from the
 * container width, so a demo scales like an image at any viewport. Demos are
 * illustrations: hidden from assistive tech, described by the caption.
 */
export function DemoShell({ children, caption, className }: { children: ReactNode; caption: string; className?: string }) {
  return (
    <figure className="w-full [container-type:inline-size]">
      <div aria-hidden className={cn("relative w-full overflow-hidden text-[clamp(7px,1.55cqw,13px)] leading-snug", className)}>
        {children}
      </div>
      <figcaption className="label mt-3 text-mute">{caption}</figcaption>
    </figure>
  );
}
