# Handbook website (Astro)

A colourful, searchable website built from the Markdown files in this repo.

```bash
cd web
npm install
npm run dev       # http://localhost:4321/web-security-handbook/
npm run build     # outputs web/dist
```

## Adding content
1. Create a `.md` file in any `Module-*/<section>/` folder (start it with a `# Title`).
2. Create a new folder with a `README.md` to add a new section. Use a numeric prefix (`16-…`) to control order.
3. Save. The sidebar, home cards, search, charts and Previous/Next links update automatically.

To add a new top-level module, create `Module-3-…/` with a `README.md`.

## Writing tips
- Diagrams: use fenced ```` ```mermaid ```` blocks. They render as coloured diagrams.
- Links between pages: use normal relative links such as `../02-auth/jwt-security.md`.
- Colours are assigned per section automatically (see `src/lib/nav.ts`); theme is in `src/styles/global.css`.
