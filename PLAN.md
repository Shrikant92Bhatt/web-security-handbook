# Web Security Handbook — Execution Plan

> **Purpose for coding agents:** Use this file as the implementation backlog for improving the existing handbook into a detailed, practical, source-backed, one-stop reference. Inspect the repository before editing. Extend existing pages when a topic is already covered; do not create duplicate chapters just to satisfy a checklist. Implement changes in small, reviewable batches and keep this plan updated.

## 1. Goal and definition of done

Build a reliable, detailed handbook for frontend and full-stack engineers, especially React, Angular, TypeScript, JavaScript, Node.js, APIs, SSR, micro-frontends, databases, cloud infrastructure, and CI/CD.

A topic is **complete only when** it explains the concept in simple language, shows how it works, demonstrates the risk and the mitigation, includes practical examples and verification, and links to trustworthy references. A topic is not complete merely because a heading or external link exists.

### Definition of done for each substantial topic
- [ ] Plain-language definition, prerequisites, mental model, and terminology.
- [ ] Explain why the issue occurs, affected assets, attack preconditions, likely impact, and trust boundaries.
- [ ] Step-by-step flow or Mermaid diagram where it materially helps understanding.
- [ ] Clearly labelled vulnerable example and corrected implementation, where code is appropriate.
- [ ] Examples use the relevant stack (JavaScript/TypeScript, React/Angular, Node.js, SQL/PostgreSQL, or cloud config as appropriate).
- [ ] Explain why the mitigation works and what it does **not** protect against.
- [ ] Positive, negative, edge-case, and regression tests with expected outcomes.
- [ ] Common mistakes, ineffective fixes, compatibility concerns, and production rollout guidance.
- [ ] Actionable developer/reviewer/operations checklist.
- [ ] Cross-links to related handbook chapters.
- [ ] Primary references with exact, relevant documentation/specification links and version/date context where applicable.
- [ ] Verify code syntax and links; do not claim examples were executed unless they actually were.

## 2. Working rules for coding agents

1. Read `AGENTS.md`, `CONTRIBUTING.md`, this plan, and the target chapter before making changes.
2. Search the repository for a topic before creating a new file. Prefer improving an existing deep-dive page and updating its parent README/navigation.
3. Preserve the existing folder structure and useful content. Avoid broad rewrites that discard accurate material.
4. Write explanations, not just headings, two-line summaries, or lists of links. Define acronyms at first use and use small, progressive examples.
5. Label unsafe code clearly as **intentionally vulnerable / lab-only**. Provide a safe alternative next to it. Do not provide instructions to attack systems without authorization.
6. Use safe, non-destructive examples and intentionally vulnerable local labs only. Never include real secrets, production credentials, or unapproved targets.
7. Prefer primary sources: OWASP, MDN, W3C/WAI, IETF RFCs, browser-vendor docs, framework docs, and cloud-vendor security docs. Tutorials/videos are supplementary, not authoritative substitutes.
8. Avoid absolute claims such as “unhackable,” “100% secure,” or unsubstantiated performance/security multipliers. Explain assumptions and trade-offs.
9. Verify standards edition and publication status before citing it. Distinguish stable releases from drafts and work in progress.
10. Keep navigation, glossary, topic map, official references, checklists, and this plan synchronized whenever a chapter is added or renamed.
11. Use Mermaid diagrams that render on GitHub; validate fenced code blocks and relative links.
12. Work in small batches. After each batch, summarize changed files, checks run, results, unresolved issues, and next steps. Do not mark a task complete without evidence.

## 3. Current handbook structure

Retain and improve these existing categories:

- `00-foundations/` — threat modeling, assets, trust boundaries, defense in depth.
- `01-browser-and-frontend/` — browser security, SOP, CORS, CSP, clickjacking, browser storage.
- `02-authentication-and-sessions/` — cookies, OAuth/OIDC, JWT, MFA, sessions and passkeys.
- `03-authorization/` — BOLA/IDOR, RBAC/ABAC/ReBAC/PBAC, tenant isolation.
- `04-api-security/` — API controls, rate limiting, idempotency, performance, real-time communication.
- `05-injection-attacks/` — XSS, SQL/NoSQL injection, SSRF and other interpreter attacks.
- `06-http-network-and-headers/` — TLS/PKI, HTTP security headers, reverse proxies.
- `07-data-and-database/` — data protection, databases, indexing and migrations.
- `08-file-upload-and-serialization/` — uploads, path traversal, archive handling, serialization.
- `09-cloud-infrastructure-devsecops/` — IAM, secrets, containers, CI/CD and cloud controls.
- `10-modern-apps-and-microfrontends/` — SSR, micro-frontends, AI/RAG and trust boundaries.
- `11-security-testing-and-tools/` — SAST, DAST, SCA, scanning and authorized labs.
- `12-prevention-checklists/` — PR, frontend, API, release and operational checklists.
- `13-frontend-system-design/` — frontend networking, state, performance, caching, LLD/HLD, accessibility and observability.
- `14-devops-and-deployment/` — deployment, CI/CD, processes, queues and cloud hosting.

Before adding a topic, check the actual contents and links in the corresponding folder. The inventory above is a map, not proof that every listed subject has a complete implementation.

## 4. Priority backlog

### P0 — Close core security coverage gaps

#### P0.1 Browser and frontend security
Target: `01-browser-and-frontend/`, `05-injection-attacks/`
- [x] Audit and deepen CSRF coverage: implemented in [cross-site-request-forgery-csrf.md](01-browser-and-frontend/cross-site-request-forgery-csrf.md) with ambient authority threat model, SameSite limitations, Double-Submit Cookie pattern, strict Origin checks, React hooks, and Vitest test suite.
- [ ] Cover DOM clobbering, safe DOM APIs, context-aware output encoding, Trusted Types, and sanitizer limitations.
- [ ] Cover unsafe URL handling and open redirects, including scheme validation and redirect allowlists.
- [ ] Review `postMessage` security: exact origin checks, message schema validation, sender assumptions, iframe sandboxing, and tests.
- [ ] Add cache poisoning and cache deception fundamentals, with CDN/reverse-proxy cache-key and sensitive-response examples.
- [ ] Explain third-party script and dependency risks, integrity/allowlisting options, and limitations of Subresource Integrity.
- [ ] Explain browser isolation/policy headers and distinguish CSP, frame-ancestors, X-Frame-Options, COOP, COEP, CORP, Permissions Policy, HSTS, and nosniff; state when each is relevant.
- [ ] Add a browser security decision table and update chapter navigation, topic map, and checklists.

#### P0.2 Identity and session lifecycle
Target: `02-authentication-and-sessions/`
- [ ] Review registration, email verification, password reset, account recovery, MFA enrollment/recovery, and account enumeration.
- [ ] Deepen session lifecycle: issue, renew, rotate, idle/absolute expiry, revoke, logout, device/session management, and incident-driven revocation.
- [x] Explain refresh-token rotation and reuse detection: implemented in [refresh-token-rotation-and-reuse-detection.md](02-authentication-and-sessions/refresh-token-rotation-and-reuse-detection.md) with RFC 6749 §10.4 token family architecture, Redis store, theft alarm sequence diagram, React concurrency queue, and Vitest test suite.
- [ ] Review OAuth 2.0/OIDC flows: Authorization Code + PKCE, redirect URI exact matching, state, nonce, issuer/audience validation, token storage, mix-up and replay considerations.
- [ ] Cover JWT verification policy, key rotation, issuer/audience/expiry, algorithm allowlists, key confusion risks, and revocation trade-offs.
- [ ] Cover phishing-resistant MFA/passkeys, recovery codes, step-up authentication, and lost-device recovery.
- [ ] Include service-to-service identity and workload credentials without conflating user authentication with service authentication.
- [ ] Add a lifecycle matrix showing control, enforcement point, failure mode, and tests.

#### P0.3 Authorization and API security
Target: `03-authorization/`, `04-api-security/`
- [ ] Audit BOLA/IDOR, BFLA, tenant isolation, and role/policy examples for object-, function-, and property-level enforcement.
- [ ] Cover mass assignment and excessive data exposure; validate allowed input fields and response DTOs.
- [ ] Add business-logic abuse examples: coupon reuse, booking/payment manipulation, workflow bypass, quota abuse, and replay.
- [ ] Add race conditions and TOCTOU examples, with transactions, atomic updates, uniqueness constraints, locking trade-offs, and concurrency tests.
- [ ] Add GraphQL security: object-level authorization, depth/complexity limits, batching abuse, introspection policy, and resource budgets.
- [x] Expand WebSocket/SSE security: implemented in [websockets-sse-and-kafka-realtime.md](04-api-security/websockets-sse-and-kafka-realtime.md) with CSWSH protection, heartbeat ping-pong, SSE Last-Event-ID, Kafka consumer groups, and Vitest tests.
- [ ] Cover webhook signature verification, timestamp/replay protection, idempotency, and secret rotation.
- [ ] Cover API inventory/version retirement, third-party API consumption, request/response schema validation, pagination limits, and resource consumption controls.
- [ ] Explain HTTP request smuggling/desynchronization at a conceptual level: parser disagreement, proxy/backend alignment, safe configuration and authorized lab validation.
- [ ] Map API topics to the OWASP API Security Top 10; do not claim complete coverage until every category is mapped.

#### P0.4 Injection and server-side request risks
Target: `05-injection-attacks/`
- [ ] Inventory SQL/NoSQL, command, template, LDAP where applicable, and XSS coverage; distinguish parameterization from context-aware encoding.
- [ ] Deepen SSRF: allowlisted destinations, redirects, DNS resolution/rebinding, IPv4/IPv6 and alternate IP encodings, metadata endpoint protections, egress controls, and safe error handling.
- [ ] Add prototype pollution with source/sink, merge/parse risks, impact, patched dependency guidance, and regression tests.
- [ ] Add path traversal and archive extraction cross-links to file handling, avoiding duplicate explanations.
- [ ] Add secure code and tests for each relevant injection type; unsafe examples must remain local/lab-only.

#### P0.5 Security testing and verification
Target: `11-security-testing-and-tools/`, `12-prevention-checklists/`
- [ ] Define a layered verification approach: threat modeling, peer review, unit/integration tests, SAST, SCA, secret scanning, container/IaC scanning, DAST, and manual business-logic testing.
- [ ] Add authorization regression-test patterns for user A/user B and tenant A/tenant B.
- [ ] Explain fuzzing/property-based testing and malformed-input testing with a small, safe example where practical.
- [ ] Define severity triage, exploitability/context, false positives, remediation ownership, and risk-based release gates.
- [ ] Clarify that a clean scanner result or checklist is not proof of security.
- [ ] Include authorized-scope requirements for all active testing and lab instructions.

### P1 — Production, enterprise, and architecture depth

#### P1.1 SSR, frontend frameworks, and micro-frontends
Target: `10-modern-apps-and-microfrontends/`, `13-frontend-system-design/`
- [ ] Cover SSR/server-component trust boundaries, server-only secrets, serialized page data, hydration, unsafe HTML, and request-specific cache leakage.
- [ ] Explain secure caching for authenticated content at browser, service worker, CDN, and server layers.
- [ ] Cover MFE remote-bundle trust, runtime configuration, shared dependency risk, host/remote boundaries, and independent authorization.
- [ ] Add secure service-worker/PWA/offline patterns: cache contents, logout cleanup, offline data sensitivity, update lifecycle, and stale authorization.
- [ ] Include React and Angular examples where framework behavior materially differs; do not imply frontend route guards replace backend authorization.

#### P1.2 HTTP, edge, and infrastructure security
Target: `06-http-network-and-headers/`, `09-cloud-infrastructure-devsecops/`, `14-devops-and-deployment/`
- [ ] Explain proxy trust, forwarded headers, TLS termination, request-size limits, timeouts, connection limits, and safe error handling.
- [ ] Cover WAF strengths and limits; do not present it as a replacement for secure application code.
- [ ] Add cloud storage exposure, IAM least privilege, workload identity/OIDC, metadata service protection, egress control, and secret rotation.
- [ ] Cover container runtime hardening, non-root execution, read-only filesystem where feasible, capability reduction, image provenance, and patching.
- [ ] Add Kubernetes RBAC/secrets/network-policy basics if Kubernetes is in scope; mark advanced operator topics separately.
- [ ] Add infrastructure-as-code scanning and policy checks where relevant.

#### P1.3 Supply chain and software delivery
Target: `09-cloud-infrastructure-devsecops/`, `14-devops-and-deployment/`
- [ ] Cover lockfile integrity, dependency confusion, typosquatting, compromised packages, maintainer/account compromise, and transitive dependency risk.
- [ ] Explain SBOMs, build provenance, artifact signing/verification, dependency update policy, and trusted CI workflows at a practical level.
- [ ] Review least-privilege GitHub Actions permissions, untrusted pull-request workflows, pinned actions, secret exposure, and OIDC-based deployments.
- [ ] Document how to triage and respond to a newly disclosed dependency vulnerability.

#### P1.4 Data protection, privacy, and resilience
Target: `07-data-and-database/`, `04-api-security/`, `09-cloud-infrastructure-devsecops/`
- [ ] Cover data classification, minimization, retention/deletion, PII redaction, audit logging, encryption key management/rotation, and backup restore tests.
- [ ] Cover queue poisoning, replay/duplicate messages, dead-letter queues, idempotent consumers, poison-message handling, and sensitive payloads.
- [ ] Explain DoS/resource exhaustion controls: bounded concurrency, queue backpressure, timeouts, retry budgets, exponential backoff with jitter, and circuit breakers.
- [ ] Add tenant isolation checks for database queries, exports, background jobs, caches, and logs.

#### P1.5 Incident response
Target: add `docs/INCIDENT-RESPONSE-PLAYBOOK.md` and link from security/testing/checklists chapters.
- [ ] Document preparation, detection, triage, containment, credential/session rotation, evidence preservation, recovery, communications ownership, and post-incident review.
- [ ] Add example playbooks for leaked API key, suspected account takeover, vulnerable dependency, exposed storage, and cross-tenant data leak.
- [ ] Avoid including real credentials or organization-specific confidential incident details.

#### P1.6 AI/LLM and retrieval-augmented applications
Target: `10-modern-apps-and-microfrontends/`
- [ ] Expand prompt injection and indirect prompt injection through documents, web pages, and tool results.
- [ ] Cover retrieval/data poisoning, access-control-aware retrieval, tenant filtering, citations, and sensitive-data leakage.
- [ ] Explain least-privilege tool permissions, argument/schema validation, server-side authorization, confirmation for high-impact actions, and audit logging.
- [ ] Cover unsafe output rendering, secret exposure, untrusted tool results, and evaluation/red-team tests.
- [ ] Make clear that prompts and model instructions are not security boundaries; enforce policy in application/backend code.

### P2 — Advanced or optional modules
- [ ] Cryptography for web engineers: password hashing vs encryption, salts/work factors, authenticated encryption, key derivation, randomness, signatures, key rotation, and common implementation mistakes.
- [ ] HTTP/2 and HTTP/3 security considerations, TLS configuration, certificate validation, DNS rebinding, and protocol edge cases.
- [ ] Advanced multi-tenant models: row-level security, schema/database-per-tenant trade-offs, tenant-context propagation, and isolation tests.
- [ ] Mobile/desktop client security as a clearly labelled companion module if project scope expands beyond web.
- [ ] Security architecture review workshop: STRIDE, attack trees, abuse cases, risk prioritization, and design trade-offs.

## 5. Standards and reference coverage

Maintain `resources/OFFICIAL_REFERENCES.md` as a curated, checked index, not an unannotated link dump.

- [ ] Map relevant OWASP ASVS requirements to handbook topics; verify the current stable version before citing.
- [ ] Map OWASP Web Security Testing Guide test areas to testing chapters; distinguish stable releases from drafts.
- [ ] Map every OWASP API Security Top 10 category to a chapter, test or explicitly documented gap.
- [ ] Add MDN references for browser and HTTP behavior; link the exact topic page near the explanation it supports.
- [ ] Add relevant IETF RFCs for HTTP, OAuth security, cookies, TLS and related protocols.
- [ ] Add W3C/WAI references for accessibility and relevant browser standards.
- [ ] Add official React, Angular, Node.js, PostgreSQL, GitHub Actions and cloud-provider documentation when giving stack-specific guidance.
- [ ] Record the standard/specification name, version/status, last-checked date, and relevant chapters in a coverage matrix.
- [ ] Recheck version-sensitive links and claims periodically; do not describe a draft as a final standard.
- [ ] Keep videos and blog posts as supplementary learning resources, not the sole source for security-sensitive claims.

## 6. Required planning and quality artifacts

Create or maintain these files. Check whether they already exist before creating them.

- [ ] `docs/SECURITY-COVERAGE-MATRIX.md` — rows for requirement/topic, priority, handbook location, reference/standard, test evidence, and status.
- [ ] `docs/CHAPTER-AUTHORING-GUIDE.md` — reusable content template and style rules for detailed explanations.
- [ ] `docs/THREAT-MODELING-WORKBOOK.md` — reusable assets, actors, data flows, trust boundaries, STRIDE, abuse cases, and mitigations.
- [ ] `docs/INCIDENT-RESPONSE-PLAYBOOK.md` — practical response workflow and example scenarios.
- [ ] `labs/README.md` or equivalent — lab prerequisites, safe scope, reset instructions, expected outcomes, and cleanup.
- [ ] `examples/README.md` or equivalent — runnable sample inventory, stack/version prerequisites, and test commands.
- [ ] Update `README.md`, `docs/SECURITY-MAP.md`, glossary, official references, and prevention checklists as topics are added or moved.
- [ ] Add a contributor/agent rule that new pages must be linked from the relevant parent README and topic map.

### Recommended chapter layout

Use this structure when it fits the topic; small reference pages may use a shorter format but must still be accurate and useful.

1. What it is — plain-language definition and terminology.
2. Why it matters — assets, impact, preconditions, trust boundaries.
3. How it works — step-by-step mechanism and diagram.
4. Vulnerable example — clearly labelled lab-only code/configuration.
5. Secure implementation — corrected code and explanation.
6. Testing — positive, negative, edge, and regression cases with expected results.
7. Common mistakes — false fixes, limitations, and related vulnerabilities.
8. Production checklist — developer, reviewer, architect, and operations controls.
9. Trade-offs and rollout — compatibility, observability, deployment, and performance.
10. Related topics and authoritative references.

## 7. Documentation CI and validation

- [ ] Inspect existing workflows before adding a new workflow; reuse existing tooling where practical.
- [ ] Add Markdown linting with a documented configuration and a reproducible local command.
- [ ] Validate internal relative links and report external-link failures separately to avoid flaky CI.
- [ ] Validate Mermaid syntax/rendering where feasible.
- [ ] Add spelling/terminology checks where they provide useful signal.
- [ ] Add example-specific tests or syntax checks for runnable code; do not claim execution if the environment cannot run them.
- [ ] Run checks on pull requests and document how to interpret failures.
- [ ] Ensure CI does not expose secrets or run unsafe active scans against third-party systems.
- [ ] Add a contribution review checklist for correctness, source quality, accessibility of diagrams, and duplicate content.
- [ ] Define a lightweight periodic review process for outdated links, standards, dependency versions, and browser behavior.

## 8. Existing work and status

The repository already contains categorized security and frontend-system-design chapters, a security topic map, prevention checklists, glossary/resources, learning plans, and DevOps/deployment material. The repository also has `AGENTS.md` and `CONTRIBUTING.md` referenced in the existing plan.

Do not mark a topic “complete” based only on the existence of a heading or overview. Audit its actual depth, examples, tests, links, and navigation before changing status.

- [x] Categorized handbook and landing README exist.
- [x] Security topic map, prevention checklist, glossary, and resource pages exist.
- [x] Frontend system design overview and related learning resources exist.
- [x] Core chapters exist for browser security, identity, authorization, APIs, injection, HTTP/network, data, file handling, cloud/DevSecOps, modern applications, testing, and deployment.
- [ ] Audit existing pages against the chapter definition of done.
- [x] Create/update the security coverage matrix and authoring guide: created docs/SECURITY-COVERAGE-MATRIX.md and docs/CHAPTER-AUTHORING-GUIDE.md.
- [ ] Verify current standards versions and update source mappings.
- [ ] Expand priority gaps with substantive explanations, examples, tests, and cross-links.
- [ ] Validate all internal links, external references, and Mermaid diagrams.
- [ ] Add documentation CI and contributor checks.
- [ ] Add end-to-end secure reference application walkthroughs.
- [ ] Re-review claims and examples before describing the handbook as production-ready.

## 9. Suggested implementation sequence

Complete in small, independently reviewable pull requests or commits:

1. **Inventory and map:** inspect all chapter files, detect duplicates and missing navigation, then build `docs/SECURITY-COVERAGE-MATRIX.md`.
2. **Authoring standard:** add/update `docs/CHAPTER-AUTHORING-GUIDE.md` and align `AGENTS.md` / `CONTRIBUTING.md`.
3. **Critical browser and identity gaps:** CSRF, DOM security, session/token lifecycle, account recovery, and OAuth/OIDC edge cases.
4. **Authorization and API gaps:** property-level authorization, business-logic abuse, race conditions, GraphQL, WebSockets, webhooks, inventory and resource limits.
5. **Injection and file handling:** prototype pollution, SSRF hardening, path/archive edge cases, and safe regression tests.
6. **Verification and production controls:** security tests, CI gates, supply chain, cloud/edge, data privacy, resilience, and incident response.
7. **Modern architecture:** SSR/MFE cache isolation, service workers/offline data, AI/RAG boundaries, and secure end-to-end examples.
8. **Quality automation:** Markdown, link, Mermaid, and code-example validation.
9. **Final audit:** compare the coverage matrix to the actual repository and report completed items, remaining gaps, and checks performed.

## 10. Final release gate

Do not label the handbook “complete” or “production-ready” until:
- [ ] High-priority coverage gaps have been addressed or explicitly documented as out of scope.
- [ ] Every major topic meets the chapter definition of done or has a justified lightweight format.
- [ ] The coverage matrix is synchronized with actual pages and authoritative references.
- [ ] Internal links and diagrams have been checked.
- [ ] Automated documentation checks pass, or any failures are clearly reported with reasons.
- [ ] Code examples have been validated to the extent possible and their status is accurately described.
- [ ] Safety guidance limits active testing to owned or explicitly authorized systems.
- [ ] The final summary lists files changed, checks run, outstanding issues, and follow-up tasks.

## 11. Recommended next actions for the coding tool

Start by inspecting `AGENTS.md`, `CONTRIBUTING.md`, all existing chapter README files, and the current link-check/CI setup. Then create or update the coverage matrix and authoring guide. Do not attempt to rewrite the entire handbook in one pass. Choose the highest-priority real gaps, make focused edits with detailed explanations and examples, update all navigation, run available checks, and report evidence plus remaining work.
