# 04 — Backend Architecture, Testing and Scalability

**In simple words:** A production backend is more than a set of routes. It needs clear boundaries, reliable data handling, tests, safe failure behavior and a way to handle more traffic without becoming unstable.

[Node.js learning path](README.md) · [Previous: APIs and networking](03-node-apis-networking-and-async.md) · **Chapter 4 of 6**

## 1. API architecture

Understand the request lifecycle:
1. Receive request and assign/request-propagate a correlation ID.
2. Parse and validate path, query, headers and body.
3. Authenticate the caller.
4. Authorize the requested action and resource.
5. Execute business logic.
6. Read/write through repository or data-access layer.
7. Map result to a response DTO and status code.
8. Record structured logs/metrics/traces and finish response.

Separate routing, controllers/handlers, services/use-cases, repositories and infrastructure adapters when that improves clarity. Avoid building layers that only pass data through without adding value.

## 2. REST and API design

- Resource naming, HTTP methods, status codes and content types.
- Request/response schemas and validation at trust boundaries.
- Pagination: offset versus cursor; stable ordering and maximum page sizes.
- Filtering, sorting and field selection with allowlists.
- Versioning and backward compatibility.
- Idempotency for operations that may be retried.
- Consistent error format, request IDs and safe error messages.
- Rate limits and quotas; distinguish per-user, per-IP, per-tenant and global controls.
- OpenAPI contracts and generated documentation.
- GraphQL and gRPC awareness: when their models help and what new operational concerns they introduce.

## 3. Authentication and authorization

Authentication answers "who is calling?" Authorization answers "what may this caller do to this specific resource?" Study sessions, OAuth 2.0/OIDC, JWT validation, Passport strategies and role/policy checks as implementation options. Validate issuer, audience, expiry, signature and allowed algorithms when using JWT. Enforce authorization on the server for every protected operation; frontend route guards are not security boundaries.

Cross-link: [Module 1 — Authentication and sessions](../../../Module-1-Attack-and-Web-Security/02-authentication-and-sessions/README.md) and [Module 1 — Authorization](../../../Module-1-Attack-and-Web-Security/03-authorization/README.md).

## 4. Error handling and reliability

- Operational errors (dependency unavailable, validation failure) versus programming errors.
- Custom error types and mapping errors to safe HTTP responses.
- Central error middleware/handler and async error propagation.
- Structured logs with severity, timestamp, service, request ID and trace ID.
- Do not expose stack traces or secrets to clients.
- Timeouts, cancellation, retry with backoff/jitter, circuit breakers and bulkheads.
- Idempotency keys and deduplication for retry-safe writes.
- Graceful degradation and dependency health.

## 5. Databases and transactions

Understand the Node driver/ORM boundary, connection pools, pool sizing, acquisition timeouts, query timeouts, transaction boundaries, parameterized queries, migrations and graceful connection close. Do not create one new database connection for every request. Avoid holding a transaction open while waiting on unrelated network services.

Cross-link: [Databases & Caching](../05-databases-and-caching.md).

## 6. Queues and background jobs

Understand producer, broker, consumer/worker, acknowledgement, visibility timeout, retry, dead-letter queue, ordering, partitioning, consumer groups and delivery guarantees. Compare RabbitMQ and Kafka by use case; they are not interchangeable in every design.

Design jobs to tolerate duplicate delivery. Use idempotent handlers, bounded retries, exponential backoff, poison-message handling, observability and replay controls. Do not assume "exactly once" removes the need for application-level correctness.

## 7. Testing strategy

- Unit tests: pure functions and isolated business rules.
- Integration tests: database, queue, filesystem and HTTP boundaries.
- API/contract tests: request and response behavior.
- End-to-end tests: critical user journeys across services.
- Load, stress, spike, soak and capacity tests; understand the different questions each answers.
- Test doubles: stubs, mocks and fakes; do not mock every dependency if an integration test is more valuable.
- Test error cases: timeout, disconnect, invalid input, duplicate message, database unavailable and partial failure.
- Use temporary databases/containers and deterministic fixtures where practical.
- Coverage is a signal, not proof of correctness.

## 8. Design principles and patterns

Learn SOLID and selected GoF patterns as tools, not rules to apply everywhere. Understand layered architecture, ports-and-adapters/hexagonal architecture, modular monolith, microservices, event-driven design, dependency injection, repository, factory, adapter, strategy, decorator and middleware. Compare trade-offs in coupling, deployment, testing and operational complexity.

## 9. Scaling Node.js services

- Vertical versus horizontal scaling.
- Stateless request handling; shared session/cache/state store.
- Load balancers and health/readiness checks.
- Multiple processes or containers; process managers and orchestration.
- Worker threads for CPU-heavy work; queues for deferred work.
- Database pool and connection limits; caching and CDN for suitable data.
- Rate limiting, backpressure and bounded concurrency.
- Graceful shutdown: stop accepting new work, drain in-flight requests, stop consumers, close connections and exit within a deadline.
- Avoid sticky sessions unless the design requires them and the trade-off is understood.

## 10. Observability

Logs explain individual events; metrics show trends; traces connect work across services. Learn request latency percentiles, throughput, error rate, saturation, event-loop delay, queue age/depth, DB pool wait and dependency health. Use correlation IDs and OpenTelemetry concepts. Do not put personal data, tokens or secrets into telemetry.

## Interview questions

1. Explain a clean Node API request lifecycle.
2. Compare controller/service/repository responsibilities.
3. What is idempotency and where would you use it?
4. Compare unit, integration, contract and E2E tests.
5. What is the difference between stress and soak testing?
6. How do you handle duplicate queue messages?
7. How would you scale a Node.js API horizontally?
8. What happens during graceful shutdown?
9. What metrics would you monitor for a Node service?

## Practical exercise

Build an order API with schema validation, authentication middleware, resource-level authorization, a database transaction and an idempotency key. Add integration tests for duplicate submissions and database failure. Add a queue worker for email delivery with retry and dead-letter handling.

**References:** [OpenTelemetry](https://opentelemetry.io/docs/), [Node.js test runner](https://nodejs.org/api/test.html), [OWASP API Security](https://owasp.org/www-project-api-security/), [RabbitMQ tutorials](https://www.rabbitmq.com/tutorials), [Kafka documentation](https://kafka.apache.org/documentation/).
