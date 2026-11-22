import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { palette, withAlpha, type Token } from './src/styles/tokens';

/** Resolve a colour token for the light or dark code theme. */
const tone =
  (token: Token, alpha?: number) =>
  ({ theme }: { theme: { type: 'light' | 'dark' } }) => {
    const value = palette[theme.type][token];
    return alpha === undefined ? value : withAlpha(value, alpha);
  };

// Latin-only files from the Fontsource packages, served through Astro's Fonts API
// (self-hosted, preloadable, with metric-matched fallbacks to avoid layout shift).
const fs = (pkg: string, file: string) => `${pkg}/files/${file}`;

export default defineConfig({
  site: 'https://fudoryu.dev',
  trailingSlash: 'always',
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Noto Serif JP',
      cssVariable: '--font-serif-jp',
      fallbacks: ['serif'],
      options: {
        // Variable (200–900), Latin + Latin Extended only (ō, ū and friends); no CJK download.
        variants: [
          {
            weight: '200 900',
            style: 'normal',
            src: [fs('@fontsource-variable/noto-serif-jp', 'noto-serif-jp-latin-wght-normal.woff2')],
            unicodeRange: [
              'U+0000-00FF',
              'U+0131',
              'U+0152-0153',
              'U+02BB-02BC',
              'U+02C6',
              'U+02DA',
              'U+02DC',
              'U+0304',
              'U+0308',
              'U+0329',
              'U+2000-206F',
              'U+20AC',
              'U+2122',
              'U+2191',
              'U+2193',
              'U+2212',
              'U+2215',
              'U+FEFF',
              'U+FFFD',
            ],
          },
          {
            weight: '200 900',
            style: 'normal',
            src: [fs('@fontsource-variable/noto-serif-jp', 'noto-serif-jp-latin-ext-wght-normal.woff2')],
            unicodeRange: [
              'U+0100-02BA',
              'U+02BD-02C5',
              'U+02C7-02CC',
              'U+02CE-02D7',
              'U+02DD-02FF',
              'U+1D00-1DBF',
              'U+1E00-1E9F',
              'U+1EF2-1EFF',
              'U+2020',
              'U+20A0-20AB',
              'U+20AD-20C4',
              'U+2113',
              'U+2C60-2C7F',
              'U+A720-A7FF',
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-plex-sans',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: '100 700',
            style: 'normal',
            src: [fs('@fontsource-variable/ibm-plex-sans', 'ibm-plex-sans-latin-wght-normal.woff2')],
          },
          {
            weight: '100 700',
            style: 'italic',
            src: [fs('@fontsource-variable/ibm-plex-sans', 'ibm-plex-sans-latin-wght-italic.woff2')],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: [fs('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')],
          },
        ],
      },
    },
  ],
  integrations: [
    // expressiveCode must come before mdx
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      styleOverrides: {
        borderRadius: '2px',
        borderColor: tone('hairline'),
        codeFontFamily: 'var(--font-plex-mono)',
        codeFontSize: '0.875rem',
        uiFontFamily: 'var(--font-plex-sans)',
        codeBackground: tone('ashDeep'),
        textMarkers: {
          markBackground: tone('ember', 0.1),
          markBorderColor: tone('ember'),
        },
        frames: {
          shadowColor: 'transparent',
          editorTabBarBackground: tone('ash'),
          editorActiveTabBackground: tone('ashDeep'),
          editorActiveTabIndicatorTopColor: tone('ember'),
          editorTabBarBorderBottomColor: tone('hairline'),
          terminalTitlebarBackground: tone('ash'),
          terminalBackground: tone('ashDeep'),
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: { plugins: [tailwindcss()] },
});
