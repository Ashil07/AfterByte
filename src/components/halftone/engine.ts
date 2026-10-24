import { gsap } from "@/components/motion/gsap";
import { buildField, type Field, type FieldShape } from "./field";

export type EngineOptions = {
  shape: FieldShape;
  morphTo?: FieldShape;
  interactive: boolean;
  intro: boolean;
  spacing: number;
  seed: number;
  illumination: number;
};

const LEVELS = 6;
const WARM = [237, 230, 218];
const ICE = [167, 200, 232];
const WHITE = [246, 246, 243];

function palette() {
  const styles: string[] = [];
  for (const base of [WARM, ICE]) {
    for (let l = 0; l < LEVELS; l++) {
      const t = (l + 1) / LEVELS;
      const c = l === LEVELS - 1 ? WHITE : base;
      styles.push(`rgba(${c[0]},${c[1]},${c[2]},${(0.16 + 0.84 * Math.pow(t, 1.25)).toFixed(3)})`);
    }
  }
  return styles;
}

/**
 * Canvas halftone renderer. Draws on demand only: intro sweep, transitions,
 * pointer movement, scroll-driven morphs and resizes each request a single
 * animation frame. When nothing changes, nothing runs.
 */
export class HalftoneEngine {
  private ctx: CanvasRenderingContext2D;
  private styles = palette();
  private cols = 0;
  private rows = 0;
  private w = 0;
  private h = 0;
  private pitch = 0;
  private ox = 0;
  private oy = 0;
  private from: Field | null = null;
  private to: Field | null = null;
  private fromShape: FieldShape | null;
  private toShape: FieldShape;
  private state = { mix: 0, sweep: 2, illum: 1 };
  private pointer = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };
  private radii = new Float32Array(0);
  private buckets = new Int16Array(0);
  private order = new Uint32Array(0);
  private raf = 0;
  private visible = true;
  private tweens: gsap.core.Tween[] = [];
  private cleanups: Array<() => void> = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: EngineOptions,
  ) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D not available");
    this.ctx = ctx;
    this.fromShape = opts.shape;
    this.toShape = opts.morphTo ?? opts.shape;
    this.state.illum = opts.illumination;

    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas);
    this.cleanups.push(() => ro.disconnect());

    const io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.request();
    });
    io.observe(canvas);
    this.cleanups.push(() => io.disconnect());

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (opts.intro && !reduce) {
      this.state.sweep = 0;
      this.tweens.push(
        gsap.to(this.state, { sweep: 1.4, duration: 2.2, delay: 0.15, ease: "power2.inOut", onUpdate: () => this.request() }),
      );
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (opts.interactive && fine && !reduce) {
      const move = (e: PointerEvent) => {
        this.pointer.tx = e.clientX;
        this.pointer.ty = e.clientY;
        this.pointer.ts = 1;
        this.request();
      };
      const leave = () => {
        this.pointer.ts = 0;
        this.request();
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      this.cleanups.push(() => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
      });
    }

    this.resize();
  }

  /** Scroll-driven blend from `shape` to `morphTo` (0..1). */
  setMorph(p: number) {
    if (Math.abs(p - this.state.mix) < 0.002) return;
    this.state.mix = p;
    this.request();
  }

  setIllumination(v: number) {
    if (Math.abs(v - this.state.illum) < 0.002) return;
    this.state.illum = v;
    this.request();
  }

  /** Animate from whatever is on screen now to a new shape. */
  transitionTo(shape: FieldShape, duration = 0.8) {
    if (shape === this.toShape && this.state.mix >= 1) return;
    // Not measured yet (e.g. hidden with display: none): resize() builds this shape later.
    if (!this.from || !this.to) {
      this.fromShape = this.toShape = shape;
      this.state.mix = 1;
      return;
    }
    this.from = this.blended();
    this.fromShape = null;
    this.toShape = shape;
    this.to = buildField(shape, this.cols, this.rows, this.w / Math.max(this.h, 1), this.opts.seed);
    this.state.mix = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || duration === 0) {
      this.state.mix = 1;
      this.request();
      return;
    }
    this.tweens.push(gsap.to(this.state, { mix: 1, duration, ease: "power2.inOut", overwrite: true, onUpdate: () => this.request() }));
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.tweens.forEach((t) => t.kill());
    this.cleanups.forEach((fn) => fn());
  }

  private blended(): Field {
    const a = this.from!;
    const b = this.to!;
    const m = this.state.mix;
    const intensity = new Float32Array(a.intensity.length);
    const tone = new Float32Array(a.tone.length);
    for (let i = 0; i < intensity.length; i++) {
      intensity[i] = a.intensity[i] + (b.intensity[i] - a.intensity[i]) * m;
      tone[i] = a.tone[i] + (b.tone[i] - a.tone[i]) * m;
    }
    return { intensity, tone };
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (!w || !h || (w === this.w && h === this.h)) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.pitch = w < 640 ? this.opts.spacing * 0.82 : this.opts.spacing;
    this.cols = Math.ceil(w / this.pitch) + 1;
    this.rows = Math.ceil(h / this.pitch) + 1;
    this.ox = (w - (this.cols - 1) * this.pitch) / 2;
    this.oy = (h - (this.rows - 1) * this.pitch) / 2;

    const aspect = w / h;
    // A mid-transition snapshot cannot be rebuilt at a new size; settle on the target.
    if (!this.fromShape) {
      this.fromShape = this.toShape;
      this.state.mix = 1;
    }
    this.from = buildField(this.fromShape, this.cols, this.rows, aspect, this.opts.seed);
    this.to = this.toShape === this.fromShape ? this.from : buildField(this.toShape, this.cols, this.rows, aspect, this.opts.seed);

    const n = this.cols * this.rows;
    this.radii = new Float32Array(n);
    this.buckets = new Int16Array(n);
    this.order = new Uint32Array(n);
    this.request();
  }

  private request() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      if (this.visible) this.frame();
    });
  }

  private frame() {
    const p = this.pointer;
    p.x += (p.tx - p.x) * 0.16;
    p.y += (p.ty - p.y) * 0.16;
    p.s += (p.ts - p.s) * 0.08;
    this.draw();
    const settling = Math.abs(p.tx - p.x) > 0.5 || Math.abs(p.ty - p.y) > 0.5 || Math.abs(p.ts - p.s) > 0.01;
    if (settling) this.request();
  }

  private draw() {
    const { ctx, cols, rows, pitch, ox, oy, from, to } = this;
    if (!from || !to) return;
    ctx.clearRect(0, 0, this.w, this.h);

    const { mix, sweep, illum } = this.state;
    const maxR = pitch * 0.46;
    const rect = this.canvas.getBoundingClientRect();
    const px = this.pointer.x - rect.left;
    const py = this.pointer.y - rect.top;
    const ps = this.pointer.s;
    const sigma2 = 2 * 160 * 160;
    const reach2 = 420 * 420;
    const total = LEVELS * 2;
    const counts = new Uint32Array(total + 1);

    for (let j = 0; j < rows; j++) {
      const v = j / (rows - 1);
      const y = oy + j * pitch;
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i;
        const u = i / (cols - 1);
        const x = ox + i * pitch;
        let val = from.intensity[idx] + (to.intensity[idx] - from.intensity[idx]) * mix;
        let tone = from.tone[idx] + (to.tone[idx] - from.tone[idx]) * mix;
        if (sweep < 1.4) {
          const d = u * 0.62 + (1 - v) * 0.38;
          const f = (sweep - d) / 0.32;
          val *= f <= 0 ? 0 : f >= 1 ? 1 : f;
        }
        val *= illum;
        if (ps > 0.003) {
          const dx = x - px;
          const dy = y - py;
          const dd = dx * dx + dy * dy;
          if (dd < reach2) {
            const g = ps * Math.exp(-dd / sigma2);
            val += g * 0.42;
            tone += g * 0.9;
          }
        }
        if (val > 1) val = 1;
        const r = maxR * Math.sqrt(val);
        if (r < 0.45) {
          this.buckets[idx] = -1;
          continue;
        }
        const level = Math.min(LEVELS - 1, Math.floor(val * LEVELS));
        const b = (tone > 0.5 ? LEVELS : 0) + level;
        this.buckets[idx] = b;
        this.radii[idx] = r;
        counts[b + 1]++;
      }
    }

    // Counting sort by bucket so each colour is one path + one fill.
    for (let b = 1; b <= total; b++) counts[b] += counts[b - 1];
    const starts = counts.slice(0, total);
    const cursor = starts.slice();
    const n = cols * rows;
    for (let idx = 0; idx < n; idx++) {
      const b = this.buckets[idx];
      if (b >= 0) this.order[cursor[b]++] = idx;
    }
    for (let b = 0; b < total; b++) {
      const start = starts[b];
      const end = cursor[b];
      if (end === start) continue;
      ctx.fillStyle = this.styles[b];
      ctx.beginPath();
      for (let k = start; k < end; k++) {
        const idx = this.order[k];
        const x = ox + (idx % cols) * pitch;
        const y = oy + Math.floor(idx / cols) * pitch;
        const r = this.radii[idx];
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }
}
