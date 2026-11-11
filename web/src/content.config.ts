import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// The handbook content lives in the repo root (Module-*/…, resources/…).
// Add a new .md file in any module folder and it appears on the site automatically.
const handbook = defineCollection({
  loader: glob({
    base: '..',
    pattern: ['Module-*/**/*.md', 'resources/*.md', 'labs/*.md', 'diagrams/*.md'],
    generateId: ({ entry }) =>
      entry.replace(/\.md$/i, '').replace(/\/README$/i, ''),
  }),
});

export const collections = { handbook };
