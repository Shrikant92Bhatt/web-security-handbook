# 04 — React Ecosystem: Basics & Intermediate

**In simple words:** React only draws the screen. Real apps also need type checking (TypeScript), a predictable place for shared data (Redux), a way to connect that data to components (React Redux), a way to handle API calls in that data flow (middleware and thunks), and a way to show different pages for different URLs (routing).

[React path home](README.md) · [Previous: Core Advanced](03-react-core-advanced.md) · **React chapter 4 of 6**

---

## Part A — Basics

## 1. Typechecking with TypeScript

**TypeScript** adds types to JavaScript and checks them before the code runs. In React it catches wrong props, missing fields and wrong event types while you type.

Language basics are in [JavaScript & TypeScript](../02-javascript-typescript.md). This section covers React-specific typing.

### Props

~~~tsx
type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';         // optional, limited values
  onClick: () => void;
} & React.ComponentPropsWithoutRef<'button'>; // also accept native button props

export function Button({ label, variant = 'primary', ...rest }: ButtonProps) {
  return <button className={variant} {...rest}>{label}</button>;
}
~~~

- Prefer typing props directly (`function C(props: Props)`) over `React.FC<Props>`. `React.FC` no longer adds implicit `children` (since @types/react 18) but adds little value.
- `React.ReactNode` = anything renderable (use for `children`). `React.ReactElement` / `JSX.Element` = a single element only.
- `React.ComponentProps<typeof Button>` extracts the props of an existing component.

### State, refs and events

~~~tsx
const [user, setUser] = useState<User | null>(null);     // union needs explicit type
const [items, setItems] = useState<CartItem[]>([]);      // empty array needs explicit type
const inputRef = useRef<HTMLInputElement>(null);         // DOM ref

function onChange(e: React.ChangeEvent<HTMLInputElement>) { setQuery(e.target.value); }
function onSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); }
~~~

### Reducers with discriminated unions

~~~tsx
type Action =
  | { type: 'added'; item: CartItem }
  | { type: 'removed'; id: string };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'added':   return [...state, action.item];      // TS knows action.item exists
    case 'removed': return state.filter((i) => i.id !== action.id);
  }
}
~~~

### Generic components

~~~tsx
type ListProps<T> = { items: T[]; getKey: (item: T) => string; render: (item: T) => React.ReactNode };

function List<T>({ items, getKey, render }: ListProps<T>) {
  return <ul>{items.map((i) => <li key={getKey(i)}>{render(i)}</li>)}</ul>;
}

<List items={orders} getKey={(o) => o.id} render={(o) => o.total} />  // T inferred as Order
~~~

### Context with no default

~~~tsx
const AuthContext = createContext<AuthValue | null>(null);
// Expose a hook that throws if the provider is missing (see Context chapter)
~~~

**Limit:** TypeScript checks at build time only. Data from an API can still be wrong at runtime. Validate external data with a schema library (Zod, Valibot) at the boundary.

---

## 2. Redux

### What is it?

**Redux** is a library that keeps the app's shared state in **one store** outside React components, and changes it only through clearly described events.

Example: the cart, signed-in user and notifications are read by many pages. Redux puts them in one place, records every change and makes the app's behaviour predictable.

### Three main principles

1. **Single source of truth.** The whole shared state lives in one object tree in one store.
2. **State is read-only.** The only way to change it is to **dispatch an action** — an object describing what happened.
3. **Changes are made with pure functions.** **Reducers** take the previous state and an action and return the next state, without mutating and without side effects.

### Actions

~~~ts
{ type: 'cart/itemAdded', payload: { id: 'p1', price: 450 } }
~~~

- `type` is a string naming the event, written as "domain/eventHappened".
- Describe **what happened**, not a setter (`cart/itemAdded`, not `setCart`).
- **Action creators** are functions that build actions: `const itemAdded = (item) => ({ type: 'cart/itemAdded', payload: item })`.

### Reducers

~~~ts
type CartState = { items: Record<string, number> };
const initial: CartState = { items: {} };

function cartReducer(state = initial, action: AnyAction): CartState {
  switch (action.type) {
    case 'cart/itemAdded': {
      const { id } = action.payload;
      return { ...state, items: { ...state.items, [id]: (state.items[id] ?? 0) + 1 } };
    }
    case 'cart/cleared':
      return initial;
    default:
      return state;         // unknown actions: return the same state
  }
}
~~~

Reducers must not: mutate state, call APIs, use `Math.random()`/`Date.now()`, or dispatch actions.

`combineReducers({ cart: cartReducer, user: userReducer })` builds the root reducer; each reducer owns one slice of the state tree.

### Store

~~~ts
const store = createStore(rootReducer);     // legacy API; modern apps use configureStore (Bonus: Redux Toolkit)
store.getState();                            // read
store.dispatch(itemAdded({ id: 'p1' }));     // change
const unsubscribe = store.subscribe(() => console.log(store.getState()));
~~~

### Unidirectional data flow

~~~mermaid
flowchart LR
  V[View<br/>React component] -- user clicks --> A[dispatch action]
  A --> M[Middleware<br/>logging, async]
  M --> R[Reducers<br/>prev state + action → next state]
  R --> S[(Store)]
  S -- subscribers notified --> V
~~~

Data moves in one direction. This makes it easy to answer "why did the state change?" — look at the action log. **Redux DevTools** show every action, the state before and after, and allow **time-travel debugging**.

### Data normalization

Store collections like a small database: **by ID**, without nested copies.

~~~ts
// ❌ Nested: the same author is copied into every post; updating a name means finding every copy
posts: [{ id: 'p1', title: 'Hi', author: { id: 'u1', name: 'Asha' } }, ...]

// ✅ Normalized
{
  posts:   { ids: ['p1', 'p2'], entities: { p1: { id: 'p1', title: 'Hi', authorId: 'u1' }, ... } },
  users:   { ids: ['u1'],       entities: { u1: { id: 'u1', name: 'Asha' } } }
}
~~~

Benefits: one copy of each item, O(1) lookup by ID, simpler updates, fewer unnecessary re-renders. Redux Toolkit's `createEntityAdapter` generates this shape and its CRUD reducers. Libraries such as `normalizr` convert nested API responses.

### Redux vs Context

| | Context + `useReducer` | Redux |
|---|---|---|
| Purpose | Pass a value down the tree | State management with a store |
| Re-renders | All consumers when value changes | Only components whose **selected** data changed |
| Middleware / async pattern | Write yourself | Built in (thunks, listeners, RTK Query) |
| DevTools, time travel | No | Yes |
| Extra dependency | None | `@reduxjs/toolkit`, `react-redux` |
| Best for | Theme, locale, auth user, small apps | Large shared state updated often, many contributors, complex flows |

Also consider: server data (product lists, orders) is usually better in a **server-state cache** (TanStack Query, RTK Query) than in hand-written Redux slices. Use Redux for **client** state that many screens share.

---

## Part B — Intermediate

## 3. React Redux

`react-redux` connects a Redux store to React components efficiently.

### Presentational vs container components

An older pattern (popular before hooks):

| Presentational ("dumb") | Container ("smart") |
|---|---|
| How things **look** | How things **work** |
| Receives data and callbacks via props | Reads the store, dispatches actions |
| No Redux knowledge | Uses `connect` or hooks |
| Easy to reuse and test | Thin glue layer |

~~~tsx
// Presentational
function CartBadge({ count, onOpen }: { count: number; onOpen: () => void }) {
  return <button onClick={onOpen}>Cart ({count})</button>;
}

// Container
function CartBadgeContainer() {
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();
  return <CartBadge count={count} onOpen={() => dispatch(cartOpened())} />;
}
~~~

With hooks, the strict split is no longer required — components can call `useSelector` directly. The idea still helps for design-system components and Storybook.

### `Provider`

Makes the store available to all components via context:

~~~tsx
import { Provider } from 'react-redux';
root.render(<Provider store={store}><App /></Provider>);
~~~

### `connect` (legacy HOC API)

~~~tsx
const mapStateToProps = (state: RootState) => ({ count: selectCartCount(state) });
const mapDispatchToProps = { onOpen: cartOpened };            // object shorthand auto-binds dispatch

export default connect(mapStateToProps, mapDispatchToProps)(CartBadge);
~~~

- `mapStateToProps` runs on every store update; the component re-renders only if the returned object is **shallowly different**.
- `connect` also wraps the component in `memo`-like behaviour.
- Still supported, but hooks are the recommended API.

### `useSelector`

~~~tsx
const count = useSelector((state: RootState) => Object.values(state.cart.items).reduce((a, b) => a + b, 0));
~~~

- Runs after every dispatch; re-renders only if the result changed by `===` (reference).
- **Return small, primitive or stable values.** Returning a new object/array every time causes a re-render on every action:

~~~tsx
// ❌ new array each time → re-render on any action
const items = useSelector((s) => s.cart.ids.map((id) => s.cart.entities[id]));

// ✅ memoised selector (reselect / createSelector)
const selectCartItems = createSelector([(s: RootState) => s.cart.ids, (s: RootState) => s.cart.entities],
  (ids, entities) => ids.map((id) => entities[id]));
const items = useSelector(selectCartItems);
~~~

- `shallowEqual` can be passed as the second argument for object results.
- Internally uses `useSyncExternalStore`, which avoids "tearing" (different components seeing different store versions) in concurrent rendering.

### `useDispatch`

~~~tsx
const dispatch = useDispatch<AppDispatch>();
<button onClick={() => dispatch(itemAdded({ id }))}>Add</button>
~~~

Typed hooks pattern:

~~~ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
~~~

`useStore()` gives the store itself — rarely needed.

---

## 4. Redux async flow

Reducers must be pure, so where do API calls go? Into **middleware**.

### Middleware

Middleware sits between `dispatch` and the reducer. It can log, delay, transform, stop or dispatch other actions.

~~~ts
const logger: Middleware = (storeApi) => (next) => (action) => {
  console.log('dispatching', action);
  const result = next(action);           // pass to next middleware / reducer
  console.log('next state', storeApi.getState());
  return result;
};
~~~

The curried signature `store => next => action` lets Redux chain middleware: each one calls `next` to continue.

### Redux Thunk

A **thunk** is a function that delays work. With `redux-thunk` middleware, you can dispatch a **function** instead of an action. The middleware calls it with `dispatch` and `getState`.

~~~ts
// Thunk action creator
export const fetchOrders = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState().orders.status === 'loading') return;      // avoid duplicate requests
  dispatch({ type: 'orders/loading' });
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    dispatch({ type: 'orders/loaded', payload: await res.json() });
  } catch (err) {
    dispatch({ type: 'orders/failed', error: String(err) });
  }
};

// In a component
useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);
~~~

~~~mermaid
sequenceDiagram
  participant C as Component
  participant T as Thunk middleware
  participant API
  participant R as Reducer
  C->>T: dispatch(fetchOrders())
  T->>R: orders/loading
  T->>API: GET /api/orders
  API-->>T: 200 + data
  T->>R: orders/loaded(data)
  R-->>C: new state → re-render
~~~

The thunk middleware itself is tiny: if the action is a function, call it with `(dispatch, getState)`; otherwise pass it on.

Redux Toolkit includes thunk by default and provides `createAsyncThunk`, which generates `pending`/`fulfilled`/`rejected` actions (see [Bonus: Redux Toolkit](06-bonus-topics.md#5-redux-toolkit)).

### Alternatives to know by name

| Tool | Idea | When |
|---|---|---|
| Thunk | Functions with `dispatch`/`getState` | Default; simple async |
| RTK listener middleware | Run effects in response to actions | Lightweight replacement for sagas |
| Redux-Saga | Generator functions, declarative effects (`take`, `call`, `put`) | Complex flows: cancellation, races, retries (legacy-heavy) |
| Redux-Observable | RxJS streams of actions | Teams already using RxJS |
| RTK Query | Data fetching + caching built on Redux | Most server-data needs |

---

## 5. Routing

**Routing** decides which screen to show for the current URL without a full page reload. **React Router** is the most common library. Current major version is v7 (merged with Remix), with three modes: **declarative**, **data** (`createBrowserRouter`) and **framework** (Vite plugin, file routes, SSR).

### JSX configuration (declarative mode)

~~~tsx
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet, useParams, useNavigate } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:productId" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <>
      <nav><NavLink to="/products">Products</NavLink></nav>
      <Outlet />            {/* child route renders here */}
    </>
  );
}

function ProductDetail() {
  const { productId } = useParams();      // from :productId
  const navigate = useNavigate();
  return <button onClick={() => navigate('/checkout')}>Buy {productId}</button>;
}
~~~

(In React Router v6 the import package was `react-router-dom`; v7 uses `react-router`, and `react-router-dom` re-exports it.)

### Object configuration (data mode)

~~~tsx
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'products/:productId',
        element: <ProductDetail />,
        loader: ({ params }) => fetch(`/api/products/${params.productId}`),  // runs before render
      },
      { path: 'admin', lazy: () => import('./admin/route') },              // code-split route
    ],
  },
]);

root.render(<RouterProvider router={router} />);
~~~

| | JSX config | Object config |
|---|---|---|
| Style | Components | Plain objects/arrays |
| Data loading | Inside components | `loader`/`action` before render (avoids fetch waterfalls) |
| Errors | Your own boundaries | `errorElement` per route |
| Generated / dynamic routes | Harder | Easy (arrays) |

Other options: `useRoutes(routesArray)` renders object config inside components; **TanStack Router** offers fully type-safe routes; **Next.js** uses file-system routing.

### History

The browser **History API** (`history.pushState`, `replaceState`, `popstate` event) changes the URL without reloading. Routers wrap it:

| Router | URL looks like | Server requirement |
|---|---|---|
| `BrowserRouter` / `createBrowserRouter` | `/products/42` | Server must return `index.html` for all app routes (SPA fallback) |
| `HashRouter` / `createHashRouter` | `/#/products/42` | None — hash is never sent to the server (static hosting) |
| `MemoryRouter` / `createMemoryRouter` | Not shown | Tests, React Native, embedded widgets |

- `navigate('/x')` = push a new entry (Back returns). `navigate('/x', { replace: true })` = replace current entry (for redirects after login).
- `navigate(-1)` goes back.
- Older versions (v4/v5) used the standalone `history` package and `useHistory()`; v6+ replaced it with `useNavigate()`.

### Protected routes

~~~tsx
function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
~~~

**Security note:** client-side route guards only improve UX. The **API must check authorization** on every request — anyone can call the API directly. See [Module 1 · Authorization](../../03-authorization/README.md).

---

## Common mistakes

| Mistake | Safer approach |
|---|---|
| `any` everywhere in props/events | Use React's event and element types |
| Trusting API response types | Validate at runtime |
| Mutating state in a reducer (outside Immer) | Return new objects |
| API calls inside reducers | Thunks / listener middleware / RTK Query |
| Selectors returning new arrays/objects | Memoised selectors (`createSelector`) |
| Storing everything in Redux | Local UI state stays local; server data in a cache |
| Missing SPA fallback on the server | Configure rewrites so deep links work |
| Relying on route guards for security | Enforce authorization on the backend |

## Interview questions

1. How do you type props, children, events and refs in React with TypeScript?
2. What are the three principles of Redux?
3. What are actions, reducers and the store? Why must reducers be pure?
4. Explain unidirectional data flow in Redux.
5. What is state normalization and why is it useful?
6. When would you choose Redux over Context?
7. Presentational vs container components — still relevant with hooks?
8. How does `useSelector` decide to re-render? What is a common performance bug?
9. What does middleware do? Write a logger middleware.
10. What is a thunk? How does `redux-thunk` work?
11. JSX vs object route configuration — trade-offs?
12. `BrowserRouter` vs `HashRouter`: what does the server need to do?
13. Why are frontend route guards not a security control?

## Quick revision

- TS: type props directly, `ReactNode` for children, typed events, discriminated-union actions, generics.
- Redux: single store, read-only state, pure reducers; actions describe events; normalize by ID.
- React Redux: `Provider` → `useSelector` (select small/stable) + `useDispatch`; `connect` is legacy.
- Async: middleware chain; thunks get `dispatch`/`getState`.
- Routing: nested routes + `Outlet`, params, `navigate`, JSX vs object config, browser vs hash history.

## References

- [react.dev — Using TypeScript](https://react.dev/learn/typescript).
- [Redux — Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview): principles, data flow and normalization.
- [Redux — Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape).
- [React Redux — Hooks](https://react-redux.js.org/api/hooks): `useSelector`, `useDispatch` and equality rules.
- [Redux — Writing Logic with Thunks](https://redux.js.org/usage/writing-logic-thunks).
- [React Router docs](https://reactrouter.com/): modes, routing and history.

**Next:** [05 · React Ecosystem: Advanced](05-ecosystem-advanced.md).
