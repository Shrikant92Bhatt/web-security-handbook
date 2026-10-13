# Web Security Topic Map

Use this map to connect a symptom to likely control areas. This is a learning aid, not a substitute for threat modeling.

| Symptom / risk | Review these areas | Key controls |
|---|---|---|
| Untrusted text runs as code | [Browser/frontend](../01-browser-and-frontend/README.md), [injection](../05-injection-attacks/README.md) | Context-aware encoding, safe DOM APIs, CSP |
| Cross-site action uses a logged-in session | [Browser/frontend](../01-browser-and-frontend/README.md), [sessions](../02-authentication-and-sessions/README.md) | SameSite cookies, CSRF tokens where appropriate, Origin checks |
| User can access another user's record | [Authorization](../03-authorization/README.md), [API security](../04-api-security/README.md) | Server-side object-level authorization and tenant scoping |
| API is overwhelmed | [API security](../04-api-security/README.md), [cloud/DevSecOps](../09-cloud-infrastructure-devsecops/README.md) | Rate limits, quotas, timeouts, concurrency bounds |
| Server fetches an attacker-controlled URL | [Injection](../05-injection-attacks/README.md) | Destination allowlists, egress controls, DNS/IP validation |
| Unsafe upload or archive extraction | [File handling](../08-file-upload-and-serialization/README.md) | Type/content validation, size limits, isolated storage, safe extraction |
| Secret appears in logs or repository | [Data](../07-data-and-database/README.md), [cloud/DevSecOps](../09-cloud-infrastructure-devsecops/README.md) | Secret manager, redaction, rotation, least privilege |
| MFE assumes host authentication is enough | [Modern apps](../10-modern-apps-and-microfrontends/README.md), [authorization](../03-authorization/README.md) | API-side authorization; explicit trust boundaries |
| Need a repeatable security review | [Testing/tools](../11-security-testing-and-tools/README.md), [checklists](../12-prevention-checklists/README.md) | Threat modeling, automated tests, manual review, authorized DAST |
