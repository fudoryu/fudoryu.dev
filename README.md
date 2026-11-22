# fudoryu.dev

Personal site of fudō-ryū, built with Astro, MDX and Observable Plot.

## Run it

Uses Node 26 (see `.nvmrc`; run `nvm use`) and npm.

```sh
npm install
npm run dev
npm run build        # static output in dist/
npm run verify       # prettier + eslint + astro check + build
```

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
