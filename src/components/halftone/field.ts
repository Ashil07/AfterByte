/**
 * Halftone light fields. A field assigns every dot of the grid an intensity
 * (0..1, drives dot radius and brightness) and a tone (0 = warm white,
 * 1 = pale blue). Shapes are pure functions of normalised grid coordinates so
 * they can be rebuilt cheaply on resize and blended for transitions.
 */

export type FieldShape =
  | "hero" // logo-like diagonal light, dark centre for the wordmark
  | "closing" // mirrored hero, used at the end of the story
  | "sprout" // a seedling breaking the soil — starting something new
  | "tree" // a branching tree — growing a business
  | "cairn" // balanced stones over still water — simpler everyday work
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


/*
 * Illustrations for chapter 02, drawn as pure fields so they morph into each
 * other like every other shape. x is centred and aspect-corrected (card width
 * ≈ 0.8), y runs 0 (top) → 1 (bottom). Tone 0 = warm white, 1 = pale blue.
 */

/** Distance from p to the segment a→b. */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const ex = px - ax - t * dx;
  const ey = py - ay - t * dy;
  return Math.sqrt(ex * ex + ey * ey);
}

/** A pointed leaf from `base` along `angle` (radians, 0 = right, negative = up). */
function leaf(x: number, y: number, bx: number, by: number, angle: number, len: number, width: number) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const half = len / 2;
  const qx = (x - bx) * dx + (y - by) * dy - half;
  const qy = -(x - bx) * dy + (y - by) * dx;
  if (Math.abs(qx) >= half) return -1;
  const edge = width * (1 - (qx / half) ** 2);
  return Math.abs(qy) < edge ? (qx + half) / len : -1;
}

/** I — a seed in the soil, a curved stem and two leaves under a warm light. */
function sproutAt(x: number, y: number, u: number, ambient: number, seed: number): readonly [number, number] {
  let i = ambient * 0.5 + 0.34 * Math.exp(-(x * x + (y - 0.36) ** 2) / 0.035);
  let t = 0.08;
  const ground = 0.8 - 0.045 * Math.exp(-(x * x) / 0.05);
  if (y > ground) {
    i = Math.max(i, (0.2 + 0.3 * noise(u * 34, y * 34, seed + 5)) * (1 - Math.min(1, (y - ground) * 2.6)));
    t = 0.04;
  }
  if ((x / 0.045) ** 2 + ((y - 0.835) / 0.026) ** 2 < 1) return [0.95, 0];
  const stemTop = 0.47;
  const stemX = (yy: number) => 0.035 * Math.sin((0.83 - yy) * 7);
  if (y > stemTop && y < 0.83 && Math.abs(x - stemX(y)) < 0.009 + 0.004 * ((y - stemTop) / 0.36)) return [0.86, 0.7];
  const tx = stemX(stemTop);
  const right = leaf(x, y, tx, stemTop, -0.5, 0.24, 0.05);
  const left = leaf(x, y, tx, stemTop + 0.02, Math.PI + 0.62, 0.18, 0.04);
  const l = Math.max(right, left);
  if (l >= 0) return [0.52 + 0.42 * l, 0.85];
  return [clamp01(i), t];
}

type Branch = { ax: number; ay: number; bx: number; by: number; w: number };
let treeCache: { seed: number; branches: Branch[]; tips: [number, number][] } | null = null;

function treeParts(seed: number) {
  if (treeCache?.seed === seed) return treeCache;
  const branches: Branch[] = [];
  const tips: [number, number][] = [];
  const grow = (x: number, y: number, angle: number, len: number, w: number, depth: number) => {
    const bx = x + Math.cos(angle) * len;
    const by = y + Math.sin(angle) * len;
    branches.push({ ax: x, ay: y, bx, by, w });
    if (depth === 0) {
      tips.push([bx, by]);
      return;
    }
    const spread = 0.38 + 0.16 * hash(depth, branches.length, seed);
    const lean = (hash(branches.length, depth, seed + 3) - 0.5) * 0.24;
    grow(bx, by, angle - spread + lean, len * 0.74, w * 0.66, depth - 1);
    grow(bx, by, angle + spread + lean, len * 0.7, w * 0.66, depth - 1);
  };
  grow(0, 0.9, -Math.PI / 2, 0.22, 0.022, 6);
  treeCache = { seed, branches, tips };
  return treeCache;
}

/** II — a branching tree: trunk in warm light, canopy turning pale blue as it rises. */
function treeAt(x: number, y: number, u: number, ambient: number, seed: number): readonly [number, number] {
  const { branches, tips } = treeParts(seed);
  for (const b of branches) {
    if (segDist(x, y, b.ax, b.ay, b.bx, b.by) < b.w * 0.5 + 0.004) return [0.88, 0.12 + 0.5 * (0.9 - y)];
  }
  let canopy = 0;
  for (const [tx, ty] of tips) {
    const d = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2);
    if (d < 0.068) canopy = Math.max(canopy, 1 - d / 0.068);
  }
  if (canopy > 0 && noise(u * 40, y * 40, seed + 9) < 0.35 + canopy * 0.6) return [0.4 + 0.45 * canopy, 0.92];
  if (y > 0.9 && y < 0.92 && Math.abs(x) < 0.34) return [0.3, 0.2];
  return [clamp01(ambient * 0.5 + 0.14 * Math.exp(-(x * x + (y - 0.45) ** 2) / 0.09)), 0.6];
}

const stones = [
  { w: 0.19, h: 0.062, dx: 0 },
  { w: 0.15, h: 0.054, dx: 0.012 },
  { w: 0.115, h: 0.047, dx: -0.01 },
  { w: 0.083, h: 0.04, dx: 0.008 },
  { w: 0.052, h: 0.032, dx: -0.004 },
];
const WATER = 0.84;

/** Which stone (and its local -1..1 coords) covers a point, or null. */
function stoneAt(x: number, y: number) {
  let floor = WATER;
  for (const s of stones) {
    const cy = floor - s.h;
    const nx = (x - s.dx) / s.w;
    const ny = (y - cy) / (s.h * 0.9);
    if (Math.abs(nx) ** 2.4 + Math.abs(ny) ** 2.4 < 1) return { nx, ny };
    floor = cy - s.h;
  }
  return null;
}

/** III — balanced stones lit from the top-left, mirrored in still water, a pale moon. */
function cairnAt(x: number, y: number, u: number, ambient: number, seed: number): readonly [number, number] {
  const st = stoneAt(x, y);
  if (st) return [clamp01(0.42 + 0.42 * Math.max(0, -0.55 * st.nx - 0.8 * st.ny) + 0.08), 0.12];
  if ((x - 0.2) ** 2 + (y - 0.2) ** 2 < 0.05 ** 2) return [0.62, 0.9];
  if (y > WATER) {
    const mirrored = stoneAt(x + 0.006 * Math.sin(y * 90), 2 * WATER - y);
    if (mirrored && Math.sin(y * 260) > -0.2) return [0.2, 0.85];
    if (y < WATER + 0.012 && Math.abs(x) < 0.36) return [0.34, 0.6];
    return [clamp01(ambient * 0.4 + 0.08 * noise(u * 20, y * 60, seed)), 0.85];
  }
  return [clamp01(ambient * 0.5 + 0.1 * Math.exp(-((x - 0.2) ** 2 + (y - 0.2) ** 2) / 0.02)), 0.8];
}
export function fieldAt(shape: FieldShape, u: number, v: number, aspect: number, seed = 7): readonly [number, number] {
  const ambient = 0.05 + 0.06 * noise(u * 12, v * 12, seed + 11);
  switch (shape) {
    case "hero": {
      // Calm zone behind the headline so type stays legible: bottom-left on wide
      // screens, the whole lower band on portrait ones, where the copy spans the width.
      const [i, t] = heroAt(u, v, seed);
      const m = aspect < 1 ? smoothstep(0.46, 0.6, v) : smoothstep(0.5, 0.66, v) * (1 - smoothstep(0.42, 0.72, u));
      return [i * (1 - 0.78 * m), t];
    }
    case "closing": {
      // Mirrored opening; calm zone behind the closing headline (top-left).
      const [i, t] = heroAt(1 - u, 1 - v, seed + 4);
      const m = smoothstep(0.08, 0.2, v) * (1 - smoothstep(0.84, 0.92, v)) * (1 - smoothstep(0.45, 0.75, u));
      return [i * (1 - 0.8 * m), t];
    }
    case "sprout":
      return sproutAt((u - 0.5) * aspect, v, u, ambient, seed);
    case "tree":
      return treeAt((u - 0.5) * aspect, v, u, ambient, seed);
    case "cairn":
      return cairnAt((u - 0.5) * aspect, v, u, ambient, seed);
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
