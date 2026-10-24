"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import type { Principle } from "@/content/approach";
import { cn } from "@/lib/cn";

const titleClass = "font-serif text-[clamp(1.6rem,2.4vw,2.125rem)] leading-[1.05]";

/**
 * One principle in chapter 08. Desktop shows the explanation under the title;
 * below lg the title is a button and the explanation opens on tap, so the list
 * scans as six short headings.
 */
export function ApproachPrinciple({ principle, index }: { principle: Principle; index: number }) {
  const [open, setOpen] = useState(false);
  const panel = useId();

  return (
    <li data-principle className="relative grid grid-cols-[3rem_1fr] gap-x-4 border-line py-6 last:border-b md:grid-cols-[5rem_1fr] md:py-11">
      <span data-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
      <span data-numeral aria-hidden className="py-3 font-serif text-[2.25rem] leading-none text-mute md:text-[2.75rem] lg:py-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div data-copy>
        <div className="hidden lg:block">
          <h3 className={titleClass}>{principle.title}</h3>
          <p className="mt-3 max-w-[48ch] text-paper/70">{principle.body}</p>
        </div>

        <div className="lg:hidden">
          <h3 className={titleClass}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panel}
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-4 py-3 text-left"
            >
              {principle.title}
              <Plus
                aria-hidden
                className={cn("size-4 shrink-0 text-mute transition-transform duration-500 ease-out-soft", open && "rotate-45")}
              />
            </button>
          </h3>
          <div
            id={panel}
            inert={!open}
            className={cn("grid transition-[grid-template-rows] duration-500 ease-out-soft", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
          >
            <p className="overflow-hidden text-paper/70">
              <span className="block max-w-[48ch] pb-3">{principle.body}</span>
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
