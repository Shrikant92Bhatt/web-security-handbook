# Multi-Cloud Deployment Guide: Hostinger VPS, Google Cloud Platform (GCP) & AWS

## 1. 🎯 Overview & Intuitive Mental Model

Deploying a full-stack application (React + Node.js + PostgreSQL + NGINX) requires choosing the right balance between cost, operational complexity, and enterprise scalability:

```
+----------------------------------------------------------------------------------------------------+
|                                    🧠 THE PHYSICAL ANALOGY                                         |
|                                                                                                    |
|  🏠 Hostinger VPS (The Compact Rented Apartment):                                                  |
|     - You get a single solid set of keys (Root SSH access).                                        |
|     - You assemble your own furniture (Install Docker, Postgres, NGINX, PM2, and Let's Encrypt).   |
|     - Ultra low cost ($5–$15/month). Best for indie hackers, MVPs, and early-stage production.     |
|                                                                                                    |
|  🏢 Google Cloud Platform / GCP (The Modern High-Tech Smart Building):                             |
|     - Fully automated services (Cloud Run auto-scales containers to zero when idle).               |
|     - Cloud SQL manages database backups, replication, and failovers automatically.               |
|     - Developer-friendly, fast startup times, great for modern cloud-native containerized apps.    |
|                                                                                                    |
|  🌐 Amazon Web Services / AWS (The Massive Industrial Enterprise Compound):                        |
|     - Infinite enterprise controls, compliance certifications, and deep multi-region scale.         |
|     - ECS Fargate runs serverless containers; RDS Aurora manages auto-scaling PostgreSQL clusters.  |
|     - Best for enterprise compliance, high-traffic SaaS, and complex multi-service ecosystems.     |
+----------------------------------------------------------------------------------------------------+
```

### Deployment Risk & Security Matrix
- **OWASP Category:** A05:2021 – Security Misconfiguration & A01:2021 – Broken Access Control
- **CWE Identifiers:** [CWE-284: Improper Access Control](https://cwe.mitre.org/data/definitions/284.html), [CWE-16: Configuration](https://cwe.mitre.org/data/definitions/16.html)
- **Blast Radius:** Publicly exposed database ports, compromised root SSH access, runaway cloud billing, unencrypted database backups.

---

## 2. 🎨 Interactive Visual Architecture

### Full-Stack Multi-Cloud Deployment Comparison

```mermaid
graph TD
    subgraph Client["Public Internet (User Requests)"]
        Browser["🌐 React Client (Web / Mobile)"]
    end

    subgraph HostingerVPS["Option 1: Hostinger VPS ($5-$20/mo)"]
        H_Nginx["🛡️ NGINX (Port 80/443 + Let's Encrypt)"]
        H_Node["⚙️ Node.js App (PM2 / Docker)"]
        H_PG["🗄️ PostgreSQL (Internal Docker Network)"]
        H_Nginx -->|Reverse Proxy| H_Node
        H_Node -->|Private Port 5432| H_PG
    end

    subgraph GCPCloud["Option 2: Google Cloud Platform (GCP)"]
        G_LB["🛡️ Cloud Load Balancing & Cloud Armor WAF"]
        G_Run["🚀 Cloud Run (Serverless Container Autoscaling)"]
        G_SQL["🗄️ Cloud SQL PostgreSQL (Private IP VPC)"]
        G_Secret["🔐 Cloud Secret Manager"]
        G_LB --> G_Run
        G_Run -->|Cloud SQL Auth Proxy| G_SQL
        G_Run -.->|Fetch Credentials| G_Secret
    end

    subgraph AWSCloud["Option 3: Amazon Web Services (AWS)"]
        A_ALB["🛡️ Application Load Balancer + AWS WAF"]
        A_ECS["🚀 ECS Fargate (Serverless Docker Cluster)"]
        A_RDS["🗄️ RDS PostgreSQL (Multi-AZ Private Subnet)"]
        A_SSM["🔐 AWS Secrets Manager"]
        A_ALB --> A_ECS
        A_ECS -->|VPC Security Group :5432| A_RDS
        A_ECS -.->|IAM Task Role| A_SSM
    end

    Browser -->|Public Traffic| H_Nginx
    Browser -->|Public Traffic| G_LB
    Browser -->|Public Traffic| A_ALB

    classDef hostinger fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;
    classDef gcp fill:#0ea5e9,stroke:#0284c7,stroke-width:2px,color:#fff;
    classDef aws fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
    class H_Nginx,H_Node,H_PG hostinger;
    class G_LB,G_Run,G_SQL,G_Secret gcp;
    class A_ALB,A_ECS,A_RDS,A_SSM aws;
```

> 💡 **Visual Inspection Tip:** On your server or cloud console, inspect firewall rules. PostgreSQL port `5432` must **NEVER** have `0.0.0.0/0` in its allowed ingress rules! Database ports should bind strictly to `127.0.0.1` or private VPC subnets.

---

## 3. 💥 Real-World Exploit & Cloud Misconfiguration Walkthrough

### The "Default Root SSH & Exposed Database Port 5432" Ransomware Attack

When provisioning a raw VPS or public cloud instance, inexperienced developers leave PostgreSQL port `5432` open to `0.0.0.0/0` with default password `postgres`.

#### Vulnerable VPS Configuration
```bash
# DANGEROUS VPS PROVISIONING
# 💥 FLAW 1: PostgreSQL listens on all public network interfaces!
# In /etc/postgresql/15/main/postgresql.conf:
listen_addresses = '*'

# In /etc/postgresql/15/main/pg_hba.conf:
host all all 0.0.0.0/0 md5

# 💥 FLAW 2: Firewall is completely disabled!
ufw status # Status: inactive

# 💥 FLAW 3: Root login via plaintext password enabled in /etc/ssh/sshd_config
PermitRootLogin yes
PasswordAuthentication yes
```

#### Exploit Execution Breakdown
1. **Automated Shodan / Masscan Sweep:** Automated internet botnets scan the IPv4 space for open port `5432` 24/7.
2. **Brute Force & Credential Spray:** Botnet connects directly to `http://YOUR_SERVER_IP:5432` and attempts standard passwords (`postgres`, `admin`, `password123`).
3. **Automated Database Wipe & Ransom Note:** In under 12 seconds, the bot drops all tables, executes `pg_dump` to exfiltrate private customer data, and inserts a single table:
   ```text
   README_PLEASE: All your databases are encrypted! Send 0.1 Bitcoin to bc1q...
   ```

---

## 4. 🛡️ Complete Production Deployment Blueprints

### Blueprint 1: Hostinger VPS Production Setup (Ubuntu + Docker Compose + NGINX)

#### Step 1: Base Server Hardening
Connect via SSH and secure the server:
```bash
# 1. Update OS packages
apt update && apt upgrade -y

# 2. Create non-root deploy user with sudo privileges
adduser deploy
usermod -aG sudo deploy

# 3. Setup SSH key authentication for deploy user
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# 4. Disable Root Login and Password Authentication
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 5. Enable UFW Firewall (Only allow SSH, HTTP, and HTTPS)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

#### Step 2: Production `docker-compose.yml` (Hostinger VPS)
```yaml
# /home/deploy/app/docker-compose.yml
version: '3.8'

services:
  # 🗄️ Database: Internal private network only (No host ports exposed!)
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: production_db
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: ${DB_STRONG_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d production_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ⚙️ Node.js API Service
  backend:
    image: ghcr.io/your-username/backend:latest
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgres://app_user:${DB_STRONG_PASSWORD}@postgres:5432/production_db
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - internal_network

  # 🛡️ NGINX Edge & SSL Proxy
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - backend
    networks:
      - internal_network

volumes:
  postgres_data:

networks:
  internal_network:
    driver: bridge
```

---

### Blueprint 2: Google Cloud Platform (GCP) Cloud Run + Cloud SQL

Google Cloud Run is the gold standard for serverless container deployment: zero server management, fast cold starts, and automated SSL termination.

```bash
# 1. Enable Required GCP APIs
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com

# 2. Provision Managed Cloud SQL PostgreSQL Instance
gcloud sql instances create prod-pg-instance \
  --database-version=POSTGRES_16 \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --availability-type=REGIONAL \
  --backup-start-time=02:00 \
  --storage-auto-increase

# 3. Create Database & User
gcloud sql databases create app_db --instance=prod-pg-instance
gcloud sql users create app_user --instance=prod-pg-instance --password='SUPER_SECURE_PASSWORD'

# 4. Store Database Connection URL in Secret Manager
echo -n "postgresql://app_user:SUPER_SECURE_PASSWORD@localhost/app_db?host=/cloudsql/PROJECT_ID:us-central1:prod-pg-instance" | \
  gcloud secrets create DB_URL --data-file=-

# 5. Deploy Container to Cloud Run with Cloud SQL Auth Proxy Built-in
gcloud run deploy api-service \
  --image=gcr.io/PROJECT_ID/backend:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=PROJECT_ID:us-central1:prod-pg-instance \
  --set-secrets=DATABASE_URL=DB_URL:latest \
  --min-instances=1 \
  --max-instances=20 \
  --cpu=2 \
  --memory=2Gi
```

---

### Blueprint 3: Amazon Web Services (AWS) ECS Fargate + RDS PostgreSQL

AWS ECS Fargate runs production containers without managing EC2 virtual machine instances.

#### Step 1: Provision AWS RDS PostgreSQL in Private VPC Subnet
* Deploy Amazon RDS inside a **Private DB Subnet Group** (no Public IP assigned).
* Configure a **Security Group (`sg-rds-postgres`)**:
  * Inbound Rule: Allow `Port 5432` from Source `sg-ecs-tasks` only!

#### Step 2: ECS Fargate Task Definition (`task-definition.json`)
```json
{
  "family": "api-production-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/apiTaskRole",
  "containerDefinitions": [
    {
      "name": "backend-container",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/backend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/db_url"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/api-production",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]
}
```

---

## 5. 🧪 Hands-On Verification & Lab

### 1. Test Server Firewall Isolation (`nmap`)
Run a port scan from your local machine against your production server IP to verify database port isolation:

```bash
# Scan all standard ports
nmap -p 22,80,443,5432 your-server-ip
```

#### Expected Production Hardened Output:
```text
PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
5432/tcp filtered postgresql
```
*(Notice: Port `5432` is `filtered` or `closed` to the public internet, proving that UFW or VPC Security Groups are enforcing isolation).*

### 2. Verify Zero-Downtime Rolling Update (Automated Smoke Test)
```bash
# Run 100 consecutive requests during a deployment to prove zero dropped connections
while true; do 
  curl -s -o /dev/null -w "%{http_code} (%{time_total}s)\n" https://app.company.com/healthz
  sleep 0.5
done
```
**Verification:** Confirm that every request returns `200` without any `502 Bad Gateway` or `Connection Refused` blips during the rollout.

---

## 6. 📋 Multi-Cloud Production Checklist

- [ ] **No Public Database Binding:** Is PostgreSQL bound strictly to private internal networks (Docker bridge, GCP VPC, or AWS Private Subnet)?
- [ ] **Root SSH Disabled:** Is `PermitRootLogin no` configured with public-key-only authentication on all VPS instances?
- [ ] **Secrets Stored in Secret Managers:** Are production database credentials loaded from AWS Secrets Manager, GCP Secret Manager, or encrypted environment files (never committed to git)?
- [ ] **Automated Automated Backups:** Are automated point-in-time recovery (PITR) backups enabled on PostgreSQL with retention set to at least 7–30 days?
- [ ] **Health Checks Configured:** Do Cloud Run, AWS Target Groups, or Docker Compose have a valid `/healthz` probe configured?
- [ ] **Container Immutability:** Are application containers stateless, writing logs to stdout/stderr and persistent uploads to S3/GCS buckets?
- [ ] **Cost / Billing Alert Activated:** Are budget alerts configured in AWS/GCP to prevent unexpected traffic spikes or rogue resource spinning?

---

## 7. 🎥 Curated Video Walkthroughs & Primary References

### 📺 High-Impact Video Explanations
- 🎥 [Complete DevOps Infrastructure Setup on VPS (TechWorld with Nana)](https://www.youtube.com/watch?v=F0_k239Xw4U) — Step-by-step tutorial setting up Ubuntu, UFW firewall, Docker Compose, and NGINX reverse proxy.
- 🎥 [Google Cloud Run Masterclass (Fireship)](https://www.youtube.com/watch?v=kY31Wn6Vw6I) — Complete walkthrough of serverless container deployments, Cloud SQL connections, and secrets management.
- 🎥 [AWS ECS Fargate & Application Load Balancer Architecture (ByteByteGo)](https://www.youtube.com/watch?v=1r_A_B_k3l4) — Visual system architecture explaining VPC subnets, task roles, and rolling updates.
- 🎥 [How to Secure a Linux Server in 10 Minutes (Hussein Nasser)](https://www.youtube.com/watch?v=HiBdZ9DVVio) — Hardening SSH keys, fail2ban, firewall rules, and user permissions.

### 📖 Primary Documentation & Specifications
- 📜 [Docker Compose Production Best Practices](https://docs.docker.com/compose/production/) — Official guidelines for container health checks, secrets, and restarting policies.
- 📜 [Google Cloud Run Documentation](https://cloud.google.com/run/docs) — Deploying containerized microservices and connecting to Cloud SQL.
- 📜 [AWS ECS Developer Guide: Fargate Launch Type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) — Serverless container management on AWS.

### 🧪 Interactive Hands-On Training Labs & Tools
- 🎯 [Killercoda Interactive Linux & Docker Sandbox](https://killercoda.com/) — Free browser terminal to practice hardening Ubuntu servers and configuring Docker Compose.
- 🎯 [AWS Skill Builder Free Hands-On Labs](https://explore.skillbuilder.aws/) — Official interactive sandbox for AWS ECS and RDS provisioning.
