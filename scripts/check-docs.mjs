import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import manualVersioning from "../src/manual-versioning.cjs";

const root = process.cwd();
const statusValues = new Set(["draft", "active", "deferred"]);
const markdownFiles = listMarkdown(root).sort();
const errors = [];
const { manualRouteForVersion, normalizeManualVersion } = manualVersioning;
const staleManualTerminologyRules = [
  {
    pattern: /\bgraph-v02-cutover\b/i,
    message: "link to the current graph 0.1 contract page instead of the old cutover page"
  },
  {
    pattern: /\bGraph v0\.2 Cutover\b/i,
    message: "use the Graph 0.1 Current Contract title"
  },
  {
    pattern: /\bv0\.2\b/i,
    message: "remove stale graph v0.2 terminology from the public Manual"
  },
  {
    matches: hasStaleV02ContractIdentifier,
    message: "use current V01 contract names in the public Manual"
  },
  {
    matches: hasImportMigrationCompatibilityWording,
    message: "describe strict unsupported-version rejection instead of import/migration compatibility"
  },
  {
    matches: hasBroadVersionPromiseWording,
    message: "name exact current v0 versions instead of broad ranges or alias promises"
  }
];

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
  if (isPublicManual(relative)) {
    for (const rule of staleManualTerminologyRules) {
      if (matchesRule(rule, text)) {
        errors.push(`${relative}: ${rule.message}`);
      }
    }
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

const staleTerminologyCases = [
  ["V02", hasStaleV02ContractIdentifier],
  ["ProjectDocumentV02", hasStaleV02ContractIdentifier],
  ["GraphFragmentV02", hasStaleV02ContractIdentifier],
  ["PatchContractV02", hasStaleV02ContractIdentifier],
  ["import/migration", hasImportMigrationCompatibilityWording],
  ["legacy import path", hasImportMigrationCompatibilityWording],
  ["migration path", hasImportMigrationCompatibilityWording],
  ["import migration compatibility", hasImportMigrationCompatibilityWording],
  ["legacy import-migration only", hasImportMigrationCompatibilityWording],
  ["import-migration compatibility", hasImportMigrationCompatibilityWording],
  ["legacy/deprecated/import-only compatibility", hasImportMigrationCompatibilityWording],
  ["import-only compatibility", hasImportMigrationCompatibilityWording],
  ["0.x", hasBroadVersionPromiseWording],
  ["0.33 or later", hasBroadVersionPromiseWording],
  ["0.33 and newer", hasBroadVersionPromiseWording],
  [">=0.33 <0.35", hasBroadVersionPromiseWording],
  ["^0.33", hasBroadVersionPromiseWording],
  ["~0.33", hasBroadVersionPromiseWording],
  ["supports fallback aliases", hasBroadVersionPromiseWording]
];
for (const [text, predicate] of staleTerminologyCases) {
  if (!predicate(text)) {
    errors.push(`stale terminology guard missed ${JSON.stringify(text)}`);
  }
}

const requiredManualCoverage = new Map([
  [
    "docs/model/graph-01-current.md",
    [
      "ProjectDocumentV01",
      "GraphDocumentV01",
      "patch libraries",
      "PatchDefinitionV01",
      "GraphFragmentV01",
      "Runtime graph targets",
      "versions are rejected with structured diagnostics",
      "0.1/V01"
    ]
  ],
  [
    "docs/model/subpatches.md",
    [
      "PatchDefinitionV01",
      "core.inlet",
      "core.outlet",
      "PatchContractV01",
      "p <patch-id>",
      "description",
      "flat expansion"
    ]
  ],
  [
    "docs/model/live-help.md",
    [
      "PatchDefinitionV01",
      "read-only",
      "help-working-copy",
      "GraphFragmentV01",
      "Promotion"
    ]
  ],
  [
    "docs/model/graph-fragments.md",
    [
      "GraphFragmentV01",
      "outsideEndpointPolicy",
      "baseRevision",
      "idConflictPolicy",
      "Read-only help views"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/graph-01-current.md",
    [
      "ProjectDocumentV01",
      "GraphDocumentV01",
      "patch libraries",
      "PatchDefinitionV01",
      "GraphFragmentV01",
      "Runtime graph targets",
      "versions are rejected with structured diagnostics",
      "0.1/V01"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/subpatches.md",
    [
      "PatchDefinitionV01",
      "core.inlet",
      "core.outlet",
      "PatchContractV01",
      "p <patch-id>",
      "description",
      "flat expansion"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/live-help.md",
    [
      "PatchDefinitionV01",
      "read-only",
      "help-working-copy",
      "GraphFragmentV01",
      "Promotion"
    ]
  ],
  [
    "versioned_docs/version-0.33/model/graph-fragments.md",
    [
      "GraphFragmentV01",
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

function isPublicManual(relative) {
  return requiresStatus(relative);
}

function matchesRule(rule, text) {
  if (rule.matches) {
    return rule.matches(text);
  }
  return rule.pattern.test(text);
}

function hasStaleV02ContractIdentifier(text) {
  return /\b(?:[A-Za-z_][A-Za-z0-9_]*V02|V02)\b/.test(text);
}

function hasImportMigrationCompatibilityWording(text) {
  const staleImportCompatibilityPatterns = [
    /\bimport[/-]migration\b/i,
    /\bimport migration compatibility\b/i,
    /\blegacy import paths?\b/i,
    /\bmigration paths?\b/i,
    /\bimport-only compatibility\b/i,
    /\blegacy\/deprecated\/import-only compatibility\b/i
  ];
  return staleImportCompatibilityPatterns.some((pattern) => pattern.test(text));
}

function hasBroadVersionPromiseWording(text) {
  const broadVersionPromisePatterns = [
    /\b0\.x\b/i,
    /\b0\.\d+\s+(?:or later|and newer|and above)\b/i,
    /(?:>=|<=|>|<)\s*0\.\d+/i,
    /[\^~]0\.\d+/,
    /\b(?:supports?|accepts?|provides?)\s+fallback aliases?\b/i
  ];
  return broadVersionPromisePatterns.some((pattern) => pattern.test(text));
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
