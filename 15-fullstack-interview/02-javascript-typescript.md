# 02 — JavaScript and TypeScript

**In simple words:** JavaScript runs code in the browser and in Node.js. TypeScript adds checks that catch many mistakes while you write code. Example: a Product type can say that every product must have an id, name and price.

[Module 2 home](README.md) · [Previous: HTTP](01-http-and-web-fundamentals.md) · **Chapter 2 of 8**

**In simple words:** JavaScript runs much of the code in a browser and in Node.js. TypeScript adds type checks that help catch mistakes while you write code.

## Variables and scope

Use const when you do not plan to assign a new value, and let when you do. Avoid var in new code because its older scoping rules can be confusing. A variable declared inside a function is not normally available outside that function. This is called scope.

## Functions and closures

A closure happens when a function remembers variables from the place where it was created.

~~~js
function makeCounter() {
  let count = 0;
  return function increase() {
    count += 1;
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
~~~

The returned function remembers count, even after makeCounter has finished.

## The event loop

JavaScript usually runs one piece of JavaScript at a time on its main thread. When a network request is waiting, the browser or Node.js can handle that waiting work separately. When it is ready, its callback is queued to run.

~~~js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// Output: A, D, C, B
~~~

Promise callbacks run before the timer callback in this example.

## Promises and async/await

A Promise represents work that may finish later.

~~~js
async function loadUser() {
  try {
    const response = await fetch("/api/user");
    if (!response.ok) throw new Error("Could not load user");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
~~~

Think about errors, timeouts and what the page should show while waiting.

## Objects and arrays

Objects and arrays are reference values. Assigning one object to another variable does not make a separate copy.

~~~js
const first = { city: "Pune" };
const second = first;
second.city = "Mumbai";
console.log(first.city); // Mumbai
~~~

This can cause bugs when shared data is changed by mistake.

## TypeScript

TypeScript checks many mistakes before the program runs. It does not check the actual data received from an API while the program is running.

~~~ts
type Product = { id: number; name: string; price: number };

function showPrice(product: Product): string {
  return "₹" + product.price;
}
~~~

A type or interface describes data. A union says a value can be one of several types. A generic lets code work with more than one data type. Unknown means you must check a value before using it.


## Deeper JavaScript topics to master

The list above is a starting point. For senior frontend interviews, study these areas as separate concepts and practise explaining the output of small programs.

### Values, types and coercion
- Primitive values: string, number, bigint, boolean, undefined, symbol and null.
- Objects, arrays, functions, dates, maps, sets and other reference values.
- typeof, Array.isArray, Number.isNaN, Object.is and safe type checks.
- Truthy/falsy values, strict equality, loose equality, implicit conversion and explicit conversion.
- Number precision, NaN, Infinity, safe integers, BigInt and floating-point limitations.
- Nullish coalescing, optional chaining and logical assignment.

### Declarations, scope and execution
- var, let and const; global, function and block scope.
- Hoisting, temporal dead zone and declaration initialization.
- Lexical environment, scope chain and variable lookup.
- Execution context, call stack, function invocation and return.
- Strict mode and differences in behavior.
- Global object and top-level declarations in scripts versus modules.

### Functions and function behavior
- Function declarations, expressions, arrow functions and methods.
- Parameters, arguments, default values, rest parameters and spread syntax.
- this binding: default, implicit, explicit, constructor and arrow lexical this.
- call, apply and bind; borrowing methods and partial application.
- Higher-order functions, callbacks, pure functions and side effects.
- Recursion, tail-call concept, stack limits and iterative alternatives.
- Function composition, currying, memoization, debounce and throttle.
- Closures, private state, module patterns and common memory-retention mistakes.

### Objects and prototypes
- Object creation, property access, computed keys and property descriptors.
- Own versus inherited properties; enumerable, writable and configurable.
- Object.keys, values, entries, assign, freeze, seal and preventExtensions.
- Prototype chain, Object.create, getPrototypeOf and setPrototypeOf.
- Constructor functions, new, instanceof and class syntax.
- Static members, getters/setters, private class fields, inheritance and composition.
- Property lookup, shadowing and prototype pollution awareness.

### Arrays, collections and iteration
- Mutating versus non-mutating methods.
- map, filter, reduce, find, findIndex, some, every, flat and flatMap.
- sort comparator, stable sorting, localeCompare and copying before sorting.
- Iterables, iterators, generators, yield, for...of and for...in differences.
- Map, Set, WeakMap and WeakSet; key identity and garbage-collection behavior.
- Destructuring, rest/spread, shallow copy and deep-copy limitations.

### Asynchronous JavaScript
- Synchronous code, tasks, microtasks, event loop, call stack and rendering opportunities.
- Promise states, chaining, error propagation and thenable assimilation.
- Promise.all, allSettled, race and any; choosing the right combinator.
- async/await, sequential versus parallel work and error handling.
- Timers, queueMicrotask, AbortController and cancellation patterns.
- Race conditions, stale responses, concurrency limits, retries and backoff.
- Browser event loop versus Node.js event loop: do not assume they are identical.

### Errors, modules and runtime behavior
- Error, TypeError, RangeError, custom errors, cause and stack traces.
- try/catch/finally, throwing, rejected promises and unhandled rejections.
- ES modules, named/default exports, dynamic import, live bindings and circular dependencies.
- CommonJS require/module.exports and how it differs from ESM.
- JSON parsing/stringifying, reviver/replacer and serialization limits.
- Regular expressions: literals, groups, character classes, quantifiers, flags, anchors, lookarounds and greedy/lazy matching.
- Memory basics: reachability, garbage collection, leaks and profiling.

## Browser JavaScript is a separate subject

Do not mix browser-provided APIs into the definition of the JavaScript language. DOM, window, fetch, localStorage, WebSocket, Canvas and Service Worker are Web Platform APIs, not core ECMAScript features. Study them in [Core Web Development](core-web-development/README.md). This distinction matters because Node.js supports the JavaScript language but does not provide a normal browser document or window.


## Interview questions

- What is the difference between var, let and const?
- What is a closure? Give a real use case.
- Explain the event loop using the example above.
- What is the difference between a Promise and async/await?
- What happens if two variables point to the same object?
- What is the difference between any and unknown?
- Why does TypeScript not replace API input validation?

## Quick revision

Practise explaining scope, closures, the event loop, Promises, object references and TypeScript unions.

**Try it:** write a function that fetches products, handles an error and returns typed product data. Add checks for the response received from the server.

**Next:** [03 · Frontend — React, Angular & Browser](03-frontend-react-angular.md).
