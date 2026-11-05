# 01 — React Core: Basics

**In simple words:** React builds a screen out of small reusable pieces called components. You describe what the screen should look like for the current data, and React updates the browser page when the data changes. Example: a shopping cart badge shows `3`; when the user adds an item, you change the number and React updates the badge.

[React path home](README.md) · [Module 2 home](../README.md) · **React chapter 1 of 6**

Examples use React 19 and TypeScript-friendly JavaScript. Older behaviour is mentioned where interviewers still ask about it.

---

## 1. Component definition (function components)

### What is it?

A **component** is a JavaScript function that returns what should appear on screen. Its name must start with a capital letter so React can tell it apart from HTML tags such as `<div>`.

~~~tsx
type ProductCardProps = { name: string; price: number };

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>₹{price}</p>
    </article>
  );
}

// Using it
<ProductCard name="Coffee beans" price={450} />
~~~

- `ProductCardProps` describes the inputs. Inputs passed from a parent are called **props**.
- Props are **read-only**. A component must never change its own props.
- The function should be **pure while rendering**: same props and state in, same output out. No network calls, timers or changing outside variables during render. Those belong in event handlers or effects.

### Why pure rendering matters

React may call your component more than once (for example in Strict Mode during development, or when it pauses and restarts work). If rendering changes things outside the component, repeating it causes bugs such as duplicate analytics events.

~~~tsx
// ❌ Mistake: side effect during render
let renderCount = 0;
function Badge() {
  renderCount++;                 // changes outside data on every render
  return <span>{renderCount}</span>;
}
~~~

### Interview points

- Function components replaced class components as the normal way to write React (classes are covered in [Bonus topics](06-bonus-topics.md)).
- A component returns JSX, a string, a number, `null` (render nothing), or an array/fragment of these.
- In React 19, `ref` can be passed as a normal prop to function components, so `forwardRef` is no longer required for new code.

---

## 2. JSX

### What is it?

**JSX** is HTML-like syntax inside JavaScript. A build tool turns it into normal function calls. `<h1 className="title">Hi</h1>` becomes roughly `jsx("h1", { className: "title", children: "Hi" })`.

### Embedding expressions

Curly braces `{}` hold any JavaScript **expression** (something that produces a value).

~~~tsx
function OrderSummary({ items, discount }: { items: { id: string; name: string }[]; discount?: number }) {
  const total = items.length;
  return (
    <section>
      <h2>Order ({total} items)</h2>

      {/* Conditional rendering */}
      {discount ? <p>You saved {discount}%</p> : null}
      {total === 0 && <p>Your cart is empty.</p>}

      {/* Lists need a stable key */}
      <ul>
        {items.map((item) => <li key={item.id}>{item.name}</li>)}
      </ul>
    </section>
  );
}
~~~

You cannot put statements such as `if` or `for` directly inside `{}`. Use a ternary, `&&`, `map`, or compute the value before `return`.

**Common mistake:** `{count && <Badge />}` renders `0` when `count` is `0`, because `0` is a value React prints. Use `{count > 0 && <Badge />}`.

### Attributes

| HTML | JSX | Why |
|---|---|---|
| `class` | `className` | `class` is a reserved JavaScript word |
| `for` | `htmlFor` | `for` is a reserved word |
| `onclick="..."` | `onClick={handleClick}` | Pass a function, not a string |
| `style="color:red"` | `style={{ color: 'red' }}` | Style is an object with camelCase keys |
| `tabindex` | `tabIndex` | Most attributes use camelCase |
| — | `aria-label`, `data-id` | `aria-*` and `data-*` keep dashes |

- `{...props}` spreads all props onto an element. Use it carefully; it can pass unexpected attributes.
- JSX escapes text by default, so `<p>{userComment}</p>` is safe from HTML injection. See [Security](06-bonus-topics.md#9-security-xss-through-react-props-and-dangerouslysetinnerhtml).

### Children

Whatever you put between opening and closing tags arrives as the `children` prop.

~~~tsx
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

<Card title="Delivery">
  <p>Arrives tomorrow</p>
</Card>
~~~

### One root rule

A component returns one root. Use a **Fragment** `<>...</>` to group elements without adding an extra `<div>`.

---

## 3. Component state

### What is it?

**State** is data a component remembers between renders and that changes over time, such as whether a dropdown is open or what the user typed. Changing state tells React to render the component again.

### `useState` and initial state

~~~tsx
import { useState } from 'react';

function QuantityPicker() {
  const [qty, setQty] = useState(1);        // 1 is the initial state

  return (
    <div>
      <button onClick={() => setQty(qty - 1)} disabled={qty <= 1}>−</button>
      <span>{qty}</span>
      <button onClick={() => setQty(qty + 1)}>+</button>
    </div>
  );
}
~~~

- `useState(1)` returns `[currentValue, setter]`.
- The initial value is used **only on the first render**. Changing the argument later does nothing.

### Updates are snapshots and batched

Inside one render, `qty` is a fixed value (a snapshot). Calling the setter schedules a new render; it does not change the variable immediately.

~~~tsx
function addThree() {
  setQty(qty + 1);
  setQty(qty + 1);
  setQty(qty + 1);   // ❌ qty is still the old value: result is +1, not +3
}

function addThreeCorrectly() {
  setQty((q) => q + 1);   // ✅ updater function gets the latest queued value
  setQty((q) => q + 1);
  setQty((q) => q + 1);   // result: +3
}
~~~

React **batches** several state updates from the same event into one re-render. Since React 18 this also happens inside promises, timeouts and native event handlers (automatic batching).

### Objects and arrays: replace, do not mutate

React compares the old and new state with `Object.is`. If you change the same object in place, React sees "same object" and may skip the update.

~~~tsx
const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);

// ❌ Mutation: same array reference
cart.push({ id: 'p1', qty: 1 });
setCart(cart);

// ✅ New array
setCart((prev) => [...prev, { id: 'p1', qty: 1 }]);

// ✅ Update one item
setCart((prev) => prev.map((i) => (i.id === 'p1' ? { ...i, qty: i.qty + 1 } : i)));
~~~

### Lazy initialization

If the initial value is expensive to compute, pass a **function**. React calls it only on the first render.

~~~tsx
// ❌ Reads localStorage on EVERY render (result is ignored after the first)
const [draft, setDraft] = useState(JSON.parse(localStorage.getItem('draft') ?? '""'));

// ✅ Lazy initializer: runs once
const [draft, setDraft] = useState(() => JSON.parse(localStorage.getItem('draft') ?? '""'));
~~~

Note the difference: `useState(fn)` stores the *result* of `fn`. To store a function in state, wrap it: `useState(() => fn)`.

### Resetting state with `key`

State belongs to a component's **position** in the tree. Changing a component's `key` makes React treat it as a new component and reset its state.

~~~tsx
<ProfileForm key={userId} userId={userId} />  // switching user clears the form
~~~

### Choosing what to keep in state

- Do not store values you can calculate from props or other state (for example `total` from `items`). Calculate them during render.
- Do not copy props into state unless you only want the initial value.
- Keep state as close as possible to where it is used.

---

## 4. Component lifecycle (function components)

### What is it?

A component's **lifecycle** is what happens from the moment it appears on screen until it disappears.

| Stage | What happens | Function-component tool |
|---|---|---|
| Mounting | Component is added to the screen for the first time | `useEffect(() => {...}, [])` runs after it appears |
| Updating | Props, state or context changed, component renders again | `useEffect` with dependencies runs when they change |
| Unmounting | Component is removed | Cleanup function returned from `useEffect` |

~~~tsx
function LiveOrderStatus({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const socket = new WebSocket(`wss://example.test/orders/${orderId}`);   // runs after mount and when orderId changes
    socket.onmessage = (e) => setStatus(e.data);

    return () => socket.close();   // cleanup: before re-running and on unmount
  }, [orderId]);

  return <p>Status: {status}</p>;
}
~~~

Think about effects as **synchronisation**, not as lifecycle events: "keep this socket connected to the current `orderId`". When `orderId` changes, React closes the old connection (cleanup) and opens a new one.

### Phases: render, pre-commit, commit

React does every update in phases:

~~~mermaid
flowchart LR
  T[Trigger<br/>initial render or setState] --> R[Render phase<br/>call components, build new tree, diff]
  R --> P[Pre-commit<br/>read DOM before change]
  P --> C[Commit phase<br/>apply DOM changes]
  C --> L[Layout effects<br/>useLayoutEffect]
  L --> B[Browser paints]
  B --> E[Passive effects<br/>useEffect]
~~~

1. **Trigger.** Something asks for an update: the first `root.render()` or a state setter.
2. **Render phase.** React calls your components to find out what the UI should look like and compares it with the previous result (see [Virtual DOM & Fiber](03-react-core-advanced.md)). This phase must be pure. React can pause, restart or throw away this work.
3. **Pre-commit phase.** Just before changing the DOM, React can read information from the current DOM, such as scroll position. In class components this is `getSnapshotBeforeUpdate`.
4. **Commit phase.** React applies the minimal changes to the real DOM, attaches refs and runs `useLayoutEffect` (and class `componentDidMount`/`componentDidUpdate`). This phase is synchronous and cannot be interrupted.
5. **Paint.** The browser draws the result.
6. **Passive effects.** `useEffect` callbacks run after paint so they do not block the screen.

Use `useLayoutEffect` only when you must measure or change layout before the user sees the screen, for example positioning a tooltip. Otherwise use `useEffect`.

### Strict Mode double-invocation

In development, `<StrictMode>` mounts, unmounts and mounts each component again, and calls render functions twice. This exposes missing cleanup. If your effect breaks when it runs twice, the cleanup is wrong — do not "fix" it by removing Strict Mode.

### Error boundaries

If a component throws an error during rendering, React would normally remove the whole tree and show a blank page. An **error boundary** catches render errors in its children and shows a fallback instead.

Error boundaries must still be **class components** (there is no hook equivalent). Most teams use the `react-error-boundary` package or write one small class:

~~~tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };            // switch to fallback UI on the next render
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);  // send to your error-reporting service
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

<ErrorBoundary fallback={<p>Could not load recommendations.</p>}>
  <Recommendations />
</ErrorBoundary>
~~~

Error boundaries do **not** catch errors in:

- event handlers (use `try/catch`),
- asynchronous code such as `setTimeout` or a promise callback (unless you rethrow into render),
- server-side rendering,
- the boundary itself.

React 19 adds `onCaughtError` and `onUncaughtError` options to `createRoot` for central error reporting.

**Tip:** place several boundaries around independent sections (sidebar, recommendations, comments) so one failure does not take down the checkout page.

---

## 5. Hooks

### What is it?

A **hook** is a special function, starting with `use`, that lets a function component use React features such as state, context, refs and effects.

### Rules of Hooks

1. **Call hooks only at the top level** of a component or custom hook — not inside `if`, loops, nested functions or after an early `return`.
2. **Call hooks only from React functions** — components or custom hooks, not normal utilities or class components.

Why: React identifies each hook by its **call order**. If a condition skips a hook on one render, every following hook receives the wrong stored value.

~~~tsx
// ❌ Breaks hook order
if (isLoggedIn) {
  const [name, setName] = useState('');
}

// ✅ Always call; decide inside
const [name, setName] = useState('');
~~~

`eslint-plugin-react-hooks` checks these rules and the dependency arrays. Keep it enabled. The exception is `use(...)`, which can be called conditionally.

### Hook types

| Category | Hooks | Use when |
|---|---|---|
| State | `useState`, `useReducer`, `useActionState`, `useOptimistic` | Component must remember and change data |
| Context | `useContext`, `use(Context)` | Read shared data without passing props through every level |
| Ref | `useRef`, `useImperativeHandle` | Keep a value that does not trigger renders, or access a DOM node |
| Effect | `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent` (React 19.2) | Synchronise with something outside React |
| Performance | `useMemo`, `useCallback`, `useTransition`, `useDeferredValue` | Skip expensive work or keep the UI responsive |
| Other | `useId`, `useSyncExternalStore`, `useDebugValue`, `use` | Accessible IDs, external stores, debugging, reading promises/context |
| Custom | `useSomething` you write | Reuse stateful logic between components |

#### State hooks: `useReducer`

Use a reducer when the next state depends on the previous state in several ways, or when many actions change the same data.

~~~tsx
type CartAction =
  | { type: 'add'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

function cartReducer(state: Record<string, number>, action: CartAction) {
  switch (action.type) {
    case 'add':    return { ...state, [action.id]: (state[action.id] ?? 0) + 1 };
    case 'remove': { const { [action.id]: _, ...rest } = state; return rest; }
    case 'clear':  return {};
  }
}

const [cart, dispatch] = useReducer(cartReducer, {});
dispatch({ type: 'add', id: 'coffee' });
~~~

The reducer is a pure function and easy to unit-test. This is the same idea Redux uses ([Ecosystem chapter](04-ecosystem-basics-and-intermediate.md)).

#### Context hooks

`useContext(ThemeContext)` reads the nearest provider value. Covered fully in [Context](02-react-core-intermediate.md#3-context).

#### Ref hooks: `useRef`

A ref is a box `{ current: value }` that keeps its value between renders **without** causing a re-render when it changes.

~~~tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);   // DOM reference
  const timerRef = useRef<number | null>(null);      // mutable value

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus search</button>
    </>
  );
}
~~~

- Do not read or write `ref.current` during render (except lazy initialisation). Use it in events and effects.
- `useImperativeHandle(ref, () => ({ focus, clear }))` exposes a small custom API to the parent instead of the whole DOM node.
- React 19: ref callbacks can return a cleanup function.

#### Effect hooks

- `useEffect`: runs after paint. For network subscriptions, timers, analytics, syncing with non-React widgets.
- `useLayoutEffect`: runs before paint. For measuring layout.
- `useInsertionEffect`: runs before layout effects. For CSS-in-JS libraries inserting `<style>` tags.

**Dependency array:**

| Array | Runs |
|---|---|
| none | after every render |
| `[]` | after mount only (plus Strict Mode re-run in development) |
| `[a, b]` | after mount and whenever `a` or `b` changes (compared with `Object.is`) |

**You might not need an effect.** Do not use effects to:

- calculate values from props/state — compute during render,
- respond to a user event — put the code in the event handler,
- reset state when a prop changes — use a `key`,
- fetch data in a framework that provides loaders or Server Components.

Data fetching in an effect needs cleanup to avoid **race conditions** (an older slow response overwriting a newer one):

~~~tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/products?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setProducts)
    .catch((e) => { if (e.name !== 'AbortError') setError(e); });
  return () => controller.abort();   // cancel old request when query changes
}, [query]);
~~~

In real apps prefer a data library (TanStack Query, RTK Query, SWR) or framework loaders; they handle caching, retries and deduplication.

#### Performance hooks

`useMemo`, `useCallback` → see [Performance](02-react-core-intermediate.md#4-performance).

- `useTransition`: mark an update as non-urgent so typing stays responsive while a big list re-renders.
- `useDeferredValue`: show a slightly older value for a slow part of the screen while the fast part updates.

~~~tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
// <input> uses query (instant); <ProductList> uses deferredQuery (can lag a little)
~~~

#### Custom hooks

A custom hook is your own function starting with `use` that calls other hooks. It shares **logic**, not state — each component calling it gets its own state.

~~~tsx
function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

function CheckoutButton() {
  const online = useOnlineStatus();
  return <button disabled={!online}>{online ? 'Place order' : 'You are offline'}</button>;
}
~~~

More patterns in [Code reuse patterns](03-react-core-advanced.md#1-code-reuse-patterns).

---

## 6. Component composition

### What is it?

**Composition** means building bigger components by putting smaller ones together, like Lego blocks.

### `props.children` and slots

`children` lets a wrapper component stay unaware of what it wraps. For several "holes", pass JSX through named props (often called **slots**):

~~~tsx
function PageLayout({ header, sidebar, children }: {
  header: React.ReactNode; sidebar: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

<PageLayout header={<SiteHeader />} sidebar={<Filters />}>
  <ProductGrid />
</PageLayout>
~~~

Bonus benefit: elements passed as `children` are created by the parent, so when `PageLayout` re-renders on its own state, `ProductGrid` is not re-rendered.

### Composition vs inheritance

React recommends **composition, not inheritance**. Instead of `class FancyButton extends Button`, write a `FancyButton` that renders `<Button>` with extra props.

~~~tsx
function Dialog({ title, children }: { title: string; children: React.ReactNode }) {
  return <div role="dialog" aria-label={title}><h2>{title}</h2>{children}</div>;
}

// Specialisation by composition
function ConfirmDeleteDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog title="Delete item?">
      <p>This cannot be undone.</p>
      <button onClick={onConfirm}>Delete</button>
    </Dialog>
  );
}
~~~

To share non-UI logic, use custom hooks or plain modules — not base classes.

### Lifting state up

When two siblings need the same data, move the state to their **closest common parent** and pass it down. The parent becomes the **single source of truth**.

~~~tsx
function ProductPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);  // lifted
  return (
    <>
      <SizePicker value={selectedSize} onChange={setSelectedSize} />
      <AddToCartButton disabled={!selectedSize} size={selectedSize} />
    </>
  );
}
~~~

Data flows **down** via props; changes flow **up** via callback props. This is **one-way data flow**. If lifting makes you pass props through many layers (**prop drilling**), first try composition (pass components as children), then consider [Context](02-react-core-intermediate.md#3-context) or a store.

### Practical decomposition task (common interview exercise)

**Task:** "Turn this product listing mock-up into components."

Step-by-step method (from React's *Thinking in React*):

1. **Draw boxes** around each part of the UI and name them. One component should do one job.
2. **Build a static version** using props only, no state.
3. **Find the minimal state.** Ask for each piece of data: Does it change? Is it passed from a parent? Can it be calculated? Only "changes, not passed, not calculable" is state.
4. **Decide where state lives:** the closest common parent of all components that read it.
5. **Add inverse data flow:** pass setter callbacks down so children can request changes.

~~~text
FilterableProductTable        state: searchText, inStockOnly
├── SearchBar                 props: searchText, inStockOnly, onSearchChange, onStockChange
└── ProductTable              props: products, searchText, inStockOnly
    ├── ProductCategoryRow    props: category
    └── ProductRow            props: product
~~~

Derived (not state): the filtered product list — computed from `products + searchText + inStockOnly` during render.

**What interviewers check:** sensible names, single responsibility, correct state placement, no duplicated state, stable keys, and that you can explain why each piece is a prop or state.

---

## Common mistakes

| Mistake | Safer approach |
|---|---|
| Mutating state objects/arrays | Create new objects/arrays (`...spread`, `map`, `filter`) |
| Storing derived values in state | Compute during render; `useMemo` only if expensive |
| Effect without cleanup | Return a cleanup for subscriptions, timers, sockets, fetch abort |
| Missing effect dependencies | Follow the lint rule; move functions inside the effect or use `useEffectEvent` |
| Hook inside a condition | Call hooks at the top level |
| Array index as key in reorderable lists | Use a stable ID from the data |
| One giant component | Decompose by responsibility |
| Copying props to state | Use the prop directly, or use `key` to reset |

## How to test your understanding

- Build a quantity picker; click "+" three times inside one handler. Explain why `setQty(qty + 1)` x3 adds only one.
- Add a `console.log` in an effect and its cleanup. Run in Strict Mode and explain the mount → unmount → mount log.
- Throw an error inside a child; wrap it with an error boundary and confirm only that section shows the fallback.

## Interview questions

1. What is the difference between props and state?
2. Why must render be pure? What can break if it is not?
3. What is lazy state initialization and when would you use it?
4. Why does `setCount(count + 1)` called three times only add one?
5. Explain the render and commit phases. Where do `useLayoutEffect` and `useEffect` run?
6. What are error boundaries? What errors can they not catch? Why are they still classes?
7. What are the Rules of Hooks and why does React depend on call order?
8. Give three cases where you do not need `useEffect`.
9. What is the difference between `useRef` and `useState`?
10. Why does React prefer composition over inheritance?
11. What does "lifting state up" mean? When does it become a problem?
12. Decompose a search-and-filter product page into components and say where each piece of state lives.

## Quick revision

- Components are pure functions of props + state.
- JSX = expressions in `{}`, `className`, camelCase attributes, `children`, keys in lists.
- State updates are snapshots, batched, and must not mutate. Use updater functions and lazy init.
- Lifecycle: mount → update → unmount; phases render → pre-commit → commit → layout effects → paint → passive effects.
- Error boundaries are class components that catch render errors in children.
- Hooks: top level only; categories state/context/ref/effect/performance/custom.
- Compose with `children` and slots; lift shared state to the common parent.

## References

- [react.dev — Describing the UI](https://react.dev/learn/describing-the-ui): components, JSX, purity and lists.
- [react.dev — Render and Commit](https://react.dev/learn/render-and-commit): the trigger, render and commit steps.
- [react.dev — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect): when to remove effects.
- [react.dev — Thinking in React](https://react.dev/learn/thinking-in-react): the decomposition method used above.
- [react.dev — Catching rendering errors with an error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

**Next:** [02 · React Core: Intermediate](02-react-core-intermediate.md).
