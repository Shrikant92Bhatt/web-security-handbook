# Diagrams

Topic pages use Mermaid diagrams that GitHub can render inline. Keep diagrams small enough to read in code review, label trust boundaries, and explain important steps in nearby prose.

The downloadable starter archive also includes animated GIF explainers for a secure request flow and an XSS trust boundary. Add these binary assets under assets/ when publishing the complete archive.

## Diagram checklist
- Name actors and trust boundaries.
- Show where validation and authorization occur.
- Distinguish browser-side controls from server-side controls.
- Do not imply that CORS or frontend routing replaces API authorization.
- Include a short textual explanation for accessibility.
