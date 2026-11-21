"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { MOTION, gsap } from "@/components/motion/gsap";
import { pageTitle } from "@/content/pages";
import { visibleById } from "@/lib/dom";

/** Grid pitch of the transition dots, in CSS pixels. */
const PITCH = 26;
/** Dot radius at full size; above √2/2 of the pitch, neighbours overlap into a solid sheet. */
const FULL = PITCH * 0.72;

type State = { busy: boolean; covered: boolean; x: number; y: number; fallback: number; hash: string };

/**
 * Page transitions. Clicking a link to another page grows halftone dots out
 * from the click until they cover the screen (the destination's name shows on
 * the sheet), the route changes underneath, then the dots shrink away from the
 * same point to reveal the new page.
 *
 * One capture-phase click listener handles every internal link — plain <a>
 * and next/link alike (Link skips clicks that are already defaultPrevented).
 * Same-page hash links, new tabs, modified clicks and downloads are left alone.
 * Back/forward and reduced motion navigate without the cover.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const state = useRef<State>({ busy: false, covered: false, x: 0, y: 0, fallback: 0, hash: "" });
  const revealRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const label = labelRef.current;
    const s = state.current;
    if (!canvas || !label) return;

    /** p: 0..1. Cover grows dots out from the origin; reveal shrinks them from it. */
    const draw = (p: number, mode: "cover" | "reveal") => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim() || "#f5f5f2";
      const maxD = Math.max(
        Math.hypot(s.x, s.y),
        Math.hypot(w - s.x, s.y),
        Math.hypot(s.x, h - s.y),
        Math.hypot(w - s.x, h - s.y),
      );
      ctx.beginPath();
      for (let y = PITCH / 2; y < h + PITCH; y += PITCH) {
        for (let x = PITCH / 2; x < w + PITCH; x += PITCH) {
          const t = Math.min(1, Math.max(0, (p - (Math.hypot(x - s.x, y - s.y) / maxD) * 0.55) / 0.45));
          const eased = 1 - (1 - t) * (1 - t);
          const r = (mode === "cover" ? eased : 1 - eased) * FULL;
          if (r < 0.3) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    // Visible canvas also blocks clicks while the transition runs.
    const show = (visible: boolean) => {
      canvas.style.visibility = visible ? "visible" : "hidden";
    };

    const reveal = () => {
      window.clearTimeout(s.fallback);
      if (!s.covered) return;
      s.covered = false;
      gsap.to(label, { opacity: 0, y: -12, duration: 0.3, ease: "power2.in", overwrite: true });
      const o = { p: 0 };
      gsap.to(o, {
        p: 1,
        duration: 0.9,
        delay: 0.15,
        ease: "power2.out",
        onUpdate: () => draw(o.p, "reveal"),
        onComplete: () => {
          show(false);
          gsap.set(label, { opacity: 0 });
          s.busy = false;
        },
      });
    };
    revealRef.current = reveal;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      e.preventDefault();
      if (s.busy) return;
      const href = url.pathname + url.search + url.hash;
      s.hash = url.hash.slice(1);
      // Window scroll is shared by every page: start the next one at the top
      // *before* it mounts. Otherwise it mounts scrolled to wherever this page
      // was (e.g. the bottom of Contact), its one-time scroll animations fire
      // and remove themselves while ScrollTrigger is still setting them up, and
      // ScrollTrigger throws. A hash link jumps to its section afterwards.
      const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (window.matchMedia(MOTION.reduced).matches) {
        toTop();
        router.push(href);
        return;
      }
      s.busy = true;
      // Keyboard activation has no pointer position: start from the link itself.
      const box = a.getBoundingClientRect();
      s.x = e.detail === 0 ? box.left + box.width / 2 : e.clientX;
      s.y = e.detail === 0 ? box.top + box.height / 2 : e.clientY;
      router.prefetch(href);
      label.textContent = pageTitle(url.pathname);
      gsap.set(label, { opacity: 0, y: 16 });
      show(true);
      const o = { p: 0 };
      gsap.to(o, {
        p: 1,
        duration: 0.75,
        ease: "power2.in",
        onUpdate: () => draw(o.p, "cover"),
        onComplete: () => {
          s.covered = true;
          gsap.to(label, { opacity: 1, y: 0, duration: 0.45, ease: "expo.out", overwrite: true });
          toTop();
          router.push(href);
          // If the route never settles (error, offline), don't leave the screen covered.
          s.fallback = window.setTimeout(reveal, 5000);
        },
      });
    };

    // Back / forward: same reason as toTop() above — the page being restored
    // must not mount at the old page's scroll position. Runs before React
    // commits the route change (Next renders it in a later task).
    const onPop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // While the cover is up, leftover wheel / swipe momentum must not scroll
    // the page underneath (it would carry on into the next page).
    const hold = (e: Event) => {
      if (s.busy) e.preventDefault();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    window.addEventListener("wheel", hold, { passive: false });
    window.addEventListener("touchmove", hold, { passive: false });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("wheel", hold);
      window.removeEventListener("touchmove", hold);
      window.clearTimeout(s.fallback);
    };
  }, [router]);

  // The new page has rendered under the cover: jump to the linked section
  // (e.g. /#services, once its layout and pin spacing exist), then reveal.
  useEffect(() => {
    const s = state.current;
    if (!s.covered && !s.hash) return;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    const finish = () => {
      s.hash = "";
      revealRef.current();
    };
    if (!s.hash) {
      // Next's own post-navigation scroll can land mid-page on phones; the
      // new page always opens at its top, so settle there before revealing.
      later(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        finish();
      }, 60);
    } else {
      // The section may not be laid out yet, and ScrollTrigger resets the scroll
      // while it adds pin spacing. Wait for the element, let the layout settle,
      // jump (again after the refreshes), then reveal. Gives up after ~2s.
      const started = performance.now();
      const seek = () => {
        const el = visibleById(s.hash);
        if (!el && performance.now() - started < 2000) return later(seek, 50);
        const jump = () => visibleById(s.hash)?.scrollIntoView({ behavior: "instant" });
        later(jump, 250);
        later(() => {
          jump();
          finish();
        }, 600);
      };
      seek();
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <canvas ref={canvasRef} style={{ visibility: "hidden" }} className="pointer-events-auto absolute inset-0 h-full w-full" />
      <p ref={labelRef} className="display-l frame absolute inset-x-0 bottom-[12vh] text-ink opacity-0" />
    </div>
  );
}
