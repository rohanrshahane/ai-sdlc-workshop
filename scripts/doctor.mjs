// Preflight check for the workshop. Run: npm run doctor
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import net from "node:net";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const results = [];
const check = async (name, fn, fix) => {
  try {
    const detail = await fn();
    results.push({ ok: true, name, detail });
    console.log(`  ✔ ${name}${detail ? ` — ${detail}` : ""}`);
  } catch (e) {
    results.push({ ok: false, name });
    console.log(`  ✘ ${name} — ${e.message}\n      fix: ${fix}`);
  }
};
const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error(`${what} timed out after ${ms / 1000}s`)), ms))]);

console.log("\nAI-SDLC workshop — preflight check\n");

await check("Node.js 20 or newer", () => {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) throw new Error(`found ${process.versions.node}`);
  return process.versions.node;
}, "Install Node.js 20 LTS or newer from https://nodejs.org");

await check("Dependencies installed", () => {
  for (const m of ["express", "@playwright/test", "allure", "@modelcontextprotocol/sdk", "@playwright/mcp"]) if (!existsSync(`node_modules/${m}/package.json`)) throw new Error(`${m} missing`);
  return "express, playwright, allure, MCP SDK";
}, "Run: npm install");

await check("Playwright browser available", async () => {
  if (process.env.PW_CHROMIUM_PATH) {
    if (!existsSync(process.env.PW_CHROMIUM_PATH)) throw new Error(`PW_CHROMIUM_PATH not found`);
    return `using ${process.env.PW_CHROMIUM_PATH}`;
  }
  const { chromium } = await import("@playwright/test");
  const path = chromium.executablePath();
  if (!existsSync(path)) throw new Error("Chromium for Playwright is not installed");
  return "chromium";
}, "Run: npx playwright install chromium");

await check(".vscode/mcp.json declares both MCP servers", () => {
  const raw = readFileSync(".vscode/mcp.json", "utf8").replace(/^\s*\/\/.*$/gm, "");
  const cfg = JSON.parse(raw);
  for (const s of ["azure-devops-mcp", "playwright"]) if (!cfg.servers?.[s]) throw new Error(`missing server "${s}"`);
  return "azure-devops-mcp, playwright";
}, "Restore the file: git checkout -- .vscode/mcp.json");

const { checkAdo, checkPlaywright } = await import("./check-mcp.mjs");

await check("azure-devops-mcp server answers", async () => {
  const { tools, workItem } = await withTimeout(checkAdo({ quiet: true }), 20000, "mock server");
  return `${tools.length} tools; work item ${workItem.id} "${workItem.fields["System.Title"]}"`;
}, "Run: node tools/mock-ado-mcp/server.mjs  (it should print 'ready'); then npm run ado:reset");

if (!process.argv.includes("--quick")) {
  await check("playwright MCP server answers", async () => {
    const { tools } = await withTimeout(checkPlaywright({ quiet: true }), 60000, "playwright MCP");
    return `${tools.length} browser tools`;
  }, "Run: npx @playwright/mcp --help  (check network/proxy); see README troubleshooting");
}

await check("Git repository and identity", () => {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "pipe" });
  const name = execSync("git config user.name", { stdio: "pipe" }).toString().trim();
  const email = execSync("git config user.email", { stdio: "pipe" }).toString().trim();
  if (!name || !email) throw new Error("user.name or user.email not set");
  return `${name} <${email}>`;
}, 'Run: git config --global user.name "Your Name" && git config --global user.email you@example.com');

await check("Port 3000 is free for the app", () => new Promise((resolve, reject) => {
  const srv = net.createServer().once("error", () => reject(new Error("port 3000 is in use")))
    .once("listening", () => srv.close(() => resolve("free"))).listen(3000);
}), "Stop whatever is using port 3000, or run the app with PORT=3001 npm start");

console.log("\n  • GitHub Copilot: in VS Code, open Chat, switch to Agent mode, and check that the tools icon lists azure-devops-mcp and playwright.");
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) failed — fix them before the session.\n` : "\nAll checks passed. You're ready for the workshop.\n");
process.exit(failed ? 1 : 0);
