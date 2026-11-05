# 04 — Backend: Node.js and API Design

**In simple words:** Node.js runs JavaScript on the server. It receives requests, validates data, applies business rules, works with databases and other services, and returns responses. This chapter is the entry point to the detailed Node.js curriculum.

[Module 2 home](README.md) · [Previous: Frontend](03-frontend-react-angular.md) · **Chapter 5 of 9**

## Start the Node.js learning path

The complete syllabus is organized into six progressive chapters, from runtime fundamentals to production operations:

1. [Node.js fundamentals and runtime](nodejs/01-nodejs-fundamentals-and-runtime.md)
2. [npm, CLI, modules and package management](nodejs/02-npm-cli-modules-and-packages.md)
3. [Node.js APIs, networking and asynchronous programming](nodejs/03-node-apis-networking-and-async.md)
4. [Backend architecture, testing and scalability](nodejs/04-backend-architecture-testing-and-scale.md)
5. [Backend frameworks and API design](nodejs/05-backend-frameworks-and-api-design.md)
6. [Production, security, tools and advanced topics](nodejs/06-production-security-and-advanced-topics.md)

**[Open the complete Node.js Backend Engineering learning path](nodejs/README.md).**

## Core request lifecycle

A well-designed API receives a request, validates its input, authenticates the caller, checks authorization, runs business rules, reads or writes data, and returns a predictable response. Failures should be logged safely and mapped to useful HTTP responses.

## What to build

Build an order API with validation, authentication, resource-level authorization, database persistence, idempotency, background email delivery and integration tests. Then containerize it, add health checks and graceful shutdown, and run multiple instances.

**Next:** [05 · Databases & Caching](05-databases-and-caching.md).
