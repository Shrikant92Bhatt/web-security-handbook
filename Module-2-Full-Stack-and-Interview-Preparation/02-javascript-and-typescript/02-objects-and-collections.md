# 02 — Objects and collections

[Subject index](README.md) · [Previous: Foundations](01-foundations.md)

## 1. Object types

An object type describes the properties an object must or may contain.

```ts
type Product = {
  id: number;
  name: string;
  price: number;
  description?: string; // optional
  readonly sku: string; // cannot be reassigned through this type
};

const product: Product = {
  id: 1,
  name: "Keyboard",
  price: 1500,
  sku: "KEY-001",
};
```

A question mark means the property may be missing. When reading it, handle the possibility of `undefined`.

```ts
if (product.description) {
  console.log(product.description.toUpperCase());
}
```

`readonly` prevents reassignment through that TypeScript reference. It is not deep immutability and does not freeze the JavaScript object at runtime.

## 2. Arrays

An array stores multiple values of the same general type.

```ts
const prices: number[] = [100, 250, 500];
const names: Array<string> = ["Asha", "Ravi"];

prices.push(700);
// prices.push("free"); // Type error
```

`number[]` and `Array<number>` mean the same thing. Use whichever style your project prefers.

## 3. Tuples

A tuple is an array with a known position and type for each item. Use one when the order has meaning and the number of elements is known.

```ts
type Coordinates = [latitude: number, longitude: number];
const pune: Coordinates = [18.52, 73.85];
```

A tuple is not automatically immutable. Use `readonly [number, number]` when the values should not be changed through that reference.

## 4. Record

`Record<Key, Value>` describes an object whose keys and values follow known types.

```ts
type StockBySymbol = Record<string, number>;

const pricesBySymbol: StockBySymbol = {
  INFY: 1500,
  TCS: 4000,
};
```

Use it for lookup tables and dictionaries. It does not mean the key exists at runtime: reading a missing key can still produce `undefined`, depending on compiler settings and the type used.

## 5. Map

A JavaScript `Map` stores key-value pairs. Keys can be strings, numbers, objects or other values.

```ts
const customerById = new Map<number, string>();
customerById.set(101, "Asha");
customerById.set(102, "Ravi");

const customer = customerById.get(101); // string | undefined
```

A Map is useful when keys are added and removed often, when keys are not just strings, or when you need Map methods such as `has`, `delete` and iteration.

## 6. Set

A `Set` stores unique values.

```ts
const visitedProductIds = new Set<number>();
visitedProductIds.add(10);
visitedProductIds.add(10);
visitedProductIds.add(20);

console.log(visitedProductIds.size); // 2
```

Use a Set to remove duplicates or quickly check whether a value has already been seen.

## 7. Index signatures

An index signature describes the type of values stored under dynamic keys.

```ts
type FeatureFlags = {
  [featureName: string]: boolean;
};

const flags: FeatureFlags = {
  newCheckout: true,
  showRecommendations: false,
};
```

Do not use a broad index signature when only a few keys are valid. A union or explicit object type gives better checking.

## 8. Readonly arrays and object safety

```ts
function showProducts(products: readonly Product[]) {
  // products.push(...) is not allowed
  return products.map(item => item.name);
}
```

Readonly types help a function communicate that it will not change the collection through that reference. They do not stop other references from changing the same underlying object.

## Common mistakes

- Using a tuple when an ordinary array is more suitable.
- Assuming `Record<string, T>` guarantees every possible string key exists.
- Confusing a plain object with a Map.
- Expecting `readonly` to freeze nested values at runtime.
- Using `any` for a dictionary instead of describing its key and value types.

## Interview questions

1. When would you use an array, tuple, Map or Set?
2. What does `Record<string, number>` describe?
3. What is an index signature?
4. What is the difference between an optional property and a property typed as `string | undefined`?
5. Does `readonly` make an object deeply immutable?

## Quick revision

Use arrays for lists, tuples for fixed positions, Record or index signatures for object dictionaries, Map for flexible key-value collections and Set for unique values.

**Try it:** build a product lookup using both a Record and a Map. Compare how you check whether a product ID exists.

[Next: Functions and generics](03-functions-and-generics.md)
