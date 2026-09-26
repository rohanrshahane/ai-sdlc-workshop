// Connects to the MCP servers the same way VS Code does (stdio) and exercises them.
//   node scripts/check-mcp.mjs              -> mock Azure DevOps server
//   node scripts/check-mcp.mjs --playwright -> also the Playwright MCP server
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function checkAdo({ id = 102, quiet = false } = {}) {
  const client = new Client({ name: "workshop-check", version: "1.0.0" });
  await client.connect(new StdioClientTransport({ command: "node", args: ["tools/mock-ado-mcp/server.mjs"], stderr: "ignore" }));
  try {
    const { tools } = await client.listTools();
    const item = await client.callTool({ name: "wit_get_work_item", arguments: { id, expand: "relations" } });
    const comments = await client.callTool({ name: "wit_list_work_item_comments", arguments: { workItemId: id } });
    const wi = JSON.parse(item.content[0].text);
    const cm = JSON.parse(comments.content[0].text);
    if (!quiet) {
      console.log(`azure-devops-mcp tools: ${tools.map((t) => t.name).join(", ")}`);
      console.log(`Work item ${wi.id}: [${wi.fields["System.WorkItemType"]}] ${wi.fields["System.Title"]} (${wi.fields["System.State"]})`);
      console.log(`  relations: ${wi.relations.map((r) => `${r.attributes.name} → ${r.attributes.targetTitle}`).join("; ")}`);
      console.log(`  comments: ${cm.totalCount}`);
    }
    return { tools: tools.map((t) => t.name), workItem: wi };
  } finally {
    await client.close();
  }
}

export async function checkPlaywright({ quiet = false, url } = {}) {
  const args = ["@playwright/mcp", "--headless", "--isolated"];
  if (process.env.PW_CHROMIUM_PATH) args.push("--executable-path", process.env.PW_CHROMIUM_PATH);
  if (process.env.PW_NO_SANDBOX) args.push("--no-sandbox");
  const client = new Client({ name: "workshop-check", version: "1.0.0" });
  await client.connect(new StdioClientTransport({ command: "npx", args, stderr: "ignore" }));
  try {
    const { tools } = await client.listTools();
    if (!quiet) console.log(`playwright tools (${tools.length}): ${tools.map((t) => t.name).slice(0, 10).join(", ")}…`);
    if (url) {
      await client.callTool({ name: "browser_navigate", arguments: { url } });
      const snap = await client.callTool({ name: "browser_snapshot", arguments: {} });
      const text = snap.content.map((c) => c.text || "").join("\n");
      if (!quiet) console.log("Page snapshot (first lines):\n" + text.split("\n").slice(0, 14).join("\n"));
      await client.callTool({ name: "browser_close", arguments: {} });
      return { tools: tools.map((t) => t.name), snapshot: text };
    }
    return { tools: tools.map((t) => t.name) };
  } finally {
    await client.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await checkAdo();
  if (process.argv.includes("--playwright")) await checkPlaywright({ url: process.env.APP_URL });
}
