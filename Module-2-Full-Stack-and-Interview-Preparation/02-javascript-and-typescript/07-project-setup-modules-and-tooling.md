# 07 — Project setup, modules and tooling

[Subject index](README.md) · [Previous: Advanced type building](06-advanced-type-building.md)

## 1. What the TypeScript compiler does

The TypeScript compiler (`tsc`) reads TypeScript files, checks their types and can emit JavaScript and declaration files. A project usually has a `tsconfig.json` file that describes how this should happen.

Start a small project:

```bash
npm init -y
npm install --save-dev typescript
npx tsc --init
```

Run a type check:

```bash
npx tsc --noEmit
```

`--noEmit` asks the compiler to check the project without writing JavaScript output.

## 2. Important tsconfig options

A practical starting point for a modern application is:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

The correct `module` and `moduleResolution` values depend on the runtime and build tool. Browser applications bundled by Vite, Angular CLI or another bundler often use a different setup from Node.js applications. Do not copy one configuration blindly.

Important options:

| Option | What it checks or changes |
|---|---|
| `strict` | Enables the main strict type-checking options |
| `noImplicitAny` | Reports places where TypeScript would otherwise infer `any` |
| `strictNullChecks` | Makes `null` and `undefined` explicit |
| `exactOptionalPropertyTypes` | Distinguishes an absent optional property from one explicitly set to `undefined` |
| `noUncheckedIndexedAccess` | Adds `undefined` when reading values by an index that may not exist |
| `noEmit` | Checks types without generating output |
| `skipLibCheck` | Skips checking declaration files from dependencies; it does not skip checking your source |
| `forceConsistentCasingInFileNames` | Catches imports whose filename casing differs |

### noImplicitAny and strictNullChecks

```ts
// With noImplicitAny, give the parameter a type.
function greet(name: string) {
  return `Hello ${name}`;
}

// With strictNullChecks, handle the missing value.
function findName(id: number): string | undefined {
  return id === 1 ? "Asha" : undefined;
}
```

Strict settings help find mistakes earlier. Enable them deliberately and fix errors rather than silencing the compiler with `any`.

## 3. Optional properties and exactOptionalPropertyTypes

An optional property normally means the property may be absent. With `exactOptionalPropertyTypes`, explicitly assigning `undefined` is not automatically treated the same as omitting the property unless `undefined` is included in the property's type.

```ts
type Preferences = {
  nickname?: string;
};

// With exactOptionalPropertyTypes, omit nickname to clear it.
// Or declare nickname?: string | undefined if explicit undefined is part of the API.
```

This distinction matters when objects are serialized, patched or merged.

## 4. Modules and imports

A file with an import or export is treated as a module. Modules keep their declarations scoped to the file.

```ts
// money.ts
export function formatMoney(amount: number): string {
  return `₹${amount}`;
}

// app.ts
import { formatMoney } from "./money.js";
console.log(formatMoney(250));
```

The import extension depends on the project's module system and build tooling. Follow the conventions used by your runtime.

Use named exports when a module exposes several related functions. A default export can be useful for one main value, but do not mix styles without a reason.

## 5. Namespaces and triple-slash directives

Namespaces group names under one TypeScript name:

```ts
namespace Validation {
  export function isEmail(value: string): boolean {
    return value.includes("@");
  }
}
```

Modern application code usually prefers ES modules. Namespaces are mostly encountered in older TypeScript projects, declaration files and some global libraries.

Triple-slash directives are special reference comments at the top of a TypeScript file. For example, `/// <reference types="node" />` tells the compiler to include declarations for a type package in supported configurations. Use normal imports and `types` configuration where they fit better; do not add directives without understanding their effect.

## 6. Declaration files and ambient declarations

A declaration file ends in `.d.ts`. It describes types for JavaScript code without providing the implementation.

```ts
// legacy-library.d.ts
declare module "legacy-library" {
  export function formatCode(value: string): string;
}
```

Ambient declarations describe values that exist at runtime but are not implemented in the declaration file. Keep declarations accurate: a false declaration can make unsafe code look correct to the compiler.

## 7. Declaration merging and module augmentation

TypeScript can merge certain declarations, especially interfaces. Module augmentation extends the type declarations of an existing module.

```ts
// custom-express.d.ts
declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}
```

The exact module name and file inclusion depend on the library. Use this carefully and keep the augmentation in a clearly named declaration file.

## 8. Decorators

Decorators are functions attached to classes or class members to add or change behavior through supported decorator APIs. TypeScript supports decorator-related compiler settings and syntax; the newer standard decorator model differs from the older experimental decorator model used by many frameworks.

A framework such as Angular has its own documented decorator conventions. Do not assume decorator examples from different TypeScript versions or frameworks are interchangeable. Check the framework's supported TypeScript version and configuration.

## 9. ts-node and tsx

Both tools help run TypeScript files during development.

- `ts-node` runs TypeScript through a Node.js integration. It is common in scripts and older projects.
- `tsx` provides a fast development runner for TypeScript and JSX and is convenient for scripts and local development.

Example:

```bash
npm install --save-dev tsx
npx tsx src/index.ts
```

A development runner does not automatically replace production build and type-check steps. Keep a separate type-check command such as `tsc --noEmit`.

## 10. Compiler troubleshooting and performance

When the compiler reports an error:
1. Read the first useful error and locate the source file and line.
2. Check the actual value and the type TypeScript inferred.
3. Fix the source type or add a safe runtime check.
4. Avoid using `as any` to hide the error.
5. Re-run the same project type check.

Useful diagnostic options:

| Command or option | Purpose |
|---|---|
| `tsc --listFiles` | Lists files included in the compilation |
| `tsc --explainFiles` | Explains why files are part of the project |
| `tsc --extendedDiagnostics` | Shows compiler timing and memory details |
| `tsc --generateCpuProfile profile.cpuprofile` | Writes a CPU profile for performance investigation |
| `tsc --showConfig` | Prints the resolved compiler configuration |

Use these when the project includes unexpected files, type-checking is slow or configuration inheritance is confusing. Do not optimize based on guesses; first identify which part of compilation is slow.

## 11. Utility libraries

Libraries such as type-fest provide reusable advanced TypeScript types. They can reduce repeated code, but first check whether TypeScript already has a built-in utility that does the job. Keep dependencies limited and make sure the team understands any complex type it introduces.

## Common mistakes

- Copying a Node.js tsconfig into a browser project without checking the build tool.
- Assuming `skipLibCheck` disables type checking for application code.
- Using a runtime runner as a replacement for a production build.
- Treating declaration files as runtime code.
- Adding global declarations that conflict with other libraries.
- Trying to fix a slow build by changing random compiler options.
- Mixing legacy and standard decorator examples.

## Interview questions

1. What does `tsc` do?
2. What does `strict` enable?
3. Compare `noImplicitAny` and `strictNullChecks`.
4. What is the difference between a module and a namespace?
5. What is a `.d.ts` file?
6. What are ambient declarations and declaration merging?
7. What are triple-slash directives?
8. How do you investigate slow TypeScript compilation?
9. Compare ts-node and tsx.
10. Why does `tsc --noEmit` still matter when a bundler already compiles TypeScript?

## Quick revision

Keep strict checks enabled, understand the module system used by your runtime, use declaration files to describe JavaScript libraries, and separate type checking from development execution and production bundling.

**Try it:** add `strict`, `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` to a small project. Fix the errors rather than disabling the options.

[Back to subject index](README.md)
