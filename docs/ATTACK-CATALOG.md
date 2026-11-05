# Attack catalog & taxonomy

This is the attack-first entry point. Classify each topic as **domain → attack family → attack type → variant**. Then study its root cause, impact, defenses, verification and learning resources.

> Taxonomy is for navigation, not a claim that an attack has only one cause. OWASP Top 10 categories are a separate risk lens: map techniques to one or more OWASP risks rather than forcing a one-to-one hierarchy.

## How the hierarchy works

| Level | Question | Example |
|---|---|---|
| Domain | What surface or trust boundary is targeted? | Browser / client |
| Family | What broad weakness is abused? | Injection |
| Attack type | What is the named technique? | Cross-site scripting |
| Variant | What form does it take? | Stored, reflected, DOM-based XSS |
| Controls | What reduces the risk? | Contextual encoding, safe DOM APIs, sanitization for supported HTML, CSP as defense-in-depth |
| Verification | How do we know? | Unit, integration and authorized security tests |

## 1. Browser and client-side attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| Injection | XSS: stored, reflected, DOM-based, mutation XSS | Context-aware output encoding; safe DOM APIs; vetted sanitization for intentional HTML; Trusted Types where supported; CSP as defense-in-depth | [PortSwigger XSS](https://www.youtube.com/results?search_query=PortSwigger+XSS+cross+site+scripting+explained) |
| Request integrity | CSRF, login CSRF, cross-site WebSocket hijacking (related) | Anti-CSRF tokens; SameSite cookies; Origin/Referer checks; re-authentication for sensitive actions; safe HTTP methods | [CSRF prevention](https://www.youtube.com/results?search_query=PortSwigger+CSRF+explained+prevention) |
| Browser policy | CORS misconfiguration, reflected origins, credentialed wildcard mistakes | Exact origin allowlists; validate scheme/host/port; restrict methods and headers; never use CORS as authorization | [CORS](https://www.youtube.com/results?search_query=browser+CORS+security+explained) |
| UI redress | Clickjacking, iframe overlay | CSP frame-ancestors; X-Frame-Options fallback; test legitimate embedding requirements | [Clickjacking](https://www.youtube.com/results?search_query=PortSwigger+clickjacking+explained) |
| DOM / navigation abuse | DOM clobbering, unsafe DOM sinks, open redirect, unsafe URL schemes | Safe DOM APIs; avoid implicit globals; validate URL schemes and destinations; Trusted Types where available | [DOM security](https://www.youtube.com/results?search_query=PortSwigger+DOM+based+vulnerabilities+DOM+clobbering) |
| Messaging trust | postMessage abuse, wildcard target origin, unvalidated message schema | Exact target origin; validate event.origin and source; schema-validate payloads; treat messages as untrusted | [postMessage security](https://www.youtube.com/results?search_query=postMessage+security+origin+validation) |
| Browser data exposure | Token theft, sensitive local storage, stale service-worker cache | Minimize sensitive client data; secure session cookies where appropriate; clear user-specific caches on logout; prevent XSS | [Browser storage security](https://www.youtube.com/results?search_query=browser+localStorage+token+security+XSS) |

## 2. Identity and access-control attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| Authentication abuse | Credential stuffing, password spraying, brute force, OTP guessing | MFA/passkeys; breached-password checks; per-account and risk-based throttling; bot detection; safe recovery | [Credential stuffing](https://www.youtube.com/results?search_query=credential+stuffing+password+spraying+OWASP) |
| Session abuse | Session hijacking, fixation, replay, stolen cookies | Secure HttpOnly SameSite cookies; TLS; rotate on login/privilege change; expiry and revocation; XSS prevention | [Session attacks](https://www.youtube.com/results?search_query=session+hijacking+session+fixation+explained) |
| Token abuse | JWT algorithm confusion, weak keys, missing issuer/audience/expiry, replay | Algorithm allowlist; verify signature and claims; key rotation; short-lived tokens; refresh rotation and revocation strategy | [JWT attacks](https://www.youtube.com/results?search_query=PortSwigger+JWT+attacks+explained) |
| Authorization bypass | IDOR/BOLA, horizontal privilege escalation, tenant escape | Server-side object checks; tenant-scoped queries; deny by default; cross-user and cross-tenant tests | [IDOR / BOLA](https://www.youtube.com/results?search_query=OWASP+IDOR+BOLA+explained) |
| Privilege escalation | BFLA, vertical privilege escalation, hidden admin endpoints | Central policy enforcement; authorization on every sensitive operation; role matrix regression tests | [Broken access control](https://www.youtube.com/results?search_query=OWASP+broken+access+control+explained) |
| Property authorization | Mass assignment, excessive data exposure | Explicit DTO allowlists; server-owned fields; response projection; schema validation | [Mass assignment](https://www.youtube.com/results?search_query=mass+assignment+API+security+explained) |
| Federation abuse | OAuth/OIDC state, nonce, redirect URI, PKCE and mix-up failures | Authorization Code + PKCE; exact redirect URI matching; state/nonce and issuer validation | [OAuth security](https://www.youtube.com/results?search_query=OAuth+2.0+security+PKCE+attacks+explained) |

## 3. Server-side injection and request-forgery attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| Database injection | SQLi: error, union, blind/time-based, second-order; NoSQL operator injection | Parameterized queries; safe ORM APIs; allowlisted query fields; least-privilege DB identity | [SQL injection](https://www.youtube.com/results?search_query=PortSwigger+SQL+injection+explained) |
| Interpreter injection | OS command injection, argument injection | Avoid shell invocation; use fixed executable and argument arrays; allowlist arguments; least privilege | [Command injection](https://www.youtube.com/results?search_query=OS+command+injection+security+explained) |
| Template injection | SSTI, expression injection | Never compile user input as template source; fixed templates; context-aware escaping | [SSTI](https://www.youtube.com/results?search_query=server+side+template+injection+explained) |
| XML parser abuse | XXE, external entity file disclosure / server-side requests | Disable external entities and DTDs when not needed; hardened parser config; size/depth limits | [XXE](https://www.youtube.com/results?search_query=XML+external+entity+XXE+explained) |
| Server request forgery | SSRF, blind SSRF, metadata access, DNS rebinding | Destination allowlists; resolve and validate IPs; block private/link-local/loopback; re-check redirects; egress controls | [SSRF](https://www.youtube.com/results?search_query=PortSwigger+SSRF+explained) |
| Runtime object abuse | Prototype pollution, unsafe deep merge | Patch dependencies; reject dangerous keys; safe merge patterns; regression tests | [Prototype pollution](https://www.youtube.com/results?search_query=PortSwigger+prototype+pollution+explained) |
| Serialization abuse | Insecure deserialization, gadget chains | Avoid unsafe native deserialization of untrusted input; schema-validated formats; integrity and isolation controls | [Deserialization](https://www.youtube.com/results?search_query=insecure+deserialization+web+security+explained) |

## 4. API and business-logic attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| API authorization | BOLA, BFLA, property-level authorization, mass assignment | Object/function/property checks on every request; tenant-scoped queries; explicit DTOs | [OWASP API Top 10](https://www.youtube.com/watch?v=YYe0FdfdgDU) |
| Resource exhaustion | Unbounded pagination, expensive filters, GraphQL depth/batching abuse | Per-user quotas; request size and complexity budgets; pagination caps; timeouts; bounded concurrency; backpressure | [API resource consumption](https://www.youtube.com/results?search_query=OWASP+API+unrestricted+resource+consumption) |
| Workflow abuse | Coupon replay, price manipulation, booking/payment bypass | Server-side invariants; state-machine transitions; transactions; idempotency; abuse monitoring | [Business logic attacks](https://www.youtube.com/results?search_query=PortSwigger+business+logic+vulnerabilities) |
| Concurrency abuse | Race conditions, TOCTOU, double spend / duplicate booking | Atomic updates; uniqueness constraints; transactions/locking where justified; idempotency; concurrency tests | [Race conditions](https://www.youtube.com/results?search_query=PortSwigger+race+conditions+web+security) |
| API schema abuse | GraphQL resolver authorization gaps, excessive query cost | Resolver-level authorization; depth/complexity limits; batching controls; cost budgets | [GraphQL security](https://www.youtube.com/results?search_query=GraphQL+API+security+OWASP) |
| Real-time channel abuse | WebSocket hijacking, unauthorized subscriptions, message replay | Authenticate handshake; validate Origin; authorize subscriptions/actions; validate schemas; connection quotas | [WebSocket security](https://www.youtube.com/results?search_query=PortSwigger+WebSocket+security) |
| Integration abuse | Webhook spoofing and replay | HMAC/signature over raw body; timestamp tolerance; constant-time comparison; idempotent consumers; secret rotation | [Webhook security](https://www.youtube.com/results?search_query=webhook+signature+replay+attack+prevention) |

## 5. Network, protocol and cache attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| Transport interception | MitM, TLS downgrade, invalid certificate acceptance | TLS with certificate validation; HSTS; modern protocol config; never disable verification | [TLS / MitM](https://www.youtube.com/results?search_query=TLS+man+in+the+middle+attack+explained) |
| HTTP parser disagreement | Request smuggling, CL.TE, TE.CL, protocol downgrade | Normalize at trusted edge; patch proxies; reject ambiguous framing; align parser behavior; authorized regression tests | [Request smuggling](https://www.youtube.com/results?search_query=PortSwigger+HTTP+request+smuggling) |
| Cache manipulation | Web cache poisoning, unkeyed input | Correct cache keys; never publicly cache personalized responses; normalize inputs; test CDN and origin together | [Cache poisoning](https://www.youtube.com/results?search_query=PortSwigger+web+cache+poisoning) |
| Cache data exposure | Web cache deception | Explicit cache rules; no-store for sensitive responses; correct content types; test path normalization | [Cache deception](https://www.youtube.com/results?search_query=web+cache+deception+explained) |
| Host trust abuse | Host header attacks, password reset poisoning | Trusted host allowlist; canonical configured origin; explicit proxy-header trust | [Host header attacks](https://www.youtube.com/results?search_query=PortSwigger+HTTP+Host+header+attacks) |
| DNS / routing abuse | DNS rebinding, dangling DNS takeover | Validate resolved addresses at connection time; egress restrictions; remove dangling DNS records | [DNS rebinding](https://www.youtube.com/results?search_query=DNS+rebinding+attack+explained) |

## 6. Data, file and parser attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| File path manipulation | Path traversal, archive extraction traversal | Canonicalize and enforce storage-root containment; generated filenames; safe extraction; least privilege | [Path traversal](https://www.youtube.com/results?search_query=PortSwigger+path+traversal) |
| Upload abuse | MIME spoofing, polyglot files, oversized files, active content | Extension allowlist; inspect content/signature; size limits; random names; storage outside web root; scanning as appropriate | [File upload security](https://www.youtube.com/results?search_query=PortSwigger+file+upload+vulnerabilities) |
| Data disclosure | Verbose errors, backup exposure, debug endpoints, log leakage | Minimize data; access controls; redaction; safe errors; encryption; retention/deletion | [Information disclosure](https://www.youtube.com/results?search_query=PortSwigger+information+disclosure+web+security) |
| Cryptographic weakness | Weak password hashing, hard-coded keys, insecure randomness, weak TLS | Vetted algorithms; password-specific hashing; key management/rotation; secure randomness; TLS validation | [Cryptographic failures](https://www.youtube.com/results?search_query=OWASP+cryptographic+failures+explained) |

## 7. Infrastructure, supply-chain and operational attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| Configuration abuse | Debug mode, public storage, default credentials, permissive CORS | Secure baselines; environment-specific config; IaC policy checks; remove defaults; continuous review | [Security misconfiguration](https://www.youtube.com/results?search_query=OWASP+security+misconfiguration+explained) |
| Dependency compromise | Typosquatting, dependency confusion, maintainer compromise | Lockfiles; trusted registries; dependency review; SCA; provenance/signature verification; least-privilege CI | [Supply-chain security](https://www.youtube.com/results?search_query=OWASP+software+supply+chain+security) |
| Build pipeline compromise | Poisoned workflows, secret exfiltration, untrusted PR execution | Minimal workflow permissions; pin actions; isolate untrusted jobs; OIDC short-lived credentials; protected environments | [CI/CD security](https://www.youtube.com/results?search_query=GitHub+Actions+security+hardening) |
| Cloud identity abuse | Overprivileged IAM, exposed keys, metadata credential theft | Least privilege; workload identity; short-lived credentials; metadata protections; audit and rotate keys | [Cloud IAM security](https://www.youtube.com/results?search_query=cloud+IAM+security+misconfiguration) |
| Container / cluster abuse | Privileged containers, exposed runtime socket, excessive RBAC | Non-root; drop capabilities; read-only FS where feasible; network policies; least-privilege RBAC | [Container security](https://www.youtube.com/results?search_query=container+security+hardening+explained) |

## 8. Availability and resilience attacks

| Family | Attack type / variants | Main measures | YouTube |
|---|---|---|---|
| Traffic exhaustion | DoS / DDoS, volumetric, protocol and application-layer floods | Edge DDoS controls; rate limits; request/connection budgets; graceful degradation | [DDoS explained](https://www.youtube.com/results?search_query=application+layer+DDoS+protection+explained) |
| Expensive operation abuse | ReDoS, algorithmic complexity, expensive filters | Safe regex; input bounds; execution timeouts; complexity limits; fuzz tests | [ReDoS](https://www.youtube.com/results?search_query=regular+expression+denial+of+service+ReDoS) |
| Retry amplification | Retry storms, queue exhaustion, poison messages | Bounded retries; exponential backoff with jitter; DLQs; backpressure; circuit breakers; idempotent consumers | [Retry storms](https://www.youtube.com/results?search_query=retry+storm+backpressure+distributed+systems) |

## OWASP Top 10:2025 — cross-reference

OWASP Top 10 is a risk-awareness classification, not a complete list of exploit techniques. One technique may map to multiple risks depending on root cause and impact.

| OWASP category | Related attack families |
|---|---|
| A01 Broken Access Control | IDOR/BOLA, BFLA, tenant escape, resource authorization |
| A02 Security Misconfiguration | CORS/header mistakes, exposed debug/admin surfaces, cloud/storage misconfiguration |
| A03 Software Supply Chain Failures | Dependency confusion, typosquatting, compromised build workflows |
| A04 Cryptographic Failures | Weak password hashing, key leakage, insecure randomness, TLS failures |
| A05 Injection | XSS, SQL/NoSQL, command, template, XML injection |
| A06 Insecure Design | Business logic abuse, race conditions, workflow bypass, missing abuse controls |
| A07 Authentication Failures | Credential stuffing, brute force, session fixation/hijacking, token validation flaws |
| A08 Software or Data Integrity Failures | Unsafe deserialization, untrusted updates/artifacts, webhook integrity failures |
| A09 Security Logging and Alerting Failures | Missing audit trails, inadequate detection, unmonitored authorization failures |
| A10 Mishandling of Exceptional Conditions | Fail-open behavior, unsafe errors, resource exhaustion and edge-case failures |

Primary reference: [OWASP Top 10:2025](https://top10.owasp.org/2025/).

## How every attack article must be written

Use [the attack playbook template](ATTACK-PLAYBOOK-TEMPLATE.md). Every article must include classification, root cause, preconditions, impact, safe lab, vulnerable and corrected examples, layered mitigations, verification tests, detection, OWASP/CWE mapping, a reviewed learning video and primary references.

**Video quality rule:** links above are targeted YouTube searches, not endorsements of every result. Prefer original OWASP, PortSwigger, browser-vendor, security conference or reputable educator material. Record the exact selected video's title, publisher, publication date and review date in the individual article. A video is a learning aid, not a security authority.

## Study sequence

1. Foundations and threat modeling.
2. Browser: XSS, CSRF, CORS and clickjacking.
3. Identity: authentication, sessions, OAuth and JWT.
4. Authorization: IDOR/BOLA, BFLA and tenant isolation.
5. Injection: SQLi, NoSQL, command, XXE and SSRF.
6. API/business logic: rate limits, race conditions, GraphQL and WebSockets.
7. Network/data: TLS, request smuggling, cache and file handling.
8. Infrastructure: IAM, supply chain, containers and CI/CD.
9. Testing: threat modeling, SAST, DAST, SCA, regression and authorized labs.

## Maintenance rules

- One canonical article per attack; cross-link it from all relevant domains.
- Do not duplicate an attack explanation across technology chapters.
- Every mitigation must state its enforcement layer, threat addressed, limitation and verification.
- Keep demonstrations local-lab-only and test only explicitly authorized systems.
- Review standards and videos periodically; record version and review date.
