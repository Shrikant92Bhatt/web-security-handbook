# 01 — TypeScript foundations

[Subject index](README.md)

## 1. What TypeScript is

JavaScript is the language that runs in browsers and Node.js. TypeScript adds a way to describe the kind of values your code expects. The TypeScript compiler checks those descriptions before the code runs and then produces JavaScript.

For example, a function that adds two prices should receive numbers. TypeScript can warn if someone passes a string by mistake.

```ts
function addPrices(first: number, second: number): number {
  return first + second;
}

addPrices(10, 20);       // valid
// addPrices("10", 20);  // Type error
```

TypeScript types are removed during compilation. They do not make JavaScript run-time values magically safe. If an API sends the wrong data, you still need a run-time check.

## 2. Primitive types

The most common primitive types are:

| Type | Meaning | Example |
|---|---|---|
| `string` | Text | `"Pune"` |
| `number` | Integer or decimal number | `42`, `19.5` |
| `boolean` | True or false | `true` |
| `bigint` | Very large integer | `9007199254740993n` |
| `symbol` | Unique identifier value | `Symbol("id")` |
| `null` | Intentionally empty value | `null` |
| `undefined` | Value not assigned | `undefined` |

`object` is not a primitive type. Arrays, functions and ordinary objects are object values.

```ts
let customerName: string = "Asha";
let orderCount: number = 3;
let isPaid: boolean = false;
let selectedCoupon: string | null = null;
```

Use the lower-case type names such as `string` and `number`. The JavaScript wrapper objects `String` and `Number` are not the normal choices for annotations.

## 3. Type annotations and type inference

An annotation is a type you write yourself:

```ts
let quantity: number = 2;
function total(price: number, count: number): number {
  return price * count;
}
```

Inference means TypeScript works out a type from the value:

```ts
const city = "Pune";       // inferred as the literal type "Pune"
let retryCount = 3;        // inferred as number
const names = ["Asha"];    // inferred as string[]
```

Do not add annotations everywhere just to repeat what TypeScript already knows. Add them where they make an API clearer: function parameters, public return values, object boundaries and values whose type cannot be inferred well.

## 4. Special types: any, unknown, void and never

- `any` turns off most checking for that value. It can hide mistakes, so avoid it where possible.
- `unknown` can hold any value, but you must check it before using it.
- `void` is commonly used when a function does not return a useful value.
- `never` represents a value that cannot occur, such as a function that always throws or a branch that should be impossible.

```ts
function printValue(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}

function fail(message: string): never {
  throw new Error(message);
}
```

Prefer `unknown` over `any` for values from external systems.

## 5. Enums and alternatives

An enum gives a name to a fixed set of values:

```ts
enum OrderStatus {
  Pending = "PENDING",
  Paid = "PAID",
  Shipped = "SHIPPED",
}
```

Enums can be useful when a project already uses them. For many application cases, a string-literal union is simpler and produces no enum runtime object:

```ts
type OrderStatus = "PENDING" | "PAID" | "SHIPPED";
const status: OrderStatus = "PAID";
```

Choose one approach consistently. Do not accept arbitrary strings just because a value came from an API; validate it first.

## 6. Structural typing

TypeScript mainly checks whether an object has the required shape. The object's declared name does not have to match the type name.

```ts
type HasName = { name: string };

const customer = { name: "Asha", city: "Pune" };
const person: HasName = customer; // valid: it has name: string
```

This is called structural typing. It is convenient when passing data between components and services. It does not mean every object is interchangeable: required fields and their types still matter.

## Common mistakes

- Thinking TypeScript checks API responses at runtime. It does not.
- Using `any` to silence an error instead of understanding it.
- Writing `String` or `Number` when `string` or `number` is intended.
- Adding annotations to every local variable even when inference is clear.
- Assuming an enum or union validates data received over the network.

## Interview questions

1. What is the difference between JavaScript and TypeScript?
2. What is type inference? When would you add an explicit annotation?
3. Compare `any` and `unknown`.
4. What is the difference between `void` and `never`?
5. Explain structural typing with an object example.
6. When might you choose a string union instead of an enum?

## Quick revision

TypeScript checks your code before it runs, then emits JavaScript. Use primitive types for simple values, inference for obvious local values, `unknown` for untrusted data and structural types to describe object shapes.

**Try it:** create a `Customer` type and a function that accepts it. Pass an object with an extra `city` field, then remove the required `name` field and observe the difference.

[Next: Objects and collections](02-objects-and-collections.md)
