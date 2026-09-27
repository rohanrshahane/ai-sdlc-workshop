# AI-SDLC Workshop — Campus Events

A hands-on sandbox for the paper **"AI-Augmented Software Development Lifecycle: A Novel and Integrated Framework"** (Shahane, Prakash, Vatsa — Deep Chain Lab, Fairleigh Dickinson University).

You will take a work item from a (mock) Azure DevOps board, let **GitHub Copilot in Agent Mode** read it through the **Model Context Protocol (MCP)**, generate code, unit tests and **Playwright** E2E tests, validate them, review the evidence in an **Allure** report, and record **AI usage metrics** — the paper's full five-layer framework, running on your laptop.

| Layer | What it does | In this repo |
|---|---|---|
| 1 · Input | Work items: stories, acceptance criteria, comments | Mock Azure DevOps: `tools/mock-ado-mcp/` (board at http://localhost:4000) |
| 2 · Orchestration | MCP servers + Copilot Agent Mode | `.vscode/mcp.json` → `azure-devops-mcp` + `playwright` |
| 3 · Generation | Code, unit tests, E2E tests under repo guidelines | `.github/copilot-instructions.md`, `.github/instructions/`, `.github/prompts/` |
| 4 · Validation | Test gate | `npm test`, `npm run test:e2e`, `azure-pipelines.yml`, `.github/workflows/ci.yml` |
| 5 · Reporting | Test evidence + AI metrics | `npm run report` (Allure), `npm run metrics` (AI usage) |

**Contents:** [Part 1 Setup](#part-1--one-time-setup-about-15-minutes) · [Part 2 Preflight](#part-2--preflight-check) · [Part 3 Explore](#part-3--explore-the-sandbox-no-copilot-needed) · [Part 4 Connect Copilot](#part-4--connect-copilot-to-the-mcp-servers) · [Part 5 Developer flow](#part-5--developer-flow-build-work-item-102-with-the-agent) · [Part 6 QA flow](#part-6--qa-flow-tests-and-the-allure-report) · [Part 7 AI metrics](#part-7--ai-metrics) · [Start over](#start-over) · [Troubleshooting](#troubleshooting)

> Commands below are for **macOS Terminal**. On **Windows**, use PowerShell or the VS Code terminal — the `npm` and `git` commands are identical; differences are noted where they matter.

---

## Part 1 — One-time setup (about 15 minutes)

Do this **before** the workshop, on a good internet connection.

### 1. Check Node.js and Git

Open **Terminal** (⌘ + Space → type "Terminal") and run:

```bash
node -v
git --version
```

- **Node.js** must be **v20 or newer**. If it's missing or older, install the **LTS** version from https://nodejs.org (or `brew install node` if you use Homebrew), then **open a new Terminal window**.
- **Git:** if macOS offers to install the *command line developer tools*, click **Install** and wait. (Windows: install from https://git-scm.com.)

### 2. Tell Git who you are (once per computer)

```bash
git config --global user.name "Your Name"
git config --global user.email you@example.com
```

### 3. Install VS Code, Copilot and Chrome

1. Install **Visual Studio Code** from https://code.visualstudio.com and drag it into **Applications**.
2. **GitHub Copilot Chat is built into recent versions of VS Code** — you don't need to install anything.
   - If the Extensions view says *"GitHub Copilot is deprecated"*, that's expected: the old extension was merged into **GitHub Copilot Chat**. Ignore it (or uninstall it).
   - If **GitHub Copilot Chat** shows a **Disable** button, it is already installed — leave it enabled.
3. **Sign in:** click the **Copilot icon** in the status bar (bottom right) or the **Accounts** icon (bottom left) → **Sign in to use Copilot** → approve in the browser → return to VS Code.
4. **Check it works:** open Chat (**⌃⌘I**, Windows **Ctrl+Alt+I**), set the mode dropdown to **Agent**, type `hello`. A reply means you're ready.
5. Install **Google Chrome** if you don't have it — the Playwright MCP server drives your installed Chrome.
6. *Optional but handy:* in VS Code press **⇧⌘P** → **Shell Command: Install 'code' command in PATH**. Then `code .` in Terminal opens the current folder in VS Code. (Windows does this automatically.)

> **About Copilot plans:** Copilot Free works but has a monthly limit on agent requests. Verified students can usually get Copilot Pro at no cost through GitHub Education — check your eligibility ahead of time at https://github.com/settings/copilot.

### 4. Get the repository

```bash
mkdir -p ~/Projects
cd ~/Projects
git clone <REPO-URL> ai-sdlc-workshop
cd ai-sdlc-workshop
git branch -a
```

You should see `main` and `remotes/origin/solution`.

### 5. Install dependencies and the test browser

```bash
npm install
npx playwright install chromium
```

The second command downloads about 150 MB, once.

---

## Part 2 — Preflight check

```bash
npm run doctor
```

Every line should show **✔** and end with **"All checks passed."** It checks Node, dependencies, the Playwright browser, both MCP servers, your Git identity and port 3000. Anything marked **✘** prints the command that fixes it.

---

## Part 3 — Explore the sandbox (no Copilot needed)

### 6. Open the mock Azure DevOps board

```bash
npm run ado:board
```

Open **http://localhost:4000**. Work items **101–104** sit in *New / Active / Closed*. Click a card to see its description, acceptance criteria and discussion.

**Leave this Terminal running.** Open a **new Terminal tab** (⌘T) for everything else and `cd ~/Projects/ai-sdlc-workshop`.

| Work item | Type | State | What it's for |
|---|---|---|---|
| 101 View upcoming events | Story | Closed | Already built — the baseline |
| **102 Search events by keyword** | Story | Active | **The main live exercise** |
| 104 Event date shown in raw format | Bug | Active | Bug fix + regression tests |
| 103 Register with a capacity limit | Story | New | Stretch goal |

### 7. Run the app

```bash
npm start
```

Open **http://localhost:3000** — six events. Notice dates like `2026-10-12 18:00`: that's **bug 104**, on purpose. Stop the app with **Ctrl + C**.

### 8. Run the tests and open the Allure report

```bash
npm run test:all
npm run report
npm run report:open
```

Expected: **8 unit tests passed**, **3 E2E tests passed**, 1 skipped (the failure demo). The report opens in your browser; press **Ctrl + C** in Terminal when finished.

### 9. See what a failure looks like

```bash
npm run demo:failure
npm run report
npm run report:open
```

`demo:failure` is *supposed* to end with **1 failed**. In the report open **chromium → demo-failure.spec.js → the failed test → Attachments**: screenshot, **video** and Playwright **trace**.

### 10. Reproduce the paper's metrics

```bash
npm run metrics -- --dir ai-usage/examples/paper-sprint
open reports/ai-metrics.html
```

(Windows: `start reports/ai-metrics.html`.) You should see **56%** mean AI contribution, **6.49** developer-days saved of **11.6** total — the paper's results.

### 11. Read the rules the agent must follow

Open `.github/copilot-instructions.md`. These are the paper's **workflow invariants**: mandatory MCP fetch, display before code, guidelines confirmation.

---

## Part 4 — Connect Copilot to the MCP servers

### 12. Work on your own branch

```bash
git checkout -b my-work
code .
```

If `code .` says **command not found**, that's fine — your branch was still created. Open VS Code → **File → Open Folder…** → choose `~/Projects/ai-sdlc-workshop`. Click **Trust** when asked.

### 13. Start the two MCP servers

Open `.vscode/mcp.json`. Click the small **Start** link above `azure-devops-mcp`, then above `playwright`. Both should say **Running**.
(Alternative: **⇧⌘P → MCP: List Servers** → start each one.)

### 14. Switch Copilot Chat to Agent mode

Open Chat (**⌃⌘I**) → mode dropdown under the chat box → **Agent**. Click the **tools** icon next to it and check that you see tools such as `wit_get_work_item` and `browser_navigate`.

### 15. Quick connection test

Type in Chat:

```
Use the azure-devops-mcp server to list my work items.
```

Copilot asks for permission to run the tool — click **Allow** (choose *Allow in this workspace* to stop repeated prompts). It should list work items 100–104.

---

## Part 5 — Developer flow: build work item 102 with the agent

### 16. Run the standardised five-step workflow

Type in Chat:

```
/implement-work-item
```

Enter **102** when asked. Approve tool calls as they appear, and watch for each step:

| Step | What you should see |
|---|---|
| 1 · Fetch | The agent calls `wit_get_work_item` and `wit_list_work_item_comments`, then **displays the whole work item** — including the Product Owner's comment that limits scope. |
| 2 · Guidelines | It reads the files under `.github/` and replies **"I have read all repository guidelines."** |
| 3 · Code + unit tests | It implements **only** the acceptance criteria, writes unit tests labelled `AC1:`, `AC2:` …, and runs `npm test`. |
| 4 · E2E tests | It opens the app through the **Playwright MCP server**, writes tests in `tests/e2e/`, and runs `npm run test:e2e`. |
| 5 · Commit | It shows `git status` and **asks you to confirm** a commit named `102: <summary>`. |

If the agent starts coding **before** showing the work item, or skips the guidelines — stop it, discard its changes (see [Start over](#start-over)), and run `/implement-work-item` again. That's one of the failure modes the framework guards against.

### 17. Check the result yourself

```bash
npm start
```

Search for `data`, then for `zzz` (you should see *No events match your search.*). Stop with **Ctrl + C**.

---

## Part 6 — QA flow: tests and the Allure report

```bash
npm run test:all
npm run report
npm run report:open
```

- Unit tests are grouped by **work item**; E2E tests appear under **chromium → spec file → work item**.
- Each test name starts with the acceptance criterion it proves (`AC1:` …) — traceability from requirement to evidence.
- Failed E2E tests carry a screenshot, a video and a trace (see step 9).

---

## Part 7 — AI metrics

### 18. Record AI usage for your work item

Type in Chat:

```
/log-ai-usage
```

Enter **102** and **Sprint 1**, then answer the effort questions in developer-days (e.g. *0.3 AI, 0.05 manual*) for the four activities: **code development, test case generation, refinement & optimisation, code review support**. Count AI-assisted time only where Copilot made a material contribution.

The agent writes `ai-usage/WI-102.json`, builds the report, and posts a summary comment on the work item — refresh **http://localhost:4000** to see it.

### 19. View the sprint report

```bash
npm run metrics -- --sprint "Sprint 1"
open reports/ai-metrics.html
```

**AI contribution %** = AI-assisted effort ÷ total effort × 100. **Effort saved** = AI-assisted effort. The sprint figure is effort-weighted, as in the paper.

---

## Stretch goals

- Fix bug **104** with `/implement-work-item` → `104` (the QA Lead asks for regression tests at 00:00 and 12:00).
- Build **103** — registration with a capacity limit (the largest item).
- Push your branch to GitHub and watch `.github/workflows/ci.yml` run the same quality gate and publish the Allure report as an artifact.

## Reference solution

The `solution` branch has work items **102** and **104** built through the same flow, with tests and AI usage entries:

```bash
git diff my-work origin/solution --stat
git checkout solution
npm run test:all && npm run report && npm run report:open
```

---

## Start over

Discard your changes and reset the mock board:

```bash
npm run ado:reset
git checkout main
git branch -D my-work
git checkout -b my-work
```

To throw away uncommitted changes but keep your branch: `git checkout -- . && git clean -fd src tests public`.

---

## Commands

| Command | What it does |
|---|---|
| `npm run doctor` | Preflight check (`-- --quick` skips the Playwright MCP check) |
| `npm start` | Run the app on http://localhost:3000 |
| `npm test` | Jest unit tests → `allure-results/` |
| `npm run test:e2e` | Playwright E2E tests (starts its own app on port 3100) → `allure-results/` |
| `npm run test:all` | Clean old results, then unit + E2E |
| `npm run report` / `npm run report:open` | Build / open the Allure report |
| `npm run demo:failure` | Force one failing E2E test to show screenshot, video and trace |
| `npm run ado:board` | Mock Azure Boards at http://localhost:4000 |
| `npm run ado:reset` | Undo comments and state changes on the mock board |
| `npm run metrics` | AI usage report → `reports/ai-metrics.html` |

## Troubleshooting

| Symptom | Fix |
|---|---|
| `command not found: code` | Open the folder via **File → Open Folder…**, or install the shell command (Part 1, step 3.6). |
| "GitHub Copilot is deprecated" / only a **Disable** button | Expected — Copilot Chat is built in. Just sign in (Part 1, step 3). |
| Chat has no **Agent** mode or no `/implement-work-item` | Make sure you're signed in and the folder is open (not a single file); **⇧⌘P → Developer: Reload Window**. |
| Agent can't fetch the work item | **MCP: List Servers** → restart **azure-devops-mcp**. Test it from Terminal: `node scripts/check-mcp.mjs`. |
| MCP server not detected | `.vscode/mcp.json` must be valid; reload the window; confirm Chat is in **Agent** mode. |
| Playwright MCP can't open a browser | Install Google Chrome, or add `"--browser", "msedge"` to the `playwright` args in `.vscode/mcp.json`. |
| Behind a proxy (`ECONNRESET`, certificate errors) | Set `HTTPS_PROXY` and `NODE_EXTRA_CA_CERTS` for Node/npm. Don't disable TLS verification. |
| Agent codes before displaying the work item | Stop it, discard changes ([Start over](#start-over)), run `/implement-work-item` again. |
| Guidelines ignored | Ask: *"Read every file under .github/ and confirm with 'I have read all repository guidelines.'"* |
| Playwright MCP not used for E2E | Name it: *"Use the `playwright` MCP server to open http://localhost:3000."* |
| Agent adds features nobody asked for | *"Implement ONLY what is in the work item."* Point it to the Product Owner's comment. |
| Unrelated files in the commit | Review `git status`; stage only the work item's files. |
| Port 3000 in use | macOS: `lsof -ti:3000 \| xargs kill` — or run `PORT=3001 npm start`. |
| Port 3100 in use during E2E | `E2E_PORT=3101 npm run test:e2e` |
| Copilot says you're out of agent requests | Pair with a neighbour, or follow along on the `solution` branch. |

## Using a real Azure DevOps organization

`.vscode/mcp.real-ado.jsonc` holds the configuration from the paper, using the official `@azure-devops/mcp` server. Copy its contents into `.vscode/mcp.json`, sign in with `az login`, and restart the servers; you'll be prompted for your organization name. The mock server uses the same tool names (`wit_get_work_item`, `wit_list_work_item_comments`, `wit_add_work_item_comment`, …), so the prompt files work unchanged. See the `@azure-devops/mcp` README for current authentication options.

## For instructors

See [`docs/FACILITATOR.md`](docs/FACILITATOR.md) for the 90-minute run sheet, live-demo talking points, and fallback plans.

## Citation

R. Shahane, S. Prakash, and A. Vatsa, "AI-Augmented Software Development Lifecycle: A Novel and Integrated Framework," IEEE, 2026.
