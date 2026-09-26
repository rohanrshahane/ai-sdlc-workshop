# AI-SDLC Workshop — Campus Events

A hands-on sandbox for the paper **"AI-Augmented Software Development Lifecycle: A Novel and Integrated Framework"** (Shahane, Prakash, Vatsa — Deep Chain Lab, Fairleigh Dickinson University).

You will take a work item from a (mock) Azure DevOps board, let GitHub Copilot in **Agent Mode** read it through the **Model Context Protocol (MCP)**, generate code, unit tests and **Playwright** E2E tests, validate them, see the results in an **Allure** report, and record **AI usage metrics** — the full five-layer framework, on your laptop.

| Layer | What it does | In this repo |
|---|---|---|
| 1 · Input | Work items: stories, acceptance criteria, comments | Mock Azure DevOps: `tools/mock-ado-mcp/` (board at http://localhost:4000) |
| 2 · Orchestration | MCP servers + Copilot Agent Mode | `.vscode/mcp.json` → `azure-devops-mcp` + `playwright` |
| 3 · Generation | Code, unit tests, E2E tests under repo guidelines | `.github/copilot-instructions.md`, `.github/instructions/`, `.github/prompts/` |
| 4 · Validation | Test gate | `npm test`, `npm run test:e2e`, `azure-pipelines.yml` (also `.github/workflows/ci.yml`) |
| 5 · Reporting | Test evidence + AI metrics | `npm run report` (Allure), `npm run metrics` (AI usage) |

---

## 1. Before the workshop (15 minutes)

**You need**

- **Node.js 20 or newer** — https://nodejs.org
- **Git**, with your name and email set:
  `git config --global user.name "Your Name"` and `git config --global user.email you@example.com`
- **VS Code** (latest) with the **GitHub Copilot** and **GitHub Copilot Chat** extensions, signed in to GitHub.
  Copilot Free works but has a monthly limit on agent requests; verified students can usually get Copilot Pro at no cost through GitHub Education — check your eligibility ahead of time.
- **Google Chrome** (the Playwright MCP server drives your installed Chrome by default).

**Set up**

```bash
git clone <repo-url> ai-sdlc-workshop
cd ai-sdlc-workshop
npm install
npx playwright install chromium
npm run doctor
```

`npm run doctor` checks Node, dependencies, the Playwright browser, both MCP servers, Git and port 3000. Fix anything marked ✘ before the session.

**Start the MCP servers in VS Code**

1. Open the folder in VS Code (`code .`). Trust the workspace.
2. Open **Command Palette → MCP: List Servers**. Start **azure-devops-mcp** and **playwright** (or click *Start* above each server in `.vscode/mcp.json`).
3. Open **Copilot Chat**, switch the mode dropdown to **Agent**, click the **tools** icon and check that both servers' tools are listed (e.g. `wit_get_work_item`, `browser_navigate`).

---

## 2. Lab 1 — Look around (10 min)

```bash
npm run ado:board      # mock Azure Boards at http://localhost:4000 (leave it running)
npm start              # the app at http://localhost:3000 (in a second terminal)
npm run test:all       # unit + E2E tests (E2E starts its own copy of the app on port 3100)
npm run report && npm run report:open   # Allure report
```

- Work item **101** (*View upcoming events*) is already done — its tests are in `tests/unit/` and `tests/e2e/view-events.spec.js`.
- Work item **102** (*Search events by keyword*) and bug **104** (*raw date format*) are waiting for you. **103** is a stretch goal.
- Read `.github/copilot-instructions.md` — these are the rules the agent must follow.

## 3. Lab 2 — Developer flow: build work item 102 with the agent (25 min)

In Copilot Chat (Agent mode) type:

```
/implement-work-item
```

Enter `102` when asked. The prompt file (`.github/prompts/implement-work-item.prompt.md`) runs the paper's five steps:

1. **Fetch** work item 102 through `azure-devops-mcp` and **display it in full** (invariant: display before code).
2. **Read and confirm** every guideline under `.github/` (invariant: guidelines confirmation).
3. **Implement only** what the acceptance criteria say, with **unit tests** for positive, negative and edge cases; run `npm test`.
4. Use the **Playwright MCP server** to open the app and generate **E2E tests** — one assertion per acceptance criterion; run `npm run test:e2e`.
5. Show `git status`, stage only work-item files, and **ask you to confirm** the commit `102: <summary>`.

Approve tool calls as they appear. Watch for the invariants — if the agent starts coding before showing the work item, stop it and start again (see Troubleshooting).

## 4. Lab 3 — QA flow: tests and the Allure report (15 min)

```bash
npm run test:all
npm run report && npm run report:open
```

- Unit tests are grouped by work item; E2E tests are under **chromium → spec file**.
- See what failure evidence looks like: `npm run demo:failure`, then `npm run report && npm run report:open`, and open the failed test — screenshot, **video** and Playwright **trace** are attached.
- `npm run clean:results` starts a fresh report.

## 5. Lab 4 — AI metrics (10 min)

In Copilot Chat:

```
/log-ai-usage
```

Enter `102` and `Sprint 1`, then answer the effort questions (in developer-days) for the four activities: code development, test case generation, refinement & optimisation, code review support. The agent writes `ai-usage/WI-102.json`, runs the report and posts a summary comment on the work item (refresh the board).

```bash
npm run metrics -- --sprint "Sprint 1"                       # your sprint → reports/ai-metrics.html
npm run metrics -- --dir ai-usage/examples/paper-sprint      # the paper's sprint: 56% · 6.49 of 11.6 days
```

AI contribution % = AI-assisted effort ÷ total effort × 100. Effort saved = AI-assisted effort. The sprint figure is effort-weighted.

## 6. Stretch goals

- Fix bug **104** with `/implement-work-item` → `104` (regression tests for 00:00 and 12:00).
- Build **103** (registration with a capacity limit) — the biggest item.
- Push to GitHub and watch `.github/workflows/ci.yml` run the same quality gate and publish the Allure report.

## Reference solution

The `solution` branch contains work items 102 and 104 done through the same flow, with their tests and AI usage entries:

```bash
git diff main solution --stat
git checkout solution && npm run test:all && npm run report && npm run report:open
```

---

## Commands

| Command | What it does |
|---|---|
| `npm start` | Run the app on http://localhost:3000 |
| `npm test` | Jest unit tests → `allure-results/` |
| `npm run test:e2e` | Playwright E2E tests (starts the app on port 3100) → `allure-results/` |
| `npm run test:all` | Clean results, then unit + E2E |
| `npm run report` / `report:open` | Build / open the Allure report |
| `npm run demo:failure` | Force one failing E2E test to show screenshot, video and trace |
| `npm run ado:board` | Mock Azure Boards at http://localhost:4000 |
| `npm run ado:reset` | Undo comments and state changes made during the workshop |
| `npm run metrics` | AI usage report → `reports/ai-metrics.html` |
| `npm run doctor` | Preflight check (`-- --quick` skips the Playwright MCP check) |

## Troubleshooting (the paper's failure modes)

| Symptom | Fix |
|---|---|
| Agent can't fetch the work item | MCP: List Servers → restart **azure-devops-mcp**. Test it: `node scripts/check-mcp.mjs`. |
| MCP server not detected | `.vscode/mcp.json` must be valid JSON; reload the window; make sure the chat is in **Agent** mode. |
| Playwright MCP fails to open a browser | Install Google Chrome, or add `"--browser", "msedge"` to the `playwright` args in `.vscode/mcp.json`. |
| Behind a proxy (`ECONNRESET`, certificate errors) | Set `HTTPS_PROXY` and `NODE_EXTRA_CA_CERTS` for Node/npm; don't disable TLS verification. |
| Agent writes code before displaying the work item | Stop it, discard the changes (`git checkout -- . && git clean -fd src tests`), start `/implement-work-item` again. |
| Guidelines ignored | Ask: "Read every file under .github/ and confirm with 'I have read all repository guidelines.'" |
| Playwright MCP not used for E2E | Name the server explicitly: "Use the `playwright` MCP server to open http://localhost:3000". |
| Agent adds features that weren't asked for | Remind it: "Implement ONLY what is in the work item." Check the Product Owner's comment on 102. |
| Missing unit tests | Ask for tests for every modified function, aligned to each acceptance criterion. |
| Unrelated files in the commit | Review `git status`; stage only the work item's files. |
| Port 3000 or 3100 in use | `PORT=3001 npm start`; `E2E_PORT=3101 npm run test:e2e`. |
| Copilot says you're out of agent requests | Pair with a neighbour, or follow along with the `solution` branch. |

## Using a real Azure DevOps organization

`.vscode/mcp.real-ado.jsonc` has the configuration from the paper, using the official `@azure-devops/mcp` server. Copy its contents into `.vscode/mcp.json`, sign in (`az login`), and restart the servers. You'll be prompted for your organization name. The mock server uses the same tool names (`wit_get_work_item`, `wit_list_work_item_comments`, `wit_add_work_item_comment`, …), so the prompt files work unchanged. Check the `@azure-devops/mcp` README for the current authentication options.
