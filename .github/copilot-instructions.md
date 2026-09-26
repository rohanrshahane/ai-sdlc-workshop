# Copilot instructions — Campus Events (AI-SDLC workshop)

This repository is the hands-on sandbox for the paper *AI-Augmented Software Development Lifecycle: A Novel and Integrated Framework*. You are the agent in Layer 3 (Generation) of that framework.

## Project
- Node.js 20+, Express 4, plain HTML/CSS/JS front end (no framework, no build step).
- `src/eventService.js` — pure business logic. `src/app.js` — Express routes. `public/` — front end.
- Unit tests: Jest + supertest in `tests/unit/`. E2E tests: Playwright in `tests/e2e/`.
- Test results go to `allure-results/`; `npm run report` builds the Allure report.

## Workflow invariants (never break these)
1. **Mandatory MCP fetch.** Read work items only through the `azure-devops-mcp` MCP server. Never ask the developer to paste requirements, and never summarise them from memory.
2. **Display before code.** Before writing any code, display the full work item: title, type, state, description, acceptance criteria (and repro steps for bugs), all comments, and relations.
3. **Guidelines confirmation.** Read every file under `.github/` (this file, `.github/instructions/`, `.github/prompts/`) and reply exactly: "I have read all repository guidelines." before implementing.

## Scope rules
- Implement ONLY what the work item's acceptance criteria require. Comments from the Product Owner can narrow scope — respect them.
- Do not add dependencies, refactor unrelated code, or change unrelated tests.
- If an acceptance criterion is ambiguous, ask the developer instead of assuming.

## Commands
- `npm test` — unit tests. `npm run test:e2e` — Playwright E2E tests (starts the app itself).
- `npm run report` — generate the Allure report. `npm start` — run the app on http://localhost:3000.

## Validation and commit
- Run `npm test` and `npm run test:e2e`. Fix only failures caused by the current work item; list any pre-existing failures instead of fixing them.
- Stage only files changed for the work item. Commit message format: `<WORK ITEM ID>: <short summary>` (e.g. `102: Add keyword search for events`).
- Always ask the developer to confirm before committing.
