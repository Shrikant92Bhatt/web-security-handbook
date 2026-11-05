# Cross-Site Request Forgery (CSRF): Threat Models, Defense-in-Depth & Modern Framework Architecture

## 1. 🎯 Overview & Intuitive Mental Model

In web architectures that use browser cookies for authentication, the browser operates under a fundamental security model called **Ambient Authority**: whenever a browser issues an HTTP request to an origin (e.g., `bank.com`), it automatically attaches all stored cookies associated with that origin—**regardless of who or what initiated the request**.

**Cross-Site Request Forgery (CSRF)** is an attack where an adversary tricks a victim's authenticated browser into executing an unwanted, unauthorized action on a trusted web application. The victim never reveals their password or session cookie to the attacker; instead, the victim's browser is co-opted as an unwitting accomplice to forge the transaction.

```
+----------------------------------------------------------------------------------------------------+
|                                    🧠 THE PHYSICAL ANALOGY                                         |
|                                                                                                    |
|  🏦 The Forged Wire-Transfer Letter (CSRF):                                                        |
|                                                                                                    |
|  1. The Legitimate Account Holder:                                                                 |
|     You have an active corporate account with your local bank. The bank branch recognizes your     |
|     official wax seal stamp (Session Cookie).                                                      |
|                                                                                                    |
|  2. The Malicious Trick:                                                                           |
|     You visit a shady street fair (Malicious Website `evil-attacker.com`). A vendor hands you a    |
|     free scratch-off ticket. Hidden underneath the scratch-off card is a pre-drafted letter to     |
|     your bank stating: *"Transfer $10,000 to Account #666"*.                                       |
|                                                                                                    |
|  3. The Blind Mail Carrier (The Browser):                                                          |
|     The mail carrier picks up all outgoing letters from your hands, automatically applies your      |
|     authentic wax seal stamp (Ambient Cookie), and delivers the letter to the bank.                 |
|                                                                                                    |
|  4. The Bank's Mistake:                                                                            |
|     The bank verifies that the wax seal is genuine, assumes YOU drafted the instruction, and       |
|     dispatches the funds.                                                                          |
|                                                                                                    |
|  🛡️ The Solution (Anti-CSRF One-Time Token):                                                       |
|     The bank requires that every transfer instruction include a secret, single-use security        |
|     token generated inside the bank lobby that day. A forged letter from the street fair will      |
|     not have this token and is immediately shredded.                                               |
+----------------------------------------------------------------------------------------------------+
```

### 🥊 Why Same-Origin Policy (SOP) & CORS Do NOT Stop CSRF

Many developers mistakenly believe that SOP or CORS prevents CSRF:
* **The SOP Misconception:** SOP prevents an attacker from **reading** the response of a cross-origin request. It does **not** prevent the browser from **sending** the request or the server from **executing** the state-changing mutation!
* **The CORS Misconception:** Standard HTML elements—such as `<form action="..." method="POST">`, `<img src="...">`, and `<iframe src="...">`—are considered **simple cross-origin requests**. Browsers send them across origins **without issuing a CORS preflight (`OPTIONS`) request**!

### Vulnerability & Severity Matrix
- **OWASP Category:** [A01:2021 – Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- **Common Weakness Enumeration:** [CWE-352: Cross-Site Request Forgery (CSRF)](https://cwe.mitre.org/data/definitions/352.html)
- **OWASP ASVS:** Section V4.2 (Operation Level Access Control & CSRF Protection)
- **Blast Radius:** Unauthorized monetary transfers, forced password changes, email address modification leading to complete Account Takeover (ATO), unauthorized posting on social platforms.

---

## 2. 🎨 Interactive Visual Architecture

### CSRF Attack vs. Double-Submit Anti-CSRF Token Defense

```mermaid
sequenceDiagram
    autonumber
    actor Victim as 👤 Authenticated User
    participant Browser as 🌐 Victim Browser (Sandboxed)
    participant Attacker as 🦹 Malicious Site (evil-hacker.com)
    participant BankAPI as 🏦 Bank Server (bank.com)

    Note over Victim,BankAPI: Phase 1: Legitimate Login & Session Establishment
    Victim->>BankAPI: POST /login {user, pass}
    BankAPI-->>Browser: Set-Cookie: session_id=s3cr3t; HttpOnly; Secure
    Note right of Browser: Cookie stored in browser jar for bank.com

    Note over Victim,Attacker: Phase 2: The Attack (Unprotected Server)
    Victim->>Attacker: Visits evil-hacker.com in another tab
    Attacker->>Browser: Injects auto-submitting hidden HTML form
    Browser->>BankAPI: POST /api/transfer (Auto-attaches session_id cookie!)
    Note over BankAPI: Server sees valid session_id -> Executes $5,000 transfer!

    Note over Victim,BankAPI: Phase 3: The Hardened Defense (Anti-CSRF Token)
    Victim->>BankAPI: GET /app/dashboard
    BankAPI-->>Browser: Response contains Anti-CSRF Token (X-CSRF-Token)
    Victim->>Attacker: Visits evil-hacker.com
    Attacker->>Browser: Submits cross-origin POST /api/transfer
    Browser->>BankAPI: POST /api/transfer (Sends cookie, but NO X-CSRF-Token!)
    Note over BankAPI: 🛡️ Defense: Missing/Invalid CSRF Token
    BankAPI-->>Browser: HTTP 403 Forbidden (Request Blocked & Logged)
```

> 💡 **Visual Inspection Tip:** Open Chrome DevTools (`F12`) -> **Application** tab -> **Cookies**:
> - Inspect the `SameSite` attribute for authentication cookies. If it is set to `None` without strict token validation, the site is critically vulnerable to cross-origin forgery.
> - In the **Network** tab, inspect state-changing requests (`POST`, `PUT`, `DELETE`). Look for request headers like `X-CSRF-Token` or `X-XSRF-Token`.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The One-Click Forced Email Takeover

A SaaS platform stores user sessions in an `HttpOnly` cookie. The backend allows users to change their registered email address via a `POST` endpoint without validating the request origin or requiring a security token.

#### ❌ Vulnerable Express Endpoint (`vulnerable-server.js`)
```javascript
// vulnerable-server.js - MISSING CSRF DEFENSE
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Simulates user authentication from cookie
function authenticate(req, res, next) {
  const sessionId = req.cookies.session_id;
  if (!sessionId || sessionId !== 'valid_secret_session_999') {
    return res.status(401).send('Unauthorized');
  }
  req.userId = 'user_12345';
  next();
}

// 💥 VULNERABILITY: State-changing mutation relies purely on ambient cookies!
app.post('/api/user/change-email', authenticate, (req, res) => {
  const { newEmail } = req.body;
  
  // Database update executes on behalf of authenticated victim!
  console.log(`[VULNERABLE] Changed user ${req.userId} email to: ${newEmail}`);
  res.send(`Email successfully changed to: ${newEmail}`);
});

app.listen(3000);
```

#### Attacker Exploit Payload (`evil-hacker.com/win-prize.html`)
The attacker tricks the victim into visiting their malicious website while logged into the SaaS platform:

```html
<!-- Hosted on https://evil-hacker.com -->
<!DOCTYPE html>
<html>
<head>
  <title>Congratulations! You Won an iPhone!</title>
</head>
<body>
  <h1>Claiming your free prize... Please wait...</h1>
  
  <!-- 💥 The Forged Form: Auto-submits instantly on page load -->
  <form id="csrfForm" action="http://localhost:3000/api/user/change-email" method="POST">
    <input type="hidden" name="newEmail" value="attacker@evil-hacker.com" />
  </form>

  <script>
    // Automatically submit the form without user interaction
    document.getElementById('csrfForm').submit();
  </script>
</body>
</html>
```

#### Step-by-Step Failure Dynamic
1. **Victim is Authenticated:** The victim is logged into the SaaS app with cookie `session_id=valid_secret_session_999`.
2. **Victim Opens Link:** The victim clicks an email or phishing link to `evil-hacker.com/win-prize.html`.
3. **Automatic Form Submission:** The attacker's script triggers `form.submit()`.
4. **Ambient Cookie Attachment:** The victim's browser sends a cross-origin `POST` request to `http://localhost:3000/api/user/change-email` and automatically attaches `Cookie: session_id=valid_secret_session_999`.
5. **Account Takeover:** The vulnerable backend inspects the valid session cookie and updates the victim's email address to `attacker@evil-hacker.com`. The attacker clicks "Forgot Password" and takes over the victim's account.

---

## 4. 🛡️ Resolution & Defense-in-Depth

Defending against CSRF requires a multi-layered defense strategy. Relying on a single mechanism creates blind spots.

```
+----------------------------------------------------------------------------------------------------+
|                               🛡️ LAYERED DEFENSE-IN-DEPTH MATRIX                                   |
|                                                                                                    |
|  1. SameSite Cookie Attribute (First Line of Defense):                                             |
|     - SameSite=Strict: Cookie NEVER sent in cross-site requests (even top-level links).            |
|     - SameSite=Lax: Cookie withheld on cross-site subrequests (images, forms, fetch).              |
|                                                                                                    |
|  2. Cryptographic Anti-CSRF Tokens (Synchronizer / Double-Submit):                                 |
|     - Unpredictable random token tied to user session, validated on every state change.            |
|                                                                                                    |
|  3. Origin & Referer Verification:                                                                 |
|     - Validates that HTTP request headers match trusted company domains.                           |
|                                                                                                    |
|  4. Custom Request Headers for SPAs (Fetch / Axios):                                               |
|     - Browsers restrict custom headers (e.g. X-Requested-With, X-CSRF-Token) cross-origin.         |
+----------------------------------------------------------------------------------------------------+
```

### ⚠️ The `SameSite=Lax` Limitations You Must Know

Modern browsers (Chrome, Edge, Firefox) set `SameSite=Lax` by default if no attribute is specified. While this eliminates naive cross-site form POST attacks, **it does not eliminate all CSRF risks**:

1. **Top-Level Navigation GET Exemption:**
   `SameSite=Lax` cookies **are sent** when the user clicks a top-level link (`<a href="...">`) navigating to your site. If your application mistakenly allows state mutations via `GET` requests (e.g., `<a href="/api/account/delete">`), `SameSite=Lax` provides **zero protection**!
2. **The 2-Minute Lax-by-Default Window (Lax-after-posting):**
   In Chromium, cookies set within the last 120 seconds without an explicit `SameSite` attribute may be sent on cross-site top-level `POST` requests to preserve legacy Single Sign-On (SSO) login flows.
3. **Subdomain Hijacking:**
   `SameSite` checks the registrable domain (eTLD+1). If an attacker compromises `blog.company.com`, they can forge requests to `app.company.com`.

---

### Pattern A: Double-Submit Cookie Pattern (Stateless & Recommended for APIs)

In the Double-Submit Cookie pattern:
1. The server generates a cryptographically random, HMAC-signed token and sets it in an unreadable cookie (`__Host-csrf-token`).
2. The frontend reads the token (or receives it via a dedicated `/api/csrf-token` endpoint) and includes it in a custom header: `X-CSRF-Token`.
3. The server verifies that the header token matches and validates the cookie signature.

#### Production Express Middleware Implementation (`csrfProtection.ts`)
```typescript
// csrfProtection.ts - PRODUCTION-READY DOUBLE-SUBMIT CSRF ENGINE
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'super_secret_hmac_key_min_32_chars_123456';
const CSRF_COOKIE_NAME = '__Host-csrf-token';

// 🛡️ Helper: Generates a cryptographically random signed token
export function generateCsrfToken(): { token: string; rawCookieValue: string } {
  const randomValue = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(randomValue)
    .digest('hex');
  
  const rawCookieValue = `${randomValue}.${signature}`;
  return { token: randomValue, rawCookieValue };
}

// 🛡️ Middleware: Issue CSRF Token Cookie
export function issueCsrfToken(req: Request, res: Response) {
  const { token, rawCookieValue } = generateCsrfToken();

  res.cookie(CSRF_COOKIE_NAME, rawCookieValue, {
    httpOnly: true,
    secure: true,              // Requires HTTPS
    sameSite: 'lax',           // Restricts cross-site subrequests
    path: '/',
    maxAge: 3600 * 1000,       // 1 hour
  });

  res.json({ csrfToken: token });
}

// 🛡️ Middleware: Enforce CSRF Validation on State Mutations
export function verifyCsrfProtection(req: Request, res: Response, next: NextFunction) {
  // Safe HTTP methods (RFC 9110) do not mutate state
  const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
  if (safeMethods.has(req.method)) {
    return next();
  }

  // 1. Strict Origin / Referer Validation
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = new Set(['https://app.company.com', 'https://api.company.com']);

  if (origin) {
    const originUrl = new URL(origin).origin;
    if (!allowedOrigins.has(originUrl)) {
      console.warn(`[CSRF] Blocked untrusted Origin: ${originUrl}`);
      return res.status(403).json({ error: 'Untrusted Origin' });
    }
  }

  // 2. Extract Token from Header and Cookie
  const clientToken = req.headers['x-csrf-token'] as string;
  const cookieValue = req.cookies[CSRF_COOKIE_NAME] as string;

  if (!clientToken || !cookieValue) {
    return res.status(403).json({ error: 'Missing CSRF Token or Cookie' });
  }

  const [cookieRandomValue, cookieSignature] = cookieValue.split('.');
  if (!cookieRandomValue || !cookieSignature) {
    return res.status(403).json({ error: 'Malformed CSRF Cookie' });
  }

  // 3. Verify HMAC Signature of the Cookie
  const expectedSignature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(cookieRandomValue)
    .digest('hex');

  const isValidSignature = crypto.timingSafeEqual(
    Buffer.from(cookieSignature),
    Buffer.from(expectedSignature)
  );

  // 4. Verify that Header Token matches Cookie Token
  const isTokenMatch = crypto.timingSafeEqual(
    Buffer.from(clientToken),
    Buffer.from(cookieRandomValue)
  );

  if (!isValidSignature || !isTokenMatch) {
    return res.status(403).json({ error: 'Invalid CSRF Token' });
  }

  next();
}
```

---

### Pattern B: React Frontend Client Integration (`useCsrfFetch.ts`)

```typescript
// useCsrfFetch.ts - TYPE-SAFE FRONTEND CSRF INTEGRATION
import { useEffect, useState, useCallback } from 'react';

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch('/api/csrf-token', { credentials: 'same-origin' });
      const data = await res.json();
      setCsrfToken(data.csrfToken);
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Wrapper for authenticated mutations (POST, PUT, DELETE)
  const secureFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }

      return fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin', // Ensure session cookies are sent
      });
    },
    [csrfToken]
  );

  return { csrfToken, secureFetch };
}
```

---

## 5. 🧪 Hands-On Verification & Lab

### 1. Verification via Terminal (`curl`)

#### Step A: Obtain CSRF Token & Cookie
```bash
# Request token and save response cookies to cookies.txt
curl -c cookies.txt -i http://localhost:3000/api/csrf-token

# Response:
# Set-Cookie: __Host-csrf-token=a9f...b2; Secure; HttpOnly; SameSite=Lax; Path=/
# {"csrfToken":"a9f...b2"}
```

#### Step B: Attempt Mutation Without Token (Should FAIL)
```bash
curl -b cookies.txt -i -X POST http://localhost:3000/api/user/change-email \
  -H "Content-Type: application/json" \
  -d '{"newEmail":"attacker@evil.com"}'

# Expected Output:
# HTTP/1.1 403 Forbidden
# {"error":"Missing CSRF Token or Cookie"}
```

#### Step C: Execute Mutation with Matching Token (Should SUCCEED)
```bash
curl -b cookies.txt -i -X POST http://localhost:3000/api/user/change-email \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: a9f...b2" \
  -d '{"newEmail":"alice@company.com"}'

# Expected Output:
# HTTP/1.1 200 OK
# {"status":"Email updated"}
```

---

### 2. Automated Vitest Integration Test (`csrf.test.ts`)

```typescript
// csrf.test.ts - COMPREHENSIVE AUTOMATED CSRF SECURITY SUITE
import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { issueCsrfToken, verifyCsrfProtection } from './csrfProtection';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/csrf-token', issueCsrfToken);
app.post('/api/user/change-email', verifyCsrfProtection, (req, res) => {
  res.json({ status: 'Email updated', email: req.body.newEmail });
});

describe('CSRF Security & Token Verification Suite', () => {
  it('issues a secure signed CSRF cookie and JSON token', async () => {
    const res = await request(app).get('/api/csrf-token');
    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBeDefined();
    
    const setCookie = res.headers['set-cookie'][0];
    expect(setCookie).toContain('__Host-csrf-token=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=Lax');
  });

  it('rejects state-changing POST requests when X-CSRF-Token header is missing', async () => {
    // 1. Get token
    const tokenRes = await request(app).get('/api/csrf-token');
    const cookie = tokenRes.headers['set-cookie'];

    // 2. Post with cookie but without header
    const postRes = await request(app)
      .post('/api/user/change-email')
      .set('Cookie', cookie)
      .send({ newEmail: 'hacker@evil.com' });

    expect(postRes.status).toBe(403);
    expect(postRes.body.error).toContain('Missing CSRF Token');
  });

  it('rejects POST requests when header token does not match cookie', async () => {
    const tokenRes = await request(app).get('/api/csrf-token');
    const cookie = tokenRes.headers['set-cookie'];

    const postRes = await request(app)
      .post('/api/user/change-email')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', 'forged_tampered_token_123')
      .send({ newEmail: 'hacker@evil.com' });

    expect(postRes.status).toBe(403);
    expect(postRes.body.error).toContain('Invalid CSRF Token');
  });

  it('successfully authorizes POST requests with matching token and valid cookie', async () => {
    const tokenRes = await request(app).get('/api/csrf-token');
    const cookie = tokenRes.headers['set-cookie'];
    const token = tokenRes.body.csrfToken;

    const postRes = await request(app)
      .post('/api/user/change-email')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', token)
      .send({ newEmail: 'alice@company.com' });

    expect(postRes.status).toBe(200);
    expect(postRes.body.status).toBe('Email updated');
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **State Mutations Disallow GET:** Are all state-changing endpoints strictly bound to `POST`, `PUT`, `PATCH`, or `DELETE`?
- [ ] **`SameSite` Attribute Configured:** Are all session cookies explicitly configured with `SameSite=Strict` or `SameSite=Lax`?
- [ ] **Cookie Prefixes Used:** Is the CSRF cookie named with the `__Host-` prefix to ensure HTTPS transmission and origin binding?
- [ ] **Cryptographic Randomness:** Are CSRF tokens generated using cryptographically secure random bytes (`crypto.randomBytes`)?
- [ ] **Timing-Safe Comparison:** Does token validation use `crypto.timingSafeEqual` to defeat timing attacks?
- [ ] **Origin Header Validated:** Does the backend verify the `Origin` and `Referer` headers against an explicit domain allowlist?
- [ ] **Multi-Step Operations Protected:** Are high-risk actions (password changes, 2FA deactivation, email updates) guarded by re-authentication / step-up checks?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [CSRF (Cross-Site Request Forgery) Explained (Computerphile)](https://www.youtube.com/watch?v=vRBihr41JTo) — Classic, intuitive breakdown of ambient authority and how forged requests execute.
- 🎥 [Cross-Site Request Forgery (CSRF) Tutorial (PortSwigger Web Security Academy)](https://www.youtube.com/watch?v=eWEgUcHPle0) — Hands-on demonstration of CSRF exploitation, token bypasses, and SameSite defenses.
- 🎥 [SameSite Cookies vs CSRF: What Changed? (Hussein Nasser)](https://www.youtube.com/watch?v=eE7T_c_W2uM) — Deep networking dive into Lax vs Strict, top-level navigation GETs, and browser adoption.
- 🎥 [Cross-Site Request Forgery in 100 Seconds (Fireship)](https://www.youtube.com/watch?v=mCo_Qf_oX8Y) — Rapid visual mental model comparing XSS and CSRF.

### 📖 Primary Documentation & Specifications
- 📜 [IETF RFC 6265bis: Cookies - HTTP State Management Mechanism](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis) — Formal standard defining `SameSite=Strict`, `Lax`, and `None`.
- 📜 [OWASP Cheat Sheet Series: Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) — Gold standard engineering recommendations for Double-Submit, Synchronizer tokens, and Origin checks.
- 📜 [MDN Web Docs: Cross-Site Request Forgery](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) — Web developer overview and security guidance.

### 🧪 Interactive Hands-On Training Labs
- 🎯 [PortSwigger Lab: CSRF vulnerability with no defenses](https://portswigger.net/web-security/csrf/lab-no-defenses) — Practice forging an auto-submitting HTML form to change an authenticated victim's email address.
- 🎯 [PortSwigger Lab: CSRF where token validation depends on request method](https://portswigger.net/web-security/csrf/lab-token-validation-depends-on-request-method) — Exploit systems that enforce anti-CSRF tokens on POST but permit state changes via GET.
- 🎯 [PortSwigger Lab: CSRF where SameSite cookie attribute is bypassed via method override](https://portswigger.net/web-security/csrf/lab-samesite-strict-bypass-via-client-side-redirect) — Exploit client-side redirects to circumvent SameSite cookie restrictions.
