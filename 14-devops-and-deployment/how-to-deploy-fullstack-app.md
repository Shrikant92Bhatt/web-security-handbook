# Complete Step-by-Step Guide: How to Deploy a Full-Stack Application

## 1. 🎯 Overview & Intuitive Mental Model

Taking a full-stack application (**React frontend + Node.js backend + PostgreSQL database**) from `localhost:3000` to a live, secure public domain on the internet is where many engineers hit a brick wall.

Deploying is not just "running `node server.js` on a remote machine." It involves coordinating five distinct production layers:

```
+----------------------------------------------------------------------------------------------------+
|                                    🧠 THE PHYSICAL ANALOGY                                         |
|                                                                                                    |
|  🏬 Opening a Physical Retail Store (Deploying Full-Stack):                                        |
|     1. Storefront & Window Display (React SPA): What customers see and interact with. Pre-built   |
|        and served statically as ultra-fast HTML/CSS/JS files.                                      |
|     2. The Secure Glass Entrance (NGINX + Let's Encrypt SSL): Checks visitor tickets (HTTPS),     |
|        blocks hooligans (rate limits), and directs customers to staff.                             |
|     3. The Staff & Sales Representatives (Node.js API Cluster managed by PM2): Runs business       |
|        logic, processes checkout, and handles customer requests in parallel across all CPU cores.  |
|     4. The Underground Vault (PostgreSQL Database): Stores sensitive customer balances and orders. |
|        Completely invisible and unreachable from the street (bound strictly to internal network).  |
|     5. The Automatic Night Backup & Alarms (DevOps Scripts & Cron): Takes vault snapshots every   |
|        night and sounds alarms if a worker falls ill.                                               |
+----------------------------------------------------------------------------------------------------+
```

### Deployment Risk & Availability Matrix
- **OWASP Category:** A05:2021 – Security Misconfiguration
- **CWE Identifiers:** [CWE-16: Configuration](https://cwe.mitre.org/data/definitions/16.html), [CWE-200: Exposure of Sensitive Information](https://cwe.mitre.org/data/definitions/200.html)
- **Blast Radius:** Complete service outage (`502 Bad Gateway`), React client-side routing 404 errors on browser refresh, database credential exposure, server memory exhaustion.

---

## 2. 🎨 Interactive Visual Architecture

### Production Deployment Topology & Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Public Web Browser
    participant DNS as 🌍 Global DNS (A Record -> Server IP)
    participant Nginx as 🛡️ NGINX (Port 80/443 + SSL)
    participant Static as 📦 React Static Assets (/dist)
    participant PM2 as ⚙️ PM2 Cluster (Node.js API :3000)
    participant DB as 🗄️ PostgreSQL (Internal :5432)

    User->>DNS: Look up https://app.company.com
    DNS-->>User: Server IP (e.g. 195.35.42.10)
    
    User->>Nginx: HTTPS GET /dashboard (TLS 1.3 Handshake)
    Nginx->>Static: try_files $uri $uri/ /index.html
    Static-->>Nginx: Serve index.html + main.js + app.css
    Nginx-->>User: 200 OK (Instant SPA render in browser)

    Note over User,Nginx: React SPA executes in browser & calls API
    User->>Nginx: POST /api/v1/orders (Authorization: Bearer token)
    Nginx->>Nginx: Strip server banner, validate payload size (<10MB)
    Nginx->>PM2: Reverse Proxy Pass -> http://127.0.0.1:3000
    PM2->>DB: SQL Query (Connection Pool over UNIX socket/localhost)
    DB-->>PM2: Query Result
    PM2-->>Nginx: 201 Created (JSON Payload)
    Nginx-->>User: 201 Created + Security Headers (HSTS, CSP)
```

> 💡 **Visual Inspection Tip:** After deploying, open your browser DevTools Network tab. Reload on a sub-route like `https://app.company.com/dashboard/billing`. If you get a raw **404 Not Found**, your NGINX configuration is missing `try_files $uri $uri/ /index.html;` (the single most common frontend deployment bug in production!).

---

## 3. 💥 Real-World Exploit & Common Deployment Pitfalls

### Top 4 Disasters in Production Deployments

#### Pitfall 1: Hardcoded `localhost:3000` in Frontend Bundles
Developers build their React app with `fetch('http://localhost:3000/api/users')`. In production, this causes the user's browser to make requests to the *visitor's own laptop*, resulting in `ERR_CONNECTION_REFUSED` for every single customer!
* **Fix:** Use environment-aware API endpoints (`VITE_API_URL=/api` or relative reverse-proxy paths).

#### Pitfall 2: React SPA 404 Error on Page Refresh
When a user visits `https://app.company.com/login` and presses `F5`, NGINX looks for a literal file named `/login` on the server hard drive. It doesn't exist, so NGINX returns a harsh 404 error!
* **Fix:** Configure NGINX fallback routing: `try_files $uri $uri/ /index.html;`.

#### Pitfall 3: Database Port Exposed to Public Internet
Binding PostgreSQL to `listen_addresses = '*'` on a VPS with no firewall allows automated internet bots to find port 5432 and execute brute-force dictionary attacks.
* **Fix:** Bind PostgreSQL strictly to `localhost` (`127.0.0.1`) or private Docker networks.

#### Pitfall 4: Production Runs in `NODE_ENV=development`
Running Node.js in development mode disables caching, leaks full stack traces with database table schemas to visitors, and slows down express routing by up to 5x.
* **Fix:** Always enforce `NODE_ENV=production`.

---

## 4. 🛡️ Step-by-Step Production Deployment Playbook

Choose between the two most popular production methods:
- **Method A:** [Docker Compose Deployment](#method-a-docker-compose-deployment-recommended-for-all-vps--cloud) *(Containerized, reproducible, easiest)*
- **Method B:** [Bare-Metal PM2 + NGINX Deployment](#method-b-native-pm2--nginx-deployment-hostinger--ubuntu-vps) *(Lightweight, runs directly on Ubuntu/Debian)*

---

### Method A: Docker Compose Deployment (Recommended for All VPS & Cloud)

This method packages the entire stack into self-contained containers that run identically on Hostinger VPS, AWS EC2, or DigitalOcean.

#### Step 1: Project Directory Structure
Ensure your repository is organized as follows:
```text
my-fullstack-app/
├── client/                 # React frontend (Vite / CRA)
│   ├── Dockerfile
│   ├── nginx.conf          # Internal NGINX for static React files
│   └── src/
├── server/                 # Node.js backend (Express / Nest / TypeScript)
│   ├── Dockerfile
│   ├── prisma/ or migrations/
│   └── src/
├── docker-compose.prod.yml # Master production orchestrator
└── .env.production         # Secret environment variables (DO NOT COMMIT TO GIT)
```

#### Step 2: React Production Multi-Stage `Dockerfile` (`client/Dockerfile`)
```dockerfile
# Stage 1: Build the React production bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Builds static files into /app/dist
RUN npm run build

# Stage 2: Serve static files with lightweight NGINX Alpine
FROM nginx:alpine
# Copy compiled HTML/JS/CSS to NGINX root
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom NGINX routing for SPA client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 3: Client SPA NGINX Configuration (`client/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        # 🛡️ Mandatory for React Router: redirect all missing paths to index.html
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

#### Step 4: Node.js Multi-Stage `Dockerfile` (`server/Dockerfile`)
```dockerfile
# Stage 1: Dependencies and TypeScript compilation
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Prune development dependencies
RUN npm prune --production

# Stage 2: Ultra-small production runner
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
# Run as non-root user for security
USER node
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
# If using Prisma:
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

#### Step 5: Master Production `docker-compose.prod.yml`
```yaml
version: '3.8'

services:
  # 🗄️ 1. PostgreSQL Database (Completely private internal network)
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - app_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ⚙️ 2. Node.js Backend API
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app_network

  # 📦 3. React Frontend SPA
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    restart: always
    networks:
      - app_network

  # 🛡️ 4. Reverse Proxy & SSL Gateway
  gateway:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./gateway-nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app_network

volumes:
  postgres_prod_data:

networks:
  app_network:
    driver: bridge
```

#### Step 6: Deploying on Your Server via SSH
Connect to your Hostinger or cloud VPS and run:
```bash
# 1. Clone your repository
git clone https://github.com/your-username/my-fullstack-app.git /opt/app
cd /opt/app

# 2. Create the production environment file
cat <<EOF > .env.production
POSTGRES_DB=company_prod
POSTGRES_USER=db_admin
POSTGRES_PASSWORD=A_Very_Strong_Password_123!
JWT_SECRET=super_secret_jwt_key_987654321
EOF

# 3. Build and launch the entire stack in the background
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 4. Run database migrations inside the backend container
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# 5. Verify all containers are running and healthy
docker compose -f docker-compose.prod.yml ps
```

---

### Method B: Native PM2 + NGINX Deployment (Hostinger / Ubuntu VPS)

If you prefer running Node.js and PostgreSQL directly on the server without Docker to minimize RAM consumption on small VPS plans (e.g. 1GB–2GB RAM):

#### Step 1: Install Dependencies on Ubuntu Server
```bash
# Update OS
sudo apt update && sudo apt upgrade -y

# 1. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PM2 Globally
sudo npm install -g pm2

# 3. Install NGINX & Git
sudo apt install -y nginx git

# 4. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

#### Step 2: Configure PostgreSQL Database
```bash
# Switch to postgres user
sudo -u postgres psql

# Run inside SQL prompt:
CREATE DATABASE company_prod;
CREATE USER db_admin WITH ENCRYPTED PASSWORD 'StrongPasswordHere!123';
GRANT ALL PRIVILEGES ON DATABASE company_prod TO db_admin;
\q
```

#### Step 3: Clone, Build & Run the Backend with PM2
```bash
# Clone to /var/www/
sudo git clone https://github.com/your-username/my-fullstack-app.git /var/www/app
cd /var/www/app/server

# Install and build backend
npm ci
npm run build

# Configure .env file
nano .env # Add DATABASE_URL=postgresql://db_admin:StrongPasswordHere!123@localhost:5432/company_prod

# Run database migrations
npx prisma migrate deploy

# Start with PM2 in Cluster Mode (Spawns across all CPU cores)
pm2 start dist/server.js --name "api-backend" -i max --env production

# Make PM2 automatically start on server reboot
pm2 startup systemd
# (Copy and run the sudo env command generated by PM2)
pm2 save
```

#### Step 4: Build the React Frontend
```bash
cd /var/www/app/client
npm ci
npm run build

# Verify build output exists at: /var/www/app/client/dist
ls -la /var/www/app/client/dist
```

#### Step 5: Configure NGINX (`/etc/nginx/sites-available/app.conf`)
```nginx
server {
    listen 80;
    server_name app.company.com;

    # 1. Serve React Frontend Static Files
    location / {
        root /var/www/app/client/dist;
        index index.html index.htm;
        # 🛡️ Crucial for React Router client-side navigation
        try_files $uri $uri/ /index.html;
    }

    # 2. Reverse Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default # Remove default NGINX welcome page
sudo nginx -t                           # Test syntax
sudo systemctl reload nginx             # Apply changes
```

---

### Step 5: Domain Setup & Free Automatic SSL with Let's Encrypt

1. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger):
   * Add an **`A` Record**:
     * **Host / Name:** `app` (or `@` for root domain)
     * **Value / Points to:** `YOUR_SERVER_IP` (e.g. `195.35.42.10`)
     * **TTL:** `Auto` or `300s`

2. On your VPS terminal, install Certbot and provision free SSL:
```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtain and automatically install SSL into NGINX
sudo certbot --nginx -d app.company.com
```

Certbot automatically modifies your NGINX configuration to:
* Enforce HTTP $\rightarrow$ HTTPS redirection.
* Install the TLS certificates.
* Configure automated 90-day certificate renewals via systemd timers.

---

### Step 6: How to Deploy Updates with Zero Downtime (Day-2 Operations)

When you make changes to your code and push to GitHub, run this 30-second deployment update on your server:

```bash
# update-deploy.sh - ZERO-DOWNTIME ROLLOUT SCRIPT
cd /var/www/app

# 1. Pull latest code
git pull origin main

# 2. Update backend and reload cluster (zero dropped requests!)
cd server
npm ci --omit=dev
npm run build
npx prisma migrate deploy
pm2 reload api-backend # PM2 gracefully restarts 1 worker at a time!

# 3. Update frontend
cd ../client
npm ci
npm run build # NGINX instantly begins serving new HTML/JS files

echo "✅ Deployment update complete with zero downtime!"
```

---

### Step 7: Automated Nightly Database Backups (`cron`)

Never run production without automated database backups:

```bash
# 1. Create backup script
sudo mkdir -p /var/backups/postgres
sudo nano /usr/local/bin/backup-db.sh
```

Paste this backup script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="company_prod"
DB_USER="db_admin"

# Dump database to compressed archive
pg_dump -U $DB_USER -h localhost -d $DB_NAME | gzip > "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Delete backups older than 14 days
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +14 -delete
```

Make executable and add to crontab:
```bash
sudo chmod +x /usr/local/bin/backup-db.sh

# Run every night at 2:00 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-db.sh") | crontab -
```

---

## 5. 🧪 Hands-On Verification & Lab

### 1. Verify Deployment Health via `curl`
```bash
# 1. Verify frontend returns React HTML index
curl -I https://app.company.com/

# 2. Verify backend API health check returns healthy
curl -i https://app.company.com/api/healthz

# Expected Response:
# HTTP/2 200
# content-type: application/json; charset=utf-8
# {"status":"ok","database":"connected","uptime":1240}
```

### 2. Verify Client-Side Routing Persistence
Open `https://app.company.com/dashboard/settings` in your browser. Refresh the page 5 times.
* **Pass:** The settings page reloads smoothly.
* **Fail:** If you see NGINX `404 Not Found`, check your `try_files` rule.

### 3. Automated Post-Deployment Verification Test (Vitest)
```typescript
// prod-smoke.test.ts
import { describe, it, expect } from 'vitest';

describe('Live Production Smoke Suite', () => {
  const DOMAIN = 'https://app.company.com';

  it('verifies SSL certificate and security headers are active', async () => {
    const res = await fetch(`${DOMAIN}/api/healthz`);
    expect(res.status).toBe(200);

    const hsts = res.headers.get('strict-transport-security');
    expect(hsts).toBeDefined();
  });

  it('confirms CORS permits requests from the frontend domain', async () => {
    const res = await fetch(`${DOMAIN}/api/healthz`, {
      headers: { Origin: DOMAIN },
    });
    expect(res.status).toBe(200);
  });
});
```

---

## 6. 📋 Production Deployment Checklist

- [ ] **SPA Routing Configured:** Is `try_files $uri $uri/ /index.html;` set in NGINX so React client routes don't 404 on refresh?
- [ ] **Relative or Environment API URLs:** Does the React client connect to `/api` or `process.env.VITE_API_URL` instead of `http://localhost:3000`?
- [ ] **Database Bound Internally:** Is PostgreSQL listening strictly on `127.0.0.1` or inside an isolated Docker bridge network?
- [ ] **PM2 Auto-Restart on Boot:** Has `pm2 startup` and `pm2 save` been executed so Node.js restarts automatically if the server reboots?
- [ ] **HTTPS Enforced with Certbot:** Is Let's Encrypt SSL active with automated 90-day renewal timers enabled?
- [ ] **UFW Firewall Active:** Are ports limited to `22` (SSH), `80` (HTTP), and `443` (HTTPS) with all other ports denied?
- [ ] **Automated Daily Backups:** Is a `pg_dump` cron job scheduled to create daily compressed backups with a 14-day retention cycle?
- [ ] **Zero-Downtime Reload:** Are production code updates deployed using `pm2 reload` or rolling container restarts?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [How to Deploy a MERN / Full-Stack App to Ubuntu VPS (Traversy Media)](https://www.youtube.com/watch?v=oykl1ERVw4U) — Complete beginner-to-pro guide setting up Ubuntu, NGINX, PM2, and Let's Encrypt.
- 🎥 [Docker Compose in Production: Deploying Full-Stack Apps (TechWorld with Nana)](https://www.youtube.com/watch?v=F0_k239Xw4U) — Step-by-step containerized deployment with multi-container networking.
- 🎥 [NGINX Reverse Proxy for Single Page Applications (Hussein Nasser)](https://www.youtube.com/watch?v=7VAI73roXaY) — Explaining `try_files`, SPA routing, and API proxy passing.
- 🎥 [Zero-Downtime Deployments Explained (ByteByteGo)](https://www.youtube.com/watch?v=scEDHsr3APg) — Visual architectural comparison of Rolling Updates, Blue-Green, and Canary releases.

### 📖 Primary Documentation & Specifications
- 📜 [NGINX Official Documentation: Deploying SPA Applications](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/) — Serving static files and handling client-side routing.
- 📜 [PM2 Production Guide](https://pm2.keymetrics.io/docs/usage/quick-start/) — Process clustering, logs, and zero-downtime reloads.
- 📜 [Certbot Official Instructions](https://certbot.eff.org/instructions) — Free automated TLS certificate provisioning for NGINX.

### 🧪 Interactive Hands-On Training Labs & Tools
- 🎯 [Killercoda Interactive Ubuntu & Docker Terminal](https://killercoda.com/) — Free disposable browser terminal to practice Ubuntu VPS deployment commands.
- 🎯 [SSL Labs Server Test](https://www.ssllabs.com/ssltest/) — Grade your live deployed domain's SSL/TLS configuration (aim for A+!).
