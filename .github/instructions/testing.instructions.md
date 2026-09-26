---
applyTo: "tests/**"
---
# Testing conventions

## Traceability
- Name every `describe` block after the work item: `describe('Work item 102 — Search events by keyword', ...)`.
- Prefix each test name with the acceptance criterion it proves: `test('AC3: ...')`. One test may cover one criterion; every criterion needs at least one test.

## Unit tests (Jest, `tests/unit/*.test.js`)
- Test service functions directly and API routes with `supertest` against `createApp()`.
- For each criterion cover **positive**, **negative** and **edge** cases (empty input, whitespace, case differences, boundaries such as 0 seats).
- Use a fresh `createStore()` per test when state can change.

## E2E tests (Playwright, `tests/e2e/*.spec.js`)
- Use `baseURL` (`page.goto('/')`); the config starts the app automatically.
- Locate elements by role, label or test id (`getByRole`, `getByLabel`, `getByTestId('event-card')`) — never by CSS position.
- Assert each acceptance criterion explicitly with `expect(...)`. Include at least one assertion per criterion.
- Do not add waits with fixed timeouts; rely on Playwright's auto-waiting assertions.
- Video, screenshots and traces are recorded on failure by the config — do not change those settings.
