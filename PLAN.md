# Web Security Handbook — Execution Plan

## Goal
Build a practical, source-backed handbook for frontend and full-stack engineers. Cover both application security and frontend system design, with diagrams, examples, trade-offs, learning resources, and exercises.

## Workstreams
1. Foundations: threat modeling, assets, trust boundaries, security principles.
2. Browser/frontend security: XSS, CSP, CSRF, CORS, clickjacking, browser storage.
3. Identity and access: authentication, sessions, OAuth/OIDC, JWT, authorization, IDOR/BOLA.
4. API and injection: input validation, rate limits, SQL/NoSQL/command injection, SSRF, SSTI.
5. Platform and data: HTTP/TLS, headers, databases, file uploads, cloud IAM, secrets, CI/CD.
6. Frontend system design: networking, REST/GraphQL/gRPC, polling/SSE/WebSockets/WebRTC, state, caching, performance, LLD, HLD, PWA/offline, accessibility, observability.
7. Learning resources: official references, video links, glossary, authorized labs.
8. Editorial review: verify claims against primary sources, check links, label examples and assumptions.

## Deliverables
- Categorized topic pages with diagrams, practical guidance, tests, and references.
- Frontend system design LLD and HLD case studies.
- Video resources and 15-day learning plans.
- Prevention checklists and safe lab guidance.
- Quality review and link validation.

## Quality gates
- Prefer OWASP, MDN, W3C/WAI, IETF, browser-vendor, and project-maintainer references.
- Distinguish XSS, CSRF, CORS, authentication, and authorization accurately.
- Use parameterized queries and context-aware output encoding as defaults.
- Explain performance, state, caching, and protocol trade-offs rather than prescribing one stack.
- Never suggest testing third-party systems without authorization.
- Do not present a scanner or checklist as proof of security.
- Check links and code examples before calling the handbook production-ready.

## Current status
- [x] Add categorized security handbook and landing README.
- [x] Add security topic map, prevention checklist, labs, glossary, and resources.
- [x] Add frontend system design overview, communication patterns, performance/caching, LLD, HLD, and offline/accessibility/observability guides.
- [x] Add Namaste Frontend System Design video and curriculum links.
- [ ] Upload animated GIF assets from the starter package.
- [ ] Validate internal/external links and Mermaid rendering.
- [ ] Review examples against current official guidance.
- [ ] Add CI for Markdown/link checks and contribution review.
- [ ] Add more worked end-to-end design examples and testable code samples.

## Phased Systematic Upgrade Roadmap
- [x] **Step 1: Master Agent Standards:** Added `.cursorrules`, `CONTRIBUTING_GUIDELINES.md`, `AGENT_INSTRUCTIONS.md`, and `AGENTS.md`.
- [x] **Phase 1: Foundations & Client-Side (`00-foundations`, `01-browser-and-frontend`):** SOP, CORS, CSP, Clickjacking, Storage Security (Cookies vs LocalStorage vs IndexedDB).
- [x] **Phase 2: Identity & Session Management (`02-authentication-and-sessions`, `03-authorization`):** All auth types (Passkeys, OAuth2/OIDC with PKCE, mTLS, SSO), JWT vulnerabilities, Session Fixation/Hijacking, BOLA / IDOR, RBAC / ABAC / ReBAC / PBAC.
- [x] **Phase 3: Exploitation & APIs (`04-api-security`, `05-injection-attacks`):** API Speed & Performance, Load Balancing (L4 vs L7), Distributed Rate Limiting (Redis Lua), Idempotent Requests (`Idempotency-Key`), XSS (Stored, Reflected, DOM), SQLi, SSRF.
- [x] **Platform, Cloud & Checklists (`08-file-upload-and-serialization`, `09-cloud-infrastructure-devsecops`, `12-prevention-checklists`):** Presigned S3 uploads, Magic bytes, Insecure deserialization, Cloud IAM OIDC, Distroless containers, Pod security, Pre-commit Gitleaks, Full production checklists.
- [ ] **Phase 4: Architecture & Hardening (`06-http-network-and-headers`, `10-modern-apps-and-microfrontends`, `13-frontend-system-design`):** HSTS, Security Headers, Microfrontend isolation, Subresource Integrity (SRI), System Design Security.

## Recommended next steps
1. Review the new [Frontend System Design chapter](13-frontend-system-design/README.md).
2. Follow the [video learning resources](resources/FRONTEND_SYSTEM_DESIGN_VIDEOS.md).
3. Practice one LLD and one HLD question, documenting assumptions and trade-offs.
4. Validate links, add CI, and iterate on worked examples.
