// Lists every QA test case in the repo, grouped by work item and acceptance criterion.
//   npm run test:list            -> console table + reports/test-cases.md
//   npm run test:list -- 102     -> only work item 102
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const only = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const sources = [
  { dir: "tests/unit", match: /\.test\.js$/, type: "Unit" },
  { dir: "tests/e2e", match: /\.spec\.js$/, type: "E2E" },
];
const SKIP = new Set(["demo-failure.spec.js"]); // facilitator demo, not a real test case

const rows = [];
for (const { dir, match, type } of sources) {
  for (const file of readdirSync(dir).filter((f) => match.test(f) && !SKIP.has(f)).sort()) {
    const lines = readFileSync(join(dir, file), "utf8").split("\n");
    let workItem = "—";
    lines.forEach((line, i) => {
      const d = line.match(/describe\(\s*(['"`])(.+?)\1/);
      if (d) {
        const wi = d[2].match(/work item (\d+)/i);
        if (wi) workItem = wi[1];
        return;
      }
      const t = line.match(/^\s*test\(\s*(['"`])(.+?)\1/);
      if (t) {
        const ac = (t[2].match(/^(AC\d+)/) || [, "support"])[1];
        const name = t[2].replace(/^AC\d+[^:]*:\s*/, "");
        rows.push({ workItem, type, ac, name, file: `${dir}/${file}:${i + 1}` });
      }
    });
  }
}

const list = rows
  .filter((r) => !only || r.workItem === only)
  .sort((a, b) => a.workItem.localeCompare(b.workItem) || a.ac.localeCompare(b.ac, undefined, { numeric: true }) || a.type.localeCompare(b.type));

if (!list.length) {
  console.log(only ? `No test cases found for work item ${only}.` : "No test cases found.");
  process.exit(0);
}

// console output
const byWi = Map.groupBy ? Map.groupBy(list, (r) => r.workItem) : list.reduce((m, r) => m.set(r.workItem, [...(m.get(r.workItem) || []), r]), new Map());
console.log(`\nQA test cases${only ? ` — work item ${only}` : ""}\n`);
for (const [wi, items] of byWi) {
  const unit = items.filter((r) => r.type === "Unit").length;
  const e2e = items.length - unit;
  console.log(`Work item ${wi}  (${items.length} tests: ${unit} unit, ${e2e} E2E)`);
  console.table(items.map((r) => ({ AC: r.ac, Type: r.type, "Test case": r.name })));
}
const acs = new Set(list.filter((r) => r.ac !== "support").map((r) => `${r.workItem}/${r.ac}`));
console.log(`Total: ${list.length} test cases across ${byWi.size} work item(s), covering ${acs.size} acceptance criteria.\n`);

// markdown report
mkdirSync("reports", { recursive: true });
const md = [`# QA test cases${only ? ` — work item ${only}` : ""}`, ""];
for (const [wi, items] of byWi) {
  md.push(`## Work item ${wi}`, "", "| # | AC | Type | Test case | Location |", "|---|---|---|---|---|");
  items.forEach((r, i) => md.push(`| ${i + 1} | ${r.ac} | ${r.type} | ${r.name.replace(/\|/g, "\\|")} | \`${r.file}\` |`));
  md.push("");
}
md.push(`Total: ${list.length} test cases, ${acs.size} acceptance criteria covered.`);
writeFileSync("reports/test-cases.md", md.join("\n") + "\n");
console.log("Wrote reports/test-cases.md");
