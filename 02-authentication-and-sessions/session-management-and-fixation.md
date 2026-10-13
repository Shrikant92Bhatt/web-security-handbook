# ⏳ Session Management, Lifecycle & Fixation Defense

> Comprehensive architecture for session lifecycles: Defeating session fixation, concurrent device controls, and absolute vs. idle timeouts.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
A secure login form is meaningless if the session it establishes is vulnerable to lifecycle exploitation. In **Session Fixation (CWE-384)**, an attacker pre-provisions a known session identifier and tricks a victim into authenticating using that identifier. If the server does not rotate the session ID upon authentication, the attacker uses the pre-provisioned ID to assume the victim's authenticated identity.

Additionally, production systems must govern session termination: enforcing idle timeouts (e.g. 15 minutes of inactivity for banking) and absolute timeouts (e.g. 12 hours regardless of activity) to prevent abandoned public computer sessions from being exploited.

### 🧠 The Fun Analogy: The "Rigged Hotel Keycard"
- **Session Fixation:** An attacker checks into a hotel, receives keycard `#55`, leaves the keycard on the lobby table, and waits. A wealthy guest arrives, picks up keycard `#55`, and registers it at the front desk with their credit card. If the hotel front desk fails to shred `#55` and issue a brand-new card, the attacker simply uses their duplicate copy of `#55` to walk straight into the wealthy guest's penthouse suite!
- **Session Regeneration:** The moment the guest says *"I am checking in"*, the front desk throws `#55` directly into an incinerator and issues a brand-new, freshly minted keycard `#99`.

### Severity & Impact
- **OWASP Category:** [A07:2021 – Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
- **Common Weakness Enumeration (CWE):**
  - **CWE-384:** Session Fixation
  - **CWE-613:** Insufficient Session Expiration
- **Blast Radius:** Persistent identity takeover, bypass of multi-factor authentication, undetected lateral account movement.

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🦹 Attacker
    actor Victim as 👤 Victim
    participant Browser as 🌐 Browser Engine
    participant Server as ⚡ Web Server
    participant SessionDB as 🗄️ Redis Session Store

    Note over Attacker,Server: Phase 1: Attacker Obtains Pre-Auth Session
    Attacker->>Server: GET / (receives pre-auth SID: "FIXED_123")
    Attacker->>Victim: Sends phishing link: https://bank.com?sid=FIXED_123 or sets subdomain cookie

    Note over Victim,Server: Phase 2: Victim Authenticates
    Victim->>Server: POST /login {user, pass} (Cookie: sid="FIXED_123")
    
    rect rgb(230, 245, 255)
    Note over Server,SessionDB: 🛡️ DEFENSE: Session ID Regeneration
    Server->>SessionDB: DEL session:FIXED_123 (Destroy old identifier)
    Server->>Server: Generate new cryptographically random SID: "NEW_987"
    Server->>SessionDB: SET session:NEW_987 {userId: "victim_id", role: "user"}
    Server-->>Browser: Set-Cookie: __Host-sid="NEW_987"; Secure; HttpOnly; SameSite=Strict
    end

    Note over Attacker,Server: Phase 3: Attacker Attempts Exploit
    Attacker->>Server: GET /account/balance (Cookie: sid="FIXED_123")
    Server->>SessionDB: GET session:FIXED_123 -> NULL!
    Server--xAttacker: 401 Unauthorized! Attack Neutralized.
```

> 💡 **Visual Inspection Tip:** Open DevTools (`Application` > `Cookies`). Observe the session cookie value before login. Log in with test credentials. Confirm that the session cookie value changes to a completely different random string immediately upon login.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: Flawed Session Re-use in Express
A legacy Node.js application kept user session data attached to the existing session instance across authentication boundaries.

#### ❌ Vulnerable Session Handling (Node.js / Express)
```typescript
// vulnerable-session.ts
import express from 'express';
import session from 'express-session';

const app = express();
app.use(express.json());

app.use(session({
  secret: 'insecure-secret',
  resave: false,
  saveUninitialized: true, // ⚠️ Issues a session cookie to every anonymous visitor!
  cookie: { secure: false }
}));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Authenticate user ...

  // ⚠️ CATASTROPHIC FLAW: req.session is populated WITHOUT regenerating the session ID!
  // The anonymous visitor's session ID becomes the authenticated user's session ID!
  (req.session as any).userId = 'user_123';
  (req.session as any).authenticated = true;

  res.json({ status: 'logged in' });
});
```

#### 💥 The Exploit Execution
1. Attacker visits `http://bank.com` and notes their anonymous session cookie: `connect.sid=s%3AATTACKER_SID`.
2. Attacker crafts a link or abuses a cross-subdomain vulnerability (`cookie tossing`) to force the victim's browser to hold `connect.sid=s%3AATTACKER_SID`.
3. Victim clicks the link and logs into their account.
4. The server mutates the existing session object instead of generating a new ID.
5. The attacker uses `connect.sid=s%3AATTACKER_SID` from their own machine and accesses the victim's account.

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Production Hardened Session Engine with Regeneration and Timeouts
```typescript
// hardened-session-manager.ts - PRODUCTION-READY SESSION LIFECYCLE
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

const app = express();
const redisClient = new Redis();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;    // 15 minutes of inactivity
const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours absolute limit

app.use(session({
  store: redisStore,
  name: '__Host-session_id', // 🛡️ Restricts cookie to origin and enforces HTTPS
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,  // 🛡️ Do not create sessions until explicitly authenticated
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: ABSOLUTE_TIMEOUT_MS,
  },
}));

// 🛡️ 1. Absolute and Idle Timeout Enforcement Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !(req.session as any).userId) return next();

  const now = Date.now();
  const sessionData = req.session as any;

  // Check absolute timeout
  if (now - sessionData.createdAt > ABSOLUTE_TIMEOUT_MS) {
    req.session.destroy(() => res.status(401).json({ error: 'Session expired (Absolute limit reached)' }));
    return;
  }

  // Check idle timeout
  if (now - sessionData.lastActivity > IDLE_TIMEOUT_MS) {
    req.session.destroy(() => res.status(401).json({ error: 'Session expired due to inactivity' }));
    return;
  }

  sessionData.lastActivity = now; // Update sliding idle window
  next();
});

// 🛡️ 2. Session Regeneration on Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  // Validate credentials ...

  // CRITICAL: Always regenerate session ID on privilege change!
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'Failed to initialize secure session' });

    const sessionData = req.session as any;
    sessionData.userId = 'user_123';
    sessionData.createdAt = Date.now();
    sessionData.lastActivity = Date.now();

    res.json({ status: 'authenticated' });
  });
});

// 🛡️ 3. Safe Session Destruction on Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    res.clearCookie('__Host-session_id', { path: '/' });
    res.json({ message: 'Session successfully terminated' });
  });
});

export default app;
```

---

## 5. 🧪 Hands-On Verification & Lab

### Automated Session Regeneration Test (Supertest)
```typescript
// session-fixation.test.ts
import request from 'supertest';
import app from './hardened-session-manager';

describe('Session Lifecycle & Fixation Suite', () => {
  it('regenerates session ID upon login to defeat fixation', async () => {
    const agent = request.agent(app);

    // Initial anonymous request
    const initRes = await agent.get('/public-ping');
    const initialCookie = initRes.headers['set-cookie'];

    // Login request
    const loginRes = await agent.post('/api/auth/login');
    const newCookie = loginRes.headers['set-cookie'][0];

    // Session ID MUST change
    expect(newCookie).not.toEqual(initialCookie);
    expect(newCookie).toContain('__Host-session_id');
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **`req.session.regenerate()` Called:** Does login always regenerate session identifiers?
- [ ] **Dual Timeouts Enforced:** Are both idle (e.g. 15 min) and absolute (e.g. 8–12 hrs) timeouts enforced?
- [ ] **`saveUninitialized: false`:** Is anonymous session auto-creation disabled?
- [ ] **Cookie Cleared on Logout:** Does the logout endpoint both destroy server session storage and clear the client cookie header?
- [ ] **Concurrent Session Bounds:** Is there a limit on concurrent active sessions per user account?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [Session Fixation & Hijacking Attacks Explained (Computerphile)](https://www.youtube.com/watch?v=T1QEs32Rezk) — Step-by-step visual demonstration of session ID adoption and pre-authentication traps.
- 🎥 [Session Management Vulnerabilities & Fixation (PortSwigger Web Security Academy)](https://www.youtube.com/watch?v=r0fNnL8_3oM) — Detailed walkthrough of cookie manipulation and session expiration flaws.
- 🎥 [Sessions vs JWTs: Which is Better? (Fireship)](https://www.youtube.com/watch?v=UBUNrFtufWo) — Concise, rapid comparison of server-side Redis sessions vs stateless cryptographic tokens.

### 📖 Primary Documentation & Specifications
- 📜 [OWASP Cheat Sheet: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) — Industry gold standard on ID regeneration, idle/absolute timeouts, and revoking tokens.
- 📜 [OWASP Web Security Testing Guide: Testing for Session Fixation (WSTG-SESS-03)](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/03-Testing_for_Session_Fixation) — Detailed pentesting and verification procedures.
- 📜 [IETF RFC 6265bis: Cookie State Management Mechanism](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis) — Strict browser security attributes for cookie storage.

### 🧪 Interactive Hands-On Training Labs
- 🎯 [PortSwigger Lab: Session hijacking via cookie manipulation](https://portswigger.net/web-security/authentication/other-mechanisms/lab-session-hijacking) — Exploit predictable session keys to hijack active user accounts.
- 🎯 [OWASP WebGoat: Session Management Lessons](https://owasp.org/www-project-webgoat/) — Practice exploiting unregenerated session IDs and missing timeout controls.

