# Chapter Writing Guide — Clear, Simple and Practical

Write like a helpful senior developer explaining a topic to a teammate, not like a research paper or product brochure.

## Use plain English first
- Prefer short sentences and familiar words. Explain one idea at a time.
- Explain the idea before using its technical name or acronym.
- Avoid marketing phrases such as "enterprise-grade", "highly scalable" and "mission-critical" unless they are genuinely needed.
- Keep paragraphs short. Use a table only when it makes a comparison easier.

**Better:** "The API checks that the signed-in user owns this order before returning it."

**Avoid:** "Enforce object-level authorization at the service boundary to prevent horizontal privilege escalation."

After the simple explanation, add the formal term: "This is object-level authorization. If the check is missing, the issue may be BOLA/IDOR."

## Use small examples
Prefer a shopping cart, product list, order, login form, profile, chat message, file upload or small customer database. Keep examples small enough to understand in one reading. Do not add cloud services, queues or microservices unless they help explain the topic.

When code is needed:
1. Show the smallest useful example.
2. Explain the important lines.
3. Show the common mistake, if relevant.
4. Show the safer version.
5. State what the example does not cover.

Mark unsafe code clearly as a local learning example. Never present it as production-ready.

## Teach in this order
1. What is it? Explain in one or two simple sentences.
2. Why should I care? Give a real situation.
3. How does it work? Show a short flow or diagram.
4. Example: use a small, easy-to-follow example.
5. Common mistake: explain what developers often get wrong.
6. How to do it safely: give practical steps and code where useful.
7. How to test it: show what to try and what result to expect.
8. Interview questions: check understanding.
9. Quick revision: list the few things to remember.

## Explain technical words
Keep correct technical terms because readers need them for interviews. Never assume the reader already knows them. For example, first say "A cache is a saved copy of data that helps the app answer faster." Then introduce "caching". Explain cache-aside, TTL and invalidation one at a time.

Add unfamiliar terms to [the simple-word glossary](../resources/GLOSSARY.md).

## References and diagrams
- Keep references relevant and limited. Add one sentence explaining what each link helps the reader learn.
- Prefer official docs, OWASP, MDN, framework documentation and standards.
- Call a video "recommended" only if it has been checked. Otherwise label it as a YouTube search.
- Teach the topic in the chapter; do not replace the explanation with a pile of links.
- Use a small diagram only when it makes the flow easier to understand. Label boxes with plain words and explain the diagram.

## Every chapter should include
A simple definition and why it matters; one everyday example; a short flow or diagram where helpful; a small code example where useful; common mistakes and the safer approach; how to test or practise it; interview questions; a quick revision checklist; and a few useful references.

**Final test:** could a developer with basic JavaScript knowledge explain the idea to a colleague after reading the chapter? If not, simplify it before adding more detail.
