# Web Security Handbook

A categorized, diagram-driven web security handbook for frontend and full-stack engineers, especially React, Angular, TypeScript, Node.js, APIs, and micro-frontends.

## Start here
- [Project plan and execution checklist](PLAN.md)
- [15-day bootcamp](bootcamp/README.md)
- [Security topic map](docs/SECURITY-MAP.md)
- [Prevention checklists](12-prevention-checklists/README.md)
- [Videos and hands-on learning](resources/VIDEOS.md)
- [Official references](resources/OFFICIAL_REFERENCES.md)
- [Glossary](resources/GLOSSARY.md)

## Handbook categories
| Category | Topics |
|---|---|
| [00 Foundations](00-foundations/README.md) | Threat modeling, assets, trust boundaries, defense in depth |
| [01 Browser and frontend](01-browser-and-frontend/README.md) | XSS, CSP, CSRF, CORS, clickjacking, browser storage |
| [02 Authentication and sessions](02-authentication-and-sessions/README.md) | Cookies, OAuth/OIDC, JWT, MFA, session lifecycle |
| [03 Authorization](03-authorization/README.md) | IDOR/BOLA, RBAC/ABAC, tenant isolation |
| [04 API security](04-api-security/README.md) | Validation, rate limits, GraphQL, WebSockets |
| [05 Injection attacks](05-injection-attacks/README.md) | SQL/NoSQL injection, SSRF, command injection, SSTI |
| [06 HTTP and network](06-http-network-and-headers/README.md) | TLS, headers, CORS, caching, proxy trust |
| [07 Data and database](07-data-and-database/README.md) | Least privilege, encryption, backups, logging |
| [08 File handling](08-file-upload-and-serialization/README.md) | Uploads, path traversal, serialization |
| [09 Cloud and DevSecOps](09-cloud-infrastructure-devsecops/README.md) | IAM, secrets, CI/CD, containers, dependencies |
| [10 Modern applications](10-modern-apps-and-microfrontends/README.md) | SSR, MFEs, AI/RAG, tool boundaries |
| [11 Testing and tools](11-security-testing-and-tools/README.md) | SAST, DAST, SCA, ZAP, safe labs |
| [12 Prevention checklists](12-prevention-checklists/README.md) | PR, frontend, API, release checklists |

## How every topic should be learned
1. Understand the vulnerability and business impact.
2. Follow the Mermaid attack/request-flow diagram.
3. Find the root cause in a small example.
4. Apply layered prevention controls.
5. Verify with a regression test or authorized lab.
6. Read the linked official references.

## Diagrams and GIFs
Mermaid diagrams are embedded in topic pages and render on GitHub. Animated GIF explainers are planned in the downloadable starter package; the GitHub edition currently uses Mermaid diagrams so the handbook remains text-reviewable and easy to maintain.

## Safety
Only test systems you own or are explicitly authorized to assess. Use intentionally vulnerable training environments for exercises. A checklist or scanner cannot guarantee an application is secure.
