# 02 — JavaScript & TypeScript

[Module 2 home](README.md) · [Previous: HTTP](01-http-and-web-fundamentals.md) · **Chapter 2 of 8**

## JavaScript

- Execution context, lexical environment, scope chain and closures.
- Hoisting, temporal dead zone, var vs let vs const.
- this, call/apply/bind, prototypes and inheritance.
- Event loop, call stack, task queue, microtasks and rendering.
- Promises, async/await, error propagation and AbortController.
- Shallow vs deep copy, immutability, equality and object references.
- Garbage collection, memory leaks, debouncing and throttling.
- ES modules, CommonJS and module resolution.

## TypeScript

- Structural typing, inference, narrowing and type guards.
- type vs interface; unions, intersections, generics and utility types.
- unknown vs any vs never; strict null checks.
- Discriminated unions and exhaustive checking.
- Typing API responses, callbacks, events and component props.
- Runtime validation: TypeScript does not validate untrusted network input.

## Interview questions

- Explain the event loop with a microtask/macrotask example.
- What is a closure? Give a use and a memory-leak risk.
- Explain this in arrow functions vs regular functions.
- How do promises differ from callbacks? How do errors propagate?
- What causes a memory leak in a long-running frontend app?
- Explain prototype inheritance.
- Compare unknown, any and never.
- When would you use a generic or discriminated union?
- Why is compile-time typing not runtime validation?

## Quick revision

Be able to write debounce, throttle, promise-based retry, concurrency limiter and typed API result models.

**Practice:** implement a concurrency-limited async task runner with typed success and failure results.

**Next:** [03 · Frontend — React, Angular & Browser](03-frontend-react-angular.md).
