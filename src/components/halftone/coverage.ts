/**
 * How much of each grid cell an image's opaque pixels cover (0..1), measured by
 * supersampling its alpha. Used to turn the wordmark into halftone dots: the
 * footer hover effect and the hero intro both size their dots from this.
 */
export function sampleCoverage(
  img: CanvasImageSource,
  cols: number,
  rows: number,
  w: number,
  h: number,
  pitch: number,
  ss = 4,
): Float32Array | null {
  const sw = cols * ss;
  const sh = rows * ss;
  const off = document.createElement("canvas");
  off.width = sw;
  off.height = sh;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return null;
  octx.drawImage(img, 0, 0, (w / pitch) * ss, (h / pitch) * ss);
  const data = octx.getImageData(0, 0, sw, sh).data;
  const cover = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let sum = 0;
      for (let y = 0; y < ss; y++) {
        const row = (j * ss + y) * sw;
        for (let x = 0; x < ss; x++) sum += data[(row + i * ss + x) * 4 + 3];
      }
      cover[j * cols + i] = sum / (ss * ss * 255);
    }
  }
  return cover;
}
