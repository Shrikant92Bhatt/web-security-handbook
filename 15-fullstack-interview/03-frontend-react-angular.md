# 03 — Frontend: React, Angular and the Browser

[Module 2 home](README.md) · [Previous: JavaScript & TypeScript](02-javascript-typescript.md) · **Chapter 3 of 8**

**In simple words:** Frontend code runs in the user's browser. It displays information, responds to clicks and sends requests to the backend. Good frontend code should be easy to use, fast and accessible.

## What the browser does

The browser reads HTML to understand the page, CSS to style it and JavaScript to make it interactive. Example: when a user clicks Add to cart, the page updates the cart and may send a request to the backend.

## React

- A component is a reusable part of the screen, such as a ProductCard.
- Props are information passed from a parent component to a child.
- State is information that can change, such as whether a menu is open.
- Render means React works out what the screen should look like.
- An effect connects a component to something outside React, such as a timer or browser event. Clean it up when it is no longer needed.
- A key is a stable ID React uses to track items in a list.

~~~jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
~~~

Know when to use local component state, shared app state and a library such as Redux or Zustand. Data from the server, such as a product list, often needs different handling from temporary UI state, such as whether a dialog is open.

## Angular

Learn components and templates, services, dependency injection, lifecycle hooks, change detection, RxJS Observables, reactive forms, routing, guards and HTTP interceptors.

A service is a shared class that does work such as loading products. Dependency injection is how Angular gives a component the service it needs.

An Observable is a way to work with values that may arrive over time. For example, a search box can send a request after the user stops typing. RxJS can cancel an older search when a newer one starts.

## Browser performance and accessibility

Load only the JavaScript needed for the current page. Resize and compress images. Avoid unnecessary screen updates. Use headings, labels, buttons and links for their real purpose. Make the page usable with a keyboard. Show loading, error and empty states. Test on a slow network and a small screen.

## Ways to build a frontend

- CSR: the browser builds the page using JavaScript.
- SSR: the server sends ready-made HTML first.
- SSG: HTML is created before a user visits the page.
- Micro-frontend: a large product is split into smaller frontend parts that teams can build and release separately.

Choose based on the product's needs. More tools do not automatically make an app better.

## Interview questions

- What makes a React component render again?
- What are props and state?
- Why does an effect need cleanup?
- When would you use Redux instead of local state?
- What is Angular change detection?
- What is an Observable? How is it different from a Promise?
- What is the difference between CSR and SSR?
- How would you make a slow page faster?
- How do you make a form usable without a mouse?

## Quick revision

Explain component data flow, React state and effects, Angular services and change detection, RxJS basics, page loading and accessibility.

**Try it:** build a product list with search, loading, error and empty states. Add pagination, keyboard support and tests.

**Next:** [04 · Backend — Node.js & API Design](04-backend-nodejs.md).
