"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FillLayer } from "@/components/ui/Button";
import { site, whatsappHref } from "@/content/site";
import { visibleById } from "@/lib/dom";

/**
 * Mobile-only bar pinned to the bottom of the screen so “Start a project” and
 * “Call” / “WhatsApp” are always one tap away. It slides away while the contact section or
 * footer is on screen, so it never covers the form or its submit button.
 */
export function MobileActionBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const targets = [visibleById("contact"), document.querySelector("footer")].filter(
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
    bar.dataset.hidden = "false";
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // Re-observe after client-side navigation: the old targets are gone.
  }, [pathname]);

  return (
    <div
      ref={barRef}
      data-hidden="false"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] transition-[translate,visibility] duration-500 ease-out-soft data-[hidden=true]:invisible data-[hidden=true]:translate-y-full motion-reduce:transition-none lg:hidden"
    >
      <nav aria-label="Quick contact" className="frame flex items-center gap-2 py-3">
        <Link
          href="/contact"
          data-fill
          className="relative inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-[2px] bg-paper px-4 text-[0.9375rem] text-ink transition-[background-color,scale] duration-150 ease-out-soft [--fill:var(--color-ice)] *:not-first:relative active:scale-[0.97] active:bg-ice"
        >
          <FillLayer />
          <span>Start a project</span>
          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 max-xs:hidden" />
        </Link>
        {site.phone.tel && (
          <a
            href={`tel:${site.phone.tel}`}
            data-fill
            aria-label={`Call AfterByte on ${site.phone.display}`}
            className="relative inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-[2px] border border-line-strong px-4 text-[0.9375rem] text-paper isolate transition-[border-color,scale] duration-150 ease-out-soft [--fill:var(--color-paper)] [&>svg]:relative [&>svg]:mix-blend-difference active:scale-[0.97] active:border-paper/60"
          >
            <FillLayer />
            <Phone aria-hidden strokeWidth={1.5} className="size-4" />
            <span className="relative mix-blend-difference max-xs:sr-only">Call</span>
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            data-fill
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with AfterByte on WhatsApp (opens WhatsApp)"
            className="relative inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border border-line-strong px-3.5 text-[0.9375rem] text-paper isolate transition-[border-color,scale] duration-150 ease-out-soft [--fill:var(--color-paper)] *:not-first:relative *:not-first:mix-blend-difference active:scale-[0.97] active:border-paper/60"
          >
            <FillLayer />
            <MessageCircle aria-hidden strokeWidth={1.5} className="size-4" />
            <span>WhatsApp</span>
          </a>
        )}
      </nav>
    </div>
  );
}
