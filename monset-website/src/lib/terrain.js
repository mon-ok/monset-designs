// The Monset peaks: two ridges slanted like the logo's two strokes.
// Heights run 0..1 (1 = main summit); the map prints 1 as 1,000 m.

// The terrain is designed on a frame of this aspect and cropped to cover any screen.
export const ASPECT = 1.633;

export const PEAKS = [
  { x: 0.66, y: 0.34, h: 1 }, // main summit
  { x: 0.86, y: 0.58, h: 0.74 },
];

// ridge long axis follows the logo's slant (down-left)
const DIR = [-0.45, 0.89];

export function peakHeight(nx, ny) {
  let z = 0;
  for (const p of PEAKS) {
    const dx = (nx - p.x) * ASPECT;
    const dy = ny - p.y;
    const a = dx * DIR[0] + dy * DIR[1];
    const c = dx * DIR[1] - dy * DIR[0];
    z += p.h * Math.exp(-((a * a) / (2 * 0.34 * 0.34) + (c * c) / (2 * 0.15 * 0.15)));
  }
  return z;
}

// "cover" crop of the design frame onto a w x h box, like object-fit: cover,
// but when the sides get cut (phones) keep the peaks in view rather than the empty middle
const FOCUS_X = 0.74;
export function coverFrame(w, h) {
  const fw = Math.max(w, h * ASPECT);
  const fh = fw / ASPECT;
  const ox = Math.min(0, Math.max(w - fw, w / 2 - FOCUS_X * fw));
  return { fw, fh, ox, oy: (h - fh) / 2 };
}
