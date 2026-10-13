# Web Security Handbook — Execution Plan

## Goal
Build a practical, source-backed web security handbook for frontend and full-stack engineers. Explain each risk, show request/data flows, give secure implementation patterns, and provide a 15-day learning plan.

## Workstreams
1. Foundations: threat modeling, assets, trust boundaries, security principles.
2. Browser/frontend: XSS, CSP, CSRF, CORS, clickjacking, browser storage.
3. Identity and access: authentication, sessions, OAuth/OIDC, JWT, authorization, IDOR/BOLA.
4. API and injection: input validation, rate limits, SQL/NoSQL/command injection, SSRF, SSTI.
5. Platform and data: HTTP/TLS, headers, databases, file uploads, cloud IAM, secrets, CI/CD.
6. Modern architectures: SSR, micro-frontends, WebSockets, AI/RAG tool boundaries.
7. Learning resources: official references, video links, glossary, authorized labs.
8. Editorial review: verify claims against primary sources, check links, label examples and threat assumptions.

## Deliverables
- Categorized topic pages with impact, root cause, attack flow, mitigations, tests, and references.
- Mermaid diagrams that render in GitHub.
- Animated explanatory GIFs in the starter archive.
- Prevention and review checklists.
- A 15-day bootcamp and safe lab guidance.
- Official resources and video learning list.

## Quality gates
- Prefer OWASP, MDN, IETF, browser-vendor, and project-maintainer references.
- Distinguish XSS, CSRF, CORS, authentication, and authorization accurately.
- Show parameterized queries and context-aware output encoding as defaults.
- Never suggest testing third-party systems without authorization.
- Avoid presenting a scanner or checklist as proof of security.
- Check all links and code samples before calling the handbook production-ready.

## Current status
- [x] Create initial categorized handbook package.
- [x] Add topic map, prevention checklist, resources, labs, glossary, and bootcamp.
- [x] Add animated GIF explainers to the downloadable starter archive.
- [x] Seed this GitHub repository with a landing README.
- [ ] Publish every Markdown page and GIF asset from the starter archive.
- [ ] Validate links and Mermaid rendering on GitHub.
- [ ] Review examples with current official guidance.
- [ ] Add CI for Markdown/link checks and contribution review.

## Publish locally
1. Download and extract the starter archive.
2. Copy its contents into this repository, preserving directory names.
3. Review README.md and PLAN.md, then commit.
4. Run a Markdown link checker and manually verify security-sensitive guidance.
5. Open a pull request for subsequent technical review.
