# Core Web Development — Complete Learning Path

**In simple words:** This subject explains how a web page is structured, styled, made interactive, connected to servers, stored locally, rendered and tested. It belongs in Module 2 after JavaScript fundamentals and before React/Angular.

[Module 2 home](../README.md) · [JavaScript & TypeScript](../02-javascript-typescript.md) · [Frontend frameworks](../03-frontend-react-angular.md)

## Learning order

1. HTML and semantic web
2. CSS and responsive layout
3. Browser JavaScript and DOM
4. Browser runtime, events and rendering
5. Network, APIs and browser storage
6. Performance, accessibility and testing

## 1. HTML and semantic web

- Document structure: doctype, html, head, body, metadata, title, charset, viewport and language.
- Elements, attributes, text nodes, nesting, void elements, global attributes, data attributes and boolean attributes.
- Semantic elements: header, nav, main, section, article, aside, footer, headings, lists, figure, time and address.
- Links: absolute/relative URLs, fragments, download, target and safe navigation behavior.
- Images: alt text, intrinsic dimensions, srcset, sizes, picture, lazy loading and responsive images.
- Forms: label, input types, name/value, textarea, select, button, fieldset, legend, required, pattern, min/max, autocomplete, FormData and native validation.
- Embedded media: audio, video, captions, transcripts, iframe, sandbox overview, SVG and Canvas.
- Accessibility basics: semantic controls, accessible names, labels, heading order, keyboard use and focus order.
- Script loading: normal, async, defer, module scripts, parsing and DOMContentLoaded.

**Practice:** build a semantic product listing and filter form without CSS or a framework.

## 2. CSS and responsive layout

- CSS syntax, selectors, combinators, attribute selectors, pseudo-classes and pseudo-elements.
- Cascade, inheritance, specificity, source order, !important, cascade layers and CSS resets.
- Box model: content, padding, border, margin, box-sizing, overflow, intrinsic sizing and margin collapse.
- Display and formatting: block, inline, inline-block and normal flow.
- Positioning: static, relative, absolute, fixed, sticky, containing blocks, stacking contexts and z-index.
- Flexbox: axes, alignment, wrapping, gap, grow, shrink and basis.
- Grid: tracks, fr, repeat, minmax, auto-fit, auto-fill, implicit grid and named areas.
- Responsive design: mobile-first, breakpoints, media queries, container queries, orientation and reduced motion.
- Units: px, %, em, rem, vw, vh, svh, lvh, dvh, ch and clamp/min/max.
- Typography, fonts, color, contrast, custom properties, themes and logical properties.
- Transitions, transforms, keyframes, animation events and prefers-reduced-motion.
- Modern CSS: aspect-ratio, object-fit, isolation, @supports, @container and nesting.
- Debugging with computed styles, box model, grid/flex inspectors and responsive emulation.

**Practice:** create a responsive catalogue using Grid, Flexbox, a mobile filter drawer and visible focus styles.

## 3. Browser JavaScript and DOM

- Separate ECMAScript (the language) from browser Web APIs (features provided by the browser).
- Browser globals: window, document, navigator, location, history, screen, console, performance and crypto.
- DOM model: Document, Node, Element, Text, DocumentFragment, parent/child/sibling relationships and live versus static collections.
- Selection: getElementById, querySelector, querySelectorAll, closest and matches.
- Read/update: textContent, innerText, innerHTML, attributes, DOM properties, classList, dataset, style and form values.
- Create/remove: createElement, append, prepend, replaceChildren, remove, cloneNode and DocumentFragment.
- Forms: input/change/submit, FormData, validity APIs, focus, reset and file input.
- Events: EventTarget, add/removeEventListener, target/currentTarget, bubbling, capturing, delegation, preventDefault, stopPropagation, once, passive and AbortSignal cleanup.
- Event types: click, pointer, keyboard, touch, focus, blur, input, change, submit, scroll, resize, visibilitychange, popstate, hashchange and custom events.
- Browser APIs: URL/URLSearchParams, Clipboard, File/Blob, Geolocation, Notifications, Fullscreen, Page Visibility, ResizeObserver, IntersectionObserver, MutationObserver, requestAnimationFrame, Canvas, SVG and MediaDevices.
- Browser modules: type=module, import/export, dynamic import, module scope, strict mode, import maps overview, CORS requirements and differences from CommonJS/AMD/UMD.
- DevTools: Console, Elements, Sources, Network, Application, Performance, Memory and Accessibility panels.

**Practice:** build a searchable list with DOM updates, delegated events, form validation and listener cleanup.

## 4. Browser runtime, events and rendering

- Call stack, execution contexts, synchronous work and run-to-completion.
- Event loop, task queue, microtask queue, Promise callbacks, queueMicrotask, timers and rendering opportunities.
- Why setTimeout delay is a minimum rather than an exact schedule; why microtask chains can delay rendering.
- Rendering model: HTML parsing, DOM, CSS parsing, CSSOM, render tree, style calculation, layout, paint and compositing.
- Reflow/layout, repaint, compositing, layout shift, forced synchronous layout and layout thrashing.
- Lifecycle: DOMContentLoaded, load, pageshow/pagehide, visibilitychange, beforeunload limitations and back-forward cache.
- Scheduling: setTimeout, setInterval, requestAnimationFrame, debounce, throttle and idle work.
- Workers: Web Workers, Shared Workers, Service Workers, message passing, structured clone, transferable objects and worker limitations.
- Memory: reachability, garbage collection concept, detached DOM nodes, retained listeners, timers, subscriptions and cleanup.

**Practice:** profile a large list filter, move expensive computation into a Web Worker and compare responsiveness.

## 5. Network, APIs and browser storage

- HTTP request/response, URL, DNS, TCP, TLS, HTTP/1.1, HTTP/2, HTTP/3, methods, status codes, headers, cookies and caching.
- Fetch API: Request, Response, Headers, response.ok, JSON/text/blob, credentials, cache, redirect and AbortController.
- Important Fetch behavior: HTTP 404/500 responses do not normally reject the Promise; check response.ok.
- Error handling: loading, empty, success, network error, timeout, cancellation, stale responses and safe retries.
- XMLHttpRequest: lifecycle, progress, timeout, abort and why Fetch is the normal default for new code.
- Origin = scheme + host + port; same-origin policy, CORS, preflight, OPTIONS, credentials and postMessage concepts.
- Storage comparison: localStorage, sessionStorage, cookies, IndexedDB, Cache API and in-memory state.
- Storage quotas, eviction, schema upgrades, transactions, serialization and storage events.
- Cookie attributes: Domain, Path, Expires/Max-Age, Secure, HttpOnly and SameSite. Security policy and session design belong in Module 1.
- Service Worker lifecycle: register, install, activate, fetch, update, scope, offline fallback and cache strategies.
- Real-time choices: polling, long polling, Server-Sent Events, WebSockets and WebRTC overview.

**Practice:** build a product search that cancels stale requests, handles errors and supports an offline cached shell.

## 6. Performance, accessibility and testing

- Critical rendering path, network waterfall, bundle size, compression, caching, image optimization, font loading and code splitting.
- Lazy loading, virtualization, avoiding long tasks, minimizing layout work and measuring before optimizing.
- Core Web Vitals: LCP, INP and CLS; causes, fixes, field versus lab data.
- Accessibility: WCAG principles, semantic structure, landmarks, keyboard access, focus visibility, labels, errors, contrast, zoom, captions and reduced motion.
- ARIA roles/states/properties, accessible names, live regions and dialog focus management. Prefer native HTML.
- Testing layers: unit, component/integration, end-to-end, accessibility, cross-browser, responsive, offline and visual regression.
- Understand JSDOM limitations; use real browsers for layout, rendering, navigation and focus behavior.
- DevTools workflow: Console, Network, Elements, Application, Performance, Memory, Coverage and Lighthouse.
- Production checklist: keyboard use, mobile layout, loading/error/empty states, offline behavior, no console errors, realistic performance tests and critical journey coverage.

**Practice:** measure and optimize the catalogue, add keyboard support, accessible errors and unit/integration/browser tests.

## Topic boundaries with the rest of the handbook

- Core JavaScript language concepts stay in 02-javascript-typescript.md.
- Browser APIs and normal web platform behavior belong here.
- React and Angular framework concepts stay in 03-frontend-react-angular.md.
- Detailed XSS, CSP, SOP/CORS attack implications, CSRF, clickjacking, secure cookies, iframe isolation and browser security headers belong in Module 1. Link to those chapters rather than duplicating them here.

## Interview readiness checklist

You should be able to explain semantic HTML, the box model, cascade and specificity, Flexbox versus Grid, DOM traversal, event delegation, event propagation, event loop and microtasks, rendering pipeline, Fetch error handling, CORS preflight, storage trade-offs, service worker lifecycle, Web Workers, Core Web Vitals and keyboard accessibility.

## Primary references

- [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN JavaScript technologies overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/JavaScript_technologies_overview)
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN client-side APIs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs)
- [MDN client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage)
- [web.dev Performance](https://web.dev/learn/performance/)
- [W3C WAI](https://www.w3.org/WAI/fundamentals/accessibility-intro/)
