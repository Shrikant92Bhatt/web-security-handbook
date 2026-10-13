# Web Security Handbook — Chapter Authoring Guide

> **Purpose:** Canonical reference guide for human and AI contributors to author, format, and structure high-impact chapters for the Web Security and Frontend System Design Handbook.

---

## 🎯 Guiding Principles

1. **Approachable & Intuitive:** Demystify intimidating security and distributed systems concepts using real-world physical analogies.
2. **Visual-First:** Diagrams are not optional decorations; they are the primary communication vehicle. Every chapter requires at least one comprehensive Mermaid diagram.
3. **Rigorous & Practical:** Every vulnerability must be paired with realistic code showing how an attacker exploits it, and how an engineer hardens it with production-grade defense-in-depth.
4. **Verified & Tested:** Include reproducible testing steps (DevTools inspection, `curl` terminal commands, and automated test assertions).
5. **Authoritative:** Ground all claims in primary internet specifications (IETF RFCs, W3C Recommendations, OWASP Cheat Sheets, MDN Web Docs).

---

## 📖 Mandatory 7-Part Chapter Structure

Every chapter document (`.md`) must follow this exact section structure:

```markdown
# [Topic Title]: [Sub-Title Describing Domain]

## 1. 🎯 Overview & Intuitive Mental Model
- Hook: Why this matters in production and high-scale systems.
- Fun Analogy: Real-world physical comparison (e.g. keycards, border control).
- Severity & Impact: OWASP category, Common Weakness Enumeration (CWE), and blast radius.

## 2. 🎨 Interactive Visual Architecture
- Complete Mermaid diagram (`sequenceDiagram` or `flowchart TD`) showing normal flow vs. attack vector.
- Visual DevTools inspection tip: `> 💡 **Visual Inspection Tip:** [What to inspect in Network/Application tab]`.

## 3. 💥 Real-World Exploit Walkthrough
- Realistic vulnerable code snippet (React / TypeScript / Node.js / SQL).
- Attacker exploit payload and step-by-step failure breakdown.
- Browser/Network behavior breakdown.

## 4. 🛡️ Resolution & Defense-in-Depth
- Production-ready hardened code implementation with explanatory inline comments.
- Configuration blueprints (e.g. Helmet headers, CSP policies, cookie attributes, NGINX blocks).
- Best practices vs. antipatterns table.

## 5. 🧪 Hands-On Verification & Lab
- Step-by-step verification using terminal `curl` or browser DevTools.
- Automated integration test snippet (Vitest / Supertest).

## 6. 📋 Code Review Checklist
- Bulleted audit checklist for pull requests to spot flaws before merging.

## 7. 🎥 Curated Video Walkthroughs & Primary References
- High-impact video explanations (ByteByteGo, Hussein Nasser, Computerphile, Fireship, PortSwigger).
- Primary official specifications (IETF RFCs, W3C, MDN, OWASP).
- Interactive hands-on training labs (PortSwigger Academy, OWASP Juice Shop/crAPI).
```

---

## 🎨 Visual Architecture Standards

### Mermaid Diagram Guidelines
- Use clear actor and participant emojis: `actor Client as 👤 Client`, `participant Gateway as 🛡️ API Gateway`, `participant DB as 🗄️ PostgreSQL`.
- Use sequence steps or flowcharts to demonstrate the exact vulnerability boundary.
- Always verify that Mermaid syntax renders cleanly without syntax errors on GitHub.

### Visual Inspection Tip Format
```markdown
> 💡 **Visual Inspection Tip:** Open Chrome DevTools (`F12`) -> **Network** tab -> Filter by `Fetch/XHR`. Inspect the Request Headers for `X-CSRF-Token` and Response Headers for `Set-Cookie: ...; SameSite=Strict`.
```

---

## 🛠️ Code Standards

- **Language Support:** Use modern TypeScript for Node.js / React examples. Use modern SQL for database examples.
- **Vulnerable Code Warning:** Clearly label vulnerable code: `// 💥 VULNERABLE CODE (FOR LAB TESTING ONLY)`.
- **Hardened Code Defense:** Use inline annotations like `// 🛡️ 1. Defeat CSRF with Double-Submit Cookie` to explain each layer of defense.

---

## 📋 Definition of Done Checklist for New Chapters

Before marking a chapter complete in `docs/SECURITY-COVERAGE-MATRIX.md` and `PLAN.md`:
- [ ] Strictly follows the 7-part template.
- [ ] Contains at least one valid Mermaid diagram with labeled actors.
- [ ] Provides both realistic vulnerable code and production-hardened code.
- [ ] Includes automated test code (Vitest / Supertest).
- [ ] Cites primary specifications (RFCs / OWASP / W3C) with active links.
- [ ] Added to the parent folder's `README.md` navigation table.
- [ ] Added to `resources/VIDEOS.md` master directory.
- [ ] Added to `docs/SECURITY-COVERAGE-MATRIX.md` with status `Complete`.
