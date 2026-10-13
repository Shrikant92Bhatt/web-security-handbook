# Frontend High-Level Design (HLD)

HLD describes system boundaries, major components, data flow, scale assumptions, quality attributes, and trade-offs. Start with requirements; do not jump straight to a fashionable stack.

## Case study framework

For each prompt:
1. Clarify product scope and core user journeys.
2. Estimate users, concurrency, update frequency, data size, and latency.
3. Draw browser, CDN, frontend, API/BFF, services, storage, and telemetry boundaries.
4. Define APIs, data contracts, pagination, cache behavior, and failure handling.
5. Explain rendering, state, accessibility, security, testing, and deployment.
6. Discuss scaling bottlenecks, trade-offs, and evolution.

## Example: social feed

```mermaid
flowchart LR
  B[Browser UI] --> CDN[CDN: app and media]
  B --> API[Feed API / BFF]
  API --> F[Feed service]
  F --> C[Cache]
  F --> DB[(Feed data)]
  B --> IMG[Image optimization service]
  B --> TEL[Client telemetry]
```

Discuss cursor pagination, ranking latency, skeleton/loading states, media lazy loading, virtualization, optimistic likes, cache invalidation, moderation, and accessibility.

## Case study prompts

| Product | Main design challenges |
|---|---|
| Social/photo feed | Cursor pagination, ranking, image delivery, optimistic actions, virtualization |
| E-commerce marketplace | Search/filter URL state, inventory freshness, cart consistency, checkout resilience |
| Video streaming | Adaptive streaming, CDN delivery, player state, captions, network changes |
| Collaborative document | Realtime updates, conflict resolution, offline edits, presence, undo/redo |
| Live chat/comments | Ordering, reconnect, event replay, unread counts, optimistic messages |
| Analytics dashboard | Query filters, large datasets, charts, export jobs, stale-data indicators |
| Ride-hailing map | Geolocation permissions, map performance, live updates, battery and privacy |
| Design tool | Canvas rendering, keyboard access, undo/redo, collaborative state |
| Shared design system | Versioning, multi-team ownership, visual regression, migration strategy |
| Micro-frontend portal | Deployment independence, routing, shared dependencies, failure isolation and auth boundaries |

## Architecture trade-offs to articulate

- SSR improves initial HTML and can help SEO, but introduces server cost and cache/personalization complexity.
- Micro-frontends can support independent delivery, but increase runtime, dependency, testing, and observability complexity.
- Optimistic UI improves perceived latency, but requires rollback and conflict behavior.
- WebSockets reduce update latency, but add connection lifecycle and scaling costs.
- A BFF can simplify client contracts, but becomes another service to operate.
- Global state can simplify cross-route sharing, but overuse creates coupling; keep local state local.

References: [System Design Handbook — Frontend System Design](https://www.systemdesignhandbook.com/guides/frontend-system-design/), [Namaste FSD curriculum repository](https://github.com/namastedev/namaste-frontend-system-design).
