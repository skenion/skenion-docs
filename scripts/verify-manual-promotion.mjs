import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import manualVersioning from "../src/manual-versioning.cjs";

const {
  manualDocusaurusVersions,
  manualRouteForVersion,
  manualVersions,
  normalizeManualVersion
} = manualVersioning;

const args = parseArgs();
const root = process.cwd();
const trainVersion = required(args["train-version"] ?? process.env.SKENION_MANUAL_TRAIN_VERSION, "train-version");
const expectedTrainId = normalizeManualVersion(trainVersion);
const trainId = args["train-id"] ?? process.env.SKENION_MANUAL_TRAIN_ID ?? expectedTrainId;
const out = args.out ?? process.env.SKENION_MANUAL_PROMOTION_OUT ?? ".skenion-manual-promotion/manual-promotion.json";
const errors = [];

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(trainVersion)) {
  errors.push(`train-version must be registry-compatible SemVer, got "${trainVersion}"`);
}
if (expectedTrainId === "latest") {
  errors.push(`train-version "${trainVersion}" must resolve to a v0 major/minor Manual track`);
}
if (trainId !== expectedTrainId) {
  errors.push(`train-id "${trainId}" must match normalized train-version "${expectedTrainId}"`);
}
if (!manualVersions.includes(trainId)) {
  errors.push(`versions.json must include Manual track "${trainId}" before Pages promotion`);
}

const docusaurusVersion = manualDocusaurusVersions[trainId];
if (!docusaurusVersion) {
  errors.push(`Docusaurus versions metadata must include Manual track "${trainId}"`);
} else {
  if (docusaurusVersion.label !== trainId) {
    errors.push(`Docusaurus label for "${trainId}" must be "${trainId}"`);
  }
  if (docusaurusVersion.path !== trainId) {
    errors.push(`Docusaurus path for "${trainId}" must be "${trainId}"`);
  }
}

const manualPath = manualRouteForVersion(trainVersion);
if (manualPath !== `/manual/${trainId}`) {
  errors.push(`Manual route for "${trainVersion}" must normalize to "/manual/${trainId}", got "${manualPath}"`);
}
for (const version of manualVersions) {
  const versionedDocs = path.join(root, "versioned_docs", `version-${version}`);
  const versionedSidebars = path.join(root, "versioned_sidebars", `version-${version}-sidebars.json`);
  if (!fs.existsSync(versionedDocs)) {
    errors.push(`missing versioned docs directory ${path.relative(root, versionedDocs)}`);
  }
  if (!fs.existsSync(versionedSidebars)) {
    errors.push(`missing versioned sidebar file ${path.relative(root, versionedSidebars)}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

const promotion = {
  trainVersion,
  trainId,
  manualVersion: trainId,
  manualPath: `/manual/${trainId}/`,
  latestPath: "/manual/",
  promotedBy: "release-train",
  generatedAt: new Date().toISOString()
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(`${out}.tmp`, `${JSON.stringify(promotion, null, 2)}\n`);
fs.renameSync(`${out}.tmp`, out);
setOutput("manual-version", trainId);
setOutput("manual-path", promotion.manualPath);
setOutput("promotion-metadata", out);

console.log(`Verified Manual promotion metadata for train ${trainId} (${trainVersion}).`);

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument "${token}"`);
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next === undefined || next.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function required(value, name) {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new Error(`Missing required --${name}`);
  }
  return text;
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}
