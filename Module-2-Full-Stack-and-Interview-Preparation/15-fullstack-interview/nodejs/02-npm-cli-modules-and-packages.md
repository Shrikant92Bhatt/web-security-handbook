# 02 — npm, CLI, Modules and Package Management

**In simple words:** A Node.js project usually depends on packages written by other developers. npm installs and manages those packages, while the Node CLI runs scripts and applications. Modules let code be split into files with clear boundaries.

[Node.js learning path](README.md) · [Previous: Runtime](01-nodejs-fundamentals-and-runtime.md) · **Chapter 2 of 6**

## 1. Node CLI

Learn how to run a file with `node app.js`, inspect help and version output, pass command-line arguments, use `--watch` where supported, enable source maps where appropriate and inspect runtime options. Understand:
- `process.argv` and parsing command-line arguments.
- Environment variables and configuration per environment.
- `NODE_OPTIONS` and the risk of hidden runtime configuration.
- Debugging with `--inspect` and secure local-only debugger exposure.
- Exit codes and signal handling.
- Difference between Node CLI options and application arguments.

## 2. npm fundamentals

- npm CLI, registry, package, dependency and package metadata.
- `package.json`: name, version, description, scripts, dependencies, devDependencies, peerDependencies, optionalDependencies, engines, type, exports and bin.
- `npm install`, `npm ci`, `npm uninstall`, `npm update`, `npm outdated`, `npm audit` and `npm run`.
- `npm ci` for reproducible CI installs from a lockfile; understand when it removes and recreates node_modules.
- package-lock version and why lockfiles should be committed for applications.
- `npm exec` / `npx` and avoiding accidental execution of untrusted packages.
- npm config, registry settings, scopes and private packages.

## 3. Semantic versioning and dependency control

Understand major/minor/patch versions and common ranges: exact, caret, tilde, wildcard and prerelease. Learn direct versus transitive dependencies, peer dependency conflicts, optional dependencies, overrides/resolutions (tool-specific), deduplication and dependency trees.

A lockfile records the resolved dependency graph; it does not prove packages are safe. Review package provenance, maintenance, release history and permissions before adding dependencies.

## 4. npm scripts and project structure

- Scripts for dev, build, test, lint, typecheck, start and migration.
- Lifecycle scripts such as prepare and postinstall; understand their supply-chain implications.
- Script argument forwarding and cross-platform environment variables.
- Monorepo workspaces, shared packages, package boundaries and versioning.
- Avoid scripts that silently depend on a globally installed tool.

## 5. Node module systems

### CommonJS
`require`, `module.exports`, `exports`, module caching, resolution and circular dependencies.

### ECMAScript Modules (ESM)
`import`, `export`, default/named exports, top-level await, dynamic import, live bindings, package `type`, `.mjs` and `.cjs`, and the `exports` field.

### Interoperability
Understand how CommonJS and ESM interoperate, where resolution differs and why package authors must test supported Node versions. Do not assume every package can be loaded with either syntax without configuration.

## 6. Module resolution and publishing

Study built-in modules, relative imports, package imports, package exports, subpath exports, conditional exports, package entry points, `main`, `module` conventions and `exports`. Understand private registries, scoped packages, npm publish, dist-tags, provenance and deprecation. Publish only intentional files using `files` or `.npmignore`; inspect the package contents before release.

## 7. Package quality and maintenance

- Pin or constrain supported Node versions using `engines` and project tooling.
- Keep dependencies updated with review and tests.
- Audit vulnerabilities and assess actual reachability and impact.
- Avoid unnecessary dependencies and typosquatting.
- Generate an SBOM where required by the delivery process.
- Use private registry credentials through secure CI secrets, not committed config.

## Interview questions

1. What is the difference between dependencies and devDependencies?
2. Why commit package-lock.json?
3. Compare npm install and npm ci.
4. Explain semantic versioning and caret versus tilde.
5. Compare CommonJS and ESM.
6. What is the purpose of the package exports field?
7. What are peer dependencies?
8. What risks can postinstall scripts introduce?
9. How do you publish a scoped private package?

## Practical exercise

Create a small ESM package with a CLI command, tests and lint/typecheck scripts. Install it in a second local project, inspect its package contents and verify that a clean npm ci reproduces the dependency tree.

**References:** [npm documentation](https://docs.npmjs.com/), [Node.js modules](https://nodejs.org/api/modules.html), [Node.js packages](https://nodejs.org/api/packages.html), [Node.js ESM](https://nodejs.org/api/esm.html).
