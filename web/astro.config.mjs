import { defineConfig } from 'astro/config';
import { remarkMermaid, remarkRewriteLinks } from './src/plugins/markdown.mjs';

// For GitHub Pages: set SITE / BASE env vars in CI. Defaults work for local dev.
export default defineConfig({
  site: process.env.SITE || 'https://shrikant92bhatt.github.io',
  base: process.env.BASE || '/web-security-handbook',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMermaid, remarkRewriteLinks],
    shikiConfig: { theme: 'tokyo-night', wrap: false },
  },
});
