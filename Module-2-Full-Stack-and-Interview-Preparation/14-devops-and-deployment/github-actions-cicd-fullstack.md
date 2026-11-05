# GitHub Actions CI/CD Pipeline for Full-Stack Applications

## 1. 🎯 Overview & Intuitive Mental Model

In modern software engineering, shipping code directly from a developer's laptop to production is a recipe for disaster. 

A **Continuous Integration and Continuous Deployment (CI/CD)** pipeline acts as an automated, incorruptible quality-assurance assembly line. Every code change is vetted, compiled, tested, containerized, security-scanned, and deployed without human intervention.

```
+----------------------------------------------------------------------------------------------------+
|                                    🧠 THE PHYSICAL ANALOGY                                         |
|                                                                                                    |
|  🏭 The Automobile Safety Testing Assembly Line:                                                   |
|     1. Blueprint Inspection (Lint & Type-Check): Ensuring dimensions match exact engineering specs.|
|     2. Crash & Stress Testing (Unit & Integration Tests): Stress-testing individual parts & systems.|
|     3. Safety & Recall Scan (SCA & SAST / Trivy / Gitleaks): Scanning for counterfeit parts or       |
|        accidental secret leaks.                                                                    |
|     4. Certified Packing & Crate (Docker Multi-Stage Build): Packaging the car in a sealed,         |
|        standard shipping container.                                                                |
|     5. Highway Rollout (Zero-Downtime Deployment): Rolling the new fleet onto the highway while     |
|        the old fleet smoothly exits without interrupting traffic flow.                             |
+----------------------------------------------------------------------------------------------------+
```

### Pipeline Risk & Severity Matrix
- **OWASP Category:** A05:2021 – Security Misconfiguration & A08:2021 – Software and Data Integrity Failures
- **CWE Identifiers:** [CWE-798: Use of Hardcoded Credentials](https://cwe.mitre.org/data/definitions/798.html), [CWE-829: Inclusion of Functionality from Untrusted Control Sphere](https://cwe.mitre.org/data/definitions/829.html)
- **Blast Radius:** Accidental deployment of broken migrations, pipeline compromise yielding production cloud credentials, supply chain attacks via poisoned dependencies.

---

## 2. 🎨 Interactive Visual Architecture

### Full-Stack CI/CD Pipeline Workflow (React + Node.js + PostgreSQL)

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 👨‍💻 Developer
    participant Git as 🐙 GitHub Repository
    participant Runner as ⚡ GitHub Actions Runner
    participant Registry as 🐳 Container Registry (GHCR / ECR / Artifact Registry)
    participant Database as 🗄️ PostgreSQL Database
    participant Prod as 🚀 Production Host (AWS / GCP / Hostinger)

    Dev->>Git: git push origin main / Open Pull Request
    Git->>Runner: Trigger Workflow (.github/workflows/deploy.yml)

    Note over Runner: 🧪 STAGE 1: TEST & VALIDATION (Parallel Jobs)
    par Frontend Quality Gate
        Runner->>Runner: npm run lint (ESLint + Prettier)
        Runner->>Runner: npm run test:unit (Vitest / React Testing Library)
        Runner->>Runner: npm run build (Vite / React Production Bundle)
    and Backend Quality Gate
        Runner->>Runner: npm run lint:backend
        Runner->>Runner: npm run test:unit (Jest / Supertest)
        Runner->>Runner: Secret Scan (Gitleaks) + Vulnerability Scan (Trivy)
    end

    Note over Runner: 📦 STAGE 2: CONTAINERIZATION
    Runner->>Runner: Multi-Stage Docker Build (Frontend NGINX + Node.js Alpine)
    Runner->>Registry: Push Tagged Images (:sha-a1b2c3d)

    Note over Runner,Prod: 🔐 STAGE 3: ZERO-SECRET OIDC AUTHENTICATION
    Runner->>Prod: OIDC Token Exchange (AWS IAM / GCP Workload Identity / SSH Key)

    Note over Runner,Database: 🗄️ STAGE 4: DATABASE MIGRATION SAFETY
    Runner->>Database: Run Pending Migrations (npx prisma migrate deploy)

    Note over Runner,Prod: 🚀 STAGE 5: ZERO-DOWNTIME ROLLOUT
    Runner->>Prod: Trigger Rolling Update / PM2 Reload / Container Restart
    Prod-->>Runner: Health Check: GET /healthz -> 200 OK
    Runner-->>Dev: ✅ Pipeline Passed & Deployed!
```

> 💡 **Visual Inspection Tip:** In your GitHub repository, click on the **Actions** tab. Inspect the run duration and step breakdown. Notice that separating dependencies into cached layers (`actions/cache`) cuts pipeline runtimes from 8 minutes down to 45 seconds!

---

## 3. 💥 Real-World Exploit & Pipeline Failure Walkthrough

### The "Plaintext Secret Leak & Out-of-Order Migration Catastrophe"

Many engineering teams accidentally expose high-privilege credentials in CI pipelines or deploy application binaries before applying database schema changes.

#### Vulnerable GitHub Actions Workflow (`.github/workflows/broken-deploy.yml`)
```yaml
# broken-deploy.yml - DANGEROUS PIPELINE PRACTICES
name: Deploy Application
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # 💥 FLAW 1: Static permanent cloud credentials with full admin privileges
      - name: Deploy to Cloud
        env:
          AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE # Permanent IAM key
          AWS_SECRET_ACCESS_KEY: ${{ secrets.DANGEROUS_RAW_KEY }}
          # 💥 FLAW 2: Plaintext database connection string printed to log
          DATABASE_URL: ${{ secrets.PROD_DB_URL }}
        run: |
          echo "Connecting to $DATABASE_URL"
          # 💥 FLAW 3: Deploying new app code BEFORE running database migrations!
          ssh -o StrictHostKeyChecking=no root@my-server.com "cd /app && git pull && pm2 restart all"
          # 💥 FLAW 4: Migrations run last; new app crashes immediately looking for missing columns
          npx prisma migrate deploy
```

#### Exploit & Failure Breakdown
1. **Public Log Exposure:** The `echo "Connecting to $DATABASE_URL"` prints the master PostgreSQL username and password into the world-readable GitHub Actions build logs.
2. **Cascading Downtime:** The new Node.js code starts up expecting a `billing_address` column in PostgreSQL. Since migrations haven't run yet, every user query throws `500 Internal Server Error`.
3. **Compromised Host:** Storing permanent AWS or SSH keys in repository secrets means anyone with write access to the repository can alter the workflow to exfiltrate full cloud infrastructure access.

---

## 4. 🛡️ Resolution & Complete Production Implementation

### Production-Ready Multi-Stage GitHub Actions Pipeline (`.github/workflows/ci-cd.yml`)

```yaml
# .github/workflows/ci-cd.yml - ENTERPRISE MULTI-STAGE PIPELINE
name: Production Full-Stack CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Concurrency group cancels redundant in-progress runs on same branch
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  id-token: write # Required for secure OIDC token exchange
  packages: write  # Allows pushing to GitHub Container Registry (GHCR)

jobs:
  # =========================================================================
  # 🧪 JOB 1: CODE QUALITY, SECURITY SCANNING & TESTING
  # =========================================================================
  validate-and-test:
    name: Lint, Test & Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Deep fetch needed for accurate secret scanning

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Secret Leak Detection (Gitleaks)
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Static Lint & Formatting Check
        run: |
          npm run lint
          npm run format:check

      - name: Run Automated Test Suite with Coverage
        run: npm run test:ci
        env:
          NODE_ENV: test

      - name: Build Verification (React & Node.js Artifacts)
        run: npm run build

  # =========================================================================
  # 🐳 JOB 2: DOCKER CONTAINERIZATION & VULNERABILITY AUDIT
  # =========================================================================
  build-and-package:
    name: Build & Scan Docker Images
    needs: validate-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.version }}
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: actions/docker/setup-buildx-action@v3

      - name: Authenticate to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker Metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}/backend
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=latest

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Scan Image for Vulnerabilities (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/${{ github.repository }}/backend:${{ steps.meta.outputs.version }}
          format: 'table'
          exit-code: '1' # Fail pipeline on critical vulnerabilities
          ignore-unfixed: true
          severity: 'CRITICAL'

  # =========================================================================
  # 🚀 JOB 3: DATABASE MIGRATION & ZERO-DOWNTIME DEPLOYMENT
  # =========================================================================
  deploy-production:
    name: Safe Production Rollout
    needs: [build-and-package]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.company.com
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Database Tooling
        run: npm ci --omit=dev

      # 🛡️ STEP 1: Apply Non-Breaking Database Migrations FIRST
      - name: Execute Pending Database Migrations
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
        run: |
          echo "🚀 Executing non-destructive database migrations..."
          npx prisma migrate deploy

      # 🛡️ STEP 2: Deploy to Production via Secure SSH Key / Cloud CLI
      - name: Trigger Server Rolling Update
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_HOST }}
          username: deploy
          key: ${{ secrets.PROD_SSH_PRIVATE_KEY }}
          script: |
            # Pull latest audited image
            docker pull ghcr.io/${{ github.repository }}/backend:latest
            
            # Zero-downtime rolling reload via docker compose or PM2
            cd /opt/app
            docker compose up -d --remove-orphans
            
            # Health check verification
            sleep 5
            curl -f http://127.0.0.1:3000/healthz || exit 1
```

---

## 5. 🧪 Hands-On Verification & Lab

### 1. Test GitHub Actions Locally Using `act`
Instead of pushing commits to GitHub just to see if your workflow YAML syntax works, test it locally using **`act`**:

```bash
# Install act on your machine
# macOS: brew install act | Windows: choco install act-cli | Linux: curl ...

# Run the test job locally inside a Docker container
act -j validate-and-test
```

### 2. Verify Secret Masking & Protection
1. Create a test secret in GitHub (**Repository Settings -> Secrets and variables -> Actions**).
2. Write a test step that references `${{ secrets.MY_SECRET }}`.
3. Verify that GitHub Actions automatically redacts the secret with `***` in the build console.

### 3. Automated Post-Deployment Smoke Test (Vitest)
```typescript
// deployment-smoke.test.ts
import { describe, it, expect } from 'vitest';

describe('Production Deployment Smoke Suite', () => {
  const PROD_URL = process.env.PROD_URL || 'https://app.company.com';

  it('verifies production health check returns healthy database connection', async () => {
    const res = await fetch(`${PROD_URL}/healthz`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.database).toBe('connected');
    expect(body.version).toBeDefined();
  });
});
```

---

## 6. 📋 Code Review & Deployment Checklist

- [ ] **OIDC Over Static Keys:** Are cloud provider credentials accessed via OpenID Connect (OIDC) rather than permanent access keys?
- [ ] **Non-Breaking Migrations First:** Are database migrations designed backward-compatibly (expand and contract pattern) and run *before* new application code deploys?
- [ ] **Secret Scanners Active:** Does the pipeline include automated pre-commit or CI scanning (Gitleaks, TruffleHog) to prevent leaked API keys?
- [ ] **Dependency Caching Enabled:** Are package manager caches (`npm`, `pnpm`, `pip`) enabled to keep pipeline feedback loops under 2 minutes?
- [ ] **Container Image Scanning:** Does the pipeline scan container images for CVEs using Trivy or Clair with an exit code of `1` for critical CVEs?
- [ ] **Branch Protection Rules:** Does the `main` branch require passing CI checks and at least one peer approval before merging?
- [ ] **Automated Rollback Hook:** Does the deployment script verify `/healthz` and automatically roll back if the health check fails?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [GitHub Actions Full Course: CI/CD Pipelines from Scratch (TechWorld with Nana)](https://www.youtube.com/watch?v=R8_veQiYBjI) — Complete hands-on masterclass covering jobs, steps, runners, environments, and secrets.
- 🎥 [CI/CD Pipeline Architecture & Best Practices (ByteByteGo)](https://www.youtube.com/watch?v=scEDHsr3APg) — Visual system architecture explaining build triggers, artifact promotion, and blue/green deployments.
- 🎥 [GitHub Actions in 100 Seconds (Fireship)](https://www.youtube.com/watch?v=eB0nUzAI7M8) — Fast visual overview of YAML workflow syntax and marketplace actions.

### 📖 Primary Documentation & Specifications
- 📜 [GitHub Actions Official Documentation](https://docs.github.com/en/actions) — Comprehensive guide on workflow syntax, hosted runners, and context objects.
- 📜 [GitHub Security Guide: Hardening GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) — Best practices for secret management and third-party actions pinning.
- 📜 [OpenID Connect in GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) — Configuring keyless cloud authentication with AWS, GCP, and Azure.

### 🧪 Interactive Hands-On Training Labs & Tools
- 🎯 [nektos/act: Run GitHub Actions Locally](https://github.com/nektos/act) — Local terminal runner to test workflows without committing.
- 🎯 [GitHub Skills: Introduction to GitHub Actions](https://skills.github.com/) — Free interactive GitHub lab repository to build your first live pipeline.
