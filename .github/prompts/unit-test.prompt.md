---
mode: agent
description: "Generate Jest unit tests aligned to a work item's acceptance criteria"
---
Generate Jest unit tests for the logic changed for the current work item, following `.github/instructions/testing.instructions.md`.

- One `describe` per work item: `Work item <ID> — <title>`.
- Prefix each test with the acceptance criterion it proves (`AC1:`, `AC2:` …).
- For every criterion cover positive, negative and edge cases.
- Test service functions directly and API routes with `supertest` against `createApp()`.
- Run `npm test` and report the results. Do not modify unrelated tests.
