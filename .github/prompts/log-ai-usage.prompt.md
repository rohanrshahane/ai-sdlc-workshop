---
mode: agent
description: "Record AI vs manual effort for a completed work item (AI metrics, Layer 5)"
---
Record AI usage for work item **${input:workItemId:Work item ID}** in sprint **${input:sprint:Sprint name, e.g. Sprint 1}**.

1. Use `azure-devops-mcp` to read the work item's title and type.
2. Ask me, one activity at a time, how much effort (in developer-days, e.g. 0.25) was **AI-assisted** and how much was **manual** for:
   - Code development
   - Test case generation
   - Refinement & optimisation
   - Code review support
   Count AI-assisted time only where Copilot made a material contribution — not trivial autocomplete.
3. Ask me the complexity (Low, Medium, High).
4. Write `ai-usage/WI-${input:workItemId}.json` using the same shape as `ai-usage/TEMPLATE.json`.
5. Run `npm run metrics` and show me the summary.
6. Post a one-paragraph AI usage summary (total effort, AI-assisted effort, AI contribution %) as a comment on the work item with `wit_add_work_item_comment`.
