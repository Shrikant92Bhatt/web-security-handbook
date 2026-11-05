# 03 — Frontend Engineering: React, Angular & Browser

[Module 2 home](README.md) · [Previous: JavaScript & TypeScript](02-javascript-typescript.md) · **Chapter 3 of 8**

## Browser and web platform

- DOM, CSSOM, render tree, layout, paint and compositing.
- Critical rendering path, script loading, hydration and client-side navigation.
- Accessibility, semantic HTML, keyboard navigation and WCAG basics.
- Web Workers, Service Workers, storage, caching and offline behavior.
- Core Web Vitals, code splitting, lazy loading and bundle analysis.

## React

- Components, props, state, reconciliation and virtual DOM.
- Hooks: useState, useEffect, useMemo, useCallback, useRef and custom hooks.
- Effect lifecycle, cleanup, stale closures and dependency correctness.
- Context vs state libraries; server state vs client state.
- Controlled/uncontrolled forms, refs, error boundaries and Suspense.
- Rendering, memoization, keys and performance profiling.
- SSR, hydration, streaming and framework trade-offs such as Next.js.

## Angular

- Components, templates, dependency injection and lifecycle hooks.
- Change detection, Zone.js and OnPush.
- RxJS Observable, Subject, BehaviorSubject and operators.
- Reactive forms, routing, guards, interceptors and lazy loading.
- Signals and RxJS: when each is appropriate.
- Standalone components, services and testing.

## Frontend architecture

Feature-based structure, shared libraries, design systems, micro-frontends, authentication flows, testing pyramid and accessibility.

## Interview questions

- What causes a React component to re-render?
- Explain useEffect cleanup and dependency-array mistakes.
- When should you use useMemo/useCallback?
- Compare Context, Redux, Zustand and server-state libraries.
- Explain reconciliation and why list keys matter.
- Compare CSR, SSR, SSG and streaming SSR.
- Explain Angular change detection and OnPush.
- Compare Observable and Promise; switchMap vs mergeMap vs concatMap?
- How would you design a reusable form system or component library?
- How do you diagnose a slow page or memory leak?

## Quick revision

Review rendering lifecycle, hooks, state ownership, RxJS operators, change detection, accessibility and performance metrics.

**Practice:** design a searchable, paginated data table with loading/error/empty states, URL-synced filters, keyboard accessibility and tests.

**Next:** [04 · Backend — Node.js & API Design](04-backend-nodejs.md).
