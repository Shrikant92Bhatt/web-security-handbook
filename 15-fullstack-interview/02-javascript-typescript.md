# 02 — JavaScript and TypeScript

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
