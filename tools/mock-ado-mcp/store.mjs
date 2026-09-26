// Shared data layer for the mock Azure DevOps server and board.
// Seed data lives in workitems.json (read-only); changes made during the
// workshop (new comments, state changes) are kept in state.json.
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SEED = join(here, "workitems.json");
const STATE = join(here, "state.json");

export function load() {
  const path = existsSync(STATE) ? STATE : SEED;
  return JSON.parse(readFileSync(path, "utf8"));
}

export function save(db) {
  writeFileSync(STATE, JSON.stringify(db, null, 2) + "\n");
}

export function reset() {
  rmSync(STATE, { force: true });
}

const base = (db) => `https://dev.azure.com/${db.organization}/${db.project}/_apis/wit/workItems`;

/** Shapes a stored item like the Azure DevOps REST API response. */
export function toApi(db, item, expand = "none") {
  const out = {
    id: item.id,
    rev: 1 + item.comments.length,
    fields: { "System.TeamProject": db.project, ...item.fields, "System.CommentCount": item.comments.length },
    url: `${base(db)}/${item.id}`,
  };
  if (expand === "relations" || expand === "all") {
    out.relations = item.relations.map((r) => ({
      rel: r.rel,
      url: `${base(db)}/${r.targetId}`,
      attributes: { ...r.attributes, targetTitle: db.workItems.find((w) => w.id === r.targetId)?.fields["System.Title"] },
    }));
  }
  return out;
}

export function find(db, id) {
  return db.workItems.find((w) => w.id === Number(id));
}
