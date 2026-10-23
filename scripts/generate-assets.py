"""Generate brand assets from the supplied logo.

Usage (from the repository root):
    python -I scripts/generate-assets.py

Requires Pillow, NumPy and SciPy. Outputs:
    public/brand/wordmark.png        white wordmark on transparent background
    src/app/icon.png, apple-icon.png favicon / touch icon
    src/app/opengraph-image.jpg      1200x630 social image (crop of the original logo)
    public/work/placeholder-*.webp   halftone placeholder art for portfolio entries
    public/team/placeholder.webp     halftone placeholder for team portraits
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "brand" / "afterbyte-logo-original.jpg"

INK = (8, 9, 11)
WARM = np.array([237, 230, 218], np.float32)
ICE = np.array([167, 200, 232], np.float32)


def extract_wordmark() -> Image.Image:
    lum = np.asarray(Image.open(LOGO).convert("L")).astype(np.float32)
    band = lum[480:790, 180:1080]
    mask = band > 120
    lab, n = ndimage.label(mask)
    sizes = ndimage.sum(mask, lab, range(1, n + 1))
    keep = np.zeros(n + 1, bool)
    keep[1:] = sizes > 400  # letters are large components; halftone dots are tiny
    letters = keep[lab]
    # Grow over the antialiased edge, but only through pixels connected to the
    # letters without crossing black, so neighbouring dots are not pulled in.
    loose = band > 45
    lab2, _ = ndimage.label(loose)
    touching = np.unique(lab2[letters])
    connected = np.isin(lab2, touching[touching > 0])
    grown = ndimage.binary_dilation(letters, iterations=2) & connected
    # One halftone dot is fused to the end of the "e" swash; cut it off.
    yy, xx = np.mgrid[0 : band.shape[0], 0 : band.shape[1]]
    grown &= (xx - 869) ** 2 + (yy - 198) ** 2 > 5.5**2
    alpha = np.clip((band - 30) / 205, 0, 1) * grown
    ys, xs = np.where(alpha > 0.05)
    pad = 6
    alpha = alpha[ys.min() - pad : ys.max() + pad, xs.min() - pad : xs.max() + pad]
    # Upscale 2x for high-density screens, then firm up the antialiased edge.
    a = Image.fromarray((alpha * 255).astype(np.uint8), "L")
    a = a.resize((a.width * 2, a.height * 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    arr = np.asarray(a).astype(np.float32) / 255
    arr = np.clip((arr - 0.18) / 0.64, 0, 1)
    rgba = np.zeros(arr.shape + (4,), np.uint8)
    rgba[..., :3] = 255
    rgba[..., 3] = (arr * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def value_noise(w: int, h: int, scale: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    gw, gh = int(w / scale) + 2, int(h / scale) + 2
    grid = rng.random((gh, gw)).astype(np.float32)
    return np.asarray(Image.fromarray(grid).resize((w, h), Image.BICUBIC))


def halftone(w: int, h: int, field: np.ndarray, tone: np.ndarray, spacing: int) -> Image.Image:
    """Render a halftone dot grid. `field` and `tone` are sampled per cell (0..1)."""
    s = 2  # supersample
    img = Image.new("RGB", (w * s, h * s), INK)
    d = ImageDraw.Draw(img)
    cols, rows = w // spacing + 1, h // spacing + 1
    fy = np.linspace(0, field.shape[0] - 1, rows).astype(int)
    fx = np.linspace(0, field.shape[1] - 1, cols).astype(int)
    for j, y in enumerate(fy):
        for i, x in enumerate(fx):
            v = float(field[y, x])
            r = spacing * 0.48 * np.sqrt(max(v, 0))
            if r < 0.5:
                continue
            t = float(tone[y, x])
            c = (WARM * (1 - t) + ICE * t) * (0.35 + 0.65 * v)
            cx, cy = (i * spacing + spacing / 2) * s, (j * spacing + spacing / 2) * s
            d.ellipse((cx - r * s, cy - r * s, cx + r * s, cy + r * s), fill=tuple(int(k) for k in c))
    return img.resize((w, h), Image.LANCZOS)


def band(xx, yy, angle, offset, width):
    n = np.cos(angle) * xx + np.sin(angle) * yy
    return np.exp(-(((n - offset) / width) ** 2))


def placeholder_fields(w, h, kind, seed):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= w
    yy /= h
    noise = value_noise(w, h, 140, seed)
    tone = value_noise(w, h, 220, seed + 7)
    if kind == "diagonal":
        f = band(xx, yy, -0.65, 0.05, 0.16) + 0.8 * band(xx, yy, -0.65, 0.6, 0.12)
    elif kind == "radial":
        f = np.exp(-(((xx - 0.5) ** 2 + (yy - 0.46) ** 2) / 0.06))
    elif kind == "columns":
        f = (np.sin(xx * np.pi * 7) * 0.5 + 0.5) ** 6 * np.clip(1.2 - yy, 0, 1)
    else:  # portrait: soft vertical light
        f = np.exp(-(((xx - 0.5) ** 2) / 0.04 + ((yy - 0.45) ** 2) / 0.12))
    f = np.clip(f * (0.65 + 0.6 * noise), 0, 1)
    return f, tone


def main():
    (ROOT / "public" / "brand").mkdir(parents=True, exist_ok=True)
    (ROOT / "public" / "work").mkdir(parents=True, exist_ok=True)
    (ROOT / "public" / "team").mkdir(parents=True, exist_ok=True)

    wm = extract_wordmark()
    wm.save(ROOT / "public" / "brand" / "wordmark.png", optimize=True)
    print("wordmark", wm.size)

    # Icons: the swash "A" from the wordmark on ink.
    a_glyph = wm.crop((0, 0, int(wm.width * 0.2), wm.height))
    for name, size in (("icon.png", 512), ("apple-icon.png", 180)):
        canvas = Image.new("RGBA", (size, size), INK + (255,))
        g = a_glyph.copy()
        g.thumbnail((int(size * 0.78), int(size * 0.78)), Image.LANCZOS)
        canvas.alpha_composite(g, ((size - g.width) // 2, (size - g.height) // 2))
        canvas.convert("RGB").save(ROOT / "src" / "app" / name, optimize=True)

    # Open Graph: crop the original artwork, which already is the brand image.
    logo = Image.open(LOGO).convert("RGB")
    og = logo.crop((27, 312, 1227, 942))
    og.save(ROOT / "src" / "app" / "opengraph-image.jpg", quality=84)

    for idx, kind in enumerate(("diagonal", "radial", "columns"), start=1):
        w, h = 1600, 1100
        f, t = placeholder_fields(w, h, kind, seed=idx * 11)
        halftone(w, h, f, t, spacing=16).save(ROOT / "public" / "work" / f"placeholder-{idx}.webp", quality=82)

    f, t = placeholder_fields(800, 1000, "portrait", seed=5)
    halftone(800, 1000, f, t, spacing=12).save(ROOT / "public" / "team" / "placeholder.webp", quality=82)
    print("done")


if __name__ == "__main__":
    main()
