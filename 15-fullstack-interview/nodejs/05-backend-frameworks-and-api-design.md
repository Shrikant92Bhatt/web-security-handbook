# 05 — Backend Frameworks and API Design

**In simple words:** Node.js provides the runtime and low-level APIs. A backend framework organizes common tasks such as routing, middleware, validation, dependency injection and error handling. Learn the concepts first so switching frameworks is easier.

[Node.js learning path](README.md) · [Previous: Architecture and testing](04-backend-architecture-testing-and-scale.md) · **Chapter 5 of 6**

## 1. Framework concepts

A framework commonly provides:
- Application bootstrap and configuration.
- Routing and route parameters.
- Middleware, hooks, guards, interceptors or plugins.
- Request parsing and validation.
- Dependency injection or service registration.
- Error handling and response serialization.
- Authentication integration and authorization hooks.
- Logging, metrics and testing helpers.
- OpenAPI/schema generation and lifecycle hooks.

Understand the request pipeline and the order in which each stage runs. Know which parts are framework features and which are Node.js core APIs.

## 2. Express

Learn application and router setup, route handlers, middleware order, request/response objects, route parameters, query/body parsing, error middleware, async error behavior for the version in use, static files, testing with an HTTP test client and production configuration.

Express is intentionally minimal. Add validation, logging, security headers, rate limits and dependency management deliberately. Avoid putting all business logic directly in route handlers.

## 3. Fastify

Learn plugin encapsulation, hooks, schema-based validation/serialization, decorators, lifecycle, logging and error handling. Understand why schemas can improve consistency and performance, and why schemas must be trusted rather than built from untrusted input.

## 4. NestJS

Study modules, controllers, providers, dependency injection, pipes, guards, interceptors, exception filters, middleware, configuration, lifecycle hooks and testing. Understand the difference between a guard (access decision), pipe (input transformation/validation), interceptor (cross-cutting request/response behavior) and exception filter (error mapping).

Nest can use different HTTP adapters. Understand the adapter boundary and avoid assuming every adapter behaves identically.

## 5. Koa, Hapi and Feathers

- **Koa:** middleware composition and async control flow; understand onion-style request/response flow.
- **Hapi:** server configuration, routes, plugins, validation and lifecycle extensions.
- **Feathers:** services, hooks, channels and realtime-oriented application patterns.
- Compare their philosophy, ecosystem, extension model and operational fit. Learn enough to read an existing codebase; choose based on project requirements and maintenance.

## 6. Routing, middleware and error handling

- Route matching, parameters, query strings and HTTP methods.
- Middleware ordering and short-circuiting.
- Request-scoped context and safe propagation.
- Validation at the edge; normalize data before business logic.
- Centralized error handling and consistent error response contracts.
- Authentication versus authorization; enforce resource-level policy.
- File uploads, size limits and streaming.
- Rate limiting, CORS policy, security headers and request timeouts.
- Avoid duplicate middleware and unclear responsibility boundaries.

## 7. Framework performance and production configuration

Measure before optimizing. Study keep-alive, compression trade-offs, JSON serialization, schema validation, route hot paths, connection pools, body limits, logging overhead, worker/queue boundaries and caching. Configure proxy trust carefully; incorrect forwarded-header trust can affect client IP, protocol and secure-cookie decisions.

## 8. Framework selection guide

| Need | Reasonable starting point | What to evaluate |
|---|---|---|
| Small, minimal REST API | Express | Middleware discipline, validation and project conventions |
| Schema-first high-throughput API | Fastify | Plugin design, schemas and ecosystem fit |
| Large structured TypeScript service | NestJS | Modules, DI, testing and team familiarity |
| Composable middleware | Koa | Need for additional libraries and conventions |
| Plugin-oriented service | Hapi | Plugin ecosystem and team experience |
| Service/realtime abstraction | Feathers | Service model and channel requirements |

These are starting points, not universal rankings. Benchmark with representative endpoints and the actual database/network workload.

## 9. API styles

REST is common for resource-oriented HTTP APIs. GraphQL provides a query language and type system but needs authorization at resolver/data boundaries, query complexity controls and batching protections. gRPC uses protocol buffers and generated clients, often for service-to-service communication. Choose based on client needs, interoperability, caching, observability and operational complexity.

## Interview questions

1. What does middleware do?
2. Explain middleware order in Express.
3. Compare Express and Fastify.
4. What are modules, controllers and providers in NestJS?
5. Compare guards, pipes, interceptors and exception filters.
6. What is plugin encapsulation?
7. Where should validation happen?
8. How do you keep business logic independent of a framework?
9. How would you choose REST versus GraphQL?

## Practical exercise

Implement the same small CRUD API in Express and Fastify, using the same validation rules, error response shape, logging and integration tests. Compare code organization and measure realistic latency before drawing conclusions.

**References:** [Express](https://expressjs.com/), [Fastify](https://fastify.dev/docs/latest/), [NestJS](https://docs.nestjs.com/), [Koa](https://koajs.com/), [Hapi](https://hapi.dev/), [Feathers](https://feathersjs.com/).
