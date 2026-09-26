---
mode: agent
description: "Generate Playwright E2E tests via the Playwright MCP server"
---
Use the `playwright` MCP server to explore the running app at http://localhost:3000 (start it with `npm start` if needed). Take a page snapshot to find accessible roles, labels and test ids.

Then write Playwright tests in `tests/e2e/wi-<ID>-<slug>.spec.js` for the user-facing flows in the current work item's acceptance criteria:
- `test.describe('Work item <ID> — <title>')`, one `test('ACn: …')` per criterion.
- Locate elements by role, label or test id; include an explicit `expect` for each criterion.
- Keep the video/screenshot/trace settings from `playwright.config.js` (failure evidence for the Allure report).

Run `npm run test:e2e` and report the results.
