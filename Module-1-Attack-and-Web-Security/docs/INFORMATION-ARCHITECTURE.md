# Information architecture

This handbook has three learning tracks with a shared reference desk. The separation is intentional: security controls, frontend architecture, and operational deployment overlap in real systems, but they answer different engineering questions.

## Track 1 — Web application security

Follow the chapters in order for a first pass. Return to individual chapters as a reference when reviewing a feature or incident.

| Order | Domain | Primary question |
|---:|---|---|
| 00 | Foundations | What are we protecting, from whom, and across which trust boundaries? |
| 01 | Browser & frontend | What security guarantees does the browser provide, and where do they stop? |
| 02 | Authentication & sessions | How does the application establish, maintain and revoke identity? |
| 03 | Authorization | Is this identity allowed to perform this action on this object and tenant? |
| 04 | API security | How are API contracts, resource use and real-time channels protected? |
| 05 | Injection attacks | Can untrusted data become executable instructions or influence server-side requests? |
| 06 | HTTP & network | How are connections, headers, proxies and transport trust configured? |
| 07 | Data & database | How is sensitive data stored, queried, cached, migrated and removed? |
| 08 | File handling | How are untrusted files and serialized data validated and processed? |
| 09 | Cloud & DevSecOps | How are infrastructure, identities, secrets and delivery pipelines protected? |
| 10 | Modern applications | How do SSR, micro-frontends and AI/RAG change application trust boundaries? |
| 11 | Security testing | How do we find, prioritize and verify security defects? |
| 12 | Prevention checklists | What should developers, reviewers and operators verify before release? |

## Track 2 — Frontend system design

Chapter 13 is a separate architecture curriculum covering browser-to-service communication, system decomposition, performance, caching, offline behavior, accessibility and observability. It is not a substitute for the security chapters: for example, a frontend route guard improves navigation UX but does not enforce backend authorization.

## Track 3 — DevOps and deployment

Chapter 14 covers delivery and operations: CI/CD, application hosting, process management, queues and serverless deployment. Security controls for cloud identity, secrets and supply chain remain in Chapter 09; deployment mechanics live in Chapter 14. Cross-link the two when a deployment decision changes the threat model.

## Shared reference desk

- [Security topic map](SECURITY-MAP.md) — a topic-first index for readers who already know what they need.
- [Coverage matrix](SECURITY-COVERAGE-MATRIX.md) — planned coverage and known gaps.
- [Chapter authoring guide](CHAPTER-AUTHORING-GUIDE.md) — consistent structure and quality expectations.
- [Official references](../resources/OFFICIAL_REFERENCES.md) — primary sources.
- [Glossary](../resources/GLOSSARY.md) — shared terminology.

## Navigation principles

1. **One canonical home per topic.** Link to an existing page rather than duplicating the explanation in another chapter.
2. **Progressive disclosure.** Start with the concept and mental model; place implementation detail, edge cases and advanced topics later in the page.
3. **Predictable chapter structure.** Use the authoring guide, but scale the template to the topic. A short reference page should not be padded to imitate a deep dive.
4. **Cross-link adjacent concepts.** Explain the relationship, then link to the canonical chapter.
5. **Make gaps visible.** A folder containing only an overview page is an index or planned area, not evidence that the subject is comprehensively covered.
6. **Keep the site navigation curated.** Add new pages to the parent chapter index and MkDocs navigation in the same change.
