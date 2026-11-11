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

## Deployment

### Vercel
The root [`vercel.json`](../vercel.json) is preconfigured to install dependencies and build the Astro site from `web/` into `web/dist` (with `base: '/'` automatically detected when `VERCEL=1`).

1. Go to [vercel.com/new](https://vercel.com/new) and import `Shrikant92Bhatt/web-security-handbook`.
2. Leave **Root Directory** at the repository root (`./`) so the build can read the Markdown content in `Module-1-*`, `Module-2-*`, `resources/`, `labs/`, and `diagrams/`.
3. Click **Deploy**.

### GitHub Pages
Enable **GitHub Actions** as the source in **Settings → Pages** on GitHub, and `.github/workflows/deploy-site.yml` will build and publish the site automatically on pushes to `main`.

