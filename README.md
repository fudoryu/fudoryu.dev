# fudoryu.dev

Personal site of fudō-ryū, built with Astro, MDX and Observable Plot.

## Run it

Uses Node 26 (see `.nvmrc`; run `nvm use`) and npm.

```sh
npm install
npm run dev
npm run build        # static output in dist/
npm run verify       # prettier + eslint + astro check + build
npx wrangler dev     # serve dist/ the way Cloudflare will (headers, 404s, redirects)
```

## Deploy

Cloudflare Workers, static assets only (`wrangler.jsonc`), deployed from GitHub Actions
(`.github/workflows/ci.yml`):

- **Push to `main`:** `verify` must pass, then `wrangler deploy` publishes to production.
- **Pull request:** `verify`, then `wrangler versions upload` creates a preview URL (shown in the run summary)
  without touching the live site.

Needs two repository secrets: `CLOUDFLARE_API_TOKEN` (token from the "Edit Cloudflare Workers" template) and
`CLOUDFLARE_ACCOUNT_ID`. Headers and caching: `public/_headers`. Roll back with `npx wrangler rollback`.

## Where things live

| What                                                        | Where                         |
| ----------------------------------------------------------- | ----------------------------- |
| Work experience (one file per role)                         | `src/content/experience/*.md` |
| About page intro (your bio, plain Markdown)                 | `src/data/about.md`           |
| Blog posts (`.md`, or `.mdx` when a post needs a component) | `src/content/posts/`          |
| Portfolio case studies (empty for now)                      | `src/content/projects/`       |
| Name, links, tagline                                        | `src/data/site.ts`            |
| Design tokens (colours, type, spacing)                      | `src/styles/global.css`       |
| Interactive charts                                          | `src/components/viz/`         |

Schemas for every collection are in `src/content.config.ts`; a typo in front matter fails the build.

## Writing a post with a chart

```mdx
---
title: My post
description: One sentence.
date: 2026-12-01
tags: [duckdb]
---

import HeatScale from '@/components/viz/HeatScale.astro';

Some prose…

<HeatScale />
```

Chart components load their JavaScript only when they scroll into view.

## Design notes

- **Ash, ink, ember.** One accent colour (cherry heat; orange in dark mode), used once per screen.
- **Type:** Noto Serif JP for headings (Latin subsets only; the 不動流 mark is an SVG), IBM Plex Sans for text, IBM Plex Mono for code.
- **Layout:** a narrow left rail for time and metadata, one reading column.
- **The hamon:** the temper line under the hero is generated at build time from a seed; each post gets its own.

## License

Code is [MIT](LICENSE). Writing (posts, experience, project write-ups, the About text) is
[CC BY 4.0](LICENSE-CONTENT.md).
