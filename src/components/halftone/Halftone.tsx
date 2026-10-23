"use client";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import { HalftoneEngine } from "./engine";
import type { FieldShape } from "./field";
import { cn } from "@/lib/cn";

export type HalftoneHandle = {
  /** Blend between `shape` and `morphTo`, 0..1. Safe to call every scroll frame. */
  setMorph: (p: number) => void;
  setIllumination: (v: number) => void;
  transitionTo: (shape: FieldShape, duration?: number) => void;
};

type Props = {
  /** Starting field. Changing it later animates to the new shape. */
  shape: FieldShape;
  /** Optional second field for scroll-driven morphs via `setMorph`. */
  morphTo?: FieldShape;
  /** Pointer-following light (desktop, fine pointer, motion allowed). */
  interactive?: boolean;
  /** Light sweeps in from the bottom-left on mount. */
  intro?: boolean;
  /** Grid pitch in CSS pixels. */
  spacing?: number;
  seed?: number;
  illumination?: number;
  className?: string;
  ref?: Ref<HalftoneHandle>;
};

/**
 * Decorative halftone light, drawn on a canvas. Always aria-hidden — it never
 * carries information that is not also in the text.
 */
export function Halftone({
  shape,
  morphTo,
  interactive = false,
  intro = false,
  spacing = 11,
  seed = 7,
  illumination = 1,
  className,
  ref,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HalftoneEngine | null>(null);
  const initial = useRef({ shape, morphTo, interactive, intro, spacing, seed, illumination });

  // Layout effect so the engine exists before parents' useGSAP callbacks
  // (also layout effects, which run after children’s) try to drive it.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let engine: HalftoneEngine | null = null;
    try {
      engine = new HalftoneEngine(canvas, initial.current);
    } catch {
      return; // no canvas support: the section simply has no texture
    }
    engineRef.current = engine;
    return () => {
      engine?.destroy();
      engineRef.current = null;
    };
  }, []);

  const shown = useRef(shape);
  useEffect(() => {
    if (shape === shown.current) return;
    shown.current = shape;
    engineRef.current?.transitionTo(shape);
  }, [shape]);

  useImperativeHandle(
    ref,
    () => ({
      setMorph: (p) => engineRef.current?.setMorph(p),
      setIllumination: (v) => engineRef.current?.setIllumination(v),
      transitionTo: (s, d) => engineRef.current?.transitionTo(s, d),
    }),
    [],
  );

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none block h-full w-full", className)} />;
}
