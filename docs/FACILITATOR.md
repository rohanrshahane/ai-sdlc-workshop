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

## Run sheet (uses the 3-slide workshop deck)

| Time | Segment | You show | Students do |
|---|---|---|---|
| 0:00 | Welcome (slide 1) | What we'll build today; check everyone's `npm run doctor` | — |
| 0:05 | How the sandbox works (slide 2) | Board → MCP → agent → **you verify** → test cases; the 3 rules | — |
| 0:15 | Lab 1 — Look around (slide 3) | Board, app, tests, Allure report | README Part 3–4 |
| 0:25 | Lab 2 — Fetch & generate | `/implement-work-item` → **102**; narrate steps 1–4; **stop at the commit prompt** | README Part 5 |
| 0:50 | Lab 3 — Verify & confirm | `git diff --stat`, `npm run test:all`, try the app against the AC checklist, then `Yes, commit.` | README Part 6 |
| 1:05 | Lab 4 — List QA test cases | `npm run test:list -- 102`, `/list-test-cases`, Allure report | README Part 7 |
| 1:15 | When the agent gets it wrong | Break a rule on purpose (below) | — |
| 1:25 | Wrap-up & questions | `git diff main solution --stat` | Stretch goals: 104, then 103 |

## Live-demo talking points
- **Fetch:** point at the chat — the agent called `wit_get_work_item` and `wit_list_work_item_comments`. Nobody pasted the requirements. Point at the Product Owner comment that narrows scope.
- **Guidelines:** the exact confirmation sentence shows the agent read the team's rules.
- **Generate:** open the unit test file: `describe('Work item 102 …')`, `AC1:` … — every test names the acceptance criterion it proves.
- **E2E:** the agent drives a real browser through Playwright MCP and reads an accessibility snapshot of the page.
- **Verify:** the agent is fast; *you* are accountable. Scope (`git diff`), tests (`npm run test:all`), behaviour (try it), then confirm. Try `Ballroom` live — it must find nothing.
- **Confirm:** commit message `102: …` links the code to the work item; nothing is committed without your yes.
- **List test cases:** `npm run test:list -- 102` gives the QA view — 16 tests (11 unit, 5 E2E) in the reference solution. `/list-test-cases` maps them to each acceptance criterion and flags gaps.
- **Allure:** open the failed demo test → Attachments → video. "A failure is something you watch, not something you reproduce."

## Breaking an invariant on purpose (failure-mode demo)
Start a new chat and type: *"Add keyword search to the events page."* Without the MCP fetch and the guidelines, the agent has to guess — watch for scope creep (e.g. searching location or tags, which the Product Owner ruled out) and missing E2E tests. Compare with the governed run. Discard with `git checkout -- . && git clean -fd src tests public`.

## If things go wrong
| Problem | Fallback |
|---|---|
| Copilot slow, rate-limited or down | `git checkout solution`, walk through the commits (`git log --oneline`, `git show`) and the pre-built report. |
| Agent goes off-script | Teaching moment — name the broken rule, stop, discard, restart the prompt. |
| A student's Copilot quota is exhausted | Pair them with a neighbour. |
| Mock board shows leftover comments | `npm run ado:reset` |
