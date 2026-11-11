import { defineConfig } from 'astro/config';
import { remarkMermaid, remarkRewriteLinks } from './src/plugins/markdown.mjs';

const isVercel = Boolean(process.env.VERCEL);
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

// For GitHub Pages / Vercel: auto-detect Vercel or use SITE / BASE env vars.
export default defineConfig({
  site: process.env.SITE || (vercelHost ? `https://${vercelHost}` : 'https://shrikant92bhatt.github.io'),
  base: process.env.BASE || (isVercel ? '/' : '/web-security-handbook'),
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMermaid, remarkRewriteLinks],
    shikiConfig: { theme: 'tokyo-night', wrap: false },
  },
});
