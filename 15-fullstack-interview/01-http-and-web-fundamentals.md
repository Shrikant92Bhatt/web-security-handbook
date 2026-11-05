# 01 — HTTP & Web Fundamentals

[Module 2 home](README.md) · **Chapter 1 of 8**

## Learn these concepts

1. Browser navigation: URL parsing → DNS → connection → TLS → HTTP request → response → parsing → rendering.
2. DNS records, recursive resolution, caching and CDN routing.
3. TCP vs UDP; connection establishment; TLS handshake and certificate validation.
4. HTTP request/response structure, methods, status codes and headers.
5. HTTP/1.1 vs HTTP/2 vs HTTP/3; multiplexing, connection reuse and QUIC.
6. Safe/idempotent methods; retries and idempotency keys.
7. Cookies, sessions, localStorage, sessionStorage and browser boundaries.
8. CORS vs same-origin policy; preflight and credentialed requests.
9. Cache-Control, ETag, Last-Modified, browser cache and CDN cache.
10. Reverse proxies, load balancers, compression, streaming and keep-alive.

## Interview questions

- Walk through what happens after entering a URL in the browser.
- Explain DNS resolution, TCP setup and the TLS handshake.
- Compare HTTP/1.1, HTTP/2 and HTTP/3.
- Explain GET vs POST vs PUT vs PATCH and idempotency.
- What happens during a CORS preflight? Is CORS authorization?
- Compare cookies, localStorage and sessionStorage. Where should session credentials live?
- Explain ETag and conditional requests.
- Difference between reverse proxy and load balancer?
- How would you debug a request that is slow only in production?

## Quick revision

Draw the browser-to-server request lifecycle. Know common status codes, cache directives and cookie flags (Secure, HttpOnly, SameSite). Explain where TLS terminates in a proxy/load-balancer architecture.

**Practice:** inspect a request in browser DevTools Network; identify timing, headers, cookies, cache behavior and response status.

**Next:** [02 · JavaScript & TypeScript](02-javascript-typescript.md).
