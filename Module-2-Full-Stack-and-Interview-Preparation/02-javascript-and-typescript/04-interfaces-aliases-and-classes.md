# 04 — Interfaces, type aliases and classes

[Subject index](README.md) · [Previous: Functions and generics](03-functions-and-generics.md)

## 1. Interfaces

An interface describes the shape that an object should follow.

```ts
interface Customer {
  id: number;
  name: string;
  email?: string;
}

function sendWelcomeEmail(customer: Customer): void {
  console.log(`Welcome, ${customer.name}`);
}
```

Interfaces can extend other interfaces:

```ts
interface Employee extends Customer {
  department: string;
}
```

Use interfaces for object contracts that may be extended or implemented by classes.

## 2. Type aliases

A type alias gives a name to a type. It can describe objects, unions, primitives, tuples, functions and combinations.

```ts
type OrderId = string;
type OrderStatus = "PENDING" | "PAID" | "CANCELLED";
type Order = {
  id: OrderId;
  status: OrderStatus;
};
```

Both interfaces and type aliases can describe object shapes. A practical guideline: use an interface for an extendable object contract; use a type alias when you need unions, intersections, tuples or other type expressions. Consistency in a codebase matters more than treating this guideline as a hard rule.

## 3. Extending and composing types

An intersection combines requirements from multiple types:

```ts
type HasId = { id: number };
type HasTimestamp = { createdAt: Date };
type SavedRecord = HasId & HasTimestamp;
```

A union allows one of several alternatives:

```ts
type Payment = { method: "card"; lastFour: string }
  | { method: "upi"; upiId: string };
```

Use a discriminant such as `method` to make the alternatives easy to check.

## 4. Classes

A class is a JavaScript feature for creating objects with shared methods and state. TypeScript adds type checking around class members.

```ts
class ShoppingCart {
  private items: string[] = [];

  add(productName: string): void {
    this.items.push(productName);
  }

  get count(): number {
    return this.items.length;
  }
}

const cart = new ShoppingCart();
cart.add("Keyboard");
console.log(cart.count);
```

## 5. Access modifiers

- `public`: can be accessed from anywhere; this is the default.
- `private`: can be accessed only inside the class in TypeScript's type system.
- `protected`: can be accessed inside the class and its subclasses.
- `readonly`: can be assigned during initialization or in the constructor, then not reassigned through that type.

TypeScript's `private` is mainly a compile-time restriction. JavaScript's `#field` syntax provides runtime private fields.

## 6. Inheritance, abstract classes and overrides

A child class can reuse and specialize a parent class.

```ts
abstract class PaymentProcessor {
  abstract pay(amount: number): Promise<boolean>;

  printReceipt(): void {
    console.log("Payment processed");
  }
}

class CardPayment extends PaymentProcessor {
  override async pay(amount: number): Promise<boolean> {
    return amount > 0;
  }
}
```

An abstract class cannot be created directly. It can contain abstract members that child classes must implement. The `override` keyword makes it clear that a method is replacing a parent method and helps catch misspelled method names.

Prefer composition when one object can use another object without needing to become a specialized version of it. Deep inheritance chains are difficult to change.

## 7. Declaration merging

Some TypeScript declarations with the same name can be combined. Interfaces can merge:

```ts
interface Window {
  appVersion: string;
}

interface Window {
  supportEmail: string;
}

// Both properties are now part of Window's type.
```

This is useful when extending types from a library, but accidental name collisions can make types confusing. Use a clear namespace or module augmentation pattern where appropriate.

## Common mistakes

- Thinking interfaces can describe only simple objects.
- Assuming interface and type alias are completely interchangeable in every feature.
- Using inheritance when composition would be easier.
- Treating TypeScript `private` as a runtime security boundary.
- Forgetting `override` when changing a parent method.
- Creating incompatible merged interface declarations.

## Interview questions

1. Interface vs type: how do you choose?
2. What is the difference between union and intersection?
3. Explain public, private, protected and readonly.
4. What is an abstract class?
5. What does the override keyword protect against?
6. What is declaration merging?

## Quick revision

Interfaces describe object contracts. Type aliases can name almost any type expression. Intersections combine requirements; unions represent alternatives. Classes create objects, while abstract classes define a base contract.

**Try it:** model a payment system with a `PaymentMethod` union and two classes that implement a common payment interface.

[Next: Narrowing and utility types](05-narrowing-and-utility-types.md)
