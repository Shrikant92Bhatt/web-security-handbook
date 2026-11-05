# Web Security & Full-Stack Engineering Interview Handbook

**How to use this handbook:** start with a module, read each chapter in order and follow the Next link. Each topic should explain the idea first, use a small example and then introduce the technical terms. See the [Simple-Word Glossary](resources/GLOSSARY.md) for quick explanations.

A sequential, one-stop learning and revision handbook with two distinct modules.

- **Module 1 — Attack & Web Security (primary):** understand attacks first, then families, techniques, variants, root causes, impact, defenses and verification.
- **Module 2 — Full-Stack Engineering & Interview Prep:** study HTTP, frontend, backend, databases, cloud/DevOps and system design in order, with interview questions and practical exercises.

## Choose your module

| Module | Purpose | Start |
|---|---|---|
| **1 · Attack & Web Security** | Attack taxonomy, prevention, secure coding and testing | [Start Module 1](docs/MODULE-1-ATTACK-SECURITY-PATH.md) |
| **2 · Full-Stack & Interview Prep** | Technology fundamentals and day-before interview revision | [Start Module 2](15-fullstack-interview/README.md) |

## Module 1 — Attack & Web Security

Follow: **domain → attack family → attack type → variant → root cause → impact → mitigation → verification**.

- [Attack catalog & taxonomy](docs/ATTACK-CATALOG.md)
- [Sequential Module 1 reading path](docs/MODULE-1-ATTACK-SECURITY-PATH.md)
- [Attack playbook template](docs/ATTACK-PLAYBOOK-TEMPLATE.md)

## Module 2 — Full-Stack Engineering & Interview Prep

Read the chapters in order. Each chapter covers core concepts, how things work, trade-offs, common mistakes, interview questions, quick revision and a practical exercise.

1. [HTTP & Web Fundamentals](15-fullstack-interview/01-http-and-web-fundamentals.md)
2. [JavaScript & TypeScript](15-fullstack-interview/02-javascript-typescript.md)
3. [Core Web Development](15-fullstack-interview/core-web-development/README.md)
4. [Frontend — React, Angular & Browser](15-fullstack-interview/03-frontend-react-angular.md)
5. [Backend — Node.js & API Design](15-fullstack-interview/04-backend-nodejs.md)
6. [Databases, SQL, NoSQL & Caching](15-fullstack-interview/05-databases-and-caching.md)
7. [Cloud, DevOps & Operations](15-fullstack-interview/06-cloud-devops.md)
8. [Full-Stack & System Design](15-fullstack-interview/07-system-design.md)
9. [Question Bank & Day-Before Revision](15-fullstack-interview/08-interview-question-bank.md)

## How to use it

- **First pass:** start at the module landing page and follow Previous / Next links. Avoid jumping around.
- **Interview prep:** answer questions aloud, draw the architecture or request flow, then complete the exercise.
- **Day before:** use each chapter's quick-revision checklist and the question bank.
- **Security practice:** use local labs or systems you are explicitly authorized to test.

## Documentation site

Install requirements from requirements-docs.txt, then run python -m mkdocs serve. Run python -m mkdocs build --strict before publishing.

Prefer primary sources: OWASP, MDN, W3C/IETF specifications, framework documentation and cloud-provider guidance. Videos supplement, but do not replace, primary references.
