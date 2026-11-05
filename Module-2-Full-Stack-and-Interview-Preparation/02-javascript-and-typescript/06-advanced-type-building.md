# 06 — Advanced type building

[Subject index](README.md) · [Previous: Narrowing and utility types](05-narrowing-and-utility-types.md)

Advanced types let you build reusable rules from other types. Learn them when they solve a real problem. A short, clear type is usually better than a clever type that the whole team struggles to read.

## 1. keyof

`keyof` creates a union of the property names of a type.

```ts
type Product = { id: number; name: string; price: number };
type ProductKey = keyof Product; // "id" | "name" | "price"
```

A common use is a safe property-reading function:

```ts
function getProperty<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}
```

The compiler checks that the requested key belongs to the object.

## 2. typeof in a type position

The JavaScript `typeof` operator checks a value at runtime. In a TypeScript type position, `typeof` asks for the type of an existing value.

```ts
const defaultSettings = {
  theme: "light",
  pageSize: 20,
};

type Settings = typeof defaultSettings;
```

This keeps a type connected to the value that defines it.

## 3. Indexed access types

Use `T[K]` to look up the type of a property.

```ts
type Product = { id: number; name: string; price: number };
type ProductName = Product["name"]; // string
type ProductValue = Product[keyof Product]; // number | string
```

This is useful when one type should stay in sync with another.

## 4. Conditional types

A conditional type chooses a result based on a type relationship. It follows the pattern `Condition ? Yes : No`.

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

When a conditional type uses a naked type parameter on the left of `extends`, it distributes over union members:

```ts
type ToArray<T> = T extends unknown ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]
```

Wrapping the type parameter in a tuple prevents that distribution: `[T] extends [unknown]`.

## 5. infer

`infer` lets a conditional type capture part of another type.

```ts
type PromiseValue<T> = T extends Promise<infer Value> ? Value : T;

type A = PromiseValue<Promise<string>>; // string
```

It is commonly used to extract function return values, array item types and Promise result types.

## 6. Mapped types

A mapped type loops over keys of another type and creates a new type.

```ts
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Product = { id: number; name: string; price: number };
type ProductDraft = Optional<Product>;
```

Mapped types can add or remove modifiers:

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type RequiredFields<T> = {
  [K in keyof T]-?: T[K];
};
```

Use built-in utilities such as `Partial` and `Required` when they already express the idea clearly.

## 7. Template literal types

Template literal types build string types from other string types.

```ts
type Action = "created" | "updated" | "deleted";
type EventName = `order:${Action}`;
// "order:created" | "order:updated" | "order:deleted"
```

They can help type event names, CSS-like tokens and API route keys. They do not create runtime strings.

## 8. Advanced string utilities

TypeScript includes `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>` and `Uncapitalize<S>`.

```ts
type Event = "orderCreated";
type ConstantName = Uppercase<Event>; // "ORDERCREATED"
type Label = Capitalize<"profile">;    // "Profile"
```

## 9. Putting the pieces together

```ts
const endpoints = {
  getCustomer: "/customers/:id",
  listOrders: "/orders",
};

type EndpointName = keyof typeof endpoints;
type EndpointPath = (typeof endpoints)[EndpointName];

type ApiResponse<T> = {
  data: T;
  receivedAt: Date;
};

type UnwrapData<T> = T extends ApiResponse<infer Value> ? Value : T;
type CustomerData = UnwrapData<ApiResponse<{ id: number; name: string }>>;
```

This pattern lets a type follow the source object instead of duplicating its keys manually.

## Common mistakes

- Using advanced types when a simple interface would be easier.
- Forgetting that conditional types can distribute across unions.
- Confusing runtime `typeof value` with type-level `typeof value`.
- Creating deeply nested conditional types that are difficult to debug.
- Assuming template literal types validate strings received at runtime.

## Interview questions

1. What does `keyof` return?
2. Explain `typeof` in a type position.
3. What is an indexed access type?
4. What does `infer` do?
5. What is a mapped type?
6. When do conditional types distribute over unions?
7. Give a real use case for template literal types.

## Quick revision

`keyof` gets keys, `typeof` gets the type of a value, `T[K]` gets a property type, conditional types choose between types, `infer` captures a type, mapped types transform properties and template literals build string unions.

**Try it:** create a type that takes an object and makes every property optional and readonly. Then compare your result with built-in utility types.

[Next: Project setup, modules and tooling](07-project-setup-modules-and-tooling.md)
