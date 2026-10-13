# 🔑 Authentication and Session Management Architecture

> The master engineering blueprint for identity verification, session lifecycles, and credential protection across distributed web applications.

---

## 📚 Handbook Navigation & Sub-Modules

Explore in-depth implementation guides for each authentication pillar:

- 🪪 [**All Authentication Types Compared**](all-auth-types.md) — Exhaustive analysis of Session-based cookies, Stateless JWT, PASETO, OAuth 2.0 / OIDC with PKCE, WebAuthn & Passkeys, Enterprise SSO/SAML 2.0, MFA/TOTP, and mTLS.
- 🪙 [**JWT Architecture & Vulnerabilities**](jwt-security.md) — Critical JWT attack vectors (`alg: none`, HMAC vs. RSA key confusion, signature stripping, secret brute-forcing) and short-lived token rotation.
- 🤝 [**OAuth 2.0 & OIDC with PKCE**](oauth2-oidc-pkce.md) — End-to-end authorization code grant with PKCE (`code_verifier`, `code_challenge`), state/nonce CSRF prevention, and token exchange.
- ⏳ [**Session Management & Fixation Defense**](session-management-and-fixation.md) — Session fixation exploits, session hijacking, rolling absolute/idle timeouts, multi-device logout, and concurrent login bounds.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
Authentication (AuthN) answers the question: **"Who are you?"** It is the cryptographic gateway to your entire system. A flaw in authentication does not merely expose a single user record; it grants an adversary total impersonation capability, allowing them to assume the identity of administrators, bypass business logic, and manipulate financial ledgers.

Modern applications must govern the entire **identity lifecycle**: registration, multi-factor verification, session issuance, cryptographic token refresh, revocation, anomaly detection, and termination.

### 🧠 The Fun Analogy: The "High-Security Hotel Check-In"
- **Credentials (Username & Password / Passkey):** Your government passport presented to the front desk concierge.
- **Session ID (`HttpOnly` Cookie):** An RFID-encoded plastic room keycard. The hotel database knows that keycard `#789` belongs to Room 402. When you tap the door reader (HTTP request), the lock queries the central hotel mainframe (Redis session store). If you check out, the concierge deactivates `#789` instantly.
- **JSON Web Token (JWT):** A laminated, self-contained backstage festival pass stamped with an indelible holographic signature. The stage bouncer does not need to call the central office—they simply verify the hologram stamp with their magnifying glass. But if someone steals your pass, they can walk backstage until the timestamp on the badge expires, unless a centralized revocation list is consulted!
- **OAuth 2.0 / PKCE:** A valet key. You do not give the parking attendant your entire keyring (your master password); you hand them a special limited-access key that only operates the engine and driver door for 30 minutes.

### Severity & Impact
- **OWASP Category:** [A07:2021 – Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
- **Common Weakness Enumeration (CWE):**
  - **CWE-287:** Improper Authentication
  - **CWE-384:** Session Fixation
  - **CWE-613:** Insufficient Session Expiration
  - **CWE-352:** Cross-Site Request Forgery (Session-related)
- **Blast Radius:** Complete account takeover, lateral tenant movement, data tampering, regulatory compliance violations.

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Legitimate User
    actor Attacker as 🦹 Attacker
    participant Browser as 🌐 Victim Browser
    participant Gateway as 🚪 API Gateway / BFF
    participant AuthService as 🔑 Identity & Auth Service
    participant SessionStore as ⚡ Redis Session Cache

    Note over User,AuthService: 1. Multi-Tier Secure Authentication
    User->>Browser: Enters credentials + TOTP
    Browser->>Gateway: POST /api/v1/auth/login {email, password, totp}
    Gateway->>AuthService: Verify Argon2id hash & TOTP token
    AuthService->>SessionStore: SET session:sid_8819 {userId: "u123", role: "admin", ip, userAgent} EX 86400
    AuthService-->>Gateway: Session Created
    Gateway-->>Browser: Set-Cookie: __Host-sid=sid_8819; Secure; HttpOnly; SameSite=Strict; Path=/
    
    Note over Attacker,Gateway: Attack Vector: Session Hijack & Fixation Attempt
    Attacker->>Browser: Attempts to pre-set sid cookie via XSS or Subdomain Tossing
    Browser->>Gateway: POST /api/v1/auth/login (with Attacker's preset cookie)
    Gateway->>AuthService: 🛡️ SESSION REGENERATION TRIGGERED
    AuthService->>SessionStore: Destroy old session & generate new cryptographically random sid_9942
    Gateway-->>Browser: Overwrites cookie with __Host-sid=sid_9942
    Note over Attacker: ❌ Attacker's pre-set cookie is invalidated! Fixation defeated.
```

> 💡 **Visual Inspection Tip:** In Chrome DevTools, open the **Application** tab, click **Cookies** under *Storage*, and select your application domain. Verify that the session cookie includes the `__Host-` prefix, has a checkmark under `HttpOnly` and `Secure`, and shows `SameSite=Strict` or `SameSite=Lax`. In the **Network** tab, inspect login responses to confirm that `Set-Cookie` rotates the token ID immediately after authentication.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The Vulnerable JWT Custom Implementation
Developers built an Express backend that accepts JSON Web Tokens. They used an unverified, hand-rolled JWT decoder and allowed the client to dictate the cryptographic algorithm.

#### ❌ Vulnerable Authentication Middleware (Node.js / Express)
```typescript
// vulnerable-auth.ts - DANGEROUS HAND-ROLLED JWT VERIFICATION
import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// ⚠️ CATASTROPHIC FLAW 1: Allowing 'none' algorithm or trusting token header blindly!
app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

    // ⚠️ FLAW 2: If attacker specifies alg: "none", signature check is bypassed!
    if (header.alg === 'none') {
      (req as any).user = payload;
      return next();
    }

    // Naive verification without constant-time comparison or expiration validation
    // ...
    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Malformed token' });
  }
});

app.get('/api/admin/system-logs', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user?.role === 'admin') {
    return res.json({ logs: ['Confidential DB dump', 'Internal IP: 10.0.0.15'] });
  }
  res.status(403).json({ error: 'Forbidden' });
});

app.listen(4001);
```

#### 💥 The Attacker's Exploit Payload
The attacker crafts an unverified token with `alg: "none"`:
```python
import base64
import json
import requests

# 1. Header specifying 'none' algorithm
header = {"alg": "none", "typ": "JWT"}
# 2. Payload elevating privileges to 'admin'
payload = {"sub": "attacker_id", "email": "hacker@evil.com", "role": "admin"}

b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
b64_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")

# Trailing dot with EMPTY signature!
forged_jwt = f"{b64_header}.{b64_payload}."

res = requests.get(
    "http://localhost:4001/api/admin/system-logs",
    headers={"Authorization": f"Bearer {forged_jwt}"}
)
print("Exploit status:", res.status_code)
print("Stolen Logs:", res.json())
```

### Execution Breakdown
1. The attacker inspects standard JWT structures and notes that JWT spec RFC 7519 originally allowed `alg: "none"` for unsecured tokens.
2. The attacker constructs a token asserting `role: "admin"` and sets `alg: "none"`.
3. The custom backend middleware inspects the header, notices `alg === 'none'`, and bypasses all cryptographic signature checks.
4. The attacker gains unrestricted superadmin access with zero credentials.

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Hardened Production Authentication Architecture (Node.js / Express + TypeScript)
```typescript
// hardened-auth.ts - PRODUCTION-READY AUTHENTICATION ENGINE
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Secrets loaded strictly from environment or secret manager (e.g. AWS Secrets Manager / Vault)
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!; // Asymmetric RS256 public key
const JWT_ISSUER = 'https://auth.company.com';
const JWT_AUDIENCE = 'https://api.company.com';

interface TokenPayload {
  sub: string;
  role: 'user' | 'admin';
  iss: string;
  aud: string;
  exp: number;
}

// 🛡️ 1. Strict Asymmetric Token Verification Middleware
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 🛡️ Explicitly enforce RS256: Prevents algorithm confusion (HS256 vs RS256) and 'none' alg
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      clockTolerance: 10, // 10 seconds leeway for clock skew
    }) as TokenPayload;

    (req as any).user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid or forged token' });
  }
};

// 🛡️ 2. Session Regeneration on Login to Defeat Session Fixation
app.post('/api/auth/login', async (req: Request, res: Response) => {
  // Validate credentials ...
  
  // Issue random session ID
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Set hardened cookie with __Host- prefix
  res.cookie('__Host-session_id', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 3600 * 1000, // 1 hour
  });

  res.json({ message: 'Authentication successful' });
});

app.get('/api/admin/system-logs', authenticateJWT, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  res.json({ status: 'success', data: ['Log entry 1', 'Log entry 2'] });
});

export default app;
```

---

## 5. 🧪 Hands-On Verification & Lab

### Terminal Verification via `curl`
```bash
# 1. Test algorithm confusion / 'none' attack rejection
FORGED_TOKEN="eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTYiLCJyb2xlIjoiYWRtaW4ifQ."
curl -i -X GET http://localhost:4001/api/admin/system-logs \
  -H "Authorization: Bearer $FORGED_TOKEN"

# Expected: HTTP 403 Forbidden ("Invalid or forged token")

# 2. Test missing Authorization header
curl -i -X GET http://localhost:4001/api/admin/system-logs

# Expected: HTTP 401 Unauthorized
```

### Automated Integration Test (Vitest / Supertest)
```typescript
// auth.test.ts
import request from 'supertest';
import app from './hardened-auth';

describe('Authentication Engine Suite', () => {
  it('strictly rejects tokens with alg: none', async () => {
    const forgedToken = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.";
    const res = await request(app)
      .get('/api/admin/system-logs')
      .set('Authorization', `Bearer ${forgedToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Invalid or forged token');
  });

  it('rotates session cookies using __Host- prefix on login', async () => {
    const res = await request(app).post('/api/auth/login');
    const cookies = res.headers['set-cookie'][0];
    
    expect(cookies).toContain('__Host-session_id=');
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('SameSite=Strict');
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **Algorithm Whitelisting:** Are JWT libraries explicitly pinned to a single trusted algorithm (`algorithms: ['RS256']`) rather than trusting the header?
- [ ] **Audience & Issuer Validation:** Are `iss` and `aud` claims validated on every token inspection?
- [ ] **Asymmetric Cryptography:** Are public/private key pairs used across distributed microservices instead of sharing shared symmetric HMAC secrets?
- [ ] **Session ID Regeneration:** Does every successful authentication regenerate the session identifier to neutralize session fixation?
- [ ] **Short Expirations:** Are access tokens configured with short lifetimes (5–15 minutes) paired with secure refresh token rotation?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [Authentication vs Authorization in System Design (ByteByteGo)](https://www.youtube.com/watch?v=1r_A_B_k3l4) — Clear mental model comparing stateful session stores vs stateless token architectures.
- 🎥 [JWT Authentication: How It Works & Why It Breaks (Hussein Nasser)](https://www.youtube.com/watch?v=7Q17ubqLfaM) — Network and server architectural analysis of cryptographic signing, claims, and revocation.
- 🎥 [Session Fixation & Hijacking Attacks Explained (Computerphile)](https://www.youtube.com/watch?v=T1QEs32Rezk) — Step-by-step breakdown of how session identifiers are captured and abused.

### 📖 Primary Documentation & Specifications
- 📜 [IETF RFC 7519: JSON Web Token (JWT) Specification](https://datatracker.ietf.org/doc/html/rfc7519) — Authoritative specification for token claims, headers, and validation rules.
- 📜 [OWASP Cheat Sheet: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) — Gold standard guidelines for session regeneration, timeouts, and storage.
- 📜 [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html) — Enterprise identity, authenticator assurance levels, and credential handling standards.

### 🧪 Interactive Hands-On Training Labs
- 🎯 [PortSwigger Lab: JWT authentication bypass via unverified signature](https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-unverified-signature) — Exploit systems that decode tokens without verifying cryptographic integrity.
- 🎯 [PortSwigger Lab: JWT authentication bypass via flawed signature verification](https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-flawed-signature-verification) — Forge administrative privileges exploiting missing algorithm constraints.

