# 🏛️ Access Control Models: RBAC vs. ABAC vs. ReBAC vs. PBAC

> Comprehensive architectural comparison: Role-Based (RBAC), Attribute-Based (ABAC), Relationship-Based (Google Zanzibar / ReBAC), and Policy-Based (OPA) Access Control.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
As applications scale from simple MVPs to enterprise platforms with hundreds of thousands of users, managing *who can do what* becomes one of the most complex architectural bottlenecks. A naive Role-Based Access Control (RBAC) model works fine when you only have `Admin` and `User`. But what happens when:
- *"Regional Managers can edit documents only within their territory during business hours"*? (Requires **ABAC**)
- *"A user can comment on a document if they are a member of a team that has viewer rights on the parent folder"*? (Requires **ReBAC**)
- *"Enterprise compliance mandates that all permissions are decoupled into declarative code-reviewed policies"*? (Requires **PBAC / OPA**)

Selecting the wrong access control model leads to "role explosion" (having 500 distinct roles like `Admin_EU_Viewer_NightShift`), messy spaghetti code, and critical authorization bypasses.

### 🧠 The Fun Analogy: The "Government Security Clearance"
- **RBAC (Role-Based):** You wear a badge labeled *"Diplomat"*. The sign on the door says *"Diplomats allowed"*. Simple, binary, but inflexible.
- **ABAC (Attribute-Based):** The door scanner checks: *"Are you a Diplomat? AND is it before 6:00 PM? AND are you in the London Embassy? AND does the document have classification <= Secret?"* Fine-grained, contextual, multi-dimensional.
- **ReBAC (Relationship-Based / Google Zanzibar):** The door scanner checks: *"Are you Bob's supervisor, who is the manager of the team that owns the project repository?"* Evaluates a graph of relationships rather than static lists.
- **PBAC (Policy-Based / Open Policy Agent):** A dedicated centralized Supreme Court judge (OPA) sits in the cloud. Every door scanner asks the judge: *"Here is the request JSON, does the current constitution (Rego policy) permit this?"*

### Architectural Model Comparison Matrix

| Model | Evaluates Based On | Best Suited For | Scalability Bottleneck | Popular Implementation |
|---|---|---|---|---|
| **RBAC** | Static Roles (`Admin`, `Member`) | Simple SPAs, internal tools | Role explosion | CASL, NestJS guards |
| **ABAC** | Subject, Resource, Action, Context | Compliance, FinTech, Healthcare | Query evaluation complexity | Cerbos, AWS IAM policies |
| **ReBAC** | Graph Relationships (`owner_of`, `member_of`) | Collaborative tools (Google Docs, Figma) | Graph traversal depth | Google Zanzibar, SpiceDB, Oso |
| **PBAC** | Centralized Declarative Rules | Kubernetes, Cloud Microservices | Network latency to policy engine | Open Policy Agent (OPA/Rego) |

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
graph TD
    subgraph RequestContext["📥 Incoming Request Context"]
        Subject["👤 Subject: Alice (Role: Editor, Dept: Finance)"]
        Resource["📄 Resource: Q3_Budget.xlsx (Dept: Finance, Sensitivity: High)"]
        Action["⚡ Action: EDIT"]
        Environment["🕒 Environment: IP=CorpVPN, Time=14:30 EST"]
    end

    subgraph DecisionEngine["🛡️ Policy Decision Point (PDP)"]
        RBAC_Check{"1. RBAC: Is Alice an Editor?"}
        ABAC_Check{"2. ABAC: Same Dept & Corp VPN?"}
        ReBAC_Check{"3. ReBAC: Is Alice member of Finance Team?"}
    end

    subgraph Enforcement["🚪 Policy Enforcement Point (PEP)"]
        Allow["✅ 200 OK: Action Authorized"]
        Deny["❌ 403 Forbidden: Policy Violation"]
    end

    RequestContext --> DecisionEngine
    RBAC_Check -->|Yes| ABAC_Check
    ABAC_Check -->|Yes| ReBAC_Check
    ReBAC_Check -->|Yes| Allow
    RBAC_Check -->|No| Deny
    ABAC_Check -->|No| Deny
    ReBAC_Check -->|No| Deny
```

> 💡 **Visual Inspection Tip:** In distributed microservice architectures, inspect network traffic to identify whether permission decisions are made via local in-memory policy evaluations (sub-millisecond) or remote RPC calls to a centralized authorization engine (e.g., SpiceDB or OPA). Monitor request latency to ensure PDP decisions do not degrade Core Web Vitals.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The Role Explosion & Frontend-Only Guard Fallacy
An enterprise analytics tool implemented RBAC. To support custom permissions, developers created boolean flags on the user object (`canEditReports`, `canExportData`) and checked them in React components, but left the backend API with a single generic `user` role check.

#### ❌ Vulnerable Route Handler (Node.js / Express)
```typescript
// vulnerable-rbac.ts
import express from 'express';

const app = express();
app.use(express.json());

// ⚠️ CATASTROPHIC FLAW: Coarse-grained RBAC ignores attribute & resource ownership!
app.delete('/api/projects/:projectId', (req, res) => {
  const user = (req as any).user; // Decoded from JWT: { id: "u42", role: "editor" }

  // Server only checks coarse role! Any 'editor' can delete ANY project in the system!
  if (user.role !== 'editor' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Requires editor role' });
  }

  // ⚠️ Missing: Does user u42 own or belong to projectId?
  // ⚠️ Missing: Is the project currently locked for audit?
  console.log(`Deleted project ${req.params.projectId} by user ${user.id}`);
  res.json({ status: 'Project deleted' });
});
```

#### 💥 The Attacker's Exploit Script
```bash
# An editor in Company A issues a DELETE request for a project owned by Company B:
curl -X DELETE https://analytics-saas.com/api/projects/proj_company_b_999 \
  -H "Authorization: Bearer editor_token_company_a"

# Result: HTTP 200 OK! Project deleted across organizational boundaries.
```

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Hardened Attribute-Based Access Control (ABAC) Policy Engine
```typescript
// hardened-abac-engine.ts - CONTEXTUAL POLICY ENGINE
import express, { Request, Response, NextFunction } from 'express';

interface UserContext {
  id: string;
  department: string;
  clearanceLevel: number;
}

interface ResourceContext {
  id: string;
  department: string;
  classificationLevel: number;
  isLocked: boolean;
}

// 🛡️ ABAC Policy Evaluation Function
function evaluateABACPolicy(user: UserContext, resource: ResourceContext, action: string): boolean {
  // Rule 1: Locked resources cannot be modified by anyone
  if (action === 'DELETE' && resource.isLocked) {
    return false;
  }

  // Rule 2: Department match constraint
  if (user.department !== resource.department) {
    return false;
  }

  // Rule 3: Clearance must meet or exceed resource classification
  if (user.clearanceLevel < resource.classificationLevel) {
    return false;
  }

  return true;
}

const app = express();

// Hardened route with ABAC enforcement
app.delete('/api/projects/:projectId', async (req: Request, res: Response) => {
  const user: UserContext = (req as any).user;
  const { projectId } = req.params;

  // Load resource attributes from database
  const project: ResourceContext = await getProjectFromDB(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // 🛡️ Evaluate multi-dimensional policy
  const isAuthorized = evaluateABACPolicy(user, project, 'DELETE');
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Forbidden: ABAC security policy violation' });
  }

  // Execute safe deletion
  res.json({ status: 'Project successfully deleted' });
});

async function getProjectFromDB(id: string): Promise<ResourceContext> {
  // Mock DB load
  return { id, department: 'Finance', classificationLevel: 3, isLocked: false };
}

export default app;
```

---

## 5. 🧪 Hands-On Verification & Lab

### Automated ABAC Policy Unit Tests (Vitest)
```typescript
// abac-policy.test.ts
import { describe, it, expect } from 'vitest';

describe('ABAC Policy Decision Point Suite', () => {
  const evaluate = (user: any, resource: any, action: string) => {
    if (action === 'DELETE' && resource.isLocked) return false;
    if (user.department !== resource.department) return false;
    if (user.clearanceLevel < resource.classificationLevel) return false;
    return true;
  };

  it('denies access when user clearance is lower than resource classification', () => {
    const user = { department: 'Engineering', clearanceLevel: 1 };
    const resource = { department: 'Engineering', classificationLevel: 3, isLocked: false };
    expect(evaluate(user, resource, 'READ')).toBe(false);
  });

  it('denies access when resource is locked regardless of clearance', () => {
    const user = { department: 'Finance', clearanceLevel: 5 };
    const resource = { department: 'Finance', classificationLevel: 1, isLocked: true };
    expect(evaluate(user, resource, 'DELETE')).toBe(false);
  });

  it('authorizes access when all multi-dimensional attributes align', () => {
    const user = { department: 'Finance', clearanceLevel: 4 };
    const resource = { department: 'Finance', classificationLevel: 2, isLocked: false };
    expect(evaluate(user, resource, 'EDIT')).toBe(true);
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **Decoupled Authorization:** Is policy evaluation decoupled from core business logic (via middleware, PDP, or guard functions)?
- [ ] **No Hardcoded Roles in Handlers:** Are endpoints checking permissions/actions (`can('delete', 'project')`) rather than hardcoded roles (`role === 'admin'`)?
- [ ] **Context Included:** Does authorization consider context attributes (time, network, device security posture, tenant) where required?
- [ ] **Default Deny:** Does the policy engine default to `DENY` if an unknown condition or missing attribute is encountered?
- [ ] **Audit Trail:** Are authorization rejections logged with user ID, resource ID, and violated policy rule?
