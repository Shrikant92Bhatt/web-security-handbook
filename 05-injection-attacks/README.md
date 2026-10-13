# 💉 Injection Attacks Architecture & Prevention

> The master guide to neutralizing interpreter manipulation: SQL/NoSQL Injection, Stored/Reflected/DOM XSS, Server-Side Request Forgery (SSRF), and OS Command Injection.

---

## 📚 Handbook Navigation & Sub-Modules

Dive into dedicated deep-dive guides for each major injection vector:

- 👾 [**Cross-Site Scripting (XSS) Deep-Dive**](xss-deep-dive.md) — Stored, Reflected, and DOM-based XSS, React `dangerouslySetInnerHTML`, `javascript:` protocol exploits, SVG vectors, and DOMPurify sanitization.
- 🗄️ [**SQL Injection & ORM Leaks**](sqli-and-orm-leaks.md) — Classic SQLi, Blind/Time-based SQLi, ORM injection vectors (Prisma, TypeORM raw queries), and parameterized prepared statements.
- 🌐 [**Server-Side Request Forgery (SSRF)**](ssrf-deep-dive.md) — AWS/GCP cloud metadata extraction (`169.254.169.254`), internal network scanning, DNS rebinding attacks, and egress network isolation.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
Injection vulnerabilities represent the most historically damaging class of flaws in computing. Injection occurs whenever **untrusted data is allowed to cross into an interpreter (SQL engine, shell, browser DOM parser, or template engine) without clear syntactic separation between code and data**.

When an interpreter confuses user data for executable instructions, the application surrenders control. An attacker can extract complete database dumps, execute arbitrary shell code on the server host, compromise internal cloud infrastructure via SSRF, or execute client-side scripts inside victim browsers.

### 🧠 The Fun Analogy: The "Restaurant Order Note"
Imagine you are dining at a diner. The waiter writes your order on an index card and slips it through a small window to the cook:
- **Normal Data:** The waiter writes: `"Order: Cheeseburger"`. The cook reads it and flips a burger.
- **Injection Attack (Data Confused for Syntax):** The customer's name is: `"; DROP COOK; HIRE NEW COOK; --"`. If the waiter writes: `"Order: Cheeseburger for ; DROP COOK; HIRE NEW COOK; --"`, and the cook executes whatever words are written on the card as commands, the diner collapses!
- **Parameterization (The Fixed Form):** The index card has separated plastic pre-printed boxes: `[ITEM BOX]`, `[QUANTITY BOX]`, `[CUSTOMER NAME BOX]`. The cook's eyes only read the `[ITEM BOX]` for cooking commands. Whatever is written in the `[CUSTOMER NAME BOX]` is treated strictly as inert ink text, no matter what punctuation marks it contains.

### Severity & Impact
- **OWASP Category:** [A03:2021 – Injection](https://owasp.org/Top10/A03_2021-Injection/), [API7:2023 – Server-Side Request Forgery](https://owasp.org/API-Security/editions/2023/en/0xa7-server-side-request-forgery/)
- **Common Weakness Enumeration (CWE):**
  - **CWE-89:** SQL Injection
  - **CWE-79:** Cross-Site Scripting (XSS)
  - **CWE-78:** OS Command Injection
  - **CWE-918:** Server-Side Request Forgery (SSRF)
  - **CWE-1336:** Server-Side Template Injection (SSTI)
- **Blast Radius:** Total database compromise, cloud credential theft (IAM role harvesting), remote code execution (RCE), persistent malware distribution.

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🦹 Attacker
    participant Gateway as 🚪 API Gateway
    participant Backend as ⚙️ Node.js App Server
    participant SQLDB as 🗄️ Relational Database
    participant CloudMetadata as ☁️ AWS Metadata Service (169.254.169.254)

    Note over Attacker,SQLDB: Attack Vector 1: SQL Injection
    Attacker->>Backend: POST /api/users/search {query: "admin' OR '1'='1"}
    
    alt Insecure String Concatenation 💥
        Backend->>SQLDB: SELECT * FROM users WHERE name = 'admin' OR '1'='1';
        SQLDB-->>Backend: Returns ALL user records & password hashes!
    else Parameterized Query (Prepared Statement) 🛡️
        Backend->>SQLDB: PREPARE stmt AS SELECT * FROM users WHERE name = $1; EXECUTE stmt('admin\' OR \'1\'=\'1');
        SQLDB-->>Backend: Returns 0 rows (Interpreted strictly as literal text string!)
    end

    Note over Attacker,CloudMetadata: Attack Vector 2: SSRF Cloud Token Theft
    Attacker->>Backend: POST /api/avatar/fetch-url {url: "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}
    Backend->>Backend: 🔍 Egress IP Validation: Resolves to Link-Local Private IP!
    Backend--xAttacker: 403 Forbidden: Destination IP 169.254.169.254 is restricted!
```

> 💡 **Visual Inspection Tip:** In Chrome DevTools, test input fields with canary strings like `'"><img src=x onerror=console.log(1)>` or `' OR 1=1 --`. Inspect the **Elements** tab to see whether the characters are safely HTML entity-encoded (`&quot;&gt;&lt;img...`) or rendered as active executable DOM nodes.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The Classic SQL Injection in Search
A team implemented an internal customer support search bar using Node.js and PostgreSQL. The developer concatenated user strings directly into the SQL query string.

#### ❌ Vulnerable Route Implementation (Node.js / Express / pg)
```typescript
// vulnerable-sqli.ts
import express from 'express';
import { Pool } from 'pg';

const app = express();
const db = new Pool();
app.use(express.json());

// ⚠️ CATASTROPHIC FLAW (SQL Injection - CWE-89):
// Raw string template literal concatenation allows syntax alteration!
app.post('/api/support/search-user', async (req, res) => {
  const { email } = req.body;

  const rawQuery = `SELECT id, email, full_name, role FROM users WHERE email = '${email}'`;
  console.log('[EXECUTING QUERY]:', rawQuery);

  const result = await db.query(rawQuery);
  res.json(result.rows);
});
```

#### 💥 The Attacker's Exploit Payload
The attacker sends:
```json
{
  "email": "victim@company.com' UNION SELECT id, password_hash, token, 'admin' FROM admin_secrets --"
}
```
The resulting SQL executed by PostgreSQL becomes:
```sql
SELECT id, email, full_name, role FROM users WHERE email = 'victim@company.com' 
UNION 
SELECT id, password_hash, token, 'admin' FROM admin_secrets --'
```
PostgreSQL executes both queries, appending the entire table of administrative password hashes and tokens to the response JSON!

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Hardened Parameterized Queries (Node.js / Express + TypeScript)
```typescript
// hardened-sqli.ts - BULLETPROOF PARAMETERIZED QUERIES
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { z } from 'zod';

const app = express();
const db = new Pool();
app.use(express.json());

const SearchInputSchema = z.object({
  email: z.string().email().max(100),
});

app.post('/api/support/search-user', async (req: Request, res: Response) => {
  // 🛡️ 1. Input Validation
  const validation = SearchInputSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const { email } = validation.data;

  // 🛡️ 2. Parameterized Prepared Statement:
  // The PostgreSQL driver compiles the SQL structure FIRST, then passes $1 as pure inert data!
  const result = await db.query(
    'SELECT id, email, full_name, role FROM users WHERE email = $1 LIMIT 1',
    [email] // Data is physically separated from query AST
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});

export default app;
```

---

## 5. 🧪 Hands-On Verification & Lab

### Automated SQL Injection Regression Test (Supertest)
```typescript
// sqli.test.ts
import request from 'supertest';
import app from './hardened-sqli';

describe('SQL Injection Prevention Suite', () => {
  it('treats SQL injection payload as inert string literal and returns 400 or 404', async () => {
    const maliciousPayload = { email: "admin' OR '1'='1' --" };

    const res = await request(app)
      .post('/api/support/search-user')
      .send(maliciousPayload);

    // Email validation will reject format, or DB will search for literal string "admin' OR..."
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.password_hash).toBeUndefined();
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **No String Concatenation in SQL:** Are template strings (`` `${input}` ``) and string concatenation (`+ input`) completely banned from SQL queries?
- [ ] **Parameterized Statements Used:** Does every database interaction use parameterized placeholders (`$1`, `?`)?
- [ ] **Context-Aware HTML Escaping:** Are frontend sinks using safe text APIs rather than `dangerouslySetInnerHTML`?
- [ ] **Strict Egress Validation (SSRF):** Do outbound webhooks and image fetchers validate resolved IP addresses against private/loopback/cloud-metadata ranges?
- [ ] **No Shell Invocations:** Is `child_process.exec()` avoided in favor of `execFile()` with fixed argument arrays?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [SQL Injection Explained (Computerphile)](https://www.youtube.com/watch?v=ciNHn38EyRc) — Classic, intuitive breakdown of breaking SQL parsers and logic inversion.
- 🎥 [Cross-Site Scripting (XSS) in 100 Seconds (Fireship)](https://www.youtube.com/watch?v=EoaDgUgS6QA) — Fast-paced visualization of reflected, stored, and DOM-based injection paths.
- 🎥 [Server-Side Request Forgery (SSRF) Architecture & Attacks (Hussein Nasser)](https://www.youtube.com/watch?v=F_YwK1N3jZ8) — Deep networking analysis of DNS resolution, egress gateways, and metadata exfiltration.

### 📖 Primary Documentation & Specifications
- 📜 [OWASP Top 10: A03:2021 – Injection](https://owasp.org/Top10/A03_2021-Injection/) — Comprehensive threat analysis of code, command, and data injection flaws.
- 📜 [OWASP Cheat Sheet: SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) — Query parameterization guidelines across major runtimes.
- 📜 [CWE-89: Improper Neutralization of Special Elements used in an SQL Command](https://cwe.mitre.org/data/definitions/89.html) — Definitive weakness classification and mitigation catalogue.

### 🧪 Interactive Hands-On Training Labs
- 🎯 [PortSwigger Lab: SQL injection vulnerability allowing retrieval of hidden data](https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data) — Practice manipulating SQL query conditions to bypass product release filters.
- 🎯 [PortSwigger Lab: Reflected XSS into HTML context](https://portswigger.net/web-security/cross-site-scripting/reflected/lab-html-context-nothing-encoded) — Inject arbitrary scripts into unencoded reflections.
- 🎯 [PortSwigger Lab: Basic SSRF against the local server](https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-localhost) — Bypass boundary firewalls by targeting 127.0.0.1 admin consoles.

