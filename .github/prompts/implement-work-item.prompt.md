---
mode: agent
description: "Run the standardised 5-step AI-SDLC workflow for one Azure DevOps work item"
---
You are executing the standardised Copilot–MCP workflow from the AI-SDLC framework for work item **${input:workItemId:Work item ID, e.g. 102}**. Do the steps in order and stop for my confirmation where stated.

## Step 1 — Work item fetch
Use MCP server `azure-devops-mcp` to fetch work item ${input:workItemId} with details (expand relations), comments and relations.
Display the full content before any action: type, title, state, description, acceptance criteria (and repro steps if it is a bug), every comment, and every relation.

## Step 2 — Repository guidelines load
Read all repository instructions under `.github/`, including:
- `.github/copilot-instructions.md`
- `.github/instructions/code-quality.instructions.md`
- `.github/instructions/testing.instructions.md`
- `.github/prompts/unit-test.prompt.md`
- `.github/prompts/test-generation.prompt.md`

Confirm with: "I have read all repository guidelines."

## Step 3 — Code and unit test generation
Implement ONLY what the work item requires. Generate unit tests for all modified logic.
Align test cases to acceptance criteria: positive scenarios, negative scenarios, edge cases.
Do not add assumptions or extra functionality. Then run `npm test` and fix only failures caused by this work item.

## Step 4 — Playwright E2E test generation
Use the `playwright` MCP server to open the running app (start it with `npm start` if needed, http://localhost:3000) and inspect the page.
Generate E2E automation tests in `tests/e2e/` for the user-facing flows described in the acceptance criteria, with assertions for each criterion. Video recording for failure evidence is already enabled in `playwright.config.js`.
Run `npm run test:e2e` and fix only failures caused by this work item.

## Step 5 — Commit
Show me `git status` and the list of files you intend to stage. Stage only files changed for this work item.
Commit message format: `${input:workItemId}: <short summary>`.
Request my confirmation before committing.
