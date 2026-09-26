// A read-only "Boards" view of the mock Azure DevOps data: http://localhost:4000
import http from "node:http";
import { load } from "./store.mjs";

const PORT = Number(process.env.BOARD_PORT) || 4000;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const columns = ["New", "Active", "Resolved", "Closed"];
const typeColor = { "User Story": "#0e7c7b", Bug: "#b42318", Feature: "#6b4fbb" };

function page(db) {
  const items = db.workItems.filter((w) => w.fields["System.WorkItemType"] !== "Feature");
  const col = (state) =>
    items
      .filter((w) => w.fields["System.State"] === state)
      .map((w) => {
        const f = w.fields;
        const color = typeColor[f["System.WorkItemType"]] || "#555";
        return `<details class="card" style="border-left-color:${color}">
  <summary><span class="type" style="color:${color}">${esc(f["System.WorkItemType"])} ${w.id}</span><b>${esc(f["System.Title"])}</b></summary>
  <div class="body">
    ${f["System.Description"] || ""}
    ${f["Microsoft.VSTS.TCM.ReproSteps"] ? `<h4>Repro steps</h4>${f["Microsoft.VSTS.TCM.ReproSteps"]}` : ""}
    ${f["Microsoft.VSTS.Common.AcceptanceCriteria"] ? `<h4>Acceptance criteria</h4>${f["Microsoft.VSTS.Common.AcceptanceCriteria"]}` : ""}
    <h4>Discussion (${w.comments.length})</h4>
    ${w.comments.map((c) => `<p class="c"><b>${esc(c.author)}</b> <small>${esc(c.date.slice(0, 16).replace("T", " "))}</small><br>${esc(c.text).replace(/\n/g, "<br>")}</p>`).join("") || "<p><i>No comments</i></p>"}
  </div>
</details>`;
      })
      .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mock Azure Boards</title><meta http-equiv="refresh" content="10">
<style>
body{margin:0;font-family:system-ui,sans-serif;background:#f4f7fa;color:#0b1f33}
header{background:#0b1f33;color:#fff;padding:14px 20px}header small{color:#afc2d4}
.board{display:grid;grid-template-columns:repeat(4,minmax(220px,1fr));gap:14px;padding:16px;overflow-x:auto}
.col h3{margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#5b6b7b}
.card{background:#fff;border-radius:8px;border-left:5px solid;padding:10px 12px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.card summary{cursor:pointer;list-style:none}.type{display:block;font-size:12px;font-weight:700}
.body{font-size:14px;border-top:1px solid #e5eaf0;margin-top:8px;padding-top:6px}.c{background:#f4f7fa;padding:6px 8px;border-radius:6px}
h4{margin:10px 0 4px;font-size:13px}code{background:#eef2f6;padding:0 3px;border-radius:3px}
</style></head><body>
<header><b>Mock Azure Boards</b> — ${esc(db.organization)} / ${esc(db.project)} <small>· ${esc(db.iteration)} · refreshes every 10s · click a card for details</small></header>
<div class="board">${columns.map((s) => `<section class="col"><h3>${s}</h3>${col(s)}</section>`).join("")}</div>
</body></html>`;
}

http
  .createServer((req, res) => {
    const db = load();
    if (req.url === "/api/workitems") {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify(db.workItems.map((w) => ({ id: w.id, ...w.fields, comments: w.comments.length }))));
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(page(db));
  })
  .listen(PORT, () => console.log(`Mock Azure Boards: http://localhost:${PORT}`));
