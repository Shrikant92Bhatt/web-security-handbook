# 05 — Type narrowing and utility types

[Subject index](README.md) · [Previous: Interfaces, aliases and classes](04-interfaces-aliases-and-classes.md)

## 1. Union types

A union means a value can be one of several types.

```ts
let orderId: string | number;
orderId = "ORD-10";
orderId = 10;
```

Before using a union value, check which member it currently is.

## 2. Type narrowing

Narrowing means checking a value so TypeScript can use a more specific type in that part of the code.

```ts
function formatId(id: string | number): string {
  if (typeof id === "number") {
    return id.toFixed(0);
  }
  return id.toUpperCase();
}
```

Common narrowing tools include:
- `typeof` for primitive values.
- `instanceof` for class instances.
- `in` for checking whether an object has a property.
- Equality checks for literal values.
- Truthiness checks, used carefully because values such as `0` and `""` are falsy.
- User-defined type guards.

## 3. Type guards and assertion functions

A type predicate tells TypeScript that a function checks a type.

```ts
type Customer = { id: number; name: string };

function isCustomer(value: unknown): value is Customer {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "number"
    && typeof candidate.name === "string";
}
```

An assertion function throws when a condition is not met and tells TypeScript that execution can continue with the asserted type.

```ts
function assertCustomer(value: unknown): asserts value is Customer {
  if (!isCustomer(value)) {
    throw new Error("Invalid customer data");
  }
}
```

Keep guards honest: the function must really check every property required by the type.

## 4. Type assertions and the satisfies operator

A type assertion tells the compiler to treat a value as a type. It does not convert the value or validate it.

```ts
const input = document.querySelector("#email") as HTMLInputElement;
```

Use an assertion only when you have evidence that the value has that shape. For data from an API, validate it instead.

The `satisfies` operator checks that an expression matches a type while keeping the expression's more specific inferred type.

```ts
type RouteName = "home" | "profile";

const routes = {
  home: "/",
  profile: "/profile",
} satisfies Record<RouteName, string>;
```

If a route is missing or a key is misspelled, TypeScript reports it. Unlike a type assertion, `satisfies` checks compatibility rather than asking the compiler to trust you.

## 5. Discriminated unions

A shared literal property can identify which variant you have.

```ts
type ApiState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function renderState(state: ApiState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return state.data.join(", ");
    case "error": return state.message;
  }
}
```

This is useful for UI state because it prevents impossible combinations such as having both loading and error data at the same time.

## 6. Built-in utility types

TypeScript provides helper types that transform existing types.

| Utility | What it does | Example |
|---|---|---|
| `Partial<T>` | Makes every property optional | Form draft |
| `Required<T>` | Makes every property required | Completed configuration |
| `Readonly<T>` | Prevents property reassignment | Read-only view |
| `Pick<T, K>` | Selects some properties | Public profile |
| `Omit<T, K>` | Removes some properties | Hide internal fields |
| `Record<K, V>` | Creates a key/value object type | Status lookup |
| `Exclude<T, U>` | Removes union members | Remove one status |
| `Extract<T, U>` | Keeps matching union members | Select one status |
| `NonNullable<T>` | Removes null and undefined | Present value |
| `ReturnType<F>` | Gets a function's return type | Reuse result type |
| `Parameters<F>` | Gets a function's parameter tuple | Reuse arguments |
| `InstanceType<C>` | Gets the instance type of a constructor | Class instance |
| `ThisType<T>` | Contextual type for `this` in object methods | Typed object methods |
| `Uppercase<S>` | Converts string literal types to uppercase | Event names |

Examples:

```ts
type User = {
  id: number;
  name: string;
  email?: string;
  passwordHash: string;
};

type UserUpdate = Partial<Pick<User, "name" | "email">>;
type PublicUser = Omit<User, "passwordHash">;
type CompleteUser = Required<User>;
type FrozenUser = Readonly<User>;
```

Be careful: `Required<User>` makes `email` required, but it does not create an email value. Utility types change compile-time descriptions, not runtime objects.

### ReturnType, Parameters and InstanceType

```ts
function createOrder(id: number, note?: string) {
  return { id, note, createdAt: new Date() };
}

type CreateOrderArgs = Parameters<typeof createOrder>;
type CreatedOrder = ReturnType<typeof createOrder>;

class CustomerService {}
type CustomerServiceInstance = InstanceType<typeof CustomerService>;
```

### ThisType and Uppercase

```ts
type Methods = {
  name: string;
  rename(nextName: string): void;
};

const methods: Methods & ThisType<Methods> = {
  name: "Cart",
  rename(nextName) {
    this.name = nextName;
  },
};

type EventName = Uppercase<"orderCreated">; // "ORDERCREATED"
```

`ThisType<T>` is a marker used in contextual typing; it does not create a runtime value. It is most useful in APIs that define object methods.

## 7. Runtime validation is still required

TypeScript types disappear when code runs. Validate data received from HTTP requests, local storage, files and third-party services. A type guard can do the validation for a small shape; a schema-validation library can help when the data is larger or more complex.

## Common mistakes

- Using `as SomeType` to silence a real mismatch.
- Writing a type guard that checks only one property but claims the full object type.
- Treating `Partial<T>` as a runtime patch operation.
- Forgetting that optional properties may be undefined.
- Using truthiness checks when zero or an empty string is a valid value.

## Interview questions

1. What is type narrowing?
2. Compare `unknown`, a union and a type assertion.
3. What is a discriminated union?
4. Compare `as` and `satisfies`.
5. Explain `Partial`, `Required`, `Pick` and `Omit`.
6. What do `ReturnType`, `Parameters` and `InstanceType` return?
7. Why do API responses need runtime validation?

## Quick revision

Narrow a union before using it. Use guards to check data, assertions only when you already know the shape, and utility types to reuse and transform existing types. None of these replaces runtime validation.

**Try it:** create a discriminated union for a login form with idle, submitting, success and error states. Make a render function that handles every state.

[Next: Advanced type building](06-advanced-type-building.md)
