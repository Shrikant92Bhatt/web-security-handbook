# Web Security and Frontend System Design Handbook

A categorized, diagram-driven handbook for frontend and full-stack engineers, especially React, Angular, TypeScript, Node.js, APIs, and micro-frontends. It combines application security with senior-level frontend architecture and system design.

## Start here
- [Frontend System Design curriculum](13-frontend-system-design/README.md)
- [15-day Frontend System Design study plan](13-frontend-system-design/15-day-study-plan.md)
- [System design videos and learning resources](resources/FRONTEND_SYSTEM_DESIGN_VIDEOS.md)
- [Project plan and execution checklist](PLAN.md)
- [15-day security bootcamp](bootcamp/README.md)
- [Security topic map](docs/SECURITY-MAP.md)
- [Prevention checklists](12-prevention-checklists/README.md)
- [Security videos and hands-on learning](resources/VIDEOS.md)
- [Official security references](resources/OFFICIAL_REFERENCES.md)
- [Glossary](resources/GLOSSARY.md)

## Handbook categories
| Category | Topics |
|---|---|
| [00 Foundations](00-foundations/README.md) | Threat modeling, assets, trust boundaries, defense in depth |
| [01 Browser and frontend security](01-browser-and-frontend/README.md) | XSS, CSP, CSRF, CORS, clickjacking, browser storage |
| [02 Authentication and sessions](02-authentication-and-sessions/README.md) | Cookies, OAuth/OIDC, JWT, MFA, session lifecycle |
| [03 Authorization](03-authorization/README.md) | IDOR/BOLA, RBAC/ABAC, tenant isolation |
| [04 API security](04-api-security/README.md) | Performance, Load Balancing, Rate Limiting, Idempotency, WebSockets, SSE & Kafka |
| [05 Injection attacks](05-injection-attacks/README.md) | SQL/NoSQL injection, SSRF, command injection, SSTI |
| [06 HTTP and network security](06-http-network-and-headers/README.md) | TLS 1.3, PKI Browser Trust, NGINX Reverse Proxy & Hardening, HTTP Security Headers |
| [07 Data and database security](07-data-and-database/README.md) | DB Types, Indexing (B+Tree, Hash, GIN, LSM), Zero-Downtime Migrations, Encryption |
| [08 File handling](08-file-upload-and-serialization/README.md) | Uploads, path traversal, serialization |
| [09 Cloud and DevSecOps](09-cloud-infrastructure-devsecops/README.md) | IAM, secrets, CI/CD, containers, dependencies |
| [10 Modern applications](10-modern-apps-and-microfrontends/README.md) | SSR, micro-frontends, AI/RAG, tool boundaries |
| [11 Security testing and tools](11-security-testing-and-tools/README.md) | SAST, DAST, SCA, ZAP, safe labs |
| [12 Security prevention checklists](12-prevention-checklists/README.md) | PR, frontend, API, release checklists |
| [13 Frontend system design](13-frontend-system-design/README.md) | Networking, communication, performance, caching, LLD, HLD, offline support, accessibility, observability |
| [14 DevOps and deployment](14-devops-and-deployment/README.md) | GitHub Actions CI/CD, React + Node + Postgres, PM2, RabbitMQ, Serverless, Hostinger, GCP, AWS |

## How to use this handbook
1. Read the relevant topic and clarify the problem or requirement.
2. Follow the Mermaid data-flow or architecture diagram.
3. Compare the options and trade-offs before choosing a design.
4. Apply security, performance, accessibility, and reliability controls.
5. Validate with tests, measurements, and authorized labs.
6. Revisit official references for implementation details.

## Safety and accuracy
Only test systems you own or are explicitly authorized to assess. Use intentionally vulnerable training environments for security exercises. A checklist, course, or scanner cannot guarantee an application is secure. Video links are learning aids; validate security-sensitive advice against primary documentation.
