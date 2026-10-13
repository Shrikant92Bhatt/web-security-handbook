# Prevention Checklists

Use these lists during design, pull requests, release reviews, and incident follow-up. Adapt them to the application's threat model rather than treating them as a universal guarantee.

## Pull request
- [ ] Untrusted input has explicit schema and size limits.
- [ ] Output uses context-safe encoding or safe framework APIs.
- [ ] Sensitive operations have server-side authorization tests.
- [ ] Database access uses parameterized queries.
- [ ] Errors do not expose secrets, stack traces, or sensitive records.
- [ ] Logs exclude credentials, tokens, and unnecessary personal data.
- [ ] Dependencies and secrets are scanned.

## API and identity
- [ ] Authentication lifecycle includes expiry, revocation, and logout.
- [ ] Every object/action has an authorization decision.
- [ ] Rate limits, timeouts, and pagination caps are defined.
- [ ] CORS is explicit and is not used as authorization.
- [ ] Tenant boundaries are tested for allowed and denied cases.

## Release
- [ ] HTTPS, security headers, cookie attributes, and cache policy are checked.
- [ ] Production secrets and deployment identities are least-privilege.
- [ ] Backups and rollback/recovery procedures are tested.
- [ ] Monitoring and incident contacts are defined.

## Keep the checklist effective
Turn relevant items into automated tests and code-review templates. Record accepted risks and owners. References: [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/).

undefined
