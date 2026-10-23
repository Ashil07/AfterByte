/**
 * Halftone light fields. A field assigns every dot of the grid an intensity
 * (0..1, drives dot radius and brightness) and a tone (0 = warm white,
 * 1 = pale blue). Shapes are pure functions of normalised grid coordinates so
 * they can be rebuilt cheaply on resize and blended for transitions.
 */

export type FieldShape =
  | "hero" // logo-like diagonal light, dark centre for the wordmark
  | "closing" // mirrored hero, used at the end of the story
  | "seed" // one point of light — starting something new
  | "growth" // rising columns — growing a business
  | "order" // tidy modules — simpler everyday work
  | "scatter" // noisy, disconnected — the problem
  | "strata"; // three aligned bands — website, software, automation

export type Field = { intensity: Float32Array; tone: Float32Array };

function hash(x: number, y: number, seed: number) {
  let h = x * 374761393 + y * 668265263 + seed * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** Smooth 2D value noise in roughly 0..1. */
export function noise(x: number, y: number, seed = 1) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function smoothstep(e0: number, e1: number, x: number) {
  return smooth(clamp01((x - e0) / (e1 - e0)));
}

/** Elongated gaussian blob oriented along the logo's light direction. */
function blob(u: number, v: number, cu: number, cv: number, along: number, across: number) {
  // Direction of the light bands in the logo: bottom-left → top-right.
  const dx = 0.88;
  const dy = -0.47;
  const pu = u - cu;
  const pv = v - cv;
  const a = pu * dx + pv * dy;
  const c = -pu * dy + pv * dx;
  return Math.exp(-((a * a) / (2 * along * along) + (c * c) / (2 * across * across)));
}

function heroAt(u: number, v: number, seed: number) {
  const n = noise(u * 5, v * 5, seed);
  const fine = noise(u * 14, v * 14, seed + 3);
  let i =
    1.0 * blob(u, v, 0.06, 0.66, 0.22, 0.085) +
    0.9 * blob(u, v, 0.8, 0.27, 0.3, 0.09) +
    0.55 * blob(u, v, 0.42, 0.93, 0.2, 0.07) +
    0.35 * blob(u, v, 0.22, 0.1, 0.18, 0.06) +
    0.4 * blob(u, v, 1.02, 0.78, 0.18, 0.08);
  i = i * (0.62 + 0.55 * n) + 0.07 + 0.1 * fine;
  // Keep the centre dark so the wordmark reads, like the original artwork.
  const cx = (u - 0.5) / 0.3;
  const cy = (v - 0.5) / 0.13;
  i *= 1 - 0.78 * Math.exp(-(cx * cx + cy * cy));
  const tone = clamp01(smoothstep(0.38, 0.72, noise(u * 3 + 9, v * 3, seed + 5)) * (1.05 - 0.55 * clamp01(i)));
  return [clamp01(i), tone] as const;
}

export function fieldAt(shape: FieldShape, u: number, v: number, aspect: number, seed = 7): readonly [number, number] {
  const ambient = 0.05 + 0.06 * noise(u * 12, v * 12, seed + 11);
  switch (shape) {
    case "hero": {
      // Calm zone behind the headline (bottom-left) so type stays legible.
      const [i, t] = heroAt(u, v, seed);
      const m = smoothstep(0.5, 0.66, v) * (1 - smoothstep(0.42, 0.72, u));
      return [i * (1 - 0.78 * m), t];
    }
    case "closing": {
      // Mirrored opening; calm zone behind the closing headline (top-left).
      const [i, t] = heroAt(1 - u, 1 - v, seed + 4);
      const m = smoothstep(0.08, 0.2, v) * (1 - smoothstep(0.84, 0.92, v)) * (1 - smoothstep(0.45, 0.75, u));
      return [i * (1 - 0.8 * m), t];
    }
    case "seed": {
      const x = (u - 0.5) * aspect;
      const y = v - 0.55;
      const d = Math.sqrt(x * x + y * y);
      const core = Math.exp(-(d * d) / 0.012);
      const halo = 0.22 * Math.exp(-(d * d) / 0.08);
      return [clamp01(core + halo + ambient * 0.6), clamp01(0.25 + 0.6 * d)];
    }
    case "growth": {
      const bars = 5;
      const left = 0.14;
      const right = 0.86;
      const slot = (right - left) / bars;
      const k = Math.floor((u - left) / slot);
      let i = ambient * 0.7;
      if (k >= 0 && k < bars) {
        const local = (u - left - k * slot) / slot;
        const inBar = local > 0.18 && local < 0.82 ? 1 : 0;
        const top = 0.78 - (k + 1) * 0.12;
        if (inBar && v > top && v < 0.84) i = 0.5 + 0.5 * smoothstep(top, top + 0.06, v) * (0.55 + k * 0.1);
      }
      return [clamp01(i), clamp01(0.2 + u * 0.7)];
    }
    case "order": {
      const cols = 3;
      const rows = 2;
      const gu = (u - 0.12) / 0.76;
      const gv = (v - 0.22) / 0.56;
      let i = ambient * 0.6;
      if (gu > 0 && gu < 1 && gv > 0 && gv < 1) {
        const cu = (gu * cols) % 1;
        const cv = (gv * rows) % 1;
        if (cu > 0.1 && cu < 0.9 && cv > 0.12 && cv < 0.88) i = 0.62 + 0.18 * (1 - cv);
      }
      return [clamp01(i), 0.55];
    }
    case "scatter": {
      const r = hash(Math.floor(u * 400), Math.floor(v * 400), seed);
      const patch = noise(u * 6, v * 6, seed + 2);
      const i = r > 0.72 ? 0.35 + 0.6 * patch : ambient + 0.25 * patch * r;
      return [clamp01(i), clamp01(r)];
    }
    case "strata": {
      let i = ambient * 0.5;
      // Band centres line up with the three rows of copy beside the figure.
      for (const c of [1 / 6, 1 / 2, 5 / 6]) {
        const d = Math.abs(v - c);
        if (d < 0.06 && u > 0.08 && u < 0.92) i = Math.max(i, 0.88 - d * 4);
      }
      // Faint vertical connectors between the bands.
      for (const c of [0.3, 0.7]) {
        if (Math.abs(u - c) < 0.012 && v > 1 / 6 && v < 5 / 6) i = Math.max(i, 0.42);
      }
      return [clamp01(i), clamp01(0.35 + 0.3 * u)];
    }
  }
}

export function buildField(shape: FieldShape, cols: number, rows: number, aspect: number, seed = 7): Field {
  const n = cols * rows;
  const intensity = new Float32Array(n);
  const tone = new Float32Array(n);
  for (let j = 0; j < rows; j++) {
    const v = (j + 0.5) / rows;
    for (let i = 0; i < cols; i++) {
      const u = (i + 0.5) / cols;
      const [a, t] = fieldAt(shape, u, v, aspect, seed);
      intensity[j * cols + i] = a;
      tone[j * cols + i] = t;
    }
  }
  return { intensity, tone };
}
