/**
 * Open Graph images (1200×630 PNG) rendered at build time with Satori + resvg.
 * Same tokens, type and temper line as the site, so shared links look like it.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { palette } from '@/styles/tokens';
import { hamon } from '@/lib/hamon';
import { MEI_HEIGHT, MEI_VIEWBOX, MEI_WIDTH, meiGlyphs } from '@/data/mei';
import { site } from '@/data/site';

const W = 1200;
const H = 630;
const c = palette.light;

// Satori needs TTF/OTF/WOFF (not WOFF2); the static Fontsource packages ship WOFF.
const font = (pkg: string, file: string) => readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    font('@fontsource/noto-serif-jp', 'noto-serif-jp-latin-300-normal.woff'),
    font('@fontsource/ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff'),
  ]).then(([serif, plex]) => [
    { name: 'Noto Serif JP', data: serif, weight: 300 as const, style: 'normal' as const },
    { name: 'IBM Plex Sans', data: plex, weight: 400 as const, style: 'normal' as const },
  ]));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, props: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

export type OgInput = {
  title: string;
  kicker?: string; // small line above the title, e.g. a date or "Writing"
  subtitle?: string;
  seed?: number;
};

export async function renderOg({ title, kicker, subtitle, seed = 11 }: OgInput) {
  const line = hamon(seed, 1056, 60);
  const titleSize = title.length > 60 ? 54 : title.length > 32 ? 64 : 80;

  const tree = h(
    'div',
    {
      style: {
        width: W,
        height: H,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 64,
        paddingRight: 72,
        paddingBottom: 56,
        paddingLeft: 72,
        background: c.ash,
        color: c.sumi,
        fontFamily: 'IBM Plex Sans',
      },
    },
    h(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', maxWidth: 940 } },
        h('div', { style: { fontSize: 26, color: c.iron, marginBottom: 28 } }, kicker ?? site.name),
        h(
          'div',
          {
            style: {
              fontFamily: 'Noto Serif JP',
              fontWeight: 300,
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
            },
          },
          title,
        ),
        subtitle
          ? h(
              'div',
              { style: { fontSize: 28, lineHeight: 1.45, color: c.iron, marginTop: 28, maxWidth: 860 } },
              subtitle,
            )
          : null,
      ),
      h(
        'svg',
        {
          width: 30,
          height: Math.round((30 * MEI_HEIGHT) / MEI_WIDTH),
          viewBox: MEI_VIEWBOX,
          fill: c.ember,
          style: { flexShrink: 0 },
        },
        ...meiGlyphs.map((g) => h('path', { d: g.d })),
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'svg',
        { width: line.width, height: line.height, viewBox: `0 0 ${line.width} ${line.height}` },
        h('path', { d: line.d, fill: 'none', stroke: c.sumi, strokeWidth: 1.5 }),
        h('circle', { cx: line.end.x - 16, cy: line.end.y, r: 16, fill: c.ember, fillOpacity: 0.16 }),
        h('circle', { cx: line.end.x - 16, cy: line.end.y, r: 5, fill: c.ember }),
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            color: c.iron,
            marginTop: 20,
          },
        },
        h('span', {}, site.name),
        h('span', {}, new URL(import.meta.env.SITE).host),
      ),
    ),
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
