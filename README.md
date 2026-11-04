# Web Security & Engineering Handbook

A practical, source-backed handbook for engineers building secure web applications and scalable frontend/full-stack systems.

The content is organized like a technical documentation site: browse by domain, follow a guided learning path, or search for a specific concept. Each chapter should help you understand **what it is, how it works, where it fails, how to implement it safely, and how to verify the result**.

> **Scope note:** This repository contains three related but distinct tracks: application security, frontend system design, and deployment/operations. They are intentionally separated in the navigation so readers can follow one track without confusing architecture topics with security controls.

## Start with a learning path

| I want to… | Start here |
|---|---|
| Learn web security from the ground up | [Security foundations](00-foundations/README.md) → [Browser security](01-browser-and-frontend/README.md) |
| Secure login, tokens and sessions | [Authentication & sessions](02-authentication-and-sessions/README.md) |
| Prevent access-control and API flaws | [Authorization](03-authorization/README.md) → [API security](04-api-security/README.md) |
| Understand common attack classes | [Injection attacks](05-injection-attacks/README.md) → [File handling](08-file-upload-and-serialization/README.md) |
| Harden transport, data and infrastructure | [HTTP & network](06-http-network-and-headers/README.md) → [Data](07-data-and-database/README.md) → [Cloud & DevSecOps](09-cloud-infrastructure-devsecops/README.md) |
| Design modern frontend applications | [Frontend system design](13-frontend-system-design/README.md) |
| Deploy and operate full-stack applications | [DevOps & deployment](14-devops-and-deployment/README.md) |
| Practice with a structured schedule | [15-day security bootcamp](bootcamp/README.md) |

## Handbook

### Part I — Web application security

| Chapter | What it covers |
|---|---|
| [00 · Foundations](00-foundations/README.md) | Assets, actors, threat modeling, trust boundaries, defense in depth |
| [01 · Browser & frontend security](01-browser-and-frontend/README.md) | Same-origin policy, CORS, CSP, CSRF, clickjacking, browser storage |
| [02 · Authentication & sessions](02-authentication-and-sessions/README.md) | Authentication methods, OAuth 2.0/OIDC, JWT, session lifecycle, refresh-token rotation |
| [03 · Authorization](03-authorization/README.md) | IDOR/BOLA, BFLA, RBAC/ABAC/ReBAC, tenant isolation |
| [04 · API security](04-api-security/README.md) | Rate limits, idempotency, API contracts, real-time APIs, performance and load balancing |
| [05 · Injection attacks](05-injection-attacks/README.md) | XSS, SQL injection, SSRF and interpreter boundaries |
| [06 · HTTP & network security](06-http-network-and-headers/README.md) | TLS, PKI, browser trust, reverse proxies and hardening |
| [07 · Data & database](07-data-and-database/README.md) | Database models, indexing, Redis, caching, migrations and data protection |
| [08 · File handling & serialization](08-file-upload-and-serialization/README.md) | Upload validation, path traversal and serialization risks |
| [09 · Cloud infrastructure & DevSecOps](09-cloud-infrastructure-devsecops/README.md) | IAM, secrets, containers, dependencies and delivery controls |
| [10 · Modern applications](10-modern-apps-and-microfrontends/README.md) | SSR, micro-frontends, AI/RAG and trust boundaries |
| [11 · Security testing & tools](11-security-testing-and-tools/README.md) | SAST, DAST, SCA, scanners and authorized labs |
| [12 · Prevention checklists](12-prevention-checklists/README.md) | Developer, reviewer, API, frontend and release checklists |

### Part II — Frontend system design

| Chapter | What it covers |
|---|---|
| [13 · Frontend system design](13-frontend-system-design/README.md) | Communication patterns, HLD, LLD, performance, caching, offline support, accessibility and observability |
| [15-day study plan](13-frontend-system-design/15-day-study-plan.md) | A structured interview-preparation path |

### Part III — Delivery and operations

| Chapter | What it covers |
|---|---|
| [14 · DevOps & deployment](14-devops-and-deployment/README.md) | CI/CD, full-stack deployment, cloud hosting, PM2, RabbitMQ and serverless |

## Reference desk

- [Security topic map](docs/SECURITY-MAP.md) · [Coverage matrix](docs/SECURITY-COVERAGE-MATRIX.md)
- [Information architecture](docs/INFORMATION-ARCHITECTURE.md) · [Chapter authoring guide](docs/CHAPTER-AUTHORING-GUIDE.md)
- [Official references](resources/OFFICIAL_REFERENCES.md) · [Glossary](resources/GLOSSARY.md)
- [Security videos](resources/VIDEOS.md) · [Frontend system design videos](resources/FRONTEND_SYSTEM_DESIGN_VIDEOS.md)
- [Diagrams](diagrams/README.md) · [Labs](labs/README.md) · [Project plan](PLAN.md)

## How to use a chapter

1. Read the overview and prerequisites; identify the asset and trust boundary involved.
2. Follow the diagram or request flow before reading implementation details.
3. Compare the intentionally vulnerable example with the secure pattern.
4. Run or adapt the verification steps in a local, authorized environment.
5. Review the checklist and follow the links to adjacent concepts and primary references.

## Browse as a documentation site

The repository includes a [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) configuration with hierarchical navigation and built-in search.

```bash
python -m pip install -r requirements-docs.txt
python -m mkdocs serve
```

Open the local address printed by MkDocs. To generate the static site:

```bash
python -m mkdocs build --strict
```

## Content and safety principles

- Prefer primary references: OWASP, MDN, W3C/WAI, IETF RFCs, framework documentation and cloud-provider security guidance.
- Label intentionally vulnerable examples as lab-only and show a safer alternative.
- Test only systems you own or are explicitly authorized to assess.
- Explain assumptions, limitations and trade-offs; no checklist or scanner can guarantee security.
- Treat videos and blog posts as supplementary learning resources, not the sole authority for security-sensitive claims.

See [CONTRIBUTING.md](CONTRIBUTING.md) before adding or changing chapters.
