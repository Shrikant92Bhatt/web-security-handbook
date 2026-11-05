# 05 — React Ecosystem: Advanced

**In simple words:** This chapter covers what happens around your components: how to test them, how source code becomes files a browser can run, and where the HTML is produced — in the browser, on the server for each request, or once at build time.

[React path home](README.md) · [Previous: Ecosystem Basics & Intermediate](04-ecosystem-basics-and-intermediate.md) · **React chapter 5 of 6**

---

## 1. Automated testing

### Types of tests

| Type | Checks | Speed | Tools |
|---|---|---|---|
| Static | Types, lint rules | Instant | TypeScript, ESLint |
| Unit | One function/hook/reducer | Very fast | Vitest, Jest |
| Component / integration | A component (or group) rendered with its children, as a user uses it | Fast | React Testing Library + Vitest/Jest + jsdom |
| End-to-end (e2e) | The whole app in a real browser against a real or mocked backend | Slow | Playwright, Cypress |
| Visual regression | Screenshots compared to a baseline | Medium | Playwright screenshots, Chromatic |

The **testing trophy** idea (Kent C. Dodds): most value comes from **integration** tests, backed by static checks, some unit tests and a few critical e2e flows.

### Types of rendering in tests

| Rendering | What it does | Used by |
|---|---|---|
| **Shallow rendering** | Renders one level only; child components are not rendered | Enzyme `shallow`, `react-test-renderer/shallow` (both legacy) |
| **Full DOM rendering** | Renders the full tree into a DOM (jsdom in Node) | React Testing Library `render`, Enzyme `mount` |
| **Static rendering** | Renders to an HTML string and inspects it | Enzyme `render`, `renderToString` |
| **Real browser** | Real Chromium/Firefox/WebKit | Playwright, Cypress, Vitest Browser Mode |

Shallow rendering is discouraged now: it tests implementation details and misses bugs in how components work together. `react-test-renderer` is **deprecated in React 19**.

### React Testing Library vs Enzyme

| | React Testing Library (RTL) | Enzyme |
|---|---|---|
| Philosophy | Test what the **user** sees and does | Test component **internals** |
| Finds elements by | Role, label, text (`getByRole('button', { name: 'Add' })`) | Component name, props, CSS selectors |
| Access to state/instance | No (on purpose) | Yes (`wrapper.state()`, `instance()`) |
| Refactor safety | High — tests survive internal rewrites | Low — tests break on refactors |
| Status | Official recommendation, actively maintained | **No official adapter for React 18+**; effectively dead |

**Guiding principle:** the more your tests resemble the way your software is used, the more confidence they give you.

### RTL example

~~~tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { CouponForm } from './CouponForm';

test('shows error for an invalid coupon', async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 400 }));

  render(<CouponForm />);
  await user.type(screen.getByRole('textbox', { name: /coupon/i }), 'BAD10');
  await user.click(screen.getByRole('button', { name: /apply/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Coupon not valid');
});
~~~

- `getBy…` — must exist now (throws if not).
- `queryBy…` — returns `null` if missing (for "should not be there").
- `findBy…` — waits (async) until it appears.
- Prefer `getByRole` → `getByLabelText` → `getByText`; `getByTestId` last.
- `userEvent` simulates real typing/clicking better than `fireEvent`.
- Mock the **network** (MSW — Mock Service Worker) rather than mocking your own modules.
- Test hooks with `renderHook`; test reducers and selectors as plain functions.

### End-to-end testing libraries

| | Playwright | Cypress | Puppeteer |
|---|---|---|---|
| Made by | Microsoft | Cypress.io | Google Chrome team |
| Browsers | Chromium, Firefox, WebKit | Chromium-family, Firefox (WebKit experimental) | Chrome/Chromium, Firefox |
| Runs | Outside browser via protocol | Inside the browser alongside the app | Outside, via DevTools protocol / WebDriver BiDi |
| Multi-tab / multi-origin | Yes | Limited | Yes |
| Parallel runs | Built in, free | Paid cloud for best parallelisation | DIY |
| Built-in test runner | Yes (`@playwright/test`) | Yes | No — it is an automation library |
| Strength | Speed, auto-waiting, traces, cross-browser | Great interactive debugging UI, time-travel snapshots | Scraping, PDF/screenshot generation, Chrome automation |

~~~ts
// Playwright
import { test, expect } from '@playwright/test';

test('guest can add to cart and checkout', async ({ page }) => {
  await page.goto('/products/coffee');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('link', { name: /cart \(1\)/i })).toBeVisible();
  await page.getByRole('link', { name: /cart/i }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout/);
});
~~~

Keep e2e tests for **critical journeys** (sign-in, checkout, payment). They are slower and more brittle than component tests.

---

## 2. Building

### Why build at all?

Browsers do not understand JSX or TypeScript, and loading hundreds of small module files is slow. A **build** turns source code into a few optimised files.

### Transpilers

A **transpiler** converts one form of JavaScript into another:

- JSX → `jsx()` calls,
- TypeScript → JavaScript (types removed),
- new syntax → older syntax for older browsers (if needed).

| Tool | Written in | Notes |
|---|---|---|
| Babel | JavaScript | Most plugins; slower; used by React Compiler plugin |
| SWC | Rust | Very fast; used by Next.js |
| esbuild | Go | Very fast; used by Vite for dev transforms |
| `tsc` | TypeScript | Type checks; usually run as `tsc --noEmit` while another tool transpiles |

Transpilers do **not** type-check (except `tsc`). Run `tsc --noEmit` in CI.

### Bundlers

A **bundler** follows `import` statements from an entry file, builds a dependency graph and outputs bundles.

| Tool | Notes |
|---|---|
| Vite | Default for new React SPAs. Dev: native ES modules + esbuild, very fast start. Production: Rollup (moving to Rolldown) |
| webpack | Mature, highly configurable, many legacy projects |
| Turbopack | Rust bundler used by Next.js |
| Rspack | Rust, webpack-compatible API |
| Rollup | Great for libraries |
| Parcel | Zero-config |

**Create React App (CRA) was deprecated in February 2025.** New projects should use a framework (Next.js, React Router framework mode) or Vite.

### Dev vs production build

| | Development | Production |
|---|---|---|
| Goal | Fast feedback | Small, fast files |
| React build | Extra warnings, Strict Mode checks, component stacks | Warnings stripped, smaller, faster |
| Code | Not minified, source maps inline | Minified, tree-shaken, hashed filenames |
| Reload | Hot Module Replacement / Fast Refresh keeps state | Not applicable |
| `process.env.NODE_ENV` / `import.meta.env.MODE` | `development` | `production` |

Never deploy a development build — it is several times slower and larger.

### Code splitting

Split the bundle so users download only what the current screen needs.

~~~tsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));  // separate chunk

function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      {isAdmin && <AdminDashboard />}
    </Suspense>
  );
}
~~~

Where to split:

1. **Routes** — biggest win (React Router `lazy`, Next.js does this automatically).
2. Heavy features opened later — rich text editor, charts, maps.
3. Large rarely-used libraries — `const { jsPDF } = await import('jspdf')` inside a click handler.

Prefetch likely next chunks (on hover or idle) so splitting does not cause visible waits.

### Build optimisation checklist

- **Tree shaking:** remove unused exports. Needs ES modules and `"sideEffects": false` in library `package.json`. Import specific functions (`import debounce from 'lodash-es/debounce'`).
- **Minification:** esbuild/Terser/SWC shorten names and remove whitespace.
- **Content-hashed filenames** (`app.3f9a1c.js`) + long `Cache-Control` → browsers cache safely until content changes.
- **Vendor chunk splitting:** keep rarely-changing libraries in their own chunk.
- **Compression:** Brotli/gzip at the server or CDN.
- **Images:** modern formats (AVIF/WebP), correct sizes, lazy loading.
- **Analyse:** `rollup-plugin-visualizer`, `webpack-bundle-analyzer`, `source-map-explorer`.
- **Budgets:** fail CI if the main bundle grows past a limit.
- **Environment variables:** anything in a client bundle is public (`VITE_*`, `NEXT_PUBLIC_*`). Never put secrets there.

---

## 3. Server-side rendering

### Difference from client-side rendering

| | CSR (client-side rendering) | SSR (server-side rendering) |
|---|---|---|
| First response | Almost empty HTML + JS bundle | Full HTML for the page |
| First visible content | After JS downloads and runs | Immediately |
| Interactive | After JS runs | After JS downloads and **hydrates** |
| SEO / link previews | Weaker (crawler must run JS) | Strong |
| Server cost | Static files only | Server renders per request |
| Complexity | Low | Higher (hydration, server/client code split, caching) |

~~~mermaid
sequenceDiagram
  participant B as Browser
  participant S as Server
  B->>S: GET /products/42
  S->>S: fetch data, render React → HTML
  S-->>B: HTML (content visible)
  B->>S: GET app.js
  B->>B: hydrateRoot → page becomes interactive
~~~

### Cases of usage

Choose SSR when:

- SEO and social previews matter (product pages, articles, marketplaces),
- first content speed matters on slow devices/networks,
- content is personalised or changes often, so it cannot be pre-built.

Prefer CSR when: the app is behind a login (dashboards, admin tools, trading terminals), SEO does not matter, and you want simple static hosting.

Prefer SSG (below) when content is the same for everyone and changes rarely.

### Server React DOM APIs

From `react-dom/server` and `react-dom/static`:

| API | Environment | Use |
|---|---|---|
| `renderToPipeableStream` | Node.js streams | Streaming SSR with Suspense (recommended in Node) |
| `renderToReadableStream` | Web Streams (Deno, Bun, edge, modern Node) | Streaming SSR |
| `renderToString` | Any | Legacy, no streaming; waits for nothing (Suspense shows fallback) |
| `renderToStaticMarkup` | Any | Non-interactive HTML (emails); output cannot be hydrated |
| `prerender` / `prerenderToNodeStream` (`react-dom/static`) | Web / Node | Static generation: waits for **all** data, then returns HTML |
| `resume` / `resumeToPipeableStream` (React 19.2) | Web / Node | Partial pre-rendering: resume a pre-rendered shell with dynamic parts |

~~~ts
// Minimal Node streaming SSR (learning example)
import { renderToPipeableStream } from 'react-dom/server';

app.get('*', (req, res) => {
  const { pipe } = renderToPipeableStream(<App url={req.url} />, {
    bootstrapScripts: ['/assets/client.js'],
    onShellReady() {                 // shell (outside Suspense) ready: start sending
      res.setHeader('content-type', 'text/html');
      pipe(res);
    },
    onShellError() { res.status(500).send('<h1>Something went wrong</h1>'); },
    onError(err) { console.error(err); },
  });
});
~~~

**Streaming SSR + Suspense:** the server sends the shell immediately, then streams each `<Suspense>` section's HTML when its data is ready. **Selective hydration** hydrates sections independently and prioritises the part the user interacts with.

### React Server Components (RSC)

**Server Components** run only on the server (at request time or build time). Their code is **never sent to the browser**.

~~~tsx
// app/products/[id]/page.tsx — a Server Component (default in Next.js App Router)
import { db } from '@/lib/db';
import { AddToCartButton } from './AddToCartButton';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });   // direct DB access, no API route
  return (
    <article>
      <h1>{product!.name}</h1>
      <AddToCartButton productId={id} />   {/* Client Component */}
    </article>
  );
}
~~~

~~~tsx
// AddToCartButton.tsx
'use client';                                // marks a Client Component boundary
import { useState } from 'react';
export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>{added ? 'Added' : 'Add to cart'}</button>;
}
~~~

| | Server Component | Client Component |
|---|---|---|
| Runs | Server only | Server (for SSR HTML) **and** browser |
| Can be `async` / `await` data | Yes | No (use `use()` or a data library) |
| State, effects, event handlers | No | Yes |
| Access DB, file system, secrets | Yes | No |
| Adds to JS bundle | No | Yes |

- **RSC is not the same as SSR.** SSR turns components into HTML. RSC produces a serialised component tree (the RSC payload) that the client merges; Client Components inside it are still SSR'd/hydrated normally.
- Props passed from server to client components must be **serialisable** (no functions except Server Functions, no class instances).
- RSC needs framework/bundler support: Next.js App Router, React Router framework mode (RSC support), Waku, Parcel.

### Server Functions (Server Actions)

A function marked `'use server'` runs on the server but can be called from the client (React creates an RPC endpoint).

~~~tsx
// actions.ts
'use server';
export async function addToCart(formData: FormData) {
  const session = await getSession();                         // ✅ authenticate
  if (!session) throw new Error('Not signed in');
  const productId = z.string().uuid().parse(formData.get('productId'));   // ✅ validate
  await db.cartItem.create({ data: { userId: session.userId, productId } });
}

// in a component
<form action={addToCart}>
  <input type="hidden" name="productId" value={id} />
  <button>Add to cart</button>
</form>
~~~

**Security:** every Server Function is a **public HTTP endpoint**. Always authenticate, authorise and validate input inside it — the UI hiding the button does not protect it. Keep secrets out of Client Components and their props. Keep React and your framework patched; RSC/Server Function implementations have had critical security advisories (for example CVE-2025-55182, a December 2025 critical remote-code-execution flaw in the React Server Components packages of React 19.0–19.2, also affecting frameworks such as Next.js). See [Module 1 · API security](../../04-api-security/README.md).

---

## 4. Static site generation

### What is it?

**SSG** generates HTML **at build time** once, then serves the same files to everyone from a CDN.

| | SSG | SSR | CSR |
|---|---|---|---|
| HTML created | At build | Per request | In browser |
| Speed | Fastest (CDN) | Depends on server | Slow first load |
| Fresh data | Only after rebuild (or ISR) | Always | Always |
| Server needed | No | Yes | No |
| Good for | Docs, blogs, marketing, product catalogue | Personalised/fast-changing pages | Logged-in apps |

**ISR (Incremental Static Regeneration)** — Next.js re-generates static pages in the background after a set time or on demand, combining SSG speed with fresher data.

**Islands architecture** (Astro): most of the page is static HTML; only interactive "islands" ship JavaScript.

### Tools

| Tool | What it is | Notes |
|---|---|---|
| **Next.js** | Full React framework | Mixes SSG, SSR, ISR, RSC per route; `generateStaticParams`; `output: 'export'` for fully static sites |
| **Gatsby** | React SSG with GraphQL data layer | Plugin ecosystem; development has slowed sharply since its Netlify acquisition (2023) — avoid for new projects |
| **Astro** | Content-first multi-framework SSG/SSR | Ships zero JS by default; use React components as islands (`client:load`, `client:visible`) |
| **Docusaurus** | Documentation site generator (Meta) | MDX docs, versioning, search, i18n out of the box |
| **React Static** | Early lightweight React SSG | Unmaintained — know the name only |
| Others | React Router framework mode (`prerender`), Remix-based setups | Pre-render selected routes |

~~~tsx
// Next.js App Router: pre-render all product pages at build
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export const revalidate = 3600;   // ISR: regenerate at most once per hour
~~~

---

## Common mistakes

| Mistake | Safer approach |
|---|---|
| Testing implementation details (state, instance methods) | Test behaviour with RTL queries by role/label |
| Too many e2e tests | Integration tests for most cases; e2e for critical journeys |
| No type-check in CI because the bundler "compiles TS" | Run `tsc --noEmit` |
| Secrets in `VITE_*` / `NEXT_PUBLIC_*` variables | Keep secrets server-side |
| SSR for an internal dashboard "for performance" | CSR is simpler when SEO does not matter |
| Using browser APIs in Server Components | Move to a Client Component / effect |
| Server Functions without auth checks | Treat as public endpoints: authenticate, authorise, validate |
| Choosing Gatsby/React Static for new work | Next.js, Astro, Docusaurus, React Router |

## Interview questions

1. Compare unit, integration and e2e tests. What would you test where?
2. Shallow vs full rendering — why is shallow rendering discouraged?
3. Why did the community move from Enzyme to React Testing Library?
4. Playwright vs Cypress vs Puppeteer — when would you pick each?
5. What is the difference between a transpiler and a bundler?
6. How does Vite's dev server differ from webpack's?
7. What changes between development and production builds?
8. How and where would you code-split a React app?
9. CSR vs SSR — trade-offs? What is hydration?
10. What is streaming SSR and selective hydration?
11. Server Components vs Client Components vs SSR — explain the difference.
12. Why must Server Functions be treated as public API endpoints?
13. SSG vs SSR vs ISR — when would you choose each?

## Quick revision

- Tests: static → unit → integration (RTL, most value) → e2e (Playwright/Cypress) for key journeys.
- RTL tests behaviour; Enzyme is legacy.
- Build: transpile (Babel/SWC/esbuild) + bundle (Vite/webpack/Turbopack); prod = minified, tree-shaken, hashed, split.
- SSR: HTML per request + hydration; stream with `renderToPipeableStream`/`renderToReadableStream`.
- RSC: server-only components, zero client JS; `'use client'` boundary; `'use server'` functions are public endpoints.
- SSG: HTML at build; Next.js/Astro/Docusaurus today; Gatsby and React Static are legacy.

## References

- [Testing Library — Guiding Principles](https://testing-library.com/docs/guiding-principles) and [query priority](https://testing-library.com/docs/queries/about#priority).
- [Playwright docs](https://playwright.dev/) and [Cypress docs](https://docs.cypress.io/).
- [Vite — Why Vite](https://vite.dev/guide/why): why native ES modules speed up development.
- [react.dev — Server React DOM APIs](https://react.dev/reference/react-dom/server) and [Static APIs](https://react.dev/reference/react-dom/static).
- [react.dev — Server Components](https://react.dev/reference/rsc/server-components) and [Server Functions](https://react.dev/reference/rsc/server-functions).
- [Next.js — Rendering](https://nextjs.org/docs/app): Server/Client Components, static and dynamic rendering.

**Next:** [06 · Bonus topics](06-bonus-topics.md).
