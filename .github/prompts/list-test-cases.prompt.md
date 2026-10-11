---
mode: agent
description: "List every QA test case generated for a work item and check it covers each acceptance criterion"
---
List the QA test cases for work item **${input:workItemId:Work item ID, e.g. 102}**.

1. Use MCP server `azure-devops-mcp` to fetch work item ${input:workItemId} and list its acceptance criteria as AC1, AC2, …
2. Run `npm run test:list -- ${input:workItemId}` and read `reports/test-cases.md`.
3. Show me one table: **AC | Acceptance criterion (short) | Unit tests | E2E tests**, with the test names in each cell.
4. Flag any acceptance criterion with **no** test, and any test that does not map to a criterion.
5. Do not write or change any code or tests — this is a review step only.
