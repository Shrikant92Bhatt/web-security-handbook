# 05 — Databases and Caching

**In simple words:** A database stores information for later. A cache keeps a short-lived copy of popular information so the app can answer faster. Example: the shop stores orders in a database and keeps popular product details in Redis for a short time.

[Module 2 home](README.md) · [Previous: Backend](04-backend-nodejs.md) · **Chapter 5 of 8**

**In simple words:** A database stores information so an application can find it later. A cache keeps a copy of often-used information so the app can answer faster.

## SQL databases

A SQL database stores information in tables made of rows and columns. An online shop may have users, products, orders and order_items tables. A primary key identifies a row. A foreign key connects one table to another.

Learn SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY and ORDER BY.

## Indexes

An index helps the database find rows without checking every row. If the app often searches users by email, an index on email can make that search faster. But indexes take storage and make writes a little slower. Add indexes for real query needs, not every column.

## Transactions

A transaction groups database changes so they succeed or fail together.

Example: when buying a product, the app creates an order and reduces stock. If the stock update fails, the order should not be left half-finished.

ACID describes four useful transaction properties: all changes happen or none do; rules remain valid; simultaneous work does not cause incorrect results; and saved changes stay saved.

## SQL and NoSQL

SQL databases are a strong choice when data has clear relationships and rules. Document databases store records as flexible documents. Key-value stores are useful for quick lookups, sessions and caching. Choose based on how the app reads and writes data.

## Caching with Redis

Example: a product page is requested thousands of times. Instead of asking the main database every time, the API can keep product details in Redis for 60 seconds. This makes reads faster and reduces database work. But the app must decide what to do when the product changes.

- Cache-aside: check the cache; if missing, read the database and save a copy.
- TTL: the time after which a saved item expires.
- Cache invalidation: remove or update a saved item when the real data changes.

## Database performance and safe changes

Check slow queries and their query plans. Avoid asking the database for the same data repeatedly in a loop. Reuse database connections with a connection pool. Back up data before risky changes. For a large table, add a new column in steps and keep old and new app versions working during the change.

## Interview questions

- What are primary and foreign keys?
- Why does an index make a search faster?
- Can too many indexes be a problem?
- What is a transaction? Explain it with an order example.
- When would you choose SQL or NoSQL?
- What is Redis used for?
- What happens when a cache contains old data?
- How would you find a slow query?

## Quick revision

Explain tables and relationships, indexes, transactions, SQL vs NoSQL, Redis and cache expiry.

**Try it:** design tables for users, products, orders and order items. Add the keys and indexes needed to find a customer's orders.

**Next:** [06 · Cloud, DevOps & Operations](06-cloud-devops.md).
