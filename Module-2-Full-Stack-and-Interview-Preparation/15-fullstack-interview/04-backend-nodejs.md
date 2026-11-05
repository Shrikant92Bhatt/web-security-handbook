# 05 — Backend: Node.js and API Design

**In simple words:** The backend runs on the server. It checks requests, applies the app's rules, reads or saves data and sends a response. Example: when a customer places an order, the backend checks stock, saves the order and returns a confirmation.

[Module 2 home](README.md) · [Previous: Frontend](03-frontend-react-angular.md) · **Chapter 5 of 9**

**In simple words:** The backend is the part of an application that runs on the server. It checks requests, applies business rules, reads or saves data and sends a response.

## Detailed Node.js learning path

This chapter introduces backend concepts. Continue with the [complete Node.js Backend Engineering curriculum](nodejs/README.md), which covers runtime internals, V8/libuv, npm, modules, Node APIs, streams, networking, frameworks, testing, queues, scaling, security and production deployment in six detailed chapters.

## How Node.js handles work

Node.js runs JavaScript outside the browser. It is good at handling many requests that spend time waiting for a database, file or network response.

Think of a restaurant: one waiter can take many orders while the kitchen prepares them. The waiter does not stand beside one table doing nothing while food cooks.

The Node.js event loop helps manage this waiting work. But long calculations on the main JavaScript thread can block other requests. Use normal async code for database and network work, worker threads for CPU-heavy JavaScript work, and a queue when work can happen later.

## Build a simple API

An API is a set of routes that another program can call.

- GET /products — list products.
- GET /products/42 — get one product.
- POST /orders — create an order.

A good API checks the request, checks who the user is and what they may do, runs the business rule, talks to the database and returns a useful status code.

## Handle failures safely

Check input on the server. Do not trust the browser. Return clear error codes without exposing passwords, tokens or internal error details. Set time limits so a request does not wait forever. Retry only when it is safe. Use an idempotency key for payment or order creation so a retry does not create a duplicate. Log enough to investigate a problem, but do not log secrets.

## Background jobs and queues

Example: after a customer places an order, the app saves the order and adds a task to send an email. A worker sends the email later. If the mail service is down, the task can be tried again. A dead-letter queue holds jobs that keep failing so they can be checked.

## Realtime updates

- Polling: the browser asks for updates every few seconds.
- Long polling: the server holds a request until it has an update or a time limit is reached.
- SSE: the server sends updates to the browser over one open HTTP connection.
- WebSocket: browser and server can both send messages over the same connection.

A delivery tracking page may use SSE for location updates. A chat app often uses WebSockets because both people send messages.

## Run more than one server

If one server cannot handle all requests, run several copies and put a load balancer in front. It sends each request to a server that can handle it. Keep shared user data in a shared store; do not keep important shared state only in one server's memory.

## Interview questions

- What is the Node.js event loop?
- Why can a CPU-heavy task slow down every request?
- When would you use a worker thread?
- What is a stream and when is it useful?
- How would you run multiple copies of a Node.js API?
- What is a queue? Why retry a job?
- What is the difference between polling, SSE and WebSockets?
- How do you stop a server without interrupting active requests?

## Quick revision

Explain request → validation → business logic → database → response. Know the event loop, worker threads, queues, retries, timeouts and adding more servers.

**Try it:** build an order API. Save an order, add an email task to a queue and make sure a repeated request does not create a duplicate order.

**Next:** [06 · Databases & Caching](05-databases-and-caching.md).
