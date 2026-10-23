"use client";

import { ArrowRight, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/**
 * Mobile-only bar pinned to the bottom of the screen so “Start a project” and
 * “Call” are always one tap away. It slides away while the contact section or
 * footer is on screen, so it never covers the form or its submit button.
 */
export function MobileActionBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => !!el,
    );
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      bar.dataset.hidden = String(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={barRef}
      data-hidden="false"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] transition-[transform,visibility] duration-500 ease-out-soft data-[hidden=true]:invisible data-[hidden=true]:translate-y-full motion-reduce:transition-none lg:hidden"
    >
      <nav aria-label="Quick contact" className="frame flex items-center gap-3 py-3">
        <a
          href="#contact-form"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2.5 rounded-[2px] bg-paper px-5 text-[0.9375rem] text-ink transition-colors duration-300 active:bg-ice"
        >
          Start a project
          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
        </a>
        {site.phone.tel && (
          <a
            href={`tel:${site.phone.tel}`}
            aria-label={`Call AfterByte on ${site.phone.display}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-line-strong px-4 text-[0.9375rem] text-paper transition-colors duration-300 active:border-paper/60"
          >
            <Phone aria-hidden strokeWidth={1.5} className="size-4" />
            Call
          </a>
        )}
      </nav>
    </div>
  );
}
