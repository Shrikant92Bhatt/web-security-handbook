# HTTP, Network, and Headers

Transport security and response headers reduce exposure but do not replace application authorization or safe coding. Configure headers deliberately and test behavior in real deployment paths, including reverse proxies and CDNs.

## 📚 Deep Dive Guides in This Section
- 📖 [HTTPS, TLS 1.3 & PKI: How Browsers Verify Website Security](./https-tls-pki-browser-trust.md) — Step-by-step cryptographic walkthrough of Root CA stores, X.509 chains of trust, OCSP stapling, Certificate Transparency, and why browser warnings trigger.
- 📖 [NGINX Masterclass: Architecture, Reverse Proxy, Microcaching & Hardening](./nginx-reverse-proxy-and-hardening.md) — Exhaustive masterclass on epoll event loop architecture, location matching priority, trailing-slash proxying, microcaching, WebSockets/SSE, rate limiting, and troubleshooting 502/504 errors.
- 📖 [Subresource Integrity (SRI)](./subresource-integrity-sri.md) — Use `integrity` hashes so browsers block tampered third-party scripts and styles, with CORS needs, mistakes and tests.

## HTTP methods: safe and idempotent

An HTTP method describes what the client wants the server to do. Two important properties are:

- **Safe:** the request is intended to read information, not change server state.
- **Idempotent:** repeating the same request one or more times has the same intended effect on server state as sending it once. The response can still differ (for example, the first DELETE may return `204`, while a later one returns `404`).

### Quick comparison

| Method | Typical purpose | Safe? | Idempotent? |
|---|---|---:|---:|
| GET | Read a resource | Yes | Yes |
| HEAD | Read headers only | Yes | Yes |
| OPTIONS | Discover supported communication options | Yes | Yes |
| PUT | Create or replace a resource at a known URL | No | Yes |
| DELETE | Remove a resource | No | Yes |
| POST | Submit data or trigger an operation | No | No (not by default) |
| PATCH | Partially update a resource | No | Not guaranteed |

> **Remember:** Safe does not mean “no logs or analytics are written.” It means the requested operation should not change the resource's state. Idempotent does not mean “the response is identical”; it means the intended state change is not multiplied by retries.

### Diagram: what happens when a request is repeated?

```mermaid
flowchart TD
    A[Client sends HTTP request] --> B{Which method?}
    B -->|GET / HEAD / OPTIONS| C[Read or inspect]
    B -->|PUT / DELETE| D[Apply the requested state]
    B -->|POST / PATCH| E[Submit or modify data]
    C --> F[Repeat the same request]
    D --> F
    E --> F
    F --> G{Idempotent semantics?}
    G -->|Yes| H[Same intended server state as one request]
    G -->|No / not guaranteed| I[May create another effect or change state again]
```

### Simple examples

- `GET /users/42` repeated five times should not update the user.
- `PUT /users/42` with the same representation repeated five times should leave the user in the same intended state.
- `DELETE /users/42` repeated five times should leave the user deleted; later responses may say it is already missing.
- `POST /payments` repeated five times could create five payments. For payment APIs, use an **idempotency key** (for example, `Idempotency-Key: order-123`) and enforce it on the server to prevent duplicate processing.
- `PATCH` is not automatically idempotent. Setting `{"status":"paid"}` can be idempotent; incrementing `{"$inc":{"quantity":1}}` is not.

### Retry rule for API clients

A network timeout does not tell the client whether the server completed the operation. Automatically retry safe/idempotent requests when appropriate. For non-idempotent operations such as payment creation, retry only when the API provides a server-enforced idempotency mechanism or another reliable duplicate-protection strategy.

References: [MDN — HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods), [RFC 9110 — Safe and Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2).

---

## Review
- Enforce HTTPS and configure TLS through a supported platform; evaluate HSTS before rollout.
- Set CSP, frame-ancestors, nosniff, and an appropriate referrer policy according to application needs.
- Use Cache-Control carefully for authenticated or sensitive responses.
- Configure CORS with explicit trusted origins when credentials are involved; never reflect arbitrary origins.
- Trust forwarded headers only from known proxy infrastructure.
- Remove verbose server banners where feasible and avoid leaking stack traces.

## Browser response path
```mermaid
flowchart LR
 A[Application] --> P[Trusted proxy or CDN]
 P --> T[HTTPS response + headers]
 T --> B[Browser policy enforcement]
```

References: [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP), [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [HTTP Security Headers Explained: HSTS, CSP, X-Frame-Options (ByteByteGo)](https://www.youtube.com/watch?v=GHRNEv_zZ7c) — Visual breakdown of the most critical browser defense headers and how they prevent exploitation.
- 🎥 [TLS/HTTPS Handshake Deep Dive (Hussein Nasser)](https://www.youtube.com/watch?v=86cQjh4aX1U) — Deep networking analysis of TLS 1.3 certificates, key exchanges, and downgrade attack prevention.
- 🎥 [HTTP Request Smuggling & Header Manipulation (PortSwigger Web Security Academy)](https://www.youtube.com/watch?v=wXPhb4q1k_s) — Exploit demonstration of frontend reverse proxy vs backend discrepancy flaws.

### 📖 Primary Documentation & Specifications
- 📜 [MDN Web Docs: HTTP Headers Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) — Comprehensive encyclopedia of all standard HTTP response headers.
- 📜 [IETF RFC 6797: HTTP Strict Transport Security (HSTS)](https://datatracker.ietf.org/doc/html/rfc6797) — Authoritative standard on mandatory TLS enforcement and preloading.
- 📜 [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/) — Standard configuration blueprints for enterprise reverse proxies and web applications.

### 🧪 Interactive Hands-On Training Labs & Tools
- 🎯 [Mozilla Observatory](https://observatory.mozilla.org/) — Free automated scanner to audit and grade your domain's live HTTP security headers.
- 🎯 [PortSwigger Lab: HTTP Request Smuggling basic CL.TE vulnerability](https://portswigger.net/web-security/request-smuggling/lab-basic-cl-te) — Hands-on lab exploiting Content-Length vs Transfer-Encoding header ambiguities.

