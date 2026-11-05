# 01 — Node.js Fundamentals and Runtime

**In simple words:** Node.js is a runtime that executes JavaScript outside a browser. It provides server-side APIs for files, networking, processes, streams and other system tasks. It is not a programming language or a web framework.

[Node.js learning path](README.md) · **Chapter 1 of 6**

## 1. What Node.js is

- JavaScript language versus JavaScript runtime versus framework.
- V8 executes JavaScript; Node.js adds APIs and runtime integration.
- Browser JavaScript versus Node.js: browser has DOM/window; Node has process, filesystem and server APIs.
- Common use cases: APIs, realtime services, command-line tools, build tools, automation and streaming workloads.
- Strengths: asynchronous I/O, large package ecosystem, shared JavaScript/TypeScript skills.
- Limitations: CPU-heavy JavaScript can block the event loop; native dependencies and memory use still need operational care.

## 2. Runtime architecture

Understand the roles of:
- **V8:** parses, compiles and executes JavaScript; manages JavaScript heap and garbage collection.
- **Node.js core APIs:** filesystem, networking, buffers, streams, crypto, timers and process APIs.
- **libuv:** event-loop implementation and cross-platform asynchronous I/O support; also provides a worker pool for selected operations.
- **Operating system:** sockets, files, process scheduling and kernel-level I/O.
- **Native addons:** optional native code that integrates with Node; introduces ABI, build and security considerations.

A useful mental model: JavaScript runs on the main event-loop thread by default. Node delegates suitable I/O or work to the operating system or libuv facilities, then schedules callbacks when results are ready. Not every asynchronous API uses the same mechanism.

## 3. Event loop

Learn the phases and what they mean: timers, pending callbacks, idle/prepare internals, poll, check and close callbacks. Understand:
- `setTimeout` and `setInterval` schedule timer callbacks; timing is not exact.
- `setImmediate` runs in the check phase.
- I/O callbacks are processed as the loop progresses.
- Promise reactions and `queueMicrotask` use the microtask queue.
- `process.nextTick` has its own queue and can starve I/O if abused.
- Ordering can depend on where code runs and the Node version; do not teach one output order as universal.

Compare browser event-loop concepts with Node's event loop, but do not assume the two are identical. Understand event-loop delay and how long synchronous callbacks reduce throughput.

## 4. libuv thread pool and concurrency

- The libuv worker pool is used by certain filesystem, DNS and crypto operations; it is not a pool that automatically runs every JavaScript callback.
- Configure pool size only after measuring workload and understanding contention.
- Node's single main JavaScript thread does not mean the entire runtime is single-threaded.
- Use worker_threads for CPU-intensive JavaScript tasks; use child processes for process isolation or separate executables.
- Use asynchronous I/O for waiting on network, database and file operations.
- Understand concurrency versus parallelism.

## 5. Node.js process and environment

Study `process.argv`, `process.env`, `process.cwd()`, `process.pid`, `process.platform`, `process.version`, `process.memoryUsage()`, `process.uptime()`, exit codes, signals and standard streams. Understand environment-specific configuration and why secrets should not be committed to source control.

## 6. Global scope and built-in objects

Know Buffer, URL, URLSearchParams, console, process, globalThis, timers, structuredClone (where supported), AbortController and Web Crypto. Understand which APIs are global in the chosen Node version and which require imports.

## 7. V8 and memory

- Call stack, heap and garbage collection at a conceptual level.
- Generational garbage collection and why allocation patterns matter.
- Memory metrics: RSS, heapTotal, heapUsed, external and arrayBuffers.
- Common leaks: unbounded caches, retained closures, listeners, timers, global collections and request objects held too long.
- Heap snapshots, allocation profiling and GC traces; never force GC as a normal production fix.
- V8 optimization concepts: interpreter/JIT tiers, hot functions, deoptimization and hidden classes at an awareness level. Avoid premature micro-optimization.

## 8. High-load operation

- Event-loop blocking, slow dependencies, connection limits and memory pressure.
- Backpressure and bounded queues.
- Horizontal scaling with multiple processes/containers and a load balancer.
- Cluster module awareness; compare with process managers and container orchestration rather than assuming Cluster is the only scaling option.
- Stateless service design and external shared stores.
- CPU profiling and event-loop utilization before optimization.

## Interview questions

1. What is Node.js, and how is it different from JavaScript?
2. What roles do V8 and libuv play?
3. Explain the Node.js event-loop phases.
4. What is the difference between process.nextTick and queueMicrotask?
5. Which tasks use the libuv thread pool?
6. How can CPU-heavy work affect API latency?
7. Compare worker_threads, child_process and cluster.
8. What is the difference between RSS and heapUsed?
9. How would you investigate an increasing memory footprint?

## Practical exercise

Create a small HTTP server. Add one route that performs asynchronous I/O and another that deliberately performs a short CPU-heavy loop. Observe how the second route affects concurrent requests. Then move the CPU work to a worker thread and compare responsiveness.

**References:** [Node.js Learn](https://nodejs.org/en/learn), [Node.js event loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), [Node.js process API](https://nodejs.org/api/process.html), [libuv documentation](https://docs.libuv.org/en/v1.x/).
