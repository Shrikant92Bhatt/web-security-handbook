# 05 — Databases, SQL, NoSQL & Caching

[Module 2 home](README.md) · [Previous: Backend](04-backend-nodejs.md) · **Chapter 5 of 8**

## Relational databases

- Tables, keys, constraints, normalization and denormalization.
- SQL joins, aggregation, subqueries, CTEs and window functions.
- Indexes: B-tree basics, composite/covering indexes, selectivity and query plans.
- Transactions and ACID; isolation levels, locks, deadlocks and MVCC.
- Connection pools, prepared statements, migrations and zero-downtime schema changes.
- Replication, read replicas, partitioning and sharding.

## NoSQL and distributed data

Document, key-value, wide-column and graph models; MongoDB embedding vs referencing; consistency and availability; eventual consistency; optimistic concurrency; choosing SQL vs NoSQL from access patterns and invariants.

## Caching and search

Redis data structures, TTL, eviction, cache-aside/read-through/write-through, cache invalidation, stampede, penetration, hot keys, CDN/browser/API/database cache layers and search indexes.

## Interview questions

- Explain how a database index works and when it can hurt.
- How do you choose the order of columns in a composite index?
- Explain ACID and transaction isolation levels.
- What are dirty reads, non-repeatable reads and phantom reads?
- How would you investigate a slow SQL query?
- Compare optimistic and pessimistic locking.
- SQL vs NoSQL: how choose for an order-management system?
- Explain cache-aside and cache invalidation challenges.
- How prevent duplicate writes during retries?
- How migrate a large table without downtime?

## Quick revision

Read an EXPLAIN plan, identify N+1 queries, explain transaction boundaries and draw a cache-aside flow.

**Practice:** design order and payment tables, define constraints/indexes, and explain how to prevent double spending under concurrent requests.

**Next:** [06 · Cloud, DevOps & Operations](06-cloud-devops.md).
