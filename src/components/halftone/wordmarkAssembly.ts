import { sampleCoverage } from "./coverage";

/** Direction of the logo's light bands, bottom-left → top-right (as in field.ts). */
const DIR_X = 0.88;
const DIR_Y = -0.47;
const COLORS = ["rgba(237,230,218,0.95)", "rgb(246,246,243)"]; // warm edge, white core
/** Each dot travels for this share of the run; the rest is its start delay. */
const TRAVEL = 0.53;
/** Canvas overhang around the image, so dots drifting in are not clipped at its edge. */
const MARGIN = 220;

type Dot = { x: number; y: number; r: number; sx: number; sy: number; delay: number; band: number };

/**
 * Hero intro: the wordmark gathers out of halftone dots that drift in along the
 * logo's light direction, left letters first. The reverse of the footer, where
 * the letters break back into dots. Sizes a canvas over the rendered image and
 * returns draw(t) for t in 0..1 (driven by the opening timeline), or null when
 * the image cannot be measured yet.
 */
export function wordmarkAssembly(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = img.getBoundingClientRect();
  if (!ctx || !w || !h || !img.complete || !img.naturalWidth) return null;

  const pitch = Math.max(4, Math.round(w / 130));
  const cols = Math.ceil(w / pitch);
  const rows = Math.ceil(h / pitch);
  const cover = sampleCoverage(img, cols, rows, w, h, pitch);
  if (!cover) return null;

  const cw = w + MARGIN * 2;
  const ch = h + MARGIN * 2;
  Object.assign(canvas.style, {
    left: `${-MARGIN}px`,
    top: `${-MARGIN}px`,
    width: `${cw}px`,
    height: `${ch}px`,
  });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, MARGIN * dpr, MARGIN * dpr);

  // Seeded, so the intro looks the same on every visit.
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const dots: Dot[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const c = cover[j * cols + i];
      if (c < 0.08) continue;
      const x = (i + 0.5) * pitch;
      const y = (j + 0.5) * pitch;
      const along = 60 + 140 * rand();
      const across = (rand() - 0.5) * 50;
      dots.push({
        x,
        y,
        r: pitch * 0.5 * Math.sqrt(c),
        // Start further back along the light, slightly off its axis.
        sx: x - DIR_X * along - DIR_Y * across,
        sy: y - DIR_Y * along + DIR_X * across,
        delay: (x / w) * 0.35 + rand() * 0.12,
        band: c > 0.6 ? 1 : 0,
      });
    }
  }

  const draw = (t: number) => {
    ctx.clearRect(-MARGIN, -MARGIN, cw, ch);
    const paths = COLORS.map(() => new Path2D());
    for (const d of dots) {
      const p = (t - d.delay) / TRAVEL;
      if (p <= 0) continue;
      const e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); // expo out
      const x = d.sx + (d.x - d.sx) * e;
      const y = d.sy + (d.y - d.sy) * e;
      const r = d.r * (0.3 + 0.7 * e);
      paths[d.band].moveTo(x + r, y);
      paths[d.band].arc(x, y, r, 0, Math.PI * 2);
    }
    paths.forEach((path, k) => {
      ctx.fillStyle = COLORS[k];
      ctx.fill(path);
    });
  };

  const dispose = () => {
    canvas.width = 0;
    canvas.height = 0;
  };

  return { draw, dispose };
}
