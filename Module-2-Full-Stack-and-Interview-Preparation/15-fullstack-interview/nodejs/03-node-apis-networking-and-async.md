# 03 — Node.js APIs, Networking and Asynchronous Programming

**In simple words:** Node.js provides APIs to work with files, network connections, time, processes and data streams. Most server applications spend much of their time waiting for these operations, so handling asynchronous work correctly is essential.

[Node.js learning path](README.md) · [Previous: npm and modules](02-npm-cli-modules-and-packages.md) · **Chapter 3 of 6**

## 1. Asynchronous programming in Node

Review callbacks, error-first callbacks, promises, async/await, generators and async iterators. Focus on Node-specific usage:
- Avoid blocking synchronous APIs in request handlers unless the use is deliberate and bounded.
- Handle rejected promises and errors at the correct boundary.
- Use Promise.all for independent work only when concurrency is safe and bounded.
- Use Promise.allSettled when every result must be inspected.
- Avoid unbounded fan-out to databases or external APIs.
- Use AbortController/AbortSignal for cancellation when the API supports it.
- Apply timeouts, retry budgets and exponential backoff with jitter to transient failures.
- Do not retry non-idempotent operations without an idempotency strategy.

## 2. File system API

Study `node:fs` callback, promise and synchronous APIs; `node:fs/promises`; path handling; file descriptors; read/write; directories; permissions; streams; temporary files; atomic replacement patterns; watchers and platform differences. Use `node:path` for path joining and normalization rather than string concatenation.

Understand race conditions between checking a file and opening it, path traversal risks, symlinks and least-privilege filesystem permissions. Security-specific handling belongs in Module 1.

## 3. Buffers and binary data

Learn Buffer creation, encoding/decoding, byte length, slicing/subarray behavior, concatenation, comparison, bounds and typed arrays. Understand that a Buffer is raw bytes, not necessarily UTF-8 text. Avoid allocating uninitialized memory unsafely; prefer safe allocation methods.

## 4. Streams and backpressure

Types: Readable, Writable, Duplex and Transform. Study:
- `pipe()` and `pipeline()`; prefer pipeline for coordinated error and cleanup handling.
- `write()` return value and `drain` event.
- highWaterMark and buffering.
- async iteration over streams.
- object mode versus byte mode.
- Transform streams for compression, parsing and data conversion.
- cancellation, destruction and error propagation.
- handling large uploads/downloads without loading the entire file into memory.

Backpressure means a fast producer must slow down when the consumer cannot keep up. Ignoring it can cause memory growth.

## 5. HTTP server and client APIs

Learn `node:http` and `node:https`: createServer, request and response objects, headers, status codes, streaming bodies, keep-alive, timeouts, request abort/close behavior and server listen/close lifecycle. Understand HTTP parser limits, maximum header sizes and request body size limits.

For outbound requests, know built-in fetch (Node version-dependent), Request/Response, AbortController, agents/connection reuse where applicable and TLS certificate validation. Do not disable TLS verification to fix certificate errors.

## 6. Network concepts

Understand sockets, TCP versus UDP, DNS lookup, TLS handshake, certificates, ports, connection pooling, keep-alive, proxies, reverse proxies, HTTP/1.1, HTTP/2 and HTTP/3 at an architectural level. Know that Node core has APIs for TCP/UDP and HTTP; choose the right abstraction rather than implementing a protocol manually.

## 7. Timers and path utilities

Use `node:timers`, `node:timers/promises`, setTimeout, setInterval, setImmediate, clear operations and abortable timer promises. Use `node:path` for platform-aware paths, `node:url` for URL parsing and `node:os` for operating-system information.

## 8. Cryptography and process APIs

Recognize `node:crypto` hashing, HMAC, randomBytes, key generation, signing and verification; use high-level vetted libraries for password hashing and established protocols rather than inventing cryptography. Learn `node:child_process`, `node:worker_threads`, `node:cluster`, `node:readline`, `node:events` and `node:util` at the use-case level. Treat shell execution and untrusted arguments as security-sensitive.

## Interview questions

1. Why are streams useful for large files?
2. What is backpressure and how does Node signal it?
3. Compare Buffer and string.
4. Compare fs callback, promise and sync APIs.
5. What is the difference between setImmediate and setTimeout?
6. How do you cancel a fetch or long-running operation?
7. Why is Promise.all dangerous for unbounded workloads?
8. How do you handle errors in a stream pipeline?
9. Compare TCP sockets and HTTP APIs.

## Practical exercise

Build an endpoint that streams a large file to the client. Add correct content headers, handle client disconnects, propagate stream errors and verify memory use remains bounded as file size increases.

**References:** [Node.js API docs](https://nodejs.org/api/), [Node.js streams](https://nodejs.org/api/stream.html), [Node.js filesystem](https://nodejs.org/api/fs.html), [Node.js HTTP](https://nodejs.org/api/http.html), [Node.js networking](https://nodejs.org/api/net.html).
