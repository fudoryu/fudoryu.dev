/**
 * Ensō — the Zen brush circle — drawn as a point cloud.
 * Each point has a target on the brush stroke and a start position sampled from
 * Gaussian noise, so the circle can "denoise" into shape the way a diffusion
 * model does. Deterministic: the same seed always yields the same circle.
 */
import { mulberry32 } from '@/lib/hamon';

export type EnsoPoint = {
  x: number;
  y: number;
  r: number; // dot radius
  o: number; // ink density (opacity)
  dx: number; // offset from target to its noisy start
  dy: number;
  delay: number; // ms
};

export function enso(seed = 3, size = 400, count = 1400) {
  const rand = mulberry32(seed);
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const c = size / 2;
  const R = size * 0.355;
  const start = -Math.PI * 0.62; // brush lands upper left
  const sweep = Math.PI * 2 * 0.9; // and lifts before closing the circle
  const lanes = Array.from({ length: 13 }, (_, i) => i / 12 - 0.5); // bristles across the stroke

  // Brush width over the stroke: a heavy landing, a full belly, a dry thin tail
  const width = (t: number) =>
    size * 0.11 * (0.7 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.3))) * (1 - 0.75 * t ** 2.2);
  // The stroke wobbles a little off a perfect circle
  const wobble = (a: number) => size * 0.012 * Math.sin(a * 2 + 0.7) + size * 0.006 * Math.sin(a * 5 + 2.1);

  const points: EnsoPoint[] = [];
  for (let i = 0; i < count; i++) {
    // more ink early, fewer points as the brush runs dry
    const t = 1 - Math.sqrt(1 - rand() * 0.9999);
    if (t > 0.8 && rand() < (t - 0.8) * 1.5) continue;
    const a = start + sweep * t;
    const dry = Math.max(0, (t - 0.55) / 0.45); // 0 wet … 1 dry
    const lane = lanes[Math.floor(rand() * lanes.length)];
    const across = (lane + gauss() * 0.06 * (1 - dry * 0.8)) * width(t);
    const rr = R + wobble(a) + across;
    const x = c + rr * Math.cos(a);
    const y = c + rr * Math.sin(a);
    const sx = c + gauss() * size * 0.26;
    const sy = c + gauss() * size * 0.26;
    points.push({
      x,
      y,
      r: (1.1 + rand() * 1.3) * (1 - dry * 0.3) * (size / 400),
      o: (0.6 + rand() * 0.4) * (1 - dry * 0.4),
      dx: sx - x,
      dy: sy - y,
      delay: Math.round(rand() * 350),
    });
  }

  const tip = start + sweep * 1.035;
  const ember = { x: c + (R + wobble(tip)) * Math.cos(tip), y: c + (R + wobble(tip)) * Math.sin(tip) };
  return { points, ember, size };
}
