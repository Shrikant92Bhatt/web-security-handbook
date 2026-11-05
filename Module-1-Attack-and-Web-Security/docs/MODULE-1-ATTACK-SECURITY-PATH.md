# Module 1 — Attack & Web Security

This is the **primary module**. Learn security from the attacker's perspective, then turn that understanding into defensive engineering.

## The method for every attack

1. **Domain:** identify the surface or trust boundary.
2. **Family/category:** group related weaknesses.
3. **Attack type:** name the technique.
4. **Variant:** understand different forms.
5. **Root cause and flow:** identify the missing validation, trust decision or control.
6. **Impact:** explain confidentiality, integrity, availability and business impact.
7. **Mitigation:** apply controls at the correct enforcement layer.
8. **Verification:** prove the fix with tests, logs and safe security checks.

Start with the [Attack catalog](ATTACK-CATALOG.md), then read the canonical chapters in order.

## Sequential reading order

| Step | Topic | Chapter |
|---:|---|---|
| 1 | Security foundations, threat modeling and trust boundaries | [00 · Foundations](../00-foundations/README.md) |
| 2 | Browser/client attacks: SOP, CORS, CSP, XSS, CSRF, clickjacking, storage | [01 · Browser & frontend security](../01-browser-and-frontend/README.md) |
| 3 | Authentication, sessions, OAuth/OIDC, JWT and token lifecycle | [02 · Authentication & sessions](../02-authentication-and-sessions/README.md) |
| 4 | Authorization, IDOR/BOLA, BFLA, RBAC/ABAC and tenant isolation | [03 · Authorization](../03-authorization/README.md) |
| 5 | API security, abuse cases, rate limits, idempotency and realtime APIs | [04 · API security](../04-api-security/README.md) |
| 6 | Injection: SQL/NoSQL, command, XSS, SSRF, XXE and template injection | [05 · Injection attacks](../05-injection-attacks/README.md) |
| 7 | HTTP/network attack surface, TLS, proxies and headers | [06 · HTTP & network security](../06-http-network-and-headers/README.md) |
| 8 | Data protection, database security, Redis and migrations | [07 · Data & database security](../07-data-and-database/README.md) |
| 9 | File uploads, path traversal and serialization | [08 · File handling](../08-file-upload-and-serialization/README.md) |
| 10 | Cloud IAM, secrets, containers, supply chain and DevSecOps | [09 · Cloud & DevSecOps](../09-cloud-infrastructure-devsecops/README.md) |
| 11 | SSR, micro-frontends, AI/RAG and modern application boundaries | [10 · Modern applications](../10-modern-apps-and-microfrontends/README.md) |
| 12 | SAST, DAST, SCA, threat modeling and authorized labs | [11 · Security testing](../11-security-testing-and-tools/README.md) |
| 13 | Practical secure coding and release checklists | [12 · Prevention checklists](../12-prevention-checklists/README.md) |

## Finish Module 1

- Revisit the [attack catalog](ATTACK-CATALOG.md) and explain each major family without reading.
- For each attack, describe one vulnerable flow, one secure design and one regression test.
- Use the [attack playbook template](ATTACK-PLAYBOOK-TEMPLATE.md) to deepen missing topics.
- Use the [security bootcamp](../bootcamp/README.md) for structured practice.

**Next:** [Module 2 — Full-Stack Engineering & Interview Prep](../15-fullstack-interview/README.md).
