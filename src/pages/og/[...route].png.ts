import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOg, type OgInput } from '@/lib/og';
import { getPosts, getProjects } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { seedFrom } from '@/lib/hamon';
import { site } from '@/data/site';

/** One image per shareable page: /og/index.png, /og/writing/<id>.png, /og/projects/<id>.png */
export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const projects = await getProjects();
  const pages: { params: { route: string }; props: OgInput }[] = [
    {
      params: { route: 'index' },
      props: {
        title: 'I forge data products.',
        kicker: site.jobTitle,
        subtitle: 'I build pipelines that hold under load and models that earn their place in production.',
      },
    },
    {
      params: { route: 'about' },
      props: {
        title: 'About',
        subtitle: 'Data, machine learning and AI engineer. Background, experience and how to reach me.',
      },
    },
    {
      params: { route: 'writing' },
      props: { title: 'Writing', subtitle: 'Notes on data engineering, machine learning and AI systems.' },
    },
    {
      params: { route: 'projects' },
      props: {
        title: 'Projects',
        subtitle: 'Case studies: the problem, the architecture, the trade-offs and the code.',
      },
    },
    ...posts.map((p) => ({
      params: { route: `writing/${p.id}` },
      props: {
        title: p.data.title,
        kicker: formatDate(p.data.date),
        subtitle: p.data.description,
        seed: seedFrom(p.id),
      },
    })),
    ...projects.map((p) => ({
      params: { route: `projects/${p.id}` },
      props: { title: p.data.title, kicker: 'Project', subtitle: p.data.summary, seed: seedFrom(p.id) },
    })),
  ];
  return pages;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as OgInput);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
