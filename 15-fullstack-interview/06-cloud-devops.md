# 06 — Cloud, DevOps and Running an Application

[Module 2 home](README.md) · [Previous: Databases](05-databases-and-caching.md) · **Chapter 6 of 8**

**In simple words:** Cloud providers rent computing, storage and networking to you. DevOps is how a team builds, tests, releases and looks after software.

## Cloud building blocks

- Compute: a virtual machine, container or serverless function that runs code.
- Storage: a place to keep files and backups.
- Database: a service that stores application data.
- Network: controls how services talk to each other.
- Identity and access: decides who or what can use each service.
- Region and availability zone: a data-centre location and a separate area within a region.

A shop website may serve images from object storage, run its API in containers and use a managed SQL database.

## Containers

A container packages an app with the files and libraries it needs to run. Docker is a common tool for building and running containers. A container is not the same as a virtual machine; several containers can share the host operating system while staying separated.

## CI/CD

A simple release process: a developer pushes code; the pipeline installs packages, runs checks and tests, builds the app, deploys it to a test environment, then deploys to production after approval. It checks the app and can roll back if needed.

## Keep the application safe

Give each service only the permissions it needs. Store passwords and API keys in a secrets manager, not in Git. Use HTTPS. Keep databases private where possible. Update old packages. Back up important data and test restoring it. Keep a way to undo a bad release.

## Watch the application

- Logs are written records of what happened.
- Metrics are numbers such as request count, error rate and response time.
- Traces show how one request moved through several services.

If checkout is slow, a trace can help show whether the delay is in the API, database or payment provider.

## Interview questions

- What is the difference between a virtual machine and a container?
- What happens in a CI/CD pipeline?
- Where should API keys be stored?
- Why should a database not be open to the public internet?
- What is the difference between logs, metrics and traces?
- What is a health check?
- How would you undo a failed release?
- Why do we need backups and restore tests?

## Quick revision

Draw the path from a code push to production. Explain containers, secrets, permissions, monitoring, backups and rollback in plain language.

**Try it:** describe how you would deploy a React frontend and Node.js API with a database, environment variables, health checks and a rollback plan.

**Next:** [07 · Full-Stack & System Design](07-system-design.md).
