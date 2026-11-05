# Frontend System Design

A practical curriculum for senior frontend and lead engineers designing scalable, accessible, secure, and maintainable browser applications. It complements the security chapters rather than replacing them.

## Study plan
Follow the [15-day Frontend System Design study plan](15-day-study-plan.md) and use the [video resource list](../../resources/FRONTEND_SYSTEM_DESIGN_VIDEOS.md) for guided learning.

## A repeatable interview framework

1. **Clarify requirements:** user journeys, functional scope, devices, accessibility, offline needs, real-time expectations, and failure modes.
2. **Estimate scale:** users, request rates, payload sizes, update frequency, media volume, and latency targets.
3. **Define boundaries:** browser, CDN/edge, frontend app, API gateway/BFF, backend services, data stores, and third parties.
4. **Design the data flow:** API contracts, pagination, caching, state ownership, synchronization, and error handling.
5. **Design the UI structure:** routes, components, state boundaries, design system, and module ownership.
6. **Address quality attributes:** performance, security, accessibility, reliability, observability, and maintainability.
7. **Explain trade-offs:** why this design fits the constraints, what it costs, and how it evolves.
8. **Close with validation:** tests, metrics, rollout, fallback behavior, and risks.

## Curriculum

| Topic | Learn and practice |
|---|---|
| [Networking and communication](communication-patterns.md) | HTTP, REST, GraphQL, gRPC, polling, WebSockets, SSE, WebRTC, webhooks |
| [Performance and caching](performance-and-caching.md) | rendering, Core Web Vitals, CDN, HTTP cache, app cache, code splitting |
| [Low-level design](low-level-design.md) | component contracts, state, design patterns, SOLID, common UI widgets |
| [High-level design](high-level-design.md) | feeds, chat, e-commerce, video, collaborative editors, dashboards |
| [Offline, accessibility, and observability](offline-accessibility-observability.md) | PWA, service workers, keyboard/screen reader support, telemetry and alerts |

