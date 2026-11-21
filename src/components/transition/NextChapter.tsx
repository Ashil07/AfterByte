"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { nextPage } from "@/content/pages";

/** Wheel distance (px) past the end of the page that carries you to the next one. */
const WHEEL_PULL = 900;
/** Finger travel (px) past the end on touch screens. */
const TOUCH_PULL = 320;
/** Pull drains away after this long without input (ms). */
const IDLE = 450;

/**
 * The last thing on the page. Keep scrolling once you reach the bottom and a
 * line fills; when it is full the next page opens (through the dot
 * transition). It is also a plain link, so clicking or tapping works, and the
 * keyboard (↓ / Page Down / Space) pulls it too. The pull lives in a ref and
 * is drawn straight to the DOM, never in React state.
 */
export function NextChapter() {
  const pathname = usePathname();
  const next = nextPage(pathname);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const bar = barRef.current;
    const title = titleRef.current;
    if (!link || !bar || !title) return;

    let pull = 0;
    let fired = false;
    let idle = 0;
    let touchY: number | null = null;
    const state = { p: 0 };

    const render = () => {
      bar.style.transform = `scaleX(${state.p})`;
      title.style.transform = `translateY(${-state.p * 18}px)`;
    };
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    const drain = () => {
      pull = 0;
      gsap.to(state, { p: 0, duration: 0.6, ease: "power3.out", onUpdate: render, overwrite: true });
    };

    const add = (amount: number) => {
      if (fired || !atBottom()) return;
      pull = Math.min(1, Math.max(0, pull + amount));
      gsap.to(state, { p: pull, duration: 0.25, ease: "power2.out", onUpdate: render, overwrite: true });
      window.clearTimeout(idle);
      if (pull >= 1) {
        fired = true;
        // A keyboard-style click (detail 0): the transition starts from the link.
        link.click();
        return;
      }
      idle = window.setTimeout(drain, IDLE);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return drain();
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      add(px / WHEEL_PULL);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = atBottom() ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      add((touchY - y) / TOUCH_PULL);
      touchY = y;
    };
    const onTouchEnd = () => {
      touchY = null;
      if (!fired) drain();
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) add(0.34);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(idle);
      gsap.killTweensOf(state);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [pathname]);

  if (!next) return null;
  return (
    <Link
      ref={linkRef}
      href={next.href}
      className="group block border-t border-line bg-ink-2"
    >
      <span className="frame flex min-h-[60svh] flex-col justify-between gap-16 pb-10 pt-14 md:pt-20">
        <span className="flex items-baseline justify-between gap-6">
          <span className="label text-mute">
            Keep scrolling
            <span className="block text-mute/70">
              or <span className="pointer-coarse:hidden">click</span>
              <span className="hidden pointer-coarse:inline">tap</span> to continue
            </span>
          </span>
          <span className="label text-mute">Next chapter</span>
        </span>
        <span className="flex items-end justify-between gap-6">
          <span ref={titleRef} className="display-xl block transition-colors duration-500 group-hover:text-ice">
            {next.title}
          </span>
          <ArrowRight
            aria-hidden
            strokeWidth={1}
            className="mb-3 size-10 shrink-0 transition-transform duration-500 ease-out-soft group-hover:translate-x-2 md:size-16"
          />
        </span>
        <span aria-hidden className="relative block h-px bg-line-strong">
          <span ref={barRef} className="absolute inset-0 origin-left bg-ice" style={{ transform: "scaleX(0)" }} />
        </span>
      </span>
    </Link>
  );
}
