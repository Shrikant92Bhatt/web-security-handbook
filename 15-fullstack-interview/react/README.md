# React — Complete Learning Path

**In simple words:** This path takes you from writing your first React component to explaining Fiber, Server Components and state-management trade-offs in a senior interview. Every topic in the React evaluation matrix below is covered, in the same Basic → Intermediate → Advanced → Bonus order.

[Module 2 home](../README.md) · [Frontend overview](../03-frontend-react-angular.md) · [Core Web Development](../core-web-development/README.md)

**Before you start:** be comfortable with the [JavaScript & TypeScript](../02-javascript-typescript.md) chapter (closures, `this`, promises, modules) and the browser basics in [Core Web Development](../core-web-development/README.md). Examples use **React 19** and TypeScript; older APIs are explained where interviews still ask about them.

## Learning order

1. [React Core: Basics](01-react-core-basics.md) — components, JSX, state, lifecycle, hooks, composition
2. [React Core: Intermediate](02-react-core-intermediate.md) — React DOM, forms, context, performance
3. [React Core: Advanced](03-react-core-advanced.md) — code reuse patterns, Virtual DOM, reconciliation, Fiber
4. [React Ecosystem: Basics & Intermediate](04-ecosystem-basics-and-intermediate.md) — TypeScript, Redux, React Redux, async flow, routing
5. [React Ecosystem: Advanced](05-ecosystem-advanced.md) — testing, building, SSR, Server Components, SSG
6. [Bonus topics](06-bonus-topics.md) — `createElement`, classes, PropTypes, Redux Toolkit, MobX, other stores, Flux, security, animation

## React evaluation matrix — coverage map

### React Core

| Level | Topic | Covered in |
|---|---|---|
| Basic | Component definition (function component) | [01 §1](01-react-core-basics.md#1-component-definition-function-components) |
| Basic | JSX — embedding expressions, attributes, children | [01 §2](01-react-core-basics.md#2-jsx) |
| Basic | Component state — initial state, `useState`, lazy initialization | [01 §3](01-react-core-basics.md#3-component-state) |
| Basic | Lifecycle — mounting, updating, unmounting; render, pre-commit, commit phases; error boundaries | [01 §4](01-react-core-basics.md#4-component-lifecycle-function-components) |
| Basic | Hooks — use cases, rules, state/context/ref/effect/performance/custom hooks | [01 §5](01-react-core-basics.md#5-hooks) |
| Basic | Composition — `props.children`, composition vs inheritance, lifting state up, decomposition task | [01 §6](01-react-core-basics.md#6-component-composition) |
| Intermediate | React DOM — `createRoot`, `hydrateRoot`, `createRef`, `createPortal`, `flushSync`; `Fragment`, `Suspense`, `StrictMode`, `Profiler` | [02 §1](02-react-core-intermediate.md#1-react-dom) |
| Intermediate | Forms — controlled/uncontrolled, SyntheticEvent, `useFormStatus`, `useFormState`/`useActionState`, `useOptimistic` | [02 §2](02-react-core-intermediate.md#2-forms) |
| Intermediate | Context — when to use, `useContext`, `Context.Provider`, `Context.Consumer` | [02 §3](02-react-core-intermediate.md#3-context) |
| Intermediate | Performance — `memo`, `useMemo`, `useCallback`, keys, Profiler | [02 §4](02-react-core-intermediate.md#4-performance) |
| Advanced | Code reuse — custom hooks, higher-order components, render props | [03 §1](03-react-core-advanced.md#1-code-reuse-patterns) |
| Advanced | Virtual DOM — concept, reconciliation, recursing on children, keys, Fiber | [03 §2](03-react-core-advanced.md#2-virtual-dom) |

### React Ecosystem

| Level | Topic | Covered in |
|---|---|---|
| Basic | Typechecking (TypeScript) | [04 §1](04-ecosystem-basics-and-intermediate.md#1-typechecking-with-typescript) |
| Basic | Redux — three principles, actions, reducers, store, unidirectional flow, normalization, Redux vs Context | [04 §2](04-ecosystem-basics-and-intermediate.md#2-redux) |
| Intermediate | React Redux — presentational vs container, `Provider`, `connect`, `useSelector`, `useDispatch` | [04 §3](04-ecosystem-basics-and-intermediate.md#3-react-redux) |
| Intermediate | Redux async flow — middleware, Redux Thunk | [04 §4](04-ecosystem-basics-and-intermediate.md#4-redux-async-flow) |
| Intermediate | Routing — React Router, JSX/object configuration, history | [04 §5](04-ecosystem-basics-and-intermediate.md#5-routing) |
| Advanced | Automated testing — rendering types, React Testing Library vs Enzyme, Playwright/Cypress/Puppeteer | [05 §1](05-ecosystem-advanced.md#1-automated-testing) |
| Advanced | Building — transpilers, bundlers, dev vs production, code splitting, optimisation | [05 §2](05-ecosystem-advanced.md#2-building) |
| Advanced | Server-side rendering — vs CSR, use cases, Server Components, Server Functions, server React DOM APIs | [05 §3](05-ecosystem-advanced.md#3-server-side-rendering) |
| Advanced | Static site generation — Next.js, Gatsby, Astro, Docusaurus, React Static | [05 §4](05-ecosystem-advanced.md#4-static-site-generation) |

### Bonus

| Topic | Covered in |
|---|---|
| React without JSX (`createElement`) | [06 §1](06-bonus-topics.md#1-react-without-jsx-createelement) |
| Class component definition | [06 §2](06-bonus-topics.md#2-class-component-definition) |
| Class component lifecycle | [06 §3](06-bonus-topics.md#3-class-component-lifecycle) |
| Typechecking — PropTypes vs TypeScript | [06 §4](06-bonus-topics.md#4-typechecking-proptypes-vs-typescript) |
| Redux Toolkit — vs pure Redux, `createSlice`, `configureStore`, Immer, RTK Query | [06 §5](06-bonus-topics.md#5-redux-toolkit) |
| MobX — principles, observable and computed values, actions, reactions | [06 §6](06-bonus-topics.md#6-mobx) |
| Other state managers — Zustand, Jotai, XState; pros/cons vs Redux and each other | [06 §7](06-bonus-topics.md#7-other-state-managers) |
| Flux architecture | [06 §8](06-bonus-topics.md#8-flux-architecture) |
| Security — XSS via React props, `dangerouslySetInnerHTML` | [06 §9](06-bonus-topics.md#9-security-xss-through-react-props-and-dangerouslysetinnerhtml) |
| Animation — react-transition-group, manual animation, `transition`, `translate` | [06 §10](06-bonus-topics.md#10-animation) |

## What you should be able to build

- A product listing with search, filters, loading/error/empty states and keyboard support.
- A checkout flow with React 19 form actions, optimistic updates and server validation.
- A shared cart using Context, then the same with Redux Toolkit and Zustand — and explain the trade-offs.
- A routed app with nested layouts, code-split routes and protected pages (with backend checks).
- Integration tests with React Testing Library and one Playwright e2e test for checkout.
- An SSR or Server Components page and a statically generated docs/blog page.

## Study method

For each section: read the explanation, run the example, break it on purpose (mutate state, remove a key, drop a cleanup), explain what went wrong, then answer the interview questions aloud without notes.

**Start:** [01 · React Core: Basics](01-react-core-basics.md).
