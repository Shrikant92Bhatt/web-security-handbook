# Contributing to the Web Security & System Design Handbook

Thank you for contributing to the **Web Security and Frontend System Design Handbook**! Our goal is to build the highest-quality, most comprehensive, visually engaging, and practical security engineering resource for software developers.

Whether you are a human engineer submitting a pull request or using an AI coding assistant, all additions and updates must follow the content and quality standards outlined below.

---

## 🎯 Core Content Standards

### 1. Tone & Engagement
- **Approachable & Fun:** Demystify intimidating cryptography and security topics with intuitive, real-world analogies (e.g., cookies as hotel keycards, SOP as border control, NGINX as the corporate front desk).
- **Emoji Signposts:** Use clear visual signposts (`🎯`, `🧠`, `🎨`, `💥`, `🛡️`, `🧪`, `📋`, `🎥`, `⚠️`) to guide the reader.

### 2. Diagrams & Visual Architecture
- **Mandatory Mermaid Diagram:** Every chapter **MUST** include at least one complete Mermaid diagram (`sequenceDiagram` or `graph TD`) detailing request and data flows across the Client, Browser Sandbox, Gateway/Reverse Proxy, and Backend Services.
- **Visual Inspection Tip:** Include actionable browser DevTools inspection tips:
  ```markdown
  > 💡 **Visual Inspection Tip:** [Explain what to inspect in DevTools Network / Application / Security tab]
  ```

### 3. Deep Code Walkthroughs (Vulnerable vs. Hardened)
- Provide both sides of every vulnerability:
  1. **Realistic Vulnerable Code:** Frontend (React / TypeScript) and/or Backend (Node.js / Express).
  2. **Attacker Payload:** Exact exploit payload and execution breakdown showing how an adversary exploits the weakness.
  3. **Production Hardened Code:** Production-grade implementation with inline explanatory comments.

### 4. Defense-in-Depth
- Implement defense-in-depth across multiple layers: framework APIs, HTTP security headers, input validation, output encoding, and kernel/database level constraints.

### 5. Hands-On Verification
- Provide reproducible verification steps: DevTools inspection, `curl` commands, or automated integration test snippets (`Vitest`, `Jest`, or `Supertest`).

---

## 📖 Mandatory 7-Part Chapter Template

Every topic document in this repository follows this exact structure:

### 1. 🎯 Overview & Intuitive Mental Model
- **Hook:** Why this topic matters in high-scale production systems.
- **Mental Model Analogy:** Real-world physical comparison.
- **Severity & Impact:** OWASP category, CWE identifier, and blast radius.

### 2. 🎨 Interactive Visual Architecture
- Mermaid diagram showing the normal request flow vs. the attack vector with labeled actors.
- Visual DevTools inspection tip.

### 3. 💥 Real-World Exploit Walkthrough
- Realistic vulnerable code snippet (React / Node.js / SQL).
- Attacker exploit payload and step-by-step failure breakdown.

### 4. 🛡️ Resolution & Defense-in-Depth
- Complete production-ready hardened code implementation.
- Production configuration blueprints (e.g. Helmet headers, CSP directives, NGINX configs, cookie flags).
- Best practices vs. antipatterns table.

### 5. 🧪 Hands-On Verification & Lab
- Step-by-step verification using terminal `curl` commands or browser DevTools.
- Automated integration test snippet (Vitest / Supertest).

### 6. 📋 Code Review Checklist
- Bulleted audit checklist for pull requests to help reviewers spot flaws before merging.

### 7. 🎥 Curated Video Walkthroughs & Primary References
- **High-Impact Videos:** Curated walkthroughs from top industry educators (ByteByteGo, Hussein Nasser, Computerphile, Fireship, PortSwigger).
- **Primary Specifications:** Authoritative RFCs (IETF), W3C Recommendations, MDN Web Docs, and OWASP Cheat Sheets.
- **Interactive Labs:** Links to free interactive labs (PortSwigger Web Security Academy, OWASP Juice Shop, OWASP crAPI).

---

## 🤖 AI Agent Guidelines

For automated AI coding agents (Google Antigravity, Claude Code, Cursor, Aider), the canonical configuration and behavioral instructions are maintained in:
- [AGENTS.md](AGENTS.md)

---

## 📋 Pull Request Review Checklist

Before opening or merging a PR, verify:
- [ ] Does the new or edited chapter strictly follow the 7-part template?
- [ ] Is there at least one valid, syntactically correct Mermaid diagram?
- [ ] Are code examples realistic, syntactically valid TypeScript/JavaScript/SQL/NGINX configs?
- [ ] Are all external claims backed by primary references (RFCs, W3C, MDN, OWASP)?
- [ ] Are no sensitive credentials, live IP addresses, or proprietary company secrets included?
- [ ] Are links tested and formatted as valid markdown?
