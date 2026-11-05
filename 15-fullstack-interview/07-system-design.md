# 07 — Full-Stack & System Design

[Module 2 home](README.md) · [Previous: Cloud & DevOps](06-cloud-devops.md) · **Chapter 7 of 8**

## Design fundamentals

Requirements and constraints; capacity estimation; HLD vs LLD; component boundaries, API contracts and data models; monolith vs microservices; load balancing, caching, queues, event-driven architecture; availability, graceful degradation, consistency, ordering, deduplication, security, observability and cost.

## Frontend system design

Component architecture, state ownership, data fetching, pagination, infinite scroll, virtualization, optimistic updates, realtime UI, offline-first behavior, conflict resolution, design systems, micro-frontends, accessibility and performance budgets.

## Practice design prompts

- Design a chat application with realtime delivery and offline reconnect.
- Design a notification system for millions of users.
- Design a rate limiter shared across multiple API instances.
- Design a file upload service with resumable uploads and malware scanning.
- Design an analytics dashboard with high-volume events.
- Design a multi-tenant SaaS application with strict tenant isolation.
- Design a frontend architecture for independently deployed teams.

## Answer framework

1. Clarify requirements and non-goals.
2. Estimate scale and identify bottlenecks.
3. Draw clients, edge, services, data stores and async components.
4. Define APIs, schemas and key workflows.
5. Deep-dive into scaling, consistency, failure handling and security.
6. Explain trade-offs and monitoring.

## Quick revision

Practise one HLD and one LLD every day. State assumptions and trade-offs; do not draw technology boxes without explaining why they are needed.

**Practice:** design a ChatGPT-like application with streaming responses, conversation history, retrieval, rate limits, background jobs, tenant isolation and observability.

**Next:** [08 · Question Bank & Day-Before Revision](08-interview-question-bank.md).
