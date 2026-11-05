# Simple-Word Glossary

Technical words are useful in interviews, but first understand the idea. This glossary gives a short, everyday explanation and a small example.

| Word | Simple meaning | Example |
|---|---|---|
| API | A way for two programs to talk | Frontend asks for a product list |
| Authentication | Checking who someone is | Signing in with a password |
| Authorization | Checking what someone is allowed to do | A customer can see their own order, not another customer's |
| Backend | Code that runs on the server | Checks an order and saves it |
| Cache | A saved copy used to answer faster | Keep product details in Redis for a short time |
| CI/CD | Automatic steps to test and release code | Run tests when code is pushed |
| Closure | A function that remembers variables around it | A counter function remembers its count |
| Component | A reusable piece of the screen written as a function | A ProductCard shows one product |
| CORS | A browser rule that controls which websites can read a response | Allow the shop website to read the shop API |
| CSP | Browser rules that limit where page scripts can come from | Allow scripts only from trusted places |
| CSRF | Tricking a signed-in browser into sending a request | A hidden page tries to submit a transfer |
| Database index | A lookup list that helps find rows faster | Find a customer by email |
| Event loop | The system that decides which waiting JavaScript callback runs next | Handle a completed network request |
| Hook | A React function starting with `use` that adds state or other features to a component | `useState` remembers the cart count |
| Horizontal scaling | Add more servers to share the work | Run four copies of an API instead of one |
| Hydration | React attaching click handlers to HTML that the server already sent | A server-rendered product page becomes clickable |
| Idempotency | Repeating a request does not repeat the action | A retry does not create a second order |
| Injection | Input is wrongly treated as a command | Search text changes the meaning of a SQL query |
| JSX | HTML-like syntax inside JavaScript that becomes function calls | `<h1>{title}</h1>` |
| Load balancer | Sends requests across available servers | Share traffic across three API servers |
| Middleware | Code that runs before the main API route | Check a login before loading an order |
| OAuth 2.0 | A way to give an app limited access without sharing your password | Let a calendar app read your calendar |
| OIDC | A sign-in layer built on OAuth 2.0 | Sign in with a trusted identity provider |
| Promise | A value that will be ready later or may fail | Wait for a product API response |
| Props | Read-only inputs a parent passes to a child component | `<ProductCard price={450} />` |
| Queue | A list of jobs waiting to be done | Send order emails in the background |
| Rate limit | A cap on how often someone can call an API | Limit repeated login attempts |
| Reconciliation | React comparing the old and new UI to find the smallest DOM change | Only the changed cart total is updated |
| Redis | A fast data store often used for cache, sessions and queues | Keep a product copy for 60 seconds |
| Reducer | A pure function that takes state and an action and returns new state | `cartReducer(state, { type: 'added' })` |
| Server Component | A React component that runs only on the server and sends no code to the browser | Product page reads the database directly |
| SSR | Server sends HTML already prepared for the browser | First page view arrives with content |
| State | Data a component remembers that can change and cause a re-render | Whether a dropdown is open |
| Virtual DOM | An in-memory description of the UI that React compares between renders | Objects like `{ type: 'li', props: {...} }` |
| SAST | A tool that checks source code for possible security issues | Scan code before release |
| DAST | A tool that tests a running application | Test a local website for unsafe behavior |
| SCA | A tool that checks third-party packages for known problems | Find an old vulnerable npm package |
| Session | A server-side record that remembers a signed-in user | A session ID links requests to a login |
| SQL | Language used to read and change relational database data | Find all orders for one customer |
| TLS | Technology that encrypts a network connection | Protect data sent over HTTPS |
| Trust boundary | A place where data moves between parts with different levels of trust | Data from a browser enters the backend |
| XSS | Attacker-controlled script runs in a page | Unsafe user text is treated as HTML and runs as code |
| BOLA / IDOR | Backend lets a user access someone else's record | Change order ID 10 to 11 and see another person's order |
| SSRF | An attacker tricks a server into making a request | A URL feature is abused to reach an internal service |

**Study tip:** when you meet a new term, write one plain sentence, one small example and one sentence about why it matters. Then learn the formal definition.
