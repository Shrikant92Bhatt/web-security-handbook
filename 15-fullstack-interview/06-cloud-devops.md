# 06 — Cloud, DevOps & Production Operations

[Module 2 home](README.md) · [Previous: Databases](05-databases-and-caching.md) · **Chapter 6 of 8**

## Cloud fundamentals

- Regions, availability zones, VPC/VNet, subnets, routing and firewalls.
- Compute: VMs, containers, managed platforms and serverless.
- Object/block/file storage; managed databases and cache services.
- IAM, roles, policies, workload identity and least privilege.
- Secrets management, KMS/encryption and key rotation.
- CDN, DNS, load balancers, autoscaling and managed ingress.

## Delivery and operations

Docker images, multi-stage builds, non-root containers, CI/CD stages, test gates, artifact promotion, Infrastructure as Code, blue-green/canary/rolling deployments, logs/metrics/traces, SLI/SLO/SLA, incident response, backups, RPO/RTO and cost management.

## Interview questions

- Compare VMs, containers and serverless.
- Explain Docker image layers and multi-stage builds.
- Design CI/CD for a React + Node application.
- How store and rotate secrets safely?
- Compare blue-green, canary and rolling deployment.
- Difference between horizontal and vertical autoscaling?
- Explain readiness vs liveness probes.
- What are logs, metrics and traces?
- Explain SLI, SLO, SLA, RPO and RTO.
- How investigate a production incident after deployment?

## Quick revision

Draw a pipeline from commit to production. Know IAM, networking, container basics, deployment strategies, observability and rollback.

**Practice:** design deployment for frontend, API and database with private networking, secrets, health checks, monitoring and rollback.

**Next:** [07 · Full-Stack & System Design](07-system-design.md).
