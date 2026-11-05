# 15-Day Web Security Bootcamp

Suggested pace: 60–120 minutes per day. Use a local demo app or an authorized training lab only.

| Day | Focus | Practice / output |
|---|---|---|
| 1 | Security basics and threat modeling | Draw assets, actors, trust boundaries, and threats |
| 2 | HTTP, TLS, browser origin model | Explain origin vs site and inspect response headers |
| 3 | XSS and output encoding | Replace unsafe DOM insertion; add regression tests |
| 4 | CSP and clickjacking | Draft a report-only CSP and frame policy |
| 5 | CSRF, cookies, CORS | Trace a cross-origin request and identify required controls |
| 6 | Authentication and sessions | Document login, renewal, logout, and revocation |
| 7 | OAuth/OIDC and token handling | Draw an authorization-code flow; identify redirect risks |
| 8 | Authorization, IDOR/BOLA | Add object-level authorization tests for two users |
| 9 | API validation and rate limits | Define validation schemas, quotas, and timeouts |
| 10 | SQL/NoSQL/command injection | Use parameterized queries and safe APIs |
| 11 | SSRF, path traversal, uploads | Create a server-side destination allowlist and upload checklist |
| 12 | Data protection and secrets | Review logging, encryption, backups, and secret rotation |
| 13 | Cloud, CI/CD, dependencies | Sketch least-privilege IAM and dependency scanning |
| 14 | Security testing and incident basics | Run a local scanner and triage findings manually |
| 15 | Capstone review | Threat model one feature, add tests, and present mitigations |

## Daily routine
1. Read the linked topic page and official reference.
2. Draw the data/request flow.
3. Write down the attacker precondition and business impact.
4. Implement or document at least one mitigation.
5. Add a test or checklist item to prevent regression.

## Capstone
Choose a feature such as profile editing or document upload. Submit a threat model, data-flow diagram, server-side authorization rules, validation strategy, logging considerations, and regression tests.

## Safety
Do not probe real sites or accounts unless you own them or have explicit authorization. Never use real credentials or production data in exercises.
