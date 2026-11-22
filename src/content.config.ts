import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    url: z.url().optional(),
    location: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit = current role
    summary: z.string(),
    stack: z.array(z.string()).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Empty for now. Add a .md/.mdx file here and /projects lights up.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { experience, posts, projects };
