# Node.js Backend Engineering — Complete Learning Path

**In simple words:** Node.js lets JavaScript run on a server. A Node.js backend receives requests, validates data, applies business rules, reads and writes data, communicates with other services and returns responses. This learning path takes you from the runtime basics to production systems.

[Module 2 home](../../README.md) · [Core Web Development](../core-web-development/README.md) · [Backend overview](../04-backend-nodejs.md)

## Learning order

1. [Node.js fundamentals and runtime](01-nodejs-fundamentals-and-runtime.md)
2. [npm, CLI, modules and package management](02-npm-cli-modules-and-packages.md)
3. [Node.js APIs, networking and asynchronous programming](03-node-apis-networking-and-async.md)
4. [Backend architecture, testing and scalability](04-backend-architecture-testing-and-scale.md)
5. [Backend frameworks and API design](05-backend-frameworks-and-api-design.md)
6. [Production, security, tools and advanced topics](06-production-security-and-advanced-topics.md)

## What you should be able to build

- A maintainable REST API with validation, authentication, authorization and consistent errors.
- A backend that uses asynchronous I/O without blocking the event loop.
- File upload/download and large-data processing with streams and backpressure.
- A service that publishes background jobs and safely retries failed work.
- A tested and observable service that can shut down gracefully and run multiple instances.
- A containerized application deployed with secure configuration and health checks.

## Topic boundaries

- JavaScript language concepts such as closures, prototypes, promises and async/await are taught in [JavaScript & TypeScript](../02-javascript-typescript.md). This path explains how Node.js uses them.
- HTTP fundamentals are introduced in [HTTP & Web Fundamentals](../01-http-and-web-fundamentals.md); this path covers Node's HTTP server/client APIs and backend implementation.
- Database concepts are in [Databases & Caching](../05-databases-and-caching.md); this path covers Node drivers, pooling and safe integration.
- Security attack explanations belong in Module 1. This path teaches secure backend implementation and links to the relevant security material.

## Framework coverage

Learn the underlying concepts first, then choose a framework. Express and Fastify are useful lightweight choices; NestJS adds a structured, dependency-injection-based architecture. Koa, Hapi and Feathers are useful to recognize and compare. Learn framework concepts deeply rather than memorizing every framework's syntax.

## Study method

For each chapter: read the explanation, trace the request or runtime flow, run the example locally, introduce a failure case, write a test and explain the trade-offs aloud. Keep Node.js version-specific behavior tied to the version used by your project.

**Next:** [01 · Node.js fundamentals and runtime](01-nodejs-fundamentals-and-runtime.md).
