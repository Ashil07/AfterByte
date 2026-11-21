"use client";

import { useEffect } from "react";
import { MOTION, gsap } from "@/components/motion/gsap";

const SELECTOR = "[data-fill]";

/** The disc's position and size so that, centred on (x, y), it covers the whole button. */
function geometry(button: Element, clientX?: number, clientY?: number) {
  const r = button.getBoundingClientRect();
  const x = clientX === undefined ? r.width / 2 : gsap.utils.clamp(0, r.width, clientX - r.left);
  const y = clientY === undefined ? r.height / 2 : gsap.utils.clamp(0, r.height, clientY - r.top);
  const size = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) + 4;
  return { x, y, size };
}

/**
 * Button hover fill. Entering a [data-fill] button grows a disc from the exact
 * point the pointer came in until it floods the button; leaving shrinks it
 * away towards where the pointer left. Keyboard focus fills from the centre.
 * Mouse only (touch would leave it stuck); reduced motion swaps instantly.
 * One set of document listeners covers every button, so Button stays a
 * server component.
 */
export function HoverFill() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const instant = () => window.matchMedia(MOTION.reduced).matches;
    const disc = (button: Element) => button.querySelector<HTMLElement>(":scope > .btn-fill > [data-fill-disc]");

    const fill = (button: Element, cx?: number, cy?: number) => {
      const el = disc(button);
      if (!el) return;
      const { x, y, size } = geometry(button, cx, cy);
      // Starting from empty: begin at the entry point; mid-drain: carry on from where it is.
      if (Number(gsap.getProperty(el, "scale")) < 0.01) gsap.set(el, { x: x - size / 2, y: y - size / 2 });
      gsap.set(el, { width: size, height: size });
      gsap.to(el, { x: x - size / 2, y: y - size / 2, scale: 1, duration: instant() ? 0 : 0.6, ease: "power3.out", overwrite: true });
    };
    const drain = (button: Element, cx?: number, cy?: number) => {
      const el = disc(button);
      if (!el) return;
      const { x, y } = geometry(button, cx, cy);
      const size = Number(gsap.getProperty(el, "width"));
      gsap.to(el, { x: x - size / 2, y: y - size / 2, scale: 0, duration: instant() ? 0 : 0.55, ease: "power2.inOut", overwrite: true });
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      const button = (e.target as Element | null)?.closest?.(SELECTOR);
      if (button && !button.contains(e.relatedTarget as Node | null)) fill(button, e.clientX, e.clientY);
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const button = (e.target as Element | null)?.closest?.(SELECTOR);
      if (button && !button.contains(e.relatedTarget as Node | null)) drain(button, e.clientX, e.clientY);
    };
    const onFocusIn = (e: FocusEvent) => {
      const button = (e.target as Element | null)?.closest?.(SELECTOR);
      if (button?.matches(":focus-visible")) fill(button);
    };
    const onFocusOut = (e: FocusEvent) => {
      const button = (e.target as Element | null)?.closest?.(SELECTOR);
      if (button && !button.matches(":hover")) drain(button);
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return null;
}
