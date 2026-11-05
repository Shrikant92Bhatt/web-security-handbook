# 04 — Backend Engineering: Node.js & API Design

[Module 2 home](README.md) · [Previous: Frontend](03-frontend-react-angular.md) · **Chapter 4 of 8**

## Node.js runtime

- V8, libuv, event loop phases and the role of the thread pool.
- Single JavaScript execution thread vs asynchronous I/O and worker threads.
- CPU-bound vs I/O-bound work; worker threads, child processes and external workers.
- Streams, buffers, backpressure and large-file processing.
- Error handling, process lifecycle, graceful shutdown and health checks.
- Memory profiling, heap snapshots, event-loop lag and diagnostics.

## API and service engineering

- REST resource design, HTTP semantics, pagination, filtering and versioning.
- Validation, serialization, centralized error handling and OpenAPI.
- Authentication vs authorization; middleware and policy enforcement.
- Rate limiting, idempotency, retries, timeouts and circuit breakers.
- WebSockets vs Server-Sent Events vs polling; reconnect and delivery semantics.
- Queues and event-driven processing: RabbitMQ/Kafka concepts, background jobs, retries and dead-letter queues.
- Caching, connection pooling, database access and transaction boundaries.

## Scaling and architecture

Stateless services, horizontal scaling, load balancing, PM2/cluster mode vs containers/orchestrators, API gateways, monolith vs microservices, observability with logs/metrics/traces.

## Interview questions

- Explain the Node.js event loop and what blocks it.
- How can Node.js handle many concurrent requests with one JS thread?
- When use worker threads, child processes or a queue?
- Explain streams and backpressure.
- How would you scale a Node API to multiple instances?
- Compare PM2 cluster mode, Kubernetes replicas and serverless.
- Design rate limiting for a multi-instance API.
- Implement idempotency for payment or booking requests.
- Compare WebSockets, SSE and long polling.
- How do you gracefully shut down without dropping in-flight requests?

## Quick revision

Know event loop, thread pool, streams, backpressure, process vs thread, stateless scaling, API reliability patterns and queue semantics.

**Practice:** design a notification service using Node.js, a queue, retry policy, dead-letter queue and SSE/WebSocket delivery.

**Next:** [05 · Databases & Caching](05-databases-and-caching.md).
