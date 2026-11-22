/**
 * fudō-ryū colour tokens — the single source of truth.
 * Consumed by: Base.astro (as CSS custom properties), astro.config.ts (code-block theme),
 * the favicon and the Open Graph images.
 *
 *   ash      the forge floor after the fire: cool, quiet paper
 *   ashDeep  a step darker, for code and insets
 *   sumi     ink, for everything that matters
 *   iron     secondary text, metadata
 *   hairline the only structure we draw
 *   ember    cherry heat (orange in the dark); spent once per screen
 *   emberGlow a translucent halo around the ember
 */
export const palette = {
  light: {
    ash: '#ecece8',
    ashDeep: '#e2e2dd',
    sumi: '#1d1e21',
    iron: '#5d6067',
    hairline: '#cdcdc7',
    ember: '#b5311c',
    emberGlow: 'rgb(224 102 42 / 0.45)',
  },
  dark: {
    ash: '#17181a',
    ashDeep: '#1f2023',
    sumi: '#e5e4df',
    iron: '#8e9197',
    hairline: '#303236',
    ember: '#e0662a',
    emberGlow: 'rgb(240 138 42 / 0.5)',
  },
} as const;

export type Scheme = keyof typeof palette;
export type Token = keyof (typeof palette)['light'];

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const vars = (scheme: Scheme) =>
  Object.entries(palette[scheme])
    .map(([k, v]) => `--${kebab(k)}:${v};`)
    .join('');

/** CSS custom properties for both schemes, injected once in the document head. */
export const tokensCss =
  `:root{${vars('light')}}` + `@media (prefers-color-scheme: dark){:root{${vars('dark')}}}`;

/** Append an alpha channel (0–1) to a #rrggbb colour. */
export const withAlpha = (hex: string, alpha: number) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
