#!/usr/bin/env node
// Mock Azure DevOps MCP server for the AI-SDLC workshop.
// Tool names and response shapes follow the official @azure-devops/mcp server
// closely enough that the same prompts work against either one.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { load, save, toApi, find } from "./store.mjs";

const server = new McpServer({ name: "azure-devops-mcp (workshop mock)", version: "1.0.0" });

const json = (data) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });
const fail = (message) => ({ isError: true, content: [{ type: "text", text: message }] });

server.registerTool(
  "core_list_projects",
  { title: "List projects", description: "List the Azure DevOps projects in the organization." },
  async () => {
    const db = load();
    return json({ count: 1, value: [{ name: db.project, organization: db.organization, state: "wellFormed" }] });
  }
);

server.registerTool(
  "wit_my_work_items",
  {
    title: "My work items",
    description: "List work items in the current sprint (id, type, title, state).",
    inputSchema: { project: z.string().optional().describe("Project name (optional in the mock)") },
  },
  async () => {
    const db = load();
    return json(
      db.workItems.map((w) => ({
        id: w.id,
        type: w.fields["System.WorkItemType"],
        title: w.fields["System.Title"],
        state: w.fields["System.State"],
      }))
    );
  }
);

server.registerTool(
  "wit_get_work_item",
  {
    title: "Get work item",
    description:
      "Get a single work item by ID, including description, acceptance criteria and repro steps. Use expand='relations' or 'all' to include linked items.",
    inputSchema: {
      id: z.number().int().describe("Work item ID"),
      project: z.string().optional(),
      expand: z.enum(["none", "relations", "fields", "links", "all"]).optional().describe("Expand options"),
    },
  },
  async ({ id, expand = "none" }) => {
    const db = load();
    const item = find(db, id);
    if (!item) return fail(`TF401232: Work item ${id} does not exist, or you do not have permissions to read it.`);
    return json(toApi(db, item, expand));
  }
);

server.registerTool(
  "wit_list_work_item_comments",
  {
    title: "List work item comments",
    description: "List the discussion comments on a work item.",
    inputSchema: { workItemId: z.number().int(), project: z.string().optional(), top: z.number().int().optional() },
  },
  async ({ workItemId, top }) => {
    const db = load();
    const item = find(db, workItemId);
    if (!item) return fail(`Work item ${workItemId} does not exist.`);
    const comments = item.comments.map((c, i) => ({ id: i + 1, createdBy: c.author, createdDate: c.date, text: c.text }));
    return json({ totalCount: comments.length, comments: top ? comments.slice(-top) : comments });
  }
);

server.registerTool(
  "wit_add_work_item_comment",
  {
    title: "Add work item comment",
    description: "Add a discussion comment to a work item (for example, an AI usage summary).",
    inputSchema: { workItemId: z.number().int(), comment: z.string().min(1), project: z.string().optional() },
  },
  async ({ workItemId, comment }) => {
    const db = load();
    const item = find(db, workItemId);
    if (!item) return fail(`Work item ${workItemId} does not exist.`);
    const entry = { author: "GitHub Copilot (via MCP)", date: new Date().toISOString(), text: comment };
    item.comments.push(entry);
    save(db);
    return json({ workItemId, id: item.comments.length, ...entry });
  }
);

server.registerTool(
  "wit_update_work_item",
  {
    title: "Update work item state",
    description: "Change a work item's state (New, Active, Resolved, Closed).",
    inputSchema: { id: z.number().int(), state: z.enum(["New", "Active", "Resolved", "Closed"]), project: z.string().optional() },
  },
  async ({ id, state }) => {
    const db = load();
    const item = find(db, id);
    if (!item) return fail(`Work item ${id} does not exist.`);
    const previous = item.fields["System.State"];
    item.fields["System.State"] = state;
    save(db);
    return json({ id, previousState: previous, state });
  }
);

await server.connect(new StdioServerTransport());
console.error("[mock azure-devops-mcp] ready — serving work items over stdio");
