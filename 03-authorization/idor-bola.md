# 🎯 Broken Object Level Authorization (BOLA / IDOR) Deep-Dive

> Defeating the #1 API security vulnerability: Insecure Direct Object References, database row scoping, and preventing cross-tenant data leaks.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
In the OWASP API Security Top 10, **Broken Object Level Authorization (BOLA)**—traditionally known as **Insecure Direct Object Reference (IDOR)**—occupies the undisputed **#1 ranking**. 

BOLA occurs whenever an API endpoint accepts an identifier (such as `/api/v1/documents/:id` or `POST /api/v1/invoices { invoiceId: "42" }`) and accesses the underlying data without verifying that the authenticated user has explicit permission to interact with that exact object. Because modern frontend single-page apps rely heavily on REST and GraphQL APIs that expose raw object IDs, BOLA is present in over 60% of commercial API assessments.

### 🧠 The Fun Analogy: The "Locker Room Key Master"
Imagine a gym where every member gets a key. Each locker has an engraved number (`1`, `2`, `3`...).
- **Vulnerable System (BOLA):** The locker key is a standard generic skeleton key. You rent Locker #5, but you realize your key can open Locker #6, Locker #7, and Locker #8 simply by walking over and inserting it. The gym management never bothered to install individual lock codes tailored to each user.
- **Hardened System (Row-Level Authorization):** When you insert your key into Locker #6, the electronic lock queries the gym database: *"Does the human holding Key #5 currently have a registered rental agreement for Locker #6?"* If no, the lock immediately locks down and rings the security alarm.

### Severity & Impact
- **OWASP Category:** [API1:2023 – Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- **Common Weakness Enumeration (CWE):** [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html)
- **Blast Radius:** Mass customer PII exfiltration, unauthorized modification of records, account takeover via password reset token references.

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🦹 Attacker (User ID: 999)
    actor Victim as 👤 Legitimate User (User ID: 101)
    participant Client as 🌐 React Client
    participant API as ⚡ Express API Endpoint
    participant DB as 🗄️ PostgreSQL Database

    Note over Victim,DB: Legitimate Flow
    Victim->>API: GET /api/v1/contracts/cnt_101
    API->>DB: SELECT * FROM contracts WHERE id = 'cnt_101' AND org_id = 'org_victim';
    DB-->>API: Returns contract record
    API-->>Victim: 200 OK { title: "Victim NDA" }

    Note over Attacker,DB: Attack Vector: BOLA / IDOR Tampering
    Attacker->>API: GET /api/v1/contracts/cnt_101 (Bearer token belongs to Attacker!)
    
    rect rgb(255, 230, 230)
    Note over API,DB: Vulnerable Check vs Hardened Check
    alt Vulnerable API (CWE-639)
        API->>DB: SELECT * FROM contracts WHERE id = 'cnt_101';
        DB-->>API: Returns Victim NDA record!
        API-->>Attacker: 💥 200 OK: Data leaked across organizations!
    else Hardened API (Strict Row Scoping) 🛡️
        API->>DB: SELECT * FROM contracts WHERE id = 'cnt_101' AND org_id = 'org_attacker';
        DB-->>API: Returns 0 rows (Empty Result)
        API-->>Attacker: 404 Not Found (Opaque rejection prevents ID enumeration)
    end
    end
```

> 💡 **Visual Inspection Tip:** Open DevTools (`Network` tab). Inspect URLs and JSON request payloads for parameter names like `id`, `user_id`, `account_id`, `org_id`, `doc_id`, or `file_id`. Change one digit of that ID in your API client (e.g. Postman or DevTools replay). If the server returns another user's data with HTTP 200, BOLA is confirmed!

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The Medical Record API Breach
A telemedicine platform allows patients to view medical prescriptions. The developer used an ORM (Prisma) but performed the user check in memory *after* loading the record from the database, introducing a race condition and error leakage.

#### ❌ Vulnerable Route Handler (Node.js / Express / Prisma)
```typescript
// vulnerable-prescription-api.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// ⚠️ VULNERABLE ENDPOINT (BOLA / IDOR)
app.get('/api/prescriptions/:prescriptionId', async (req, res) => {
  const { prescriptionId } = req.params;
  const loggedInUserId = (req as any).user.id;

  // ⚠️ FLAW 1: Fetching object purely by ID without scoping to tenant or user!
  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId }
  });

  if (!prescription) {
    return res.status(404).json({ error: 'Not found' });
  }

  // ⚠️ FLAW 2: Incomplete or bypassable in-memory check
  // Many developers forget to check tenant boundaries or allow doctors from different clinics!
  if (prescription.patientId !== loggedInUserId && (req as any).user.role !== 'doctor') {
    // ⚠️ Leaks 403 Forbidden which confirms the record exists to the attacker!
    return res.status(403).json({ error: 'Access denied to this prescription' });
  }

  res.json(prescription);
});
```

#### 💥 The Attacker's Exploit Script
```python
import requests

# An attacker with a low-privilege patient account iterates through UUIDs / IDs
headers = {"Authorization": "Bearer patient_token"}

for target_id in ["rx_1001", "rx_1002", "rx_1003"]:
    res = requests.get(f"https://health-app.com/api/prescriptions/{target_id}", headers=headers)
    if res.status_code == 200:
        print("Harvested Confidential Medical Data:", res.json())
    elif res.status_code == 403:
        print(f"Record {target_id} exists but is restricted (ID enumerated!)")
```

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Hardened Production Route with Contextual Database Scoping
```typescript
// hardened-prescription-api.ts - BULLETPROOF OBJECT AUTHORIZATION
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.get('/api/prescriptions/:prescriptionId', async (req: Request, res: Response) => {
  const { prescriptionId } = req.params;
  const user = (req as any).user; // Authenticated context from JWT / session

  // 🛡️ 1. Enforce query scoping directly inside the SQL WHERE clause
  // The database will physically NOT return any rows that do not belong to this user/clinic!
  const prescription = await prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
      // If patient, restrict to patientId; if doctor, restrict to clinicId
      ...(user.role === 'patient' 
        ? { patientId: user.id } 
        : { clinicId: user.clinicId }),
    },
    select: {
      id: true,
      medication: true,
      dosage: true,
      issuedAt: true,
      // 🛡️ NEVER leak internal database foreign keys or sensitive tracking IDs
    }
  });

  // 🛡️ 2. Return 404 instead of 403 to prevent object enumeration
  if (!prescription) {
    return res.status(404).json({ error: 'Prescription not found' });
  }

  res.json(prescription);
});

export default app;
```

### Prevention Architecture: Direct vs. Indirect Reference Maps
If you cannot use UUIDs and must handle sensitive numerical legacy IDs, use an **Indirect Reference Map**:
- The server generates an ephemeral random token (e.g. `hashids` or cryptographically random session-scoped mapping):
  - User sees: `/api/files/download?ref=xK9mP`
  - Server translates: `session.referenceMap.get('xK9mP') -> database_id: 42`
- Even if an attacker manipulates `ref=xK9mQ`, the attacker cannot guess or reference other users' files!

---

## 5. 🧪 Hands-On Verification & Lab

### Automated BOLA Regression Test (Supertest)
```typescript
// idor-bola.test.ts
import request from 'supertest';
import app from './hardened-prescription-api';

describe('BOLA / IDOR Verification Suite', () => {
  it('returns 404 when user attempts to access another patients prescription', async () => {
    const res = await request(app)
      .get('/api/prescriptions/rx_victim_999')
      .set('Authorization', 'Bearer token_patient_attacker_111');

    // Must be 404 Not Found (Opaque denial)
    expect(res.status).toBe(404);
    expect(res.body.medication).toBeUndefined();
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **Database-Level Ownership Filtering:** Does every ORM query (`findFirst`, `where`) include `userId: currentUserId` or `tenantId: currentTenantId`?
- [ ] **No Raw Unscoped `findById()`:** Are unscoped `findUnique({ where: { id } })` calls strictly banned unless preceded by a verified authorization policy check?
- [ ] **Opaque 404 Responses:** Does unauthorized access return `404 Not Found` rather than `403 Forbidden` to prevent object existence enumeration?
- [ ] **Indirect References:** Are sequential integer IDs converted to UUIDv4, ULIDs, or session-scoped indirect tokens?
- [ ] **Mutations Checked:** Are `UPDATE` and `DELETE` queries strictly scoped by ownership so users cannot modify or delete others' objects?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [What is IDOR? Insecure Direct Object References Explained (PwnFunction)](https://www.youtube.com/watch?v=3cx9kH_jJc4) — Beautifully animated visual explainer on how object ID manipulation works.
- 🎥 [Broken Object Level Authorization (BOLA) - OWASP API #1 (Hussein Nasser)](https://www.youtube.com/watch?v=Xh0m2qZ88nI) — Deep dive into why BOLA is the most prevalent API flaw in production microservices.
- 🎥 [How to Find and Exploit IDOR Vulnerabilities (NahamSec)](https://www.youtube.com/watch?v=b_gK7L-m8m8) — Real-world bug bounty hunting patterns and authorization testing workflows.

### 📖 Primary Documentation & Specifications
- 📜 [OWASP API Security Project: API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/) — Official OWASP standard documentation.
- 📜 [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) — Enterprise patterns for data-layer access enforcement.
- 📜 [PortSwigger Web Security: Insecure Direct Object References (IDOR)](https://portswigger.net/web-security/access-control/idor) — Comprehensive theory and attack vectors.

### 🧪 Interactive Hands-On Training Labs
- 🎯 [PortSwigger Lab: Insecure direct object references](https://portswigger.net/web-security/access-control/lab-insecure-direct-object-references) — Practice extracting sensitive user chat transcripts via static ID manipulation.
- 🎯 [PortSwigger Lab: User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter) — Hands-on horizontal privilege escalation lab.
