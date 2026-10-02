import type { APIRoute } from 'astro';
import { info } from '../lib/info';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.href : info.site.url;
  const sitemapUrl = new URL('sitemap-index.xml', siteUrl).href;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
