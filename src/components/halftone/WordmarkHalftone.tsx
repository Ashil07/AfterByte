"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { FINE_POINTER } from "@/components/motion/gsap";

const SRC = "/brand/wordmark.png";
/** Grid pitch, reach of the cursor and how far dots bulge away from it (CSS px). */
const PITCH = 8;
const REACH = 170;
const PUSH = 9;
/** Supersampling used when measuring how much of each cell the letters cover. */
const SS = 4;

const COLORS = [
  "rgba(146,148,157,0.35)", // grid dots outside the letters
  "rgba(237,230,218,0.97)", // warm, outer ring
  "rgb(246,246,243)", // white, under the cursor
];

/**
 * The footer wordmark, with the opening scene reversed: in the hero solid
 * letters sit over halftone light; here the letters themselves turn into
 * halftone dots under the cursor and bulge away from it, then close back into
 * solid type. Fine pointer + motion allowed only; otherwise it is a plain image.
 * Draws on demand (one rAF chain while the effect is settling), like the engine.
 */
export function WordmarkHalftone() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const allowed = window.matchMedia(`${FINE_POINTER} and (prefers-reduced-motion: no-preference)`);

    let img: HTMLImageElement | null = null;
    let cover: Float32Array | null = null;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    const p = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };

    const measureCover = () => {
      if (!img?.complete || !w || !h) return;
      const sw = cols * SS;
      const sh = rows * SS;
      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, (w / PITCH) * SS, (h / PITCH) * SS);
      const data = octx.getImageData(0, 0, sw, sh).data;
      cover = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let sum = 0;
          for (let y = 0; y < SS; y++) {
            const row = (j * SS + y) * sw;
            for (let x = 0; x < SS; x++) sum += data[(row + i * SS + x) * 4 + 3];
          }
          cover[j * cols + i] = sum / (SS * SS * 255);
        }
      }
    };

    const resize = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / PITCH);
      rows = Math.ceil(h / PITCH);
      measureCover();
    };

    const solid = el.querySelector("img");
    /** Open the solid letters around the cursor so the dots show through. */
    const mask = (on: boolean) => {
      if (!solid) return;
      const value = on
        ? `radial-gradient(circle ${(REACH * p.s).toFixed(1)}px at ${p.x}px ${p.y}px, transparent 0%, transparent 62%, #000 92%)`
        : "";
      solid.style.maskImage = value;
      solid.style.setProperty("-webkit-mask-image", value);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const on = !!cover && p.s >= 0.003;
      mask(on);
      if (!on || !cover) return;

      const paths = COLORS.map(() => new Path2D());
      const i0 = Math.max(0, Math.floor((p.x - REACH) / PITCH));
      const i1 = Math.min(cols - 1, Math.ceil((p.x + REACH) / PITCH));
      const j0 = Math.max(0, Math.floor((p.y - REACH) / PITCH));
      const j1 = Math.min(rows - 1, Math.ceil((p.y + REACH) / PITCH));
      for (let j = j0; j <= j1; j++) {
        const cy = (j + 0.5) * PITCH;
        for (let i = i0; i <= i1; i++) {
          const cx = (i + 0.5) * PITCH;
          const dx = cx - p.x;
          const dy = cy - p.y;
          const d = Math.hypot(dx, dy);
          if (d >= REACH) continue;
          const f = 1 - d / REACH;
          // Dots hold their full size over most of the reach and only shrink in
          // the outer band, where the solid letters fade back in (see mask()).
          const g = f >= 0.45 ? 1 : f / 0.45;
          const e = g * g * (3 - 2 * g) * p.s;
          const push = d > 0.001 ? (PUSH * f * f * p.s) / d : 0;
          const x = cx + dx * push;
          const y = cy + dy * push;
          const c = cover[j * cols + i];
          let r: number;
          let band: number;
          if (c < 0.04) {
            r = 0.9 * e;
            band = 0;
          } else {
            r = PITCH * 0.5 * Math.sqrt(c) * e;
            band = f > 0.55 ? 2 : 1;
          }
          if (r < 0.35) continue;
          paths[band].moveTo(x + r, y);
          paths[band].arc(x, y, r, 0, Math.PI * 2);
        }
      }
      paths.forEach((path, k) => {
        ctx.fillStyle = COLORS[k];
        ctx.fill(path);
      });
    };

    const frame = () => {
      raf = 0;
      p.x += (p.tx - p.x) * 0.2;
      p.y += (p.ty - p.y) * 0.2;
      p.s += (p.ts - p.s) * 0.12;
      if (p.ts === 0 && p.s < 0.003) p.s = 0;
      draw();
      const settling = Math.abs(p.tx - p.x) > 0.3 || Math.abs(p.ty - p.y) > 0.3 || Math.abs(p.ts - p.s) > 0.003;
      if (settling) raf = requestAnimationFrame(frame);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const local = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      p.tx = e.clientX - rect.left;
      p.ty = e.clientY - rect.top;
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !allowed.matches) return;
      if (!img) {
        img = new window.Image();
        img.onload = () => {
          measureCover();
          request();
        };
        img.src = SRC;
      }
      local(e);
      if (p.s < 0.01) {
        p.x = p.tx;
        p.y = p.ty;
      }
      p.ts = 1;
      request();
    };
    const move = (e: PointerEvent) => {
      if (p.ts !== 1) return;
      local(e);
      request();
    };
    const leave = () => {
      p.ts = 0;
      request();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      mask(false);
      ro.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={wrap} className="relative mt-20 md:mt-28">
      <Image
        src={SRC}
        alt="AfterByte"
        width={1706}
        height={514}
        sizes="(min-width: 1600px) 1500px, 92vw"
        className="h-auto w-full select-none opacity-95"
      />
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
