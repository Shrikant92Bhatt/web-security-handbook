# 15-Day Frontend System Design Study Plan

Designed for experienced frontend engineers preparing for tech-lead or senior system design interviews. Aim for 60–90 minutes daily and produce diagrams or notes rather than only watching videos.

| Day | Topic | Practice deliverable |
|---|---|---|
| 1 | Interview framework and web architecture | Requirements, scale assumptions, browser-to-backend diagram |
| 2 | HTTP, DNS, TLS, REST and API contracts | Design a paginated REST endpoint with errors and timeouts |
| 3 | GraphQL, gRPC and protocol trade-offs | Compare options for a dashboard and a service-to-service call |
| 4 | Polling, long polling, SSE, WebSockets, WebRTC | Choose a protocol for live comments, chat, and video |
| 5 | State management and data fetching | Separate local, URL, server-cache, and persistent state |
| 6 | HTTP caching, CDN and query cache | Define cache keys, freshness, invalidation, and private data rules |
| 7 | Rendering and performance | Choose CSR/SSR/SSG; define performance budgets and measurements |
| 8 | Low-level design: autocomplete | Define component API, debounce, cancellation, keyboard behavior, tests |
| 9 | Low-level design: infinite scroll and nested comments | Design pagination, virtualization, retries, and state transitions |
| 10 | High-level design: social feed | Draw architecture and explain media delivery, cache, and pagination |
| 11 | High-level design: e-commerce or analytics dashboard | Define search/filter URL state, freshness, exports, and failure states |
| 12 | Micro-frontends and design systems | Decide module boundaries, versioning, routing, shared dependencies |
| 13 | PWA, offline, accessibility | Define offline scope, sync conflicts, keyboard and screen-reader support |
| 14 | Testing and observability | Build a test matrix and define client-side metrics and alerts |
| 15 | Mock interview and review | Present one LLD and one HLD in 45 minutes each; record trade-offs |

## Daily method

1. Read the corresponding chapter.
2. Watch one focused lesson from the [video resource list](../resources/FRONTEND_SYSTEM_DESIGN_VIDEOS.md).
3. Draw the architecture without copying an existing solution.
4. Write assumptions, alternatives, failure modes, security controls, and metrics.
5. Explain why the chosen design is appropriate and when you would change it.

## Final mock-interview rubric

- Requirements and constraints are clear.
- The architecture and data flow are understandable.
- API and state contracts are explicit.
- Performance, security, accessibility, and reliability are addressed.
- The design includes loading, empty, failure, retry, and offline states where relevant.
- Trade-offs are justified; no unnecessary complexity is introduced.
- Testing, monitoring, deployment, and evolution are considered.

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [Namaste Frontend System Design Complete Walkthrough (Akshay Saini)](https://www.youtube.com/watch?v=RCZ8mvsKEu4) — Foundation series covering all 15 study days from protocols to mock interviews.
- 🎥 [Senior Frontend System Design Interview Masterclass (Chirag Goel)](https://www.youtube.com/watch?v=rc3JGT56kd4) — High-scoring mock interview walkthroughs for FAANG/Tier-1 frontend engineering loops.
- 🎥 [System Design Interview: An Insider's Guide (ByteByteGo)](https://www.youtube.com/watch?v=kY31Wn6Vw6I) — Structured communication techniques for technical lead assessments.

### 📖 Primary Documentation & Specifications
- 📜 [Frontend System Design Interview Playbook](https://www.systemdesignhandbook.com/guides/frontend-system-design-interview/) — Comprehensive 4-stage interview timing and pacing blueprint.
- 📜 [MDN Web Platform Documentation](https://developer.mozilla.org/en-US/docs/Web) — Authoritative living standard for all browser APIs and network behaviors.

### 🧪 Interactive Hands-On Training Labs & Mock Interviews
- 🎯 [NamasteDev FSD Community & Exercises](https://namastedev.com/learn/namaste-frontend-system-design) — Structured repository with 15-day hands-on assignments.
- 🎯 [GreatFrontEnd Practice Modules](https://www.greatfrontend.com/system-design) — Interactive mock interview simulator and rubric evaluation.

