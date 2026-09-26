---
applyTo: "src/**,public/**"
---
# Code quality

- Use `'use strict';` and CommonJS (`require` / `module.exports`) in `src/`.
- Put business rules in `src/eventService.js` as small, pure, exported functions. Routes in `src/app.js` stay thin: parse input, call the service, return JSON.
- API errors return JSON `{ "error": "<message>" }` with the correct status code (400 invalid input, 404 not found, 409 conflict).
- Never mutate the seed data file; work on the in-memory store from `createStore()`.
- Front end: build DOM with `textContent` (never `innerHTML` with user or API data). Give interactive elements accessible labels so tests can find them by role and name.
- Keep functions under ~30 lines; name things after the domain (event, seats, registration).
- No new npm dependencies without the developer's approval.
