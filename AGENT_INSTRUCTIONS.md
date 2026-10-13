# Web Security Handbook — Content & Quality Standards

You are upgrading and expanding topics in the Web Security and Frontend System Design Handbook. Every topic document must be comprehensive, highly visual, fun to learn, and practical.

## Core Content Standards

1. Tone & Engagement:
- Fun, approachable, and engaging.
- Use intuitive real-world analogies (e.g., comparing cookies to hotel keycards, SOP to passport border control).
- Use emoji signposts for visual hierarchy (🎯, 🧠, 🎨, 💥, 🛡️, 🧪, 📋, ⚠️).

2. Diagrams & Visuals:
- Every topic MUST include at least one complete Mermaid diagram (`sequenceDiagram` or `graph TD`) detailing the exact request/response flow between Client, Browser Sandbox, Gateway/Proxy, and Backend/Database.
- Suggest relevant visual aid placeholders: `> 💡 **Visual Inspection Tip:** [Describe what to inspect in DevTools Network/Application tab]`.

3. Code Depth (Vulnerable vs. Hardened):
- Always provide BOTH sides:
  a) Realistic vulnerable code (Frontend: React/TypeScript; Backend: Node.js/Express).
  b) Exploit payload showing how an attacker exploits the flaw.
  c) Production-ready hardened fix with explanatory inline comments.

4. Resolutions & Defenses:
- Include layered defense-in-depth: HTTP security headers, framework APIs, input validation, and sanitization.

5. Verification:
- Provide concrete testing steps (browser DevTools walkthrough, curl command, or test assertions).

---

## Mandatory Chapter Template

Each updated markdown file must follow this exact 6-part structure:

### 1. 🎯 Overview & Intuitive Mental Model
- Hook: Why this matters in production and high-scale frontend systems.
- Fun Analogy: Real-world mental model.
- Severity & Impact: OWASP category, Common Weakness Enumeration (CWE), and blast radius.

### 2. 🎨 Interactive Visual Architecture
- Mermaid sequence diagram showing the normal flow vs. attack vector.
- Clear actor labels: Attacker, Victim Browser, Legitimate App, and Target API.

### 3. 💥 Real-World Exploit Walkthrough
- Realistic vulnerable code snippet (React / Node.js).
- Attacker payload / step-by-step execution.
- Browser behavior breakdown (cookie handling, DOM rendering, or CORS headers).

### 4. 🛡️ Resolution & Defense-in-Depth
- Complete hardened code implementation.
- Configuration blueprints (e.g., Helmet headers, CSP policies, SameSite cookie settings).
- Best practices and antipatterns to avoid.

### 5. 🧪 Hands-On Verification & Lab
- How to test locally (DevTools inspection or curl command).
- Automated test snippet (Jest / Vitest or supertest).

### 6. 📋 Code Review Checklist
- Quick bulleted audit checklist for pull requests.

### 7. 🎥 Curated Video Walkthroughs & Primary References
- High-impact curated videos (PortSwigger, Computerphile, Hussein Nasser, OWASP, LiveOverflow).
- Primary official specifications (IETF RFCs, MDN Web Docs, W3C, OWASP Cheat Sheet Series).
- Hands-on interactive lab exercises (PortSwigger Web Security Academy lab links).
