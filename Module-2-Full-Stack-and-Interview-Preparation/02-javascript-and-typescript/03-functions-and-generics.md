# 03 — Functions and generics

[Subject index](README.md) · [Previous: Objects and collections](02-objects-and-collections.md)

## 1. Function parameter and return types

Describe what a function receives and what it returns.

```ts
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

const formatPrice = (amount: number): string => `₹${amount}`;
```

A function that does not return a useful value is commonly annotated as `void`.

## 2. Optional, default and rest parameters

```ts
function greet(name: string, title?: string): string {
  return title ? `Hello ${title} ${name}` : `Hello ${name}`;
}

function applyDiscount(price: number, discount = 0): number {
  return price - discount;
}

function sum(...values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
```

Optional parameters may be omitted. Default parameters use their default when the argument is missing or `undefined`. Rest parameters collect remaining arguments into an array.

## 3. Function types and call signatures

A function type describes a function's input and output shape.

```ts
type PriceFormatter = (amount: number) => string;

const format: PriceFormatter = amount => `₹${amount}`;
```

A call signature is the same idea written inside an object type. It is useful when a value is an object that can also be called like a function.

```ts
type Search = {
  (query: string): string[];
  description: string;
};

const searchProducts: Search = Object.assign(
  (query: string) => [query],
  { description: "Search product names" }
);
```

## 4. Construct signatures

A construct signature describes a value that can be called with `new`.

```ts
type CustomerConstructor = new (name: string) => { name: string };

class Customer {
  constructor(public name: string) {}
}

const createCustomer: CustomerConstructor = Customer;
const customer = new createCustomer("Asha");
```

You will see construct signatures in factory functions and libraries that accept a class constructor.

## 5. Function overloads

Overloads let callers use multiple supported input shapes while the implementation handles them.

```ts
function findOrder(id: number): string;
function findOrder(reference: string): string;
function findOrder(value: number | string): string {
  return `Order: ${value}`;
}

findOrder(10);
findOrder("ORD-10");
```

The overload signatures are visible to callers. The implementation signature is not a third public overload. Keep overloads limited to cases where the return type or behavior genuinely depends on the input shape. A union parameter is simpler when it does the job.

## 6. Generics

A generic lets a function or type work with different data types while keeping the relationship between input and output.

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstName = firstItem(["Asha", "Ravi"]); // string | undefined
const firstPrice = firstItem([100, 200]);      // number | undefined
```

Here `T` is a type parameter. TypeScript usually infers it from the argument.

### Generic constraints

Sometimes a generic needs a minimum set of properties. Use `extends` to state that requirement.

```ts
function getId<T extends { id: number }>(item: T): number {
  return item.id;
}

getId({ id: 10, name: "Keyboard" });
// getId({ name: "Mouse" }); // missing id
```

A constraint does not mean the generic is exactly that type. It means the type passed in must have at least the required shape.

### Generic defaults and multiple parameters

```ts
type ApiResult<TData, TError = string> = {
  data: TData;
  error?: TError;
};

const result: ApiResult<string> = { data: "Saved" };
```

Use meaningful names such as `TData` when several type parameters make `T` and `U` hard to understand.

## 7. The special this parameter

In TypeScript, a function can declare what type `this` must have when called. The special `this` parameter is checked by TypeScript and is not a normal runtime argument.

```ts
type Cart = {
  items: number[];
  add(this: Cart, itemId: number): void;
};

const cart: Cart = {
  items: [],
  add(itemId) {
    this.items.push(itemId);
  },
};

cart.add(10);
```

Arrow functions do not get their own `this`; they capture it from the surrounding scope. This matters when passing callbacks.

## Common mistakes

- Using `any` in a generic and losing the input/output relationship.
- Adding overloads when a union parameter is enough.
- Assuming a generic constraint creates a new object shape or validates data at runtime.
- Forgetting that optional parameters may be `undefined`.
- Losing the expected `this` context when passing a method as a callback.

## Interview questions

1. What problem do generics solve?
2. What is the difference between a generic and `any`?
3. Explain a generic constraint using `extends`.
4. When would you use overloads instead of a union?
5. What are call signatures and construct signatures?
6. How does the special `this` parameter work?

## Quick revision

Function types describe callable values. Overloads describe multiple call patterns. Generics preserve type information, and constraints describe the minimum shape a generic value must have.

**Try it:** write a generic `getById` function that accepts an array of items with numeric IDs and returns the matching item or `undefined`.

[Next: Interfaces, aliases and classes](04-interfaces-aliases-and-classes.md)
