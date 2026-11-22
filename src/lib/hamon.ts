/**
 * Hamon — the temper line a smith's clay leaves along a blade's edge.
 * Deterministic: the same seed always yields the same line.
 */
export function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable numeric seed from any string (e.g. a post id). */
export const seedFrom = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

export function hamon(seed: number, width = 1000, height = 60) {
  const rand = mulberry32(seed);
  const mid = height * 0.55;
  const k = height / 60; // amplitudes are tuned for a 60-unit-tall box
  // A few slow waves, calm at the start, livelier in the middle
  const waves = Array.from({ length: 4 }, (_, i) => ({
    amp: (6 - i * 1.2) * (0.6 + rand() * 0.6) * k,
    freq: (1.2 + i * 1.7) * (0.8 + rand() * 0.4),
    phase: rand() * Math.PI * 2,
  }));
  const steps = 90;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const taper = Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.6;
    let y = 0;
    for (const w of waves) y += w.amp * Math.sin(t * Math.PI * 2 * w.freq + w.phase);
    pts.push([t * width, mid + y * taper]);
  }
  // Smooth with Catmull–Rom → cubic Bézier
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  const end = pts[pts.length - 1];
  return { d, end: { x: end[0], y: end[1] }, width, height };
}
