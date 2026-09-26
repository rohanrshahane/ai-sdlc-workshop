# Facilitator guide — AI-SDLC live workshop (90 minutes)

## The week before
- Send students the **Before the workshop** section of the README and ask them to run `npm run doctor` and paste the output if anything fails.
- Remind them to check their GitHub Copilot access (Copilot Free has a monthly agent-request limit).
- Rehearse once on the projector laptop: `npm run ado:reset`, then Lab 2 end to end with work item **102**. Note how long the agent takes — plan for about 5–10 minutes per work item.

## The morning of
- Projector laptop: `npm run doctor` (all ✔), VS Code open, both MCP servers **Running**, Copilot Chat in **Agent** mode, font size up (Ctrl/Cmd + =).
- Terminal 1: `npm run ado:board` → browser tab on http://localhost:4000.
- Terminal 2: free for `npm start` / tests.
- Pre-build a fallback report on the `solution` branch: `git checkout solution && npm run test:all; npm run demo:failure; npm run report`, then `git checkout main`. Keep that report open in a browser tab (`npm run report:open`).
- Conference Wi-Fi: dependencies are local once `npm install` is done, so only Copilot itself needs the network.

## Run sheet

| Time | Segment | You show | Students do |
|---|---|---|---|
| 0:00 | Why AI-SDLC (slides 2–4) | Traditional vs AI-augmented SDLC | — |
| 0:10 | Components (slides 5–7) | `.vscode/mcp.json`, `.github/`, mock board | Lab 1: run tests, open report |
| 0:25 | Developer flow (slides 8–9) | `/implement-work-item` → **102**, narrate each step | Lab 2 on their laptops |
| 0:50 | QA flow (slides 10–11) | `npm run test:all`, `npm run demo:failure`, Allure: screenshot + video | Lab 3 |
| 1:05 | AI metrics (slides 12–14) | `/log-ai-usage`, board comment, `npm run metrics`; then the paper sprint (56% · 6.49 of 11.6 days) | Lab 4 |
| 1:15 | Guardrails & failure modes (slide 16) | Break an invariant on purpose (below) | — |
| 1:25 | Wrap-up & questions | `git diff main solution --stat` | Stretch goals at home |

## Live-demo talking points
- **Step 1:** point at the chat — the agent called `wit_get_work_item` and `wit_list_work_item_comments`. Nobody pasted the requirements. Point at the Product Owner comment that narrows scope.
- **Step 2:** the exact confirmation sentence is an audit artifact.
- **Step 3:** open the unit test file: `describe('Work item 102 …')`, `AC1:` … — traceability from test to acceptance criterion.
- **Step 4:** the agent drives a real browser through Playwright MCP and reads an accessibility snapshot of the page.
- **Step 5:** commit message `102: …` links code to the work item; nothing is committed without your confirmation.
- **Allure:** open the failed demo test → Attachments → video. "A failure is something you watch, not something you reproduce."
- **Metrics:** effort-weighted mean; the paper's sprint reproduces exactly (56%, 6.49 of 11.6 days).

## Breaking an invariant on purpose (failure-mode demo)
Start a new chat and type: *"Add keyword search to the events page."* Without the MCP fetch and the guidelines, the agent has to guess — watch for scope creep (e.g. searching location or tags, which the Product Owner ruled out) and missing E2E tests. Compare with the governed run. Discard with `git checkout -- . && git clean -fd src tests public`.

## If things go wrong
| Problem | Fallback |
|---|---|
| Copilot slow, rate-limited or down | `git checkout solution`, walk through the commits (`git log --oneline`, `git show`) and the pre-built report. |
| Agent goes off-script | Teaching moment — name the failure mode (slide 16), stop, discard, restart the prompt. |
| A student's Copilot quota is exhausted | Pair them with a neighbour. |
| Mock board shows leftover comments | `npm run ado:reset` |
