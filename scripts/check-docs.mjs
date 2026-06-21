import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import manualVersioning from "../src/manual-versioning.cjs";

const root = process.cwd();
const statusValues = new Set(["draft", "active", "deferred"]);
const markdownFiles = listMarkdown(root).sort();
const errors = [];
const { manualRouteForVersion, normalizeManualVersion } = manualVersioning;

for (const file of markdownFiles) {
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");
  if (requiresStatus(relative)) {
    const status = readStatus(text);
    if (!status) {
      errors.push(`${relative}: missing status front matter`);
    } else if (!statusValues.has(status)) {
      errors.push(`${relative}: invalid status "${status}"`);
    }
  }
  for (const link of localMarkdownLinks(text)) {
    const target = link.split("#", 1)[0];
    if (!target) {
      continue;
    }
    const absolute = path.resolve(path.dirname(file), decodeURIComponent(target));
    if (!fs.existsSync(absolute)) {
      errors.push(`${relative}: broken local link ${link}`);
    }
  }
  for (const manualPath of patchSpecificManualPaths(text)) {
    errors.push(`${relative}: patch-specific Manual path ${manualPath}; use the major/minor path instead`);
  }
}

const versionCases = new Map([
  ["", "latest"],
  ["latest", "latest"],
  ["current", "latest"],
  ["0.33", "0.33"],
  ["0.22", "0.22"],
  ["0.22.5", "0.22"],
  ["v0.22.5", "0.22"]
]);
for (const [input, expected] of versionCases) {
  const actual = normalizeManualVersion(input);
  if (actual !== expected) {
    errors.push(`manual version ${JSON.stringify(input)} normalized to ${actual}, expected ${expected}`);
  }
}

const routeCases = new Map([
  ["latest", "/manual/"],
  ["0.33", "/manual/0.33"],
  ["0.22.5", "/manual/0.22"]
]);
for (const [input, expected] of routeCases) {
  const actual = manualRouteForVersion(input);
  if (actual !== expected) {
    errors.push(`manual version ${JSON.stringify(input)} routed to ${actual}, expected ${expected}`);
  }
}

const requiredManualCoverage = new Map([
  [
    "docs/model/graph-v02-cutover.md",
    [
      "ProjectDocumentV02",
      "GraphDocumentV02",
      "patch libraries",
      "PatchDefinitionV02",
      "GraphFragmentV02",
      "Runtime graph targets",
      "legacy import/migration only"
    ]
  ],
  [
    "docs/model/subpatches.md",
    [
      "PatchDefinitionV02",
      "core.inlet",
      "core.outlet",
      "PatchContractV02",
      "p <patch-id>",
      "description",
      "flat expansion"
    ]
  ],
  [
    "docs/model/live-help.md",
    [
      "PatchDefinitionV02",
      "read-only",
      "help-working-copy",
      "GraphFragmentV02",
      "Promotion"
    ]
  ],
  [
    "docs/model/graph-fragments.md",
    [
      "GraphFragmentV02",
      "outsideEndpointPolicy",
      "baseRevision",
      "idConflictPolicy",
      "Read-only help views"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/graph-v02-cutover.md",
    [
      "ProjectDocumentV02",
      "GraphDocumentV02",
      "patch libraries",
      "PatchDefinitionV02",
      "GraphFragmentV02",
      "Runtime graph targets",
      "legacy import/migration only"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/subpatches.md",
    [
      "PatchDefinitionV02",
      "core.inlet",
      "core.outlet",
      "PatchContractV02",
      "p <patch-id>",
      "description",
      "flat expansion"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/live-help.md",
    [
      "PatchDefinitionV02",
      "read-only",
      "help-working-copy",
      "GraphFragmentV02",
      "Promotion"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/graph-fragments.md",
    [
      "GraphFragmentV02",
      "outsideEndpointPolicy",
      "baseRevision",
      "idConflictPolicy",
      "Read-only help views"
    ]
  ],
  [
    "docs/model/desktop-runtime-sessions.md",
    [
      "Tauri",
      "RuntimeConnectionProfile",
      "local-managed",
      "local-shared",
      "remote",
      "owned-child",
      "shared-runtime",
      "isolated-runtime",
      "volatile-help",
      "RuntimeSessionInfoResponse",
      "authPolicy"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/desktop-runtime-sessions.md",
    [
      "Tauri",
      "RuntimeConnectionProfile",
      "local-managed",
      "local-shared",
      "remote",
      "owned-child",
      "shared-runtime",
      "isolated-runtime",
      "volatile-help",
      "RuntimeSessionInfoResponse",
      "authPolicy"
    ]
  ]
]);

for (const [relative, snippets] of requiredManualCoverage) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    errors.push(`${relative}: missing required M06.75 Manual page`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      errors.push(`${relative}: missing required M06.75 Manual coverage for ${JSON.stringify(snippet)}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`validated ${markdownFiles.length} markdown files`);

function listMarkdown(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...listMarkdown(absolute));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      result.push(absolute);
    }
  }
  return result;
}

function requiresStatus(relative) {
  return (
    relative.startsWith(`docs${path.sep}`)
    || relative.startsWith(`versioned_docs${path.sep}`)
  );
}

function readStatus(text) {
  if (!text.startsWith("---\n")) {
    return null;
  }
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    return null;
  }
  const frontMatter = text.slice(4, end).split("\n");
  for (const line of frontMatter) {
    const match = /^status:\s*([A-Za-z-]+)\s*$/.exec(line.trim());
    if (match) {
      return match[1];
    }
  }
  return null;
}

function localMarkdownLinks(text) {
  const links = [];
  const markdownLink = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of text.matchAll(markdownLink)) {
    const href = match[1].trim();
    if (
      href &&
      !href.startsWith("http://") &&
      !href.startsWith("https://") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("#")
    ) {
      links.push(href);
    }
  }
  return links;
}

function patchSpecificManualPaths(text) {
  return Array.from(new Set(text.match(/\/manual\/0\.\d+\.\d+(?:\/|\b)/g) ?? []));
}
