# Web Security Handbook — Security Coverage Matrix

> **Purpose:** Authoritative mapping of web security domains, industry standards (OWASP Top 10 2021, OWASP API Top 10 2023, OWASP ASVS v4.0.3, CWE), handbook chapter implementations, test evidence, and active coverage status.

Last updated: **October 2026**

---

## 🗺️ Master Coverage & Standards Alignment Matrix

| Category | Requirement / Topic | Priority | Handbook Chapter Location | Primary Standard / CWE | Test Evidence & Verification | Status |
|---|---|---|---|---|---|---|
| **00 Foundations** | Threat Modeling & Defense-in-Depth | P0 | [`00-foundations/README.md`](../00-foundations/README.md) | OWASP ASVS V1, STRIDE | Threat model diagram, asset-boundary matrix | ✅ Complete |
| **01 Browser** | Same-Origin Policy (SOP) & Sandbox | P0 | [`01-browser-and-frontend/same-origin-policy.md`](../01-browser-and-frontend/same-origin-policy.md) | W3C SOP, CWE-346 | Vitest origin parser test, DevTools inspection | ✅ Complete |
| **01 Browser** | Cross-Origin Resource Sharing (CORS) | P0 | [`01-browser-and-frontend/cross-origin-resource-sharing.md`](../01-browser-and-frontend/cross-origin-resource-sharing.md) | W3C CORS, OWASP A01:2021, CWE-942 | Supertest preflight validation test suite | ✅ Complete |
| **01 Browser** | Content Security Policy (CSP Level 3) | P0 | [`01-browser-and-frontend/content-security-policy.md`](../01-browser-and-frontend/content-security-policy.md) | W3C CSP3, OWASP A03:2021, CWE-79 | Vitest nonce verification, CSP evaluator audit | ✅ Complete |
| **01 Browser** | Clickjacking & Frame Busting | P0 | [`01-browser-and-frontend/clickjacking.md`](../01-browser-and-frontend/clickjacking.md) | W3C CSP `frame-ancestors`, CWE-1021 | Supertest header check, PoC frame test | ✅ Complete |
| **01 Browser** | Browser Storage Security (Cookies vs Storage) | P0 | [`01-browser-and-frontend/browser-storage-security.md`](../01-browser-and-frontend/browser-storage-security.md) | RFC 6265bis, OWASP A07:2021, CWE-539 | Cookie prefix assertion test (`__Host-`) | ✅ Complete |
| **01 Browser** | Cross-Site Request Forgery (CSRF) | P0 | [`01-browser-and-frontend/cross-site-request-forgery-csrf.md`](../01-browser-and-frontend/cross-site-request-forgery-csrf.md) | OWASP A01:2021, CWE-352, ASVS V4.2 | Supertest anti-CSRF token & SameSite tests | ✅ Complete |
| **02 Auth & Sessions** | All Authentication Types (Basic, Token, Passkeys) | P0 | [`02-authentication-and-sessions/all-auth-types.md`](../02-authentication-and-sessions/all-auth-types.md) | FIDO2 / WebAuthn, OWASP A07:2021 | WebAuthn mock ceremony test, Argon2id verify | ✅ Complete |
| **02 Auth & Sessions** | JWT Security & Cryptographic Pitfalls | P0 | [`02-authentication-and-sessions/jwt-security.md`](../02-authentication-and-sessions/jwt-security.md) | RFC 7519, RFC 8725, CWE-347 | Vitest algorithm-confusion rejection test | ✅ Complete |
| **02 Auth & Sessions** | OAuth 2.0, OpenID Connect & PKCE | P0 | [`02-authentication-and-sessions/oauth2-oidc-pkce.md`](../02-authentication-and-sessions/oauth2-oidc-pkce.md) | RFC 7636, RFC 8252, OWASP ASVS V3 | S256 code verifier calculation test | ✅ Complete |
| **02 Auth & Sessions** | Session Management & Session Fixation | P0 | [`02-authentication-and-sessions/session-management-and-fixation.md`](../02-authentication-and-sessions/session-management-and-fixation.md) | OWASP A07:2021, CWE-384, ASVS V3.3 | Supertest session regeneration test | ✅ Complete |
| **02 Auth & Sessions** | Refresh Token Rotation & Reuse Detection | P0 | [`02-authentication-and-sessions/refresh-token-rotation-and-reuse-detection.md`](../02-authentication-and-sessions/refresh-token-rotation-and-reuse-detection.md) | RFC 6749 §10.4, OWASP ASVS V3.7 | Vitest token family revocation test suite | ✅ Complete |
| **03 Authorization** | IDOR & Broken Object Level Authorization (BOLA) | P0 | [`03-authorization/idor-bola.md`](../03-authorization/idor-bola.md) | OWASP API1:2023, CWE-639 | Multi-tenant tenant scoping Vitest tests | ✅ Complete |
| **03 Authorization** | RBAC vs ABAC vs ReBAC (Google Zanzibar) | P0 | [`03-authorization/rbac-abac-rebac.md`](../03-authorization/rbac-abac-rebac.md) | NIST SP 800-162, OWASP A01:2021 | Permission matrix unit test suite | ✅ Complete |
| **03 Authorization** | BFLA & Multi-Tenant PostgreSQL Row-Level Security | P0 | [`03-authorization/bfla-and-tenant-isolation.md`](../03-authorization/bfla-and-tenant-isolation.md) | OWASP API5:2023, CWE-285, ASVS V4.1 | PostgreSQL RLS schema validation test | ✅ Complete |
| **04 API Security** | API Performance & Fast Optimization | P1 | [`04-api-security/api-performance-and-optimization.md`](../04-api-security/api-performance-and-optimization.md) | RFC 9111 (HTTP Caching), Brotli | Supertest ETag & compression assertion | ✅ Complete |
| **04 API Security** | Load Balancing Algorithms & Layer 4 vs 7 | P1 | [`04-api-security/load-balancing.md`](../04-api-security/load-balancing.md) | Layer 4/7 OSI, Consistent Hashing | Node.js round-robin simulation test | ✅ Complete |
| **04 API Security** | Rate Limiting & Throttling Algorithms | P0 | [`04-api-security/rate-limiting-and-throttling.md`](../04-api-security/rate-limiting-and-throttling.md) | OWASP API4:2023, CWE-770 | Redis Lua sliding window burst test | ✅ Complete |
| **04 API Security** | Idempotent Requests & Distributed Locks | P0 | [`04-api-security/idempotent-requests.md`](../04-api-security/idempotent-requests.md) | IETF draft-idempotency-key, Stripe Spec | Vitest parallel duplicate request test | ✅ Complete |
| **04 API Security** | Real-Time: WebSockets, SSE & Apache Kafka | P0 | [`04-api-security/websockets-sse-and-kafka-realtime.md`](../04-api-security/websockets-sse-and-kafka-realtime.md) | RFC 6455, WHATWG SSE, CWE-346 (CSWSH) | Vitest origin rejection & wscat verification | ✅ Complete |
| **04 API Security** | OpenAPI / Swagger Integration & Security | P0 | [`04-api-security/openapi-swagger-nodejs-integration.md`](../04-api-security/openapi-swagger-nodejs-integration.md) | OpenAPI 3.1, OWASP API9:2023 | Zod validation & production gatekeeper test | ✅ Complete |
| **05 Injection** | Cross-Site Scripting (XSS) Deep Dive | P0 | [`05-injection-attacks/xss-deep-dive.md`](../05-injection-attacks/xss-deep-dive.md) | OWASP A03:2021, CWE-79 | DOMPurify sanitization & React JSX tests | ✅ Complete |
| **05 Injection** | Server-Side Request Forgery (SSRF) | P0 | [`05-injection-attacks/ssrf-deep-dive.md`](../05-injection-attacks/ssrf-deep-dive.md) | OWASP A10:2021, CWE-918 | Private IP range blocker & DNS rebinding test | ✅ Complete |
| **05 Injection** | SQL Injection & ORM Leaks | P0 | [`05-injection-attacks/sqli-and-orm-leaks.md`](../05-injection-attacks/sqli-and-orm-leaks.md) | OWASP A03:2021, CWE-89 | Parameterized pg query & Prisma leak tests | ✅ Complete |
| **06 HTTP & Network** | HTTPS, TLS 1.3 & PKI Browser Trust | P0 | [`06-http-network-and-headers/https-tls-pki-browser-trust.md`](../06-http-network-and-headers/https-tls-pki-browser-trust.md) | RFC 8446 (TLS 1.3), RFC 5280, RFC 6960 | OpenSSL s_client verification & OCSP test | ✅ Complete |
| **06 HTTP & Network** | Complete NGINX Masterclass & Hardening | P0 | [`06-http-network-and-headers/nginx-reverse-proxy-and-hardening.md`](../06-http-network-and-headers/nginx-reverse-proxy-and-hardening.md) | CIS NGINX Benchmark, CWE-400 | `nginx -t`, Slowloris timeout validation | ✅ Complete |
| **07 Data & Database** | Database Types & Indexing Internals | P1 | [`07-data-and-database/database-types-and-indexing-deep-dive.md`](../07-data-and-database/database-types-and-indexing-deep-dive.md) | Relational vs NoSQL, B+Tree, GIN, LSM | `EXPLAIN ANALYZE` query planner tests | ✅ Complete |
| **07 Data & Database** | Redis In-Memory Caching & Distributed Locks | P0 | [`07-data-and-database/redis-architecture-caching-and-node-integration.md`](../07-data-and-database/redis-architecture-caching-and-node-integration.md) | Redis Protocol, CWE-306, Redlock Spec | Vitest stampede mutex & ioredis test | ✅ Complete |
| **07 Data & Database** | Zero-Downtime Database Migrations | P0 | [`07-data-and-database/zero-downtime-database-migrations.md`](../07-data-and-database/zero-downtime-database-migrations.md) | Expand & Contract Pattern, Safe DDL | PostgreSQL advisory lock & batch backfill | ✅ Complete |
| **08 File Uploads** | File Upload Security & Magic Bytes | P0 | [`08-file-upload-and-serialization/README.md`](../08-file-upload-and-serialization/README.md) | OWASP A08:2021, CWE-434, Magic Bytes | File-type header verification & S3 bucket test | ✅ Complete |
| **09 DevSecOps** | Cloud IAM, Secrets & CI/CD Security | P0 | [`09-cloud-infrastructure-devsecops/README.md`](../09-cloud-infrastructure-devsecops/README.md) | OWASP A05:2021, CIS Benchmarks | GitHub Actions OIDC role validation test | ✅ Complete |
| **10 Modern Apps** | Micro-frontends & LLM Security | P1 | [`10-modern-apps-and-microfrontends/README.md`](../10-modern-apps-and-microfrontends/README.md) | OWASP Top 10 for LLM, Webpack MFE | Prompt injection delimiter & boundary tests | ✅ Complete |
| **11 Testing & Tools** | SAST, DAST, SCA & OWASP ZAP Automation | P0 | [`11-security-testing-and-tools/README.md`](../11-security-testing-and-tools/README.md) | OWASP WSTG v4.2, OWASP ZAP | Automated ZAP baseline container scan | ✅ Complete |
| **12 Prevention** | Master Hardening Checklists & Blueprints | P0 | [`12-prevention-checklists/README.md`](../12-prevention-checklists/README.md) | CIS Benchmarks, NIST SP 800-53 | Pull Request & Production release checklist | ✅ Complete |
| **13 System Design** | Networking & Communication Patterns | P1 | [`13-frontend-system-design/communication-patterns.md`](../13-frontend-system-design/communication-patterns.md) | System Design Principles, RFC 9110 | Debounced fetch & stale request cancellation | ✅ Complete |
| **14 DevOps & Deploy** | Complete Full-Stack Deployment Playbook | P0 | [`14-devops-and-deployment/how-to-deploy-fullstack-app.md`](../14-devops-and-deployment/how-to-deploy-fullstack-app.md) | Production VPS Hardening, Docker Compose | Native PM2 cluster & Certbot SSL tests | ✅ Complete |
| **14 DevOps & Deploy** | GitHub Actions CI/CD Full-Stack Pipeline | P0 | [`14-devops-and-deployment/github-actions-cicd-fullstack.md`](../14-devops-and-deployment/github-actions-cicd-fullstack.md) | Automated Delivery, Lint/Test/Build/Deploy | GitHub Actions runner workflow simulation | ✅ Complete |
| **14 DevOps & Deploy** | PM2 Process Manager, RabbitMQ & Serverless | P0 | [`14-devops-and-deployment/pm2-rabbitmq-and-serverless.md`](../14-devops-and-deployment/pm2-rabbitmq-and-serverless.md) | AMQP 0-9-1, Node.js Cluster, AWS Lambda | RabbitMQ DLQ backoff & PM2 cluster tests | ✅ Complete |
| **14 DevOps & Deploy** | Multi-Cloud Deployment: Hostinger, GCP & AWS | P1 | [`14-devops-and-deployment/multi-cloud-deployment-hostinger-gcp-aws.md`](../14-devops-and-deployment/multi-cloud-deployment-hostinger-gcp-aws.md) | Cloud Architecture, Terraform, Docker | VPS security benchmark, UFW firewall audit | ✅ Complete |

---

## 🎯 Gap Analysis & Immediate P0 Execution Roadmap

From our repository audit and `PLAN.md` alignment, the two highest-priority security gaps required to complete foundational coverage are:

1. **CSRF Deep Dive (`01-browser-and-frontend/cross-site-request-forgery-csrf.md`):**
   - Threat model of ambient credentialed requests.
   - Breakdown of `SameSite=Lax` vs `Strict` vs `None`, including the 2-minute Lax-by-default window in Chromium and top-level navigation GET exceptions.
   - Synchronizer Token Pattern (STP) vs Double-Submit Cookie Pattern vs Encrypted Token.
   - Strict Origin / Referer validation algorithms.
   - Production React + Node.js/Express implementation with automated Vitest integration test.

2. **Refresh Token Rotation & Reuse Detection (`02-authentication-and-sessions/refresh-token-rotation-and-reuse-detection.md`):**
   - Token family theft detection (RFC 6749 §10.4).
   - Instant revocation of all descendant and active tokens upon reuse attempt.
   - Sliding expiration vs Absolute session timeouts.
   - Production Redis-backed token family tracking in Node.js/Express with automated Vitest race condition and theft tests.
