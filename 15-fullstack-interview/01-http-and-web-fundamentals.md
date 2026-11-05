# 01 — HTTP and How the Web Works

**In simple words:** HTTP is how a browser and a server talk. When you open a website, the browser finds the server, asks for a page or data, and shows the reply. Example: your browser asks the shop website for product 42, and the server sends back its name and price.

[Module 2 home](README.md) · **Chapter 1 of 8**

**In simple words:** HTTP is how a browser and a server talk. When you open a website, the browser finds the server, connects to it, asks for a page or data, and shows the reply.

## What happens when you open a website?

Example: you type https://shop.example.com/products.

1. The browser reads the address.
2. DNS finds the server's IP address, like looking up a shop's street address.
3. The browser connects to the server.
4. HTTPS protects the connection using TLS.
5. The browser sends an HTTP request.
6. The server sends back HTML, CSS, JavaScript or data.
7. The browser builds and displays the page.

## Request and response

A request has a method, address, headers and sometimes a body. A response has a status code, headers and sometimes a body.

~~~http
GET /products/42 HTTP/1.1
Host: shop.example.com
Accept: application/json
~~~

Possible response: { "id": 42, "name": "Coffee Mug", "price": 250 }

## Common methods

| Method | Meaning | Example |
|---|---|---|
| GET | Read something | View product 42 |
| POST | Create or submit something | Place an order |
| PUT | Replace something | Replace a profile |
| PATCH | Change part of something | Change profile photo |
| DELETE | Remove something | Delete a saved address |

An idempotent request gives the same final result if it is repeated. For example, setting an address to the same value twice should not create two addresses. This matters when a network fails and the browser retries.

## Status codes

- 200: worked.
- 201: something was created.
- 204: worked; no response body.
- 400: request data is not valid.
- 401: sign-in is missing or invalid.
- 403: signed in, but not allowed.
- 404: item or route was not found.
- 429: too many requests.
- 500: server failed.

## DNS, TCP and TLS

DNS finds the IP address for a domain name. TCP creates a reliable connection between computers. TLS encrypts the connection and helps the browser check the server's identity. HTTPS is HTTP sent through TLS.

## HTTP versions

HTTP/1.1 is widely supported. HTTP/2 can send many requests over one connection. HTTP/3 uses QUIC and can handle some network changes and packet loss better. Understand the problem each version improves; do not start by memorizing every internal detail.

## Cookies and browser storage

A cookie can be sent automatically with matching requests. It is often used for a login session. HttpOnly stops page JavaScript from reading a cookie; Secure means it is sent only over HTTPS; SameSite helps control when it is sent from another site.

- localStorage stays until code or the user clears it.
- sessionStorage normally stays for that browser tab session.
- Cookies can be sent automatically to the server.

Do not store sensitive login tokens in browser storage without understanding the risk. An XSS bug can let malicious JavaScript read browser data.

## Same-origin policy and CORS

The browser normally stops a page on one website from reading private responses from another website. This is the same-origin policy.

CORS lets a server say which other website addresses may read its response. CORS is not a login check and does not stop someone from calling your API outside a browser.

## Caching

Caching keeps a copy of data so it can be reused instead of fetched again. A product image may be saved in the browser cache. Cache-Control says how long a saved response may be reused. ETag lets the browser ask whether its saved copy is still current.

## Interview questions

- What happens after you type a URL and press Enter?
- What does DNS do?
- Why do we use HTTPS?
- What is the difference between GET and POST?
- What is the difference between 401 and 403?
- What is CORS? What does it not protect?
- When would you use a cookie instead of localStorage?
- How does browser caching save time?

## Quick revision

Explain the URL-to-page journey in your own words. Know common methods, status codes, cookie flags and the purpose of DNS, TCP, TLS, CORS and caching.

**Try it:** open browser DevTools → Network, reload a page and inspect one request. Find its method, status code, request headers, response headers and timing.

**Next:** [02 · JavaScript & TypeScript](02-javascript-typescript.md).
