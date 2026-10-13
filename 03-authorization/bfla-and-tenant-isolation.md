# 🏢 BFLA & Multi-Tenant Database Isolation

> Defeating Broken Function Level Authorization (BFLA), vertical privilege escalation, and architecting ironclad multi-tenant data boundaries.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
In enterprise SaaS applications, customer organizations (tenants) share underlying cloud infrastructure. Two related vulnerabilities represent the highest systemic risks to multi-tenant environments:
1. **Broken Function Level Authorization (BFLA / OWASP API #5):** A regular user accesses administrative functions simply by guessing or inspecting hidden endpoints (e.g. `POST /api/admin/export-all-users` or flipping HTTP verbs from `GET` to `DELETE`).
2. **Cross-Tenant Data Bleed:** A flaw in database querying or background worker queues leaks Organization A's proprietary customer data into Organization B's dashboard.

Frontend route guards (`<ProtectedRoute role="admin">`) only protect the browser DOM rendering; they offer **zero security** against an attacker interacting directly with your API gateway.

### 🧠 The Fun Analogy: The "Commercial Skyscraper Floors"
- **BFLA (Elevator Keycard Flaw):** You work in an office on the 4th floor. You step into the building elevator. The elevator button panel has a taped cardboard sign over the 50th floor (Executive Penthouse) that says *"Admins Only"*. You peel off the cardboard tape, press the button, and the elevator takes you straight to the CEO's office because the elevator motor never verified your keycard!
- **Multi-Tenant Isolation:**
  - **Shared DB + Row Scoping (PostgreSQL RLS):** An apartment complex with private locked mailboxes in the lobby. The mail carrier can only slide mail into the slot matching your key.
  - **Schema per Tenant:** Each organization rents an entire floor with its own private corridor.
  - **Database per Tenant:** Each organization has its own freestanding bank vault building with separate physical power lines.

### Multi-Tenant Database Architecture Models

| Strategy | Isolation Level | Cost & Ops Overhead | Blast Radius of Query Bug | Best Suited For |
|---|---|---|---|---|
| **Shared DB + Shared Schema (`tenant_id`)** | ⚠️ Logical (App/RLS) | 🟢 Lowest (Cost-effective) | 💥 High (Data bleed risk) | Early/Growth SaaS, B2C |
| **Shared DB + Schema-per-Tenant** | 🟡 Logical (Schema boundary)| 🟡 Medium (Migration overhead)| 🟡 Medium | Mid-market B2B SaaS |
| **Database-per-Tenant** | 🟢 Physical (Separate DB) | 🔴 High (Infrastructure cost) | 🟢 Lowest (Strict isolation) | FinTech, Healthcare, GovCloud |

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🦹 Member of Org B
    participant Gateway as 🚪 API Gateway
    participant Endpoint as ⚙️ Administrative Handler
    participant PostgresRLS as 🗄️ PostgreSQL (Row-Level Security)

    Attacker->>Gateway: POST /api/admin/users/invite {email: "evil@hacker.com", role: "superadmin"}
    Gateway->>Gateway: Validates JWT: { userId: "u88", orgId: "org_B", role: "member" }

    rect rgb(255, 230, 230)
    Note over Gateway,Endpoint: Defense Check 1: BFLA Verification
    Gateway->>Endpoint: Route: /api/admin/* requires 'admin' permission
    Endpoint->>Endpoint: Check: role "member" !== "admin"
    Endpoint--xGateway: 403 Forbidden: Insufficient administrative privileges
    Gateway--xAttacker: Request blocked at Function Gateway!
    end

    Note over Gateway,PostgresRLS: Defense Check 2: PostgreSQL Row-Level Security (RLS)
    Note right of PostgresRLS: Even if code has a bug omitting WHERE tenant_id,<br/>Postgres enforces: SET LOCAL app.current_tenant = 'org_B';<br/>DB automatically filters all SELECT/UPDATE queries!
```

> 💡 **Visual Inspection Tip:** In Chrome DevTools, inspect your frontend source maps or bundle using the **Sources** tab. Search for strings like `/admin/`, `/v1/internal/`, or `role === 'admin'`. Test accessing these discovered endpoints using a non-admin account token to verify whether the backend enforces Function-Level Authorization.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The Hidden Admin Endpoint (BFLA)
A team built an administrative endpoint to export user lists. They hid the navigation link in the React sidebar for non-admins, but forgot to attach authorization middleware to the Express route.

#### ❌ Vulnerable Route Handler (Node.js / Express)
```typescript
// vulnerable-admin-api.ts
import express from 'express';

const app = express();

// Authenticated middleware (only checks if user is logged in!)
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'Auth required' });
  req.user = { id: 'u123', role: 'member', tenantId: 'org_acme' };
  next();
};

app.use(requireAuth);

// ⚠️ CATASTROPHIC FLAW (BFLA / OWASP API #5):
// The developer assumed only admins would know about this URL because the button
// is hidden in the React UI!
app.post('/api/admin/tenants/:tenantId/delete', async (req, res) => {
  // Missing: if (req.user.role !== 'superadmin') check!
  console.log(`Deleted tenant ${req.params.tenantId} by ${req.user.id}`);
  res.json({ status: 'Tenant destroyed' });
});
```

#### 💥 The Exploit Payload
A normal non-privileged member sends this command via `curl`:
```bash
curl -X POST https://saas-company.com/api/admin/tenants/org_victim/delete \
  -H "Authorization: Bearer regular_member_jwt"
```
The tenant is deleted because the backend never verified the caller's administrative function privilege!

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Layer 1: Strict Function-Level Permission Middleware
```typescript
// hardened-bfla-api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();

// 🛡️ Explicit Permission Guard Factory
export const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.permissions?.includes(requiredPermission)) {
      return res.status(403).json({ error: `Forbidden: Missing required permission '${requiredPermission}'` });
    }
    next();
  };
};

// Protected administrative route requiring explicit permission
app.post(
  '/api/admin/tenants/:tenantId/delete',
  requirePermission('tenant:delete'), // 🛡️ Function-Level Authorization Gate
  async (req: Request, res: Response) => {
    res.json({ status: 'Tenant successfully deleted' });
  }
);
```

### Layer 2: PostgreSQL Row-Level Security (RLS) for Ironclad Tenant Isolation
Even if a developer accidentally writes `SELECT * FROM users` without a `WHERE tenant_id = ?` clause, PostgreSQL's RLS engine physically restricts query results at the database kernel level:

```sql
-- 1. Enable RLS on the table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Create the tenant boundary policy
CREATE POLICY tenant_isolation_policy ON users
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- 3. In your database connection middleware, set the tenant context per transaction:
-- SET LOCAL app.current_tenant = 'org_acme_uuid';
```

---

## 5. 🧪 Hands-On Verification & Lab

### Automated BFLA Regression Test (Supertest)
```typescript
// bfla.test.ts
import request from 'supertest';
import app from './hardened-bfla-api';

describe('Function-Level Authorization Suite', () => {
  it('strictly blocks regular members from administrative mutation endpoints', async () => {
    const res = await request(app)
      .post('/api/admin/tenants/org_123/delete')
      .set('Authorization', 'Bearer token_member_without_admin_perm');

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Missing required permission');
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **No UI-Only Security:** Are all administrative, export, and destructive actions protected by server-side permission checks?
- [ ] **HTTP Verb Parity:** Does authorization apply consistently across all HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`)?
- [ ] **Row-Level Security (RLS):** Is database-level RLS or query middleware active to prevent cross-tenant data bleed?
- [ ] **Tenant Scoping in Background Workers:** Do Redis message queues and Bull/Kafka consumers validate tenant context before processing jobs?
- [ ] **Superadmin Logging:** Are all high-privilege administrative actions recorded in tamper-evident audit logs?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [Broken Function Level Authorization (BFLA) Deep Dive (API Security)](https://www.youtube.com/watch?v=kY31Wn6Vw6I) — Real-world exploits targeting hidden endpoints, HTTP method confusion, and administrative routing flaws.
- 🎥 [Multi-Tenant Database Architecture & PostgreSQL Row Level Security (Hussein Nasser)](https://www.youtube.com/watch?v=F0_k239Xw4U) — Step-by-step implementation of multi-tenant isolation, shared schemas, and kernel-level RLS policies.
- 🎥 [OWASP API Security Top 10: API5 Broken Function Level Authorization (Tanya Janca)](https://www.youtube.com/watch?v=1FfLg3x_l4k) — Pragmatic defensive engineering guide for securing internal and administrative APIs.

### 📖 Primary Documentation & Specifications
- 📜 [OWASP API Security Top 10: API5:2023 Broken Function Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/) — Official threat catalog, attack scenarios, and remediation blueprints.
- 📜 [PostgreSQL Documentation: Row Level Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) — Authoritative guide for declarative tenant scoping at the database layer.
- 📜 [AWS Well-Architected Framework: SaaS Lens Multi-Tenant Data Isolation](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/multi-tenant-data-isolation.html) — Enterprise cloud tenant isolation design patterns.

### 🧪 Interactive Hands-On Training Labs
- 🎯 [PortSwigger Lab: Unprotected admin functionality with unpredictable URL](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality-with-unpredictable-url) — Discover and abuse hidden administrative functions leaking in frontend scripts.
- 🎯 [OWASP crAPI (completely ridiculous API) Project](https://github.com/OWASP/crAPI) — Realistic microservices sandbox designed specifically to practice finding BFLA and multi-tenant authorization bypasses.

