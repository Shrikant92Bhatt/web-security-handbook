# Data and Database Security

Protect confidentiality, integrity, availability, and privacy throughout data collection, processing, storage, export, logging, backup, and deletion.

## Controls
- Classify data and minimize collection and retention.
- Use TLS in transit and appropriate encryption at rest; manage keys separately from encrypted data.
- Give application/database identities least privilege and separate read/write/admin roles where practical.
- Use parameterized queries, transactions, constraints, and safe migration practices.
- Redact tokens, passwords, session IDs, and unnecessary personal data from logs.
- Test backup restoration and define retention/deletion requirements.
- Restrict exports and audit high-impact access.

## Data lifecycle
```mermaid
flowchart LR
 C[Collect minimum] --> P[Process with access checks]
 P --> S[Store with protection]
 S --> U[Use and audit]
 U --> R[Retain only as needed]
 R --> D[Delete or anonymize]
```

References: [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [OWASP Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
