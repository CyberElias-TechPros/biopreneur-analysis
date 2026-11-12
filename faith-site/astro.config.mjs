import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { serializeSitemapEntry } from './src/lib/sitemap-routes.ts';

const siteUrl =
  process.env.PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://lij.name.ng');

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Feed routes are for readers' RSS clients, not search result pages.
      filter: (page) => !/\/(rss\.xml|robots\.txt)\/?$/.test(page),
      serialize: serializeSitemapEntry,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
  },
});
