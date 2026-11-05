# 07 — Full-Stack and System Design

[Module 2 home](README.md) · [Previous: Cloud & DevOps](06-cloud-devops.md) · **Chapter 7 of 8**

**In simple words:** System design is planning how the parts of an application work together. In an interview, explain what you are building, draw the main parts and show how the design handles more users and failures.

## Start with the problem

Before choosing tools, ask who will use the app, what they should be able to do, how many users or requests to expect, what data must be saved and what happens if a service is down.

Do not start by saying "we need microservices" or "we need Kafka". First understand the problem.

## Draw the main parts

~~~text
Browser / Mobile App
        |
   API / Backend
     /       \
Database    Cache
        |
   Background Worker
        |
   Email / Other Services
~~~

Explain what each part does and why it is needed.

## Make it handle more users

A load balancer sends requests across several servers. A cache avoids repeating expensive reads. A queue lets slow work happen later. A database index helps find records faster. Horizontal scaling means adding more copies of a service. A CDN serves images and other files from places closer to users.

Add these only when the problem needs them.

## Plan for failures

A payment provider may be unavailable. A request may be sent twice. A worker may crash halfway through a job. Explain how your design handles these cases.

Timeouts stop requests waiting forever. Limited retries can help with temporary failures. Idempotency prevents a repeated request from doing the same action twice. Backups help recover lost data. Logs and metrics help find problems.

## Frontend system design

Discuss page and component structure, where state lives, how data is fetched, loading and error states, pagination, accessibility, performance, testing and what the UI does when the network is offline.

## Practice questions

- Design a chat application.
- Design a notification system.
- Design a file upload service.
- Design a product search page.
- Design a dashboard that shows live data.
- Design an app where each company can see only its own data.

## How to answer a system-design question

1. Repeat the problem in your own words.
2. Ask questions and state your assumptions.
3. Draw the browser, API, database and any other needed parts.
4. Explain one user journey from start to finish.
5. Explain what happens when traffic grows or a service fails.
6. Explain security, testing and monitoring.
7. Say what you would improve if the product became larger.

## Quick revision

Practise drawing one design in 10–15 minutes. Explain why you chose each part. A simple design with clear reasons is better than a diagram full of tools you cannot explain.

**Try it:** design a chat app. Show how a message is sent, saved, delivered to the other user and shown again after reconnecting.

**Next:** [08 · Question Bank & Day-Before Revision](08-interview-question-bank.md).
