# Attack playbook — authoring template

Copy this template for a new attack article. Keep one canonical article per technique; link sibling variants rather than duplicating content.

## 1. Classification

| Field | Value |
|---|---|
| Domain | Browser / identity / server / API / network / data / infrastructure / availability |
| Attack family | |
| Attack type | |
| Variants | |
| OWASP Top 10:2025 mapping | |
| OWASP API Top 10 mapping (if applicable) | |
| CWE | |
| Affected assets | |
| Trust boundary | |
| Attacker prerequisites / capability | |
| Severity context | Explain likelihood, impact and assumptions; do not assign a universal severity |

## 2. What is the attack?

Define it plainly. Explain the root cause and distinguish it from related attacks.

## 3. How it works

Describe the request/data flow and trust boundary. Add a Mermaid diagram when useful.

## 4. Safe demonstration

Use a deliberately vulnerable local-only example. Clearly label it unsafe and provide setup/reset instructions. Never include real targets, credentials or destructive payloads.

## 5. Impact and variants

Explain confidentiality, integrity and availability impact. Describe variants and link separate articles when needed.

## 6. Prevention and mitigations

| Layer | Control | Threat addressed | Limitations / trade-offs | Verification |
|---|---|---|---|---|
| Browser / frontend | | | | |
| API / backend | | | | |
| Identity / authorization | | | | |
| Database / storage | | | | |
| Network / infrastructure | | | | |
| Monitoring / response | | | | |

Only list controls relevant to this attack. Explain where enforcement must happen. Frontend validation is not a substitute for server-side enforcement.

## 7. Secure implementation

Show corrected code/configuration for relevant stacks. Explain why it works, its assumptions and what it does not solve.

## 8. Testing and verification

Include positive, negative, boundary and regression tests with expected results. Use only local or explicitly authorized environments.

## 9. Detection and incident response

Identify useful logs, metrics and alerts without logging secrets or unnecessary personal data. Explain containment and recovery where appropriate.

## 10. Developer and reviewer checklist

- [ ] Root cause, trust boundary and attacker prerequisites are documented.
- [ ] Prevention is enforced at the correct trusted layer.
- [ ] Secure defaults and least privilege are applied.
- [ ] Negative and regression tests cover the attack.
- [ ] Logs and alerts support detection without exposing secrets.
- [ ] Related attack pages and OWASP/CWE mappings are linked.

## 11. Video learning

- **YouTube:** [Specific reviewed video or targeted YouTube search]
- **Publisher / channel:**
- **Publication date:**
- **Why this video:**
- **Reviewed on:** YYYY-MM-DD

Prefer original OWASP, PortSwigger, browser-vendor, security conference or reputable educator material. A video supplements, but does not replace, primary documentation.

## 12. Primary references

Link relevant OWASP guidance, CWE entries, MDN/browser documentation, standards/RFCs and framework docs. Include versions or publication status where relevant.

## 13. Related handbook pages

- Parent attack family:
- Related attack techniques:
- Prevention checklist:
- Testing / lab:
