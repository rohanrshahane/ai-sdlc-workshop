// AI usage tracking (Layer 5): per-work-item effort -> sprint / PI report.
//   npm run metrics                                   -> all files in ai-usage/
//   npm run metrics -- --sprint "Sprint 1"            -> one sprint
//   npm run metrics -- --dir ai-usage/examples/paper-sprint
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const dir = arg("dir", "ai-usage");
const sprint = arg("sprint");
const outDir = arg("out", "reports");
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

function readEntries() {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "TEMPLATE.json")
    .map((f) => ({ file: f, ...JSON.parse(readFileSync(join(dir, f), "utf8")) }))
    .filter((e) => !sprint || e.sprint === sprint)
    .sort((a, b) => a.workItemId - b.workItemId);
}

function summarise(e) {
  const acts = e.activities ?? [];
  const ai = acts.length ? acts.reduce((s, a) => s + (a.aiDays || 0), 0) : e.aiDays || 0;
  const manual = acts.length ? acts.reduce((s, a) => s + (a.manualDays || 0), 0) : e.manualDays || 0;
  const total = ai + manual;
  return { id: e.workItemId, title: e.title, type: e.type, complexity: e.complexity, sprint: e.sprint, ai: round(ai), manual: round(manual), total: round(total), pct: total ? Math.round((ai / total) * 100) : 0, activities: acts };
}

const items = readEntries().map(summarise);
if (!items.length) {
  console.log(`No AI usage entries found in ${dir}${sprint ? ` for sprint "${sprint}"` : ""}.`);
  console.log("Copy ai-usage/TEMPLATE.json to ai-usage/WI-<id>.json, or run the /log-ai-usage prompt in Copilot Chat.");
  process.exit(0);
}
const totals = items.reduce((t, i) => ({ ai: t.ai + i.ai, manual: t.manual + i.manual, total: t.total + i.total }), { ai: 0, manual: 0, total: 0 });
// Effort-weighted mean, as in the paper: total AI-assisted effort / total effort.
const meanPct = totals.total ? Math.round((totals.ai / totals.total) * 100) : 0;
const label = sprint || (dir.includes("paper") ? "Paper sprint" : "All sprints");

// Per-activity roll-up (only for entries that record activities)
const byActivity = {};
for (const i of items) for (const a of i.activities) {
  byActivity[a.name] ??= { ai: 0, manual: 0 };
  byActivity[a.name].ai += a.aiDays || 0;
  byActivity[a.name].manual += a.manualDays || 0;
}

// ---- console
console.log(`\nAI usage report — ${label}\n`);
console.table(items.map((i) => ({ "Work item": i.id, Title: i.title, Complexity: i.complexity, "Total (d)": i.total, "AI (d)": i.ai, "Manual (d)": i.manual, "AI %": `${i.pct}%` })));
console.log(`Total effort: ${round(totals.total)} developer-days`);
console.log(`AI-assisted (effort saved): ${round(totals.ai)} developer-days`);
console.log(`Mean AI contribution (effort-weighted): ${meanPct}%\n`);

// ---- files
mkdirSync(outDir, { recursive: true });
const report = { label, generatedAt: new Date().toISOString(), totals: { total: round(totals.total), ai: round(totals.ai), manual: round(totals.manual), meanPct }, items, byActivity };
writeFileSync(join(outDir, "ai-metrics.json"), JSON.stringify(report, null, 2));

const md = [
  `# AI usage report — ${label}`,
  "",
  "| Work item | Title | Complexity | Total effort | AI effort | Manual effort | Effort saved | AI contribution |",
  "|---|---|---|---|---|---|---|---|",
  ...items.map((i) => `| ${i.id} | ${i.title} | ${i.complexity} | ${i.total} d | ${i.ai} d | ${i.manual} d | ${i.ai} d | ${i.pct}% |`),
  `| **Total** | | | **${round(totals.total)} d** | **${round(totals.ai)} d** | **${round(totals.manual)} d** | **${round(totals.ai)} d** | **${meanPct}%** |`,
  "",
  "AI contribution % = AI-assisted effort ÷ total effort × 100. Effort saved = AI-assisted effort.",
].join("\n");
writeFileSync(join(outDir, "ai-metrics.md"), md + "\n");

const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const max = Math.max(...items.map((i) => i.total));
const bars = items.map((i) => `
  <div class="row"><div class="lbl"><b>${i.id}</b> ${esc(i.title)} <small>${esc(i.complexity || "")}</small></div>
  <div class="bar" style="width:${(i.total / max) * 100}%"><span class="ai" style="flex:${i.ai}">${i.ai}</span><span class="man" style="flex:${i.manual}">${i.manual}</span></div>
  <div class="pct">${i.pct}%</div></div>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI usage report — ${esc(label)}</title>
<style>body{font-family:system-ui,sans-serif;margin:0;background:#f4f7fa;color:#0b1f33}main{max-width:900px;margin:0 auto;padding:24px 16px}
h1{font-size:24px;margin:0 0 16px}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.kpi{background:#fff;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.08)}.kpi b{display:block;font-size:34px}.kpi span{color:#5b6b7b}
.row{display:grid;grid-template-columns:260px 1fr 56px;gap:12px;align-items:center;margin:10px 0}.lbl small{color:#5b6b7b}
.bar{display:flex;height:26px;border-radius:5px;overflow:hidden;font-size:12px}.bar span{display:flex;align-items:center;justify-content:center;min-width:28px}
.ai{background:#0e7c7b;color:#fff}.man{background:#c9d4de}.pct{font-weight:700;text-align:right}
.legend{font-size:13px;color:#5b6b7b}.sw{display:inline-block;width:10px;height:10px;margin:0 4px 0 12px;border-radius:2px}
@media(max-width:640px){.row{grid-template-columns:1fr 48px}.lbl{grid-column:1/-1}.kpis{grid-template-columns:1fr}}</style></head>
<body><main><h1>AI usage report — ${esc(label)}</h1>
<div class="kpis"><div class="kpi"><b>${meanPct}%</b><span>mean AI contribution</span></div>
<div class="kpi"><b>${round(totals.ai)}</b><span>developer-days saved</span></div>
<div class="kpi"><b>${round(totals.total)}</b><span>total developer-days</span></div></div>
<p class="legend">Effort by work item (developer-days)<span class="sw" style="background:#0e7c7b"></span>AI-assisted<span class="sw" style="background:#c9d4de"></span>Manual</p>
${bars}
<p class="legend">AI contribution % = AI-assisted effort ÷ total effort × 100 · Effort saved = AI-assisted effort · Generated ${esc(report.generatedAt.slice(0, 16).replace("T", " "))} UTC</p>
</main></body></html>`;
writeFileSync(join(outDir, "ai-metrics.html"), html);
console.log(`Wrote ${outDir}/ai-metrics.html, ai-metrics.md and ai-metrics.json`);
