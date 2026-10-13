# Glossary

- **Authentication:** verifying who or what an actor is.
- **Authorization:** deciding what an authenticated or anonymous actor may do.
- **BOLA / IDOR:** broken object-level authorization; an actor can access or modify an object they should not control.
- **CORS:** browser mechanism controlling whether scripts can read cross-origin responses; it is not server-side authorization.
- **CSP:** Content Security Policy, a browser-enforced policy that can reduce impact of certain injection attacks.
- **CSRF:** tricking a browser into sending an unwanted authenticated request.
- **Defense in depth:** multiple complementary controls so one failure does not cause total compromise.
- **Least privilege:** grant only the minimum permissions needed.
- **OAuth 2.0:** authorization framework for delegated access.
- **OIDC:** identity layer built on OAuth 2.0.
- **Origin:** scheme, host, and port tuple used by the browser security model.
- **SAST:** static application security testing.
- **DAST:** dynamic application security testing against a running application.
- **SCA:** software composition analysis for third-party components.
- **SSRF:** server-side request forgery; abuse of a server's ability to make network requests.
- **XSS:** cross-site scripting; attacker-controlled script execution in a trusted origin context.
- **Trust boundary:** point where data or control crosses between components with different trust levels.
