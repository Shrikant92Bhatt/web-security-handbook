# 03 — React Core: Advanced

**In simple words:** This chapter answers two senior-level questions. First, how do you share behaviour between components without copying code? Second, what does React actually do inside when your state changes?

[React path home](README.md) · [Previous: Intermediate](02-react-core-intermediate.md) · **React chapter 3 of 6**

---

## 1. Code reuse patterns

Three patterns have been used over React's history. All solve the same problem: "several components need the same stateful behaviour, such as tracking the window size or loading the current user."

### Custom hooks (modern default)

~~~tsx
function useFetch<T>(url: string) {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    fetch(url, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<T>; })
      .then((data) => setState({ data, loading: false }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ error, loading: false }); });
    return () => controller.abort();
  }, [url]);

  return state;
}

function OrderHistory() {
  const { data, error, loading } = useFetch<Order[]>('/api/orders');
  if (loading) return <Spinner />;
  if (error) return <p role="alert">Could not load orders.</p>;
  return <OrderList orders={data!} />;
}
~~~

Why it won:

- No extra components in the tree (no "wrapper hell").
- It is clear where each value comes from (`const { data } = useFetch(...)`).
- Several hooks combine easily without name clashes.
- Works naturally with TypeScript.

Each component that calls the hook gets **its own** state. To share the same data, put it in context or a store and read it from the hook.

### Higher-order components (HOC)

A **HOC** is a function that takes a component and returns a new component with extra behaviour or props. Name pattern: `withSomething`.

~~~tsx
function withAuth<P extends object>(Wrapped: React.ComponentType<P & { user: User }>) {
  function WithAuth(props: P) {
    const user = useCurrentUser();
    if (!user) return <Navigate to="/login" />;
    return <Wrapped {...props} user={user} />;
  }
  WithAuth.displayName = `withAuth(${Wrapped.displayName ?? Wrapped.name})`;
  return WithAuth;
}

const ProtectedAccountPage = withAuth(AccountPage);
~~~

Known examples: Redux `connect`, React Router v5 `withRouter`, `React.memo` (technically a HOC).

Problems:

- **Prop collisions** — two HOCs injecting `user` overwrite each other.
- **Unclear origin** — inside `AccountPage`, where does `user` come from?
- **Wrapper hell** in DevTools: `withAuth(withTheme(connect(...)))`.
- Refs and static methods are not passed through automatically.
- **Never create a HOC inside render** — it produces a new component type each time and React remounts it, losing state.

Still useful for: cross-cutting wrapping at module level (auth gates, error boundaries, analytics) and legacy code.

### Render props

A component receives a **function as a prop** (often `children`) and calls it to decide what to render.

~~~tsx
function MousePosition({ children }: { children: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>{children(pos)}</div>;
}

<MousePosition>
  {({ x, y }) => <p>Cursor at {x}, {y}</p>}
</MousePosition>
~~~

Known examples: `Context.Consumer`, Formik's `<Formik>{(form) => ...}</Formik>`, Downshift, virtualised list `rowRenderer`.

Problems: nested callbacks ("callback pyramid") when combining several; new function each render can defeat `memo`.

Still useful for: letting a **parent control rendering** of items inside a reusable component (list rows, table cells, headless UI).

### Compare and choose

| | Custom hook | HOC | Render props |
|---|---|---|---|
| Shares | Logic | Logic + wrapping | Logic + rendering control |
| Extra tree nodes | None | One per HOC | One per provider |
| Value origin clear | Yes | No | Yes |
| Name collisions | No | Yes | No |
| Composes several | Easy | Wrapper nesting | Callback nesting |
| Use today for | Most reuse | Wrapping whole components (auth gate) | Parent decides how items render |

Related: **compound components** (`<Tabs><Tabs.List/><Tabs.Panel/></Tabs>` sharing state via context) and **headless components** (logic-only libraries such as TanStack Table, Radix, Downshift) combine these ideas.

---

## 2. Virtual DOM

### Concept

Changing the real DOM is relatively expensive (layout, paint). React lets you describe the whole UI for the current state, then works out the **smallest** set of DOM changes needed.

The **Virtual DOM** is the in-memory description of the UI: plain JavaScript objects (React elements) such as

~~~js
{ type: 'li', props: { className: 'item', children: 'Coffee' }, key: 'p1' }
~~~

On each update:

1. React builds a new element tree by calling components.
2. It **diffs** (compares) the new tree against the previous one.
3. It applies only the differences to the real DOM.

**Interview nuance:** the Virtual DOM is not "faster than the DOM" in itself — it adds work. Its value is that you write simple declarative code ("UI = f(state)") and still get reasonably efficient updates, plus it enables features such as scheduling and rendering to non-DOM targets (React Native). Frameworks like Svelte and Solid avoid a Virtual DOM by compiling fine-grained updates.

### Reconciliation algorithm

Comparing two arbitrary trees perfectly costs about O(n³). React uses a **heuristic O(n)** algorithm based on two assumptions:

1. **Elements of different types produce different trees.**
2. **Keys tell React which children are the same between renders.**

#### Rule 1 — different type → replace the whole subtree

~~~tsx
// Before                       // After
<div><Counter /></div>          <section><Counter /></section>
~~~

`div` → `section` is a different type, so React **unmounts** the old subtree (Counter's state is lost) and mounts a new one. Same for switching component types (`<ProductList>` → `<ProductGrid>`).

This is why you must **never define a component inside another component**: each render creates a new function = new type = remount and state loss.

~~~tsx
function Page() {
  // ❌ new component type every render
  const Row = () => <input />;
  return <Row />;
}
~~~

#### Rule 2 — same DOM type → update attributes

`<div className="a" />` → `<div className="b" />`: React keeps the DOM node and only changes `className`. For `style`, only changed properties are updated.

#### Rule 3 — same component type → keep instance, update props

React keeps the component's state and hooks, renders it with new props, and recurses into the result.

#### Recursing on children

React walks the children lists of both trees at the same time.

Without keys, it matches by **position**:

~~~tsx
// Before           // After (inserted at top)
<li>Tea</li>        <li>Coffee</li>   ← compared with "Tea": update text
<li>Milk</li>       <li>Tea</li>      ← compared with "Milk": update text
                    <li>Milk</li>     ← new: insert
~~~

Inserting at the start makes React update every item — and any state inside items moves to the wrong item.

#### Keys

With keys, React matches children by identity:

~~~tsx
<li key="coffee">Coffee</li>   ← new key: insert
<li key="tea">Tea</li>         ← same key: keep, maybe move
<li key="milk">Milk</li>       ← same key: keep
~~~

Key rules:

- Unique **among siblings** (not globally).
- **Stable** — the same item has the same key on every render. Use database IDs.
- Index as key is acceptable only for static lists that never reorder, filter or insert.
- Changing a key on purpose resets a component (`<Form key={userId} />`).
- Keys are not passed as props; pass `id` separately if the child needs it.

### Fiber architecture

**Fiber** is React's reconciliation engine, introduced in React 16. It made rendering **interruptible**, which is the foundation for concurrent features.

#### Why it was needed

The old "stack reconciler" walked the tree recursively and could not stop. A big update could block the main thread for 100 ms+, freezing typing and animations.

#### What a fiber is

A **fiber** is a JavaScript object representing one unit of work — usually one component or DOM element. It stores:

| Field | Meaning |
|---|---|
| `type`, `key` | What it is (function, class, `'div'`) |
| `child`, `sibling`, `return` | Links forming a tree as a linked list (parent = `return`) |
| `pendingProps`, `memoizedProps` | New props and last rendered props |
| `memoizedState` | Hooks linked list (this is why hook order matters) / class state |
| `flags` | Side effects to apply (placement, update, deletion) |
| `lanes` | Priority of pending work |
| `alternate` | Link to the matching fiber in the other tree |

Because the tree is a linked list, React walks it with a loop instead of recursion, so it can **pause after any fiber** and continue later.

#### Double buffering: current and work-in-progress trees

~~~mermaid
flowchart LR
  subgraph cur["Current tree (on screen)"]
    C1[App] --> C2[Cart]
  end
  subgraph wip["Work-in-progress tree"]
    W1["App (next)"] --> W2["Cart (next)"]
  end
  C1 -. alternate .- W1
  C2 -. alternate .- W2
~~~

- **Current tree:** what is on screen now.
- **Work-in-progress (WIP) tree:** being built for the next update, reusing fibers via `alternate`.
- At commit, React swaps a pointer: WIP becomes current. Users never see a half-finished UI.

#### Two phases, again

| Phase | Work | Interruptible? |
|---|---|---|
| Render (reconciliation) | `beginWork` calls components and diffs children; `completeWork` prepares DOM nodes and collects effects | **Yes** — can pause, resume, restart, discard |
| Commit | Before-mutation (snapshots), mutation (DOM changes), layout (refs, `useLayoutEffect`), then passive effects scheduled | **No** — synchronous |

This is why render must be pure: React may run it several times before committing once.

#### Priorities and the scheduler

Each update gets a **lane** (priority):

- urgent: clicks, typing (`SyncLane`, `InputContinuousLane`),
- default: normal updates,
- transitions: `startTransition` updates,
- idle / offscreen: hidden content.

In concurrent rendering, React works in small time slices (around 5 ms), yields to the browser so it can handle input and paint, and lets an urgent update **interrupt** a lower-priority render in progress. The interrupted work is restarted later.

#### What Fiber enabled

- `useTransition`, `useDeferredValue`, `startTransition`
- `Suspense` for code and data, streaming SSR, selective hydration
- error boundaries
- returning arrays/fragments/strings from components
- `Activity` / offscreen rendering

---

## Common mistakes

| Mistake | Safer approach |
|---|---|
| Defining components inside components | Define at module level |
| Creating HOCs inside render | Create once at module level |
| Index or random keys in dynamic lists | Stable IDs |
| Expecting the Virtual DOM to make every update cheap | Avoid unnecessary renders; profile |
| Side effects during render "because it only runs once" | Concurrent React may render multiple times; use effects/handlers |

## How to test your understanding

1. Render a list of `<input>`s with index keys. Type in the first, then insert an item at the top. Watch the text stay in the wrong row. Switch to ID keys.
2. Toggle a parent between `<div>` and `<span>` around a counter. Watch the counter reset.
3. Type into an input that filters 10,000 items. Then wrap the list update in `startTransition` and compare responsiveness.

## Interview questions

1. Compare custom hooks, HOCs and render props. Which would you use today and why?
2. What problems do HOCs cause? Why must they not be created during render?
3. What is the Virtual DOM? Is it faster than the real DOM?
4. Explain React's reconciliation heuristics.
5. Why do keys matter? What goes wrong with index keys?
6. Why does defining a component inside another component reset its state?
7. What is Fiber and what problem did it solve?
8. What are the current and work-in-progress trees?
9. Which phase is interruptible and why must it be pure?
10. How do lanes/priorities and time slicing make `useTransition` possible?

## Quick revision

- Reuse: custom hooks (default), HOC (`withX` wrapper), render props (function decides output).
- Virtual DOM = element objects; diff → minimal DOM patch.
- Reconciliation: different type → remount; same type → update; children matched by key (else position).
- Fiber = linked-list unit of work; current + WIP trees; interruptible render, synchronous commit; lanes for priority.

## References

- [react.dev — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).
- [legacy.reactjs.org — Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html): the original description of the diffing heuristics (legacy site, still accurate for the concepts).
- [react.dev — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state): how position and keys decide state.
- [acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture): early design notes on Fiber from a React core team member.

**Next:** [04 · React Ecosystem: Basics & Intermediate](04-ecosystem-basics-and-intermediate.md).
