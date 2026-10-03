import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { info } from '$lib/info';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('archives', (post) => !post.data.draft);

  posts.sort((a, b) => {
    const timeA = a.data.date instanceof Date ? a.data.date.getTime() : new Date(a.data.date).getTime();
    const timeB = b.data.date instanceof Date ? b.data.date.getTime() : new Date(b.data.date).getTime();
    return timeB - timeA;
  });

  return rss({
    title: info.site.title,
    description: info.site.description,
    site: context.site?.href ?? info.site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date instanceof Date ? post.data.date : new Date(post.data.date),
      description: post.data.description,
      link: `/archives/${post.id}/`,
      categories: post.data.tags ?? [],
    })),
    customData: `<language>${info.site.locale ?? 'en-US'}</language>`,
  });
};
