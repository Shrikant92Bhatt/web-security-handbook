# 02 — React Core: Intermediate

**In simple words:** This chapter covers the tools you use every day once the basics are clear: how React attaches to the page (React DOM), how forms work, how to share data without passing props everywhere (Context), and how to stop unnecessary re-renders (performance).

[React path home](README.md) · [Previous: Basics](01-react-core-basics.md) · **React chapter 2 of 6**

---

## 1. React DOM

`react` contains the component model (hooks, `createElement`, `memo`). `react-dom` connects that model to the browser DOM. `react-dom/client` and `react-dom/server` hold the entry points.

### APIs

#### `createRoot` — start a client-rendered app

~~~tsx
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';

const root = createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, info) => reportError(error, info.componentStack), // React 19
});
root.render(<StrictMode><App /></StrictMode>);

// Later, e.g. when a micro-frontend is removed:
root.unmount();
~~~

`createRoot` enables **concurrent features** (transitions, Suspense streaming, automatic batching). The old `ReactDOM.render` was deprecated in React 18 and **removed in React 19**.

#### `hydrateRoot` — attach React to server-rendered HTML

When the server already sent HTML (SSR/SSG), the browser should not throw that HTML away and rebuild it. **Hydration** means React walks the existing HTML, attaches event handlers and takes control.

~~~tsx
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root')!, <App />);
~~~

The first client render must produce the **same output** as the server. Differences cause **hydration mismatch** errors. Typical causes: `Date.now()`, `Math.random()`, `window`/`localStorage` checks during render, locale-formatted dates. Fix by reading browser-only values in `useEffect`, or by using `suppressHydrationWarning` for genuinely unavoidable text differences (for example a timestamp).

#### `createRef`

`createRef()` creates `{ current: null }`. It is mainly for **class components**: create it in the constructor/field and attach with `ref={this.inputRef}`.

In function components use `useRef`. `createRef` inside a function component creates a **new** ref on every render, so the value is lost.

#### `createPortal` — render somewhere else in the DOM

A portal renders children into a different DOM node while staying in the same place in the **React** tree.

~~~tsx
import { createPortal } from 'react-dom';

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body,
  );
}
~~~

Why: modals, tooltips and toasts must escape parents with `overflow: hidden` or `z-index` stacking. Important detail: **events bubble through the React tree, not the DOM tree**, and context still works — a click inside the modal reaches React handlers on the component that rendered it.

#### `flushSync` — force an update right now

React normally batches updates and applies them later. `flushSync` applies them synchronously so you can read the updated DOM on the next line.

~~~tsx
import { flushSync } from 'react-dom';

function addMessage(text: string) {
  flushSync(() => setMessages((m) => [...m, text]));
  listRef.current!.lastElementChild?.scrollIntoView();   // DOM already contains the new message
}
~~~

Use rarely. It hurts performance and can make Suspense fallbacks appear. Typical valid uses: scroll-to-new-item, integrating with a non-React library, browser `beforeprint`.

### Built-in components

#### `Fragment`

Groups children without adding a DOM node. Use the long form when you need a `key`:

~~~tsx
{orders.map((o) => (
  <Fragment key={o.id}>
    <dt>{o.id}</dt>
    <dd>{o.total}</dd>
  </Fragment>
))}
~~~

#### `Suspense`

Shows a fallback while something inside is **not ready**: lazy-loaded code, data read with `use(promise)`, or a Suspense-enabled data library.

~~~tsx
const Reviews = lazy(() => import('./Reviews'));

<Suspense fallback={<Spinner />}>
  <Reviews productId={id} />
</Suspense>
~~~

- Nest boundaries to reveal the page in stages (header first, reviews later).
- Updates wrapped in `startTransition` keep showing the old content instead of flashing the fallback again.
- On the server, Suspense enables **streaming SSR**: send the shell, then stream each section as it finishes ([SSR](05-ecosystem-advanced.md#3-server-side-rendering)).
- Suspense does **not** detect data fetched inside `useEffect`.

#### `StrictMode`

Development-only checks; no effect in production builds:

- calls render functions, initialisers and reducers twice to expose impure code,
- runs effects mount → cleanup → mount to expose missing cleanup,
- runs ref callbacks twice,
- warns about deprecated APIs.

#### `Profiler`

Measures how often and how long a part of the tree renders.

~~~tsx
<Profiler id="ProductGrid" onRender={(id, phase, actualDuration, baseDuration) => {
  // phase: "mount" | "update" | "nested-update"
  // actualDuration: time spent rendering this commit
  // baseDuration: estimated time without memoisation
  if (actualDuration > 16) console.warn(id, phase, actualDuration);
}}>
  <ProductGrid />
</Profiler>
~~~

Disabled in production builds unless you use the special profiling build. For day-to-day work the **React DevTools Profiler** tab is easier.

Related React 19.2 component: `<Activity mode="hidden">` keeps a hidden subtree's state while deprioritising it (useful for tabs). Mention it only if the interviewer is on React 19.2+.

---

## 2. Forms

### Controlled vs uncontrolled

| | Controlled | Uncontrolled |
|---|---|---|
| Who owns the value | React state | The DOM |
| Read the value | From state | Via a ref or `FormData` on submit |
| Set initial value | `value` | `defaultValue` / `defaultChecked` |
| Good for | Live validation, formatting, dependent fields | Simple forms, file inputs, fewer re-renders |

~~~tsx
// Controlled
function EmailField() {
  const [email, setEmail] = useState('');
  const invalid = email !== '' && !email.includes('@');
  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid} />
      {invalid && <p role="alert">Enter a valid email</p>}
    </>
  );
}

// Uncontrolled
function NewsletterForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    subscribe(String(data.get('email')));
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" defaultValue="" required />
      <button>Subscribe</button>
    </form>
  );
}
~~~

**Common mistakes:**

- `value` without `onChange` → read-only field and a warning.
- Switching between `value={undefined}` and a string → "uncontrolled to controlled" warning. Start with `''`.
- `<input type="file">` is always uncontrolled.

Large forms often use **React Hook Form** (mostly uncontrolled, fast) with a schema validator such as **Zod**. Always validate again on the server — client validation is only for user experience.

### SyntheticEvent

React wraps native browser events in a **SyntheticEvent** with the same interface (`target`, `currentTarget`, `preventDefault()`, `stopPropagation()`) across browsers.

- React attaches listeners at the **root container** (since React 17; before that, at `document`) and dispatches through the React tree.
- The original event is at `e.nativeEvent`.
- **Event pooling was removed in React 17**, so you can read `e.target` inside async code.
- `onChange` on inputs fires on every keystroke (like native `input` event), not only on blur.
- Typing: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, `React.MouseEvent<HTMLButtonElement>`.

### React 19 form actions

React 19 lets `<form action={fn}>` take a **function**. React calls it with `FormData`, wraps it in a transition, and resets uncontrolled fields after success.

~~~tsx
<form action={async (formData) => { await saveAddress(formData); }}>
  <input name="city" />
  <SubmitButton />
</form>
~~~

#### `useFormStatus`

Read the pending state of the **parent form** from a child component (from `react-dom`). It must be used inside a component rendered within the `<form>`.

~~~tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;
}
~~~

#### `useFormState` → renamed to `useActionState`

`useFormState` (from `react-dom`, React canary/18 era) was **renamed to `useActionState`** and moved to `react` in React 19. `useFormState` is deprecated; interviewers may use either name.

~~~tsx
import { useActionState } from 'react';

type State = { error?: string; ok?: boolean };

async function applyCoupon(prev: State, formData: FormData): Promise<State> {
  const code = String(formData.get('code'));
  const res = await fetch('/api/coupon', { method: 'POST', body: JSON.stringify({ code }) });
  return res.ok ? { ok: true } : { error: 'Coupon not valid' };
}

function CouponForm() {
  const [state, formAction, isPending] = useActionState(applyCoupon, {});
  return (
    <form action={formAction}>
      <input name="code" />
      <button disabled={isPending}>Apply</button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.ok && <p>Coupon applied</p>}
    </form>
  );
}
~~~

- Signature: `useActionState(action, initialState, permalink?)` → `[state, dispatchAction, isPending]`.
- The action receives the **previous state** first, then the form data.
- With Server Functions (Next.js etc.) it also works before JavaScript loads (progressive enhancement).

#### `useOptimistic`

Show the expected result **immediately** while the request runs; React reverts automatically if the transition ends without the real state updating.

~~~tsx
function Comments({ comments, sendComment }: { comments: Comment[]; sendComment: (t: string) => Promise<void> }) {
  const [optimistic, addOptimistic] = useOptimistic(
    comments,
    (current, text: string) => [...current, { id: 'temp', text, sending: true }],
  );

  async function action(formData: FormData) {
    const text = String(formData.get('text'));
    addOptimistic(text);          // appears instantly with "sending" style
    await sendComment(text);      // parent refreshes real list after this
  }

  return (
    <form action={action}>
      {optimistic.map((c) => <p key={c.id} style={{ opacity: c.sending ? 0.5 : 1 }}>{c.text}</p>)}
      <input name="text" />
    </form>
  );
}
~~~

Use for likes, chat messages, cart quantity — actions that almost always succeed. Always show an error if the request fails.

---

## 3. Context

### What is it?

**Context** lets a parent provide a value that any descendant can read without passing it through every level as props.

### When to use it

Good fits — values many components need and that change **rarely**:

- current theme, language/locale,
- signed-in user,
- feature flags,
- dependency injection (an API client, analytics service),
- state for a compound component (`<Tabs>` → `<Tab>`).

Poor fits:

- avoiding passing props one or two levels (just pass props),
- high-frequency changing data (mouse position, form keystrokes) shared across a large tree — every consumer re-renders,
- complex app state with many updates → consider a store (Redux, Zustand).

**Context is a transport mechanism, not a state manager.** It moves a value; you still manage state with `useState`/`useReducer`.

### `createContext`, `Provider`, `useContext`

~~~tsx
import { createContext, useContext, useMemo, useState } from 'react';

type CartContextValue = { count: number; add: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const value = useMemo(() => ({ count, add: () => setCount((c) => c + 1) }), [count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
  // React 19 shorthand: <CartContext value={value}>{children}</CartContext>
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
~~~

Key points:

- `useContext` reads the **nearest** provider above. With no provider, it returns the `createContext` default.
- When the provider `value` changes (by `Object.is`), **every** consumer re-renders, even through `memo`. Memoise object values (as above) so they do not change on every provider render.
- In React 19 you can render `<CartContext value={...}>` directly; `Context.Provider` still works and is expected to be deprecated later.
- React 19's `use(CartContext)` can be called inside conditions.

### `Context.Consumer` (legacy render-prop API)

Before hooks, function components read context with a render prop:

~~~tsx
<CartContext.Consumer>
  {(cart) => <span>{cart?.count}</span>}
</CartContext.Consumer>
~~~

Still supported; prefer `useContext`. Class components can use `static contextType = CartContext` for one context.

### Avoiding re-render problems

- **Split contexts** by update frequency: `CartStateContext` and `CartActionsContext` (actions never change, so components that only dispatch do not re-render).
- Keep providers **low** in the tree where possible.
- For selective subscriptions (re-render only when `count` changes), use a store with selectors (`useSyncExternalStore`, Zustand, Redux).

---

## 4. Performance

### First, know what makes a component re-render

A component renders again when:

1. its own state changes,
2. its **parent renders** (by default, all children render too — whether props changed or not),
3. a context it reads changes.

A re-render is not automatically slow; React only touches the DOM if output changed. Optimise when profiling shows a real problem.

### `memo`

`memo(Component)` skips re-rendering when props are **shallowly equal** to last time.

~~~tsx
const ProductRow = memo(function ProductRow({ product, onAdd }: { product: Product; onAdd: (id: string) => void }) {
  return <li>{product.name} <button onClick={() => onAdd(product.id)}>Add</button></li>;
});
~~~

`memo` is useless if the parent passes a **new** object or function each render — which is where `useMemo` and `useCallback` help.

### `useMemo` — cache a calculated value

~~~tsx
const visible = useMemo(
  () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
  [products, query],
);
~~~

Use when: the calculation is genuinely expensive, or the result is passed to a `memo` child / used as an effect dependency and must keep the same reference.

### `useCallback` — cache a function

~~~tsx
const handleAdd = useCallback((id: string) => dispatch({ type: 'add', id }), [dispatch]);
<ProductRow product={p} onAdd={handleAdd} />
~~~

`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. It only helps when the function goes to a memoised child or an effect dependency.

### Keys and performance

- Stable keys let React **move** existing DOM nodes when a list is reordered instead of re-creating them.
- Index keys on reorderable/insertable lists cause wrong state on items (an input's text stays in the wrong row) and extra work.
- `Math.random()` keys force every item to unmount and remount each render — very slow and loses state.

### Profiler

Find slow components before optimising:

1. React DevTools → Profiler → Record → interact → Stop.
2. Look at the **flame graph** (what rendered and how long) and "**Why did this render?**" (enable in settings).
3. Fix the biggest cost first. Measure again.

The `<Profiler>` component (above) gives the same numbers in code.

### React Compiler

React Compiler (stable since late 2025) automatically adds memoisation at build time, so new projects may need far fewer manual `memo`/`useMemo`/`useCallback` calls. It requires code that follows the Rules of React. Understand manual memoisation anyway — interviews and existing codebases still use it.

### Other performance tools

| Problem | Tool |
|---|---|
| Large initial bundle | `lazy` + `Suspense`, route-based code splitting |
| Long list (1,000+ rows) | Virtualisation: `react-window`, TanStack Virtual |
| Typing feels slow because of heavy results | `useTransition` / `useDeferredValue` |
| Whole app re-renders on one context change | Split context or use a selector-based store |
| Expensive child under frequently-changing parent | Move state down, or pass the child as `children` |

**Move state down** is often better than memoisation: if only the search box needs `query`, keep `query` in `<SearchBox>` instead of the page component.

---

## Common mistakes

| Mistake | Safer approach |
|---|---|
| Reading `window` during render in SSR apps | Read in `useEffect` to avoid hydration mismatch |
| Portal without focus management | Trap focus inside the modal, return focus on close, close on Escape |
| Controlled input with no `onChange` | Add `onChange` or use `defaultValue` |
| Treating client validation as security | Validate on the server too |
| One huge context with fast-changing state | Split contexts or use a store with selectors |
| Wrapping everything in `useMemo`/`useCallback` | Profile first; memoise where it removes measured work |
| `memo` child receiving inline objects | Stabilise props or drop `memo` |

## Interview questions

1. What is the difference between `createRoot` and `hydrateRoot`? What causes hydration mismatches?
2. Why do events from a portal bubble to React ancestors that are not DOM ancestors?
3. When would you use `flushSync`? What is the cost?
4. What does `StrictMode` do in development? Does it affect production?
5. How does `Suspense` work with `lazy`? With streaming SSR?
6. Controlled vs uncontrolled components — trade-offs?
7. What is a SyntheticEvent? What changed in React 17?
8. Explain `useFormStatus`, `useActionState` (formerly `useFormState`) and `useOptimistic`.
9. When should you use Context, and when is it the wrong tool?
10. Why do all context consumers re-render, and how do you reduce that?
11. Explain `memo`, `useMemo` and `useCallback`. When are they a waste?
12. How would you find why a list is slow?

## Quick revision

- `createRoot` (client), `hydrateRoot` (SSR HTML), portals keep React tree, `flushSync` = synchronous update, `createRef` = classes.
- `Fragment`, `Suspense`, `StrictMode` (dev only), `Profiler`.
- Forms: controlled = state owns value; uncontrolled = DOM owns value; React 19 actions + `useFormStatus` + `useActionState` + `useOptimistic`.
- Context = dependency transport; memoise value; split by update frequency.
- Performance: profile → move state down / compose → `memo` + stable props → virtualise → code-split.

## References

- [react.dev — react-dom/client](https://react.dev/reference/react-dom/client): `createRoot` and `hydrateRoot`.
- [react.dev — Built-in components](https://react.dev/reference/react/components): `Fragment`, `Suspense`, `StrictMode`, `Profiler`, `Activity`.
- [react.dev — `<form>`](https://react.dev/reference/react-dom/components/form) and [useActionState](https://react.dev/reference/react/useActionState).
- [react.dev — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context).
- [react.dev — memo](https://react.dev/reference/react/memo): when memoisation helps and when it does not.

**Next:** [03 · React Core: Advanced](03-react-core-advanced.md).
