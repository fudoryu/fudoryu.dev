import { palette } from '@/styles/tokens';

const { light, dark } = palette;

export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    rect { fill: ${light.ash} } path { stroke: ${light.sumi} } circle { fill: ${light.ember} }
    @media (prefers-color-scheme: dark) {
      rect { fill: ${dark.ash} } path { stroke: ${dark.sumi} } circle { fill: ${dark.ember} }
    }
  </style>
  <rect width="32" height="32" rx="6"/>
  <path d="M5 19 C9 15, 12 21, 16 17 S 22 14, 24 17" fill="none" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="26.5" cy="17" r="2.2"/>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
