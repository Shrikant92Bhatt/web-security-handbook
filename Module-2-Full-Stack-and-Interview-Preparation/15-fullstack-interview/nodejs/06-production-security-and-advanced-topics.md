# 06 — Production, Security, Tools and Advanced Node.js

**In simple words:** A backend is production-ready when it can be configured, tested, monitored, secured, deployed and recovered when something fails. This chapter covers the tools and advanced capabilities used to operate Node.js services.

[Node.js learning path](README.md) · [Previous: Frameworks](05-backend-frameworks-and-api-design.md) · **Chapter 6 of 6**

## 1. Development tools

- **NVM / version managers:** install and switch Node versions; pin project expectations with an engines field and project version file where supported.
- **Linting and formatting:** ESLint, Prettier and consistent TypeScript rules; distinguish linting from formatting and type checking.
- **Documentation:** JSDoc/TSDoc for code contracts; OpenAPI/Swagger for HTTP API contracts.
- **Debugging:** Node inspector, breakpoints, watch expressions, source maps and VS Code debugging.
- **Profiling:** CPU profiles, heap snapshots, allocation profiles, flame graphs and event-loop delay.
- **Monitoring:** structured logs, metrics, traces, health endpoints and alerting.
- **Testing:** Node test runner, Jest/Vitest, Supertest or equivalent HTTP testing tools; choose based on project compatibility.

## 2. TypeScript with Node.js

Understand compiling versus running TypeScript, tsconfig, module resolution, ESM/CommonJS alignment, source maps, declaration files, path aliases and runtime validation. TypeScript types disappear at runtime; validate external input with a schema library or explicit checks. Keep Node type definitions aligned with the runtime version.

## 3. Authentication and authorization implementation

- Authentication: session cookies, OAuth 2.0/OIDC, JWT, Passport strategies and identity-provider integration.
- Authorization: role checks, policy checks, ownership checks and tenant/resource-level enforcement.
- Password storage: use a suitable password-hashing algorithm and vetted library; never store plaintext or reversible passwords.
- Token/session lifecycle: expiry, refresh, rotation, revocation and logout.
- Secrets: environment/secret manager injection, rotation and least privilege.
- Rate limits and abuse controls on login, reset, OTP and sensitive actions.

Authentication establishes identity; authorization checks permission for the specific action and resource. Read the full threat models in Module 1: [Authentication and sessions](../../02-authentication-and-sessions/README.md), [Authorization](../../03-authorization/README.md), [API security](../../04-api-security/README.md).

## 4. Dependency and application security

- Review npm audit output; assess severity, reachability, exploitability and available fixes.
- Use lockfiles and trusted registries; review new packages, maintainers, install scripts and provenance.
- Run SCA, secret scanning, SAST and container/IaC scans in CI.
- Validate input and output schemas; parameterize database queries.
- Set request/body/file limits, timeouts, rate limits and safe CORS policy.
- Avoid unsafe deserialization, shell injection, path traversal and server-side request forgery.
- Redact secrets and personal data from logs and error responses.
- Use least-privilege service identities and rotate credentials.

Do not treat `npm audit` or a clean scanner report as proof that an application is secure.

## 5. Containers and orchestration

- Docker image layers, Dockerfile, build context, multi-stage builds and image tags.
- Run as non-root; keep images small and patched; avoid embedding secrets in layers.
- Health checks, resource requests/limits, graceful termination and signal forwarding.
- Kubernetes awareness: Pods, Deployments, Services, ConfigMaps, Secrets, probes, rolling updates, autoscaling, namespaces, RBAC and network policies.
- Containerization packages the service and its runtime environment; orchestration manages multiple instances and their lifecycle.
- Clustering is not the same as Kubernetes orchestration.

## 6. Process managers and deployment

Understand PM2, systemd, containers and managed platform runtimes. A process manager can restart a crashed process and manage logs; it does not make an application stateless or fix memory leaks. Learn cluster mode, startup scripts, environment configuration, log rotation and graceful reload behavior.

Deployment flow: build → test → scan → package → deploy → health check → observe → rollback if required. Use CI/CD with limited permissions and protected secrets.

## 7. Serverless

Study AWS Lambda, Azure Functions and Google Cloud Functions / Cloud Run functions terminology and platform differences. Understand invocation model, cold starts, execution limits, concurrency, statelessness, temporary storage, connection reuse, retries, event triggers and observability. Avoid opening a new database connection for every invocation when a managed pooling/proxy solution is appropriate. Design handlers to tolerate duplicate events.

## 8. Queues and messaging

Recognize RabbitMQ, Kafka and cloud queues. Compare queue versus event log, consumer groups, acknowledgements, offsets, retries, dead-letter handling, ordering, partitioning, delivery guarantees and idempotent consumers. Use a queue when work can be decoupled from the request; do not put every operation behind a broker without a clear need.

## 9. Native extensions and WebAssembly

- Node-API (N-API) provides an ABI-stable interface for native addons across supported Node versions.
- Native addons can call C/C++ code; account for build toolchains, platform binaries, memory safety and distribution.
- WebAssembly can run compiled modules in a controlled runtime; understand imports/exports, memory, performance and sandbox boundaries.
- Use native/WASM code only when a measured need justifies additional complexity.

## 10. Other Node APIs

Recognize `node:crypto`, `node:process`, `node:cluster`, `node:worker_threads`, `node:child_process`, `node:perf_hooks`, `node:diagnostics_channel`, `node:inspector`, `node:readline` and `node:util`. Learn the problem each solves and its operational/security implications.

## 11. Data and visualization integrations

Know how Node applications connect to MongoDB, Redis and SQL databases using official drivers or ORMs. Understand connection pools, query parameterization, transactions and migrations. Monitoring stacks may include Prometheus, Grafana, OpenTelemetry collectors and log platforms such as Kibana; these are integrations, not Node.js APIs.

## 12. Infrastructure as code and deployment templates

Recognize Terraform, AWS CloudFormation and Helm. Terraform/CloudFormation define infrastructure; Helm packages Kubernetes resources. Learn state, plans, drift, secrets handling, environment separation, review and rollback. Keep infrastructure credentials outside source files.

## 13. Production checklist

- [ ] Supported Node version is pinned and patched.
- [ ] Configuration is validated at startup; secrets come from a secure source.
- [ ] Health and readiness checks reflect real dependencies.
- [ ] Logs are structured and redact sensitive data.
- [ ] Metrics include latency, throughput, errors, event-loop delay and resource use.
- [ ] Requests have timeouts, size limits and cancellation where possible.
- [ ] Database pools and queues are bounded.
- [ ] Shutdown drains requests and workers before the deadline.
- [ ] Dependencies, container images and infrastructure are scanned and reviewed.
- [ ] Backups, migrations, rollback and incident procedures are tested.

## Interview questions

1. What is the difference between NVM and a process manager?
2. How do you debug a Node.js memory leak?
3. What is the difference between authentication and authorization?
4. How do you secure an npm dependency supply chain?
5. Compare PM2, systemd and Kubernetes.
6. What causes a serverless cold start?
7. Compare RabbitMQ and Kafka.
8. What is Node-API and why does ABI stability matter?
9. What should a production health check verify?
10. How would you deploy and roll back a Node API?

## Practical exercise

Containerize the order API from the previous chapter. Add environment validation, non-root execution, readiness/liveness endpoints, structured logs, metrics, graceful shutdown and CI checks. Simulate a dependency outage and verify the service fails safely.

**References:** [Node.js diagnostics](https://nodejs.org/en/learn/diagnostics), [Node.js security best practices](https://nodejs.org/en/learn/getting-started/security-best-practices), [Docker docs](https://docs.docker.com/), [Kubernetes docs](https://kubernetes.io/docs/), [PM2 docs](https://pm2.keymetrics.io/docs/), [OpenTelemetry](https://opentelemetry.io/docs/).
