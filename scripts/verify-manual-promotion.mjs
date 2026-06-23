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

const CANONICAL_PAGES_ORIGIN = "https://skenion.github.io/skenion-docs";
const args = parseArgs();
const root = process.cwd();
const trainVersion = required(
  args["compatibility-version"]
    ?? process.env.SKENION_MANUAL_COMPATIBILITY_VERSION
    ?? args["train-version"]
    ?? process.env.SKENION_MANUAL_TRAIN_VERSION,
  "compatibility-version"
);
const expectedTrainId = normalizeManualVersion(trainVersion);
const trainId = args["train-id"] ?? process.env.SKENION_MANUAL_TRAIN_ID ?? expectedTrainId;
const manifestInput =
  args["compatibility-matrix"]
  ?? process.env.SKENION_MANUAL_COMPATIBILITY_MATRIX
  ?? args.manifest
  ?? process.env.SKENION_MANUAL_TRAIN_MANIFEST
  ?? "";
const manifestRef = String(args["manifest-ref"] ?? process.env.SKENION_MANUAL_MANIFEST_REF ?? "").trim();
const pagesOriginOverride = args["pages-origin"] ?? process.env.SKENION_MANUAL_PAGES_ORIGIN;
const out = args.out ?? process.env.SKENION_MANUAL_PROMOTION_OUT ?? ".skenion-manual-promotion/manual-promotion.json";
const expectedManualPath = `/manual/${trainId}/`;
const expectedPagesUrl = `${CANONICAL_PAGES_ORIGIN}${expectedManualPath}`;
const errors = [];

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(trainVersion)) {
  errors.push(`compatibility-version must be registry-compatible SemVer, got "${trainVersion}"`);
}
if (expectedTrainId === "latest") {
  errors.push(`compatibility-version "${trainVersion}" must resolve to a v0 major/minor Manual track`);
}
if (trainId !== expectedTrainId) {
  errors.push(`train-id "${trainId}" must match normalized compatibility-version "${expectedTrainId}"`);
}
if (pagesOriginOverride !== undefined) {
  const requestedPagesOrigin = String(pagesOriginOverride).replace(/\/+$/, "");
  if (requestedPagesOrigin !== CANONICAL_PAGES_ORIGIN) {
    errors.push(
      `pages-origin must be the canonical Pages origin ${JSON.stringify(CANONICAL_PAGES_ORIGIN)}, got ${JSON.stringify(requestedPagesOrigin)}`
    );
  }
}
if (!manifestInput.trim()) {
  errors.push("compatibility matrix is required for Manual Pages promotion verification");
}
if (!manifestRef) {
  errors.push("manifest-ref is required for Manual Pages promotion verification");
} else if (!/^[0-9a-f]{40}$/i.test(manifestRef)) {
  errors.push(`manifest-ref must be a 40-character commit SHA, got "${manifestRef}"`);
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
if (`${manualPath}/` !== expectedManualPath) {
  errors.push(`Manual route for "${trainVersion}" must normalize to "${expectedManualPath}", got "${manualPath}"`);
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

const manifest = manifestInput.trim() ? readManifest(manifestInput, errors) : null;
if (manifest) {
  validateCompatibilityMatrix(manifest);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

const evidenceUrl = workflowRunUrl() ?? expectedPagesUrl;
const promotion = {
  schema: "skenion.manual-promotion",
  "schema-version": "0.1.0",
  "train-version": trainVersion,
  "train-id": trainId,
  "compatibility-version": trainVersion,
  "compatibility-line": trainId,
  "contracts-line": manifest?.["contracts-line"] ?? trainId,
  "contracts-range": manifest?.["contracts-range"] ?? canonicalRangeForLine(trainId),
  "manual-version": trainVersion,
  "manual-track": trainId,
  "manual-path": expectedManualPath,
  "latest-path": "/manual/",
  "pages-url": expectedPagesUrl,
  "manifest-ref": manifestRef,
  "compatibility-matrix-ref": manifestRef,
  "release-gate": {
    id: "docs-pages-deployment",
    status: "passed",
    required: true,
    "requires": "compatibility-matrix-verification",
    "manual-version": trainVersion,
    "manual-path": expectedManualPath,
    "pages-url": expectedPagesUrl,
    "evidence-url": evidenceUrl
  },
  "promoted-by": "compatibility-matrix",
  "generated-at": new Date().toISOString()
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(`${out}.tmp`, `${JSON.stringify(promotion, null, 2)}\n`);
fs.renameSync(`${out}.tmp`, out);
setOutput("manual-version", trainVersion);
setOutput("manual-track", trainId);
setOutput("manual-path", promotion["manual-path"]);
setOutput("pages-url", promotion["pages-url"]);
setOutput("evidence-url", evidenceUrl);
setOutput("promotion-metadata", out);

console.log(`Verified Manual promotion metadata for compatibility line ${trainId} (${trainVersion}).`);

function validateCompatibilityMatrix(manifest) {
  rejectLegacyManifestKeys(manifest);
  requireEquals(manifest.schema, "skenion.compatibility-matrix", "manifest.schema");
  requireEquals(manifest["schema-version"], "0.1.0", "manifest.schema-version");
  requireEquals(manifest["contracts-line"], trainId, "manifest.contracts-line");
  requireEquals(manifest["contracts-range"], canonicalRangeForLine(trainId), "manifest.contracts-range");
  requireEquals(manifest.promoted, true, "manifest.promoted");

  validateContractsPackages(manifest.components?.contracts);
  validateSdkRange(manifest.components?.sdk);

  const docsManual = manifest.components?.docs?.manual;
  if (!docsManual || typeof docsManual !== "object") {
    errors.push("components.docs.manual is required for Manual Pages promotion");
  }
  requireManualVersionOnLine(docsManual?.version, "components.docs.manual.version");
  requireEquals(docsManual?.path, expectedManualPath, "components.docs.manual.path");
  rejectPatchSpecificManualPath(docsManual?.path, "components.docs.manual.path");
  requireEquals(docsManual?.["pages-url"], expectedPagesUrl, "components.docs.manual.pages-url");
  requireDocsManualPromoted(docsManual);
  requireDocsManualPagesDeployed(docsManual);

  const docsGate = manifest["release-gates"]?.["docs-pages-deployment"];
  if (!docsGate || typeof docsGate !== "object") {
    errors.push("release-gates.docs-pages-deployment is required for Manual Pages promotion");
    return;
  }
  requireEquals(docsGate.id, "docs-pages-deployment", "release-gates.docs-pages-deployment.id");
  requireEquals(docsGate.required, true, "release-gates.docs-pages-deployment.required");
  requirePassedStatus(docsGate.status, "release-gates.docs-pages-deployment.status");
  requireManualVersionOnLine(docsGate["manual-version"], "release-gates.docs-pages-deployment.manual-version");
  requireEquals(docsGate["manual-path"], expectedManualPath, "release-gates.docs-pages-deployment.manual-path");
  rejectPatchSpecificManualPath(docsGate["manual-path"], "release-gates.docs-pages-deployment.manual-path");
  requireEquals(docsGate["pages-url"], expectedPagesUrl, "release-gates.docs-pages-deployment.pages-url");
  requireNonEmptyString(docsGate["evidence-url"], "release-gates.docs-pages-deployment.evidence-url");
}

function rejectLegacyManifestKeys(manifest) {
  const legacyPaths = [
    ["schemaVersion"],
    ["trainId"],
    ["trainVersion"],
    ["train-id"],
    ["train-version"],
    ["protocolBaselines"],
    ["capabilitySet"],
    ["capability-set", "manual", "versionedPaths"],
    ["capability-set", "manual", "pagesDeployment"],
    ["capability-set", "manual", "latestPromotionRequiresMatrix"],
    ["capability-set", "manual", "patchReleasesUseMajorMinorPath"],
    ["components", "docs", "manual", "pagesUrl"],
    ["releaseGates"],
    ["release-gates", "docsPagesDeployment"],
    ["release-gates", "docs-pages-deployment", "manualVersion"],
    ["release-gates", "docs-pages-deployment", "manualPath"],
    ["release-gates", "docs-pages-deployment", "pagesUrl"],
    ["release-gates", "docs-pages-deployment", "evidenceUrl"]
  ];

  for (const keyPath of legacyPaths) {
    if (hasPath(manifest, keyPath)) {
      errors.push(`manifest must use current kebab-case keys; found ${keyPath.join(".")}`);
    }
  }
}

function validateContractsPackages(contracts) {
  requirePackageVersionOnLine(contracts?.npm, "components.contracts.npm");
  requirePackageVersionOnLine(contracts?.crate ?? contracts?.["crate-package"], "components.contracts.crate");
}

function validateSdkRange(sdk) {
  if (!sdk) {
    return;
  }
  const range = firstNonEmptyString(
    sdk["contracts-range"],
    sdk["supported-contracts-range"],
    sdk.supportedContractsRange,
    sdk.contracts?.range,
    sdk.contracts?.["supported-range"],
    sdk.npm?.["contracts-range"]
  );
  requireEquals(range, canonicalRangeForLine(trainId), "components.sdk.contracts-range");
}

function requirePackageVersionOnLine(packageRef, label) {
  if (!packageRef || typeof packageRef !== "object") {
    errors.push(`${label} is required in the compatibility matrix`);
    return;
  }
  requireManualVersionOnLine(packageRef.version, `${label}.version`);
}

function requireManualVersionOnLine(version, label) {
  const normalized = safeNormalizeManualVersion(version);
  if (!normalized) {
    errors.push(`${label} must be registry-compatible SemVer on Contracts line ${trainId}, got ${JSON.stringify(version)}`);
    return;
  }
  if (normalized !== trainId) {
    errors.push(`${label} must be inside Contracts line ${trainId}, got ${JSON.stringify(version)}`);
  }
}

function safeNormalizeManualVersion(version) {
  try {
    return normalizeManualVersion(version);
  } catch {
    return "";
  }
}

function canonicalRangeForLine(line) {
  const match = /^0\.(\d+)$/.exec(String(line ?? ""));
  if (!match) {
    return "";
  }
  const minor = Number(match[1]);
  return `>=0.${minor}.0 <0.${minor + 1}.0`;
}

function firstNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
}

function readManifest(value, collectedErrors) {
  const text = String(value ?? "").trim();
  try {
    if (isInlineJson(text)) {
      return JSON.parse(text);
    }
    const manifestPath = path.isAbsolute(text) ? text : path.join(root, text);
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    collectedErrors.push(`could not read Manual promotion manifest: ${error.message}`);
    return null;
  }
}

function requireEquals(actual, expected, label) {
  if (actual !== expected) {
    errors.push(`${label} must be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function requirePassedStatus(value, label) {
  if (value !== "passed") {
    errors.push(`${label} must be "passed" for Manual Pages promotion, got ${JSON.stringify(value)}`);
  }
}

function requireDocsManualPromoted(manual) {
  const promoted =
    manual?.promoted === true
    || manual?.["latest-promoted"] === true
    || statusIsPassed(manual?.["promotion-status"])
    || statusIsPassed(manual?.promotion?.status);
  if (!promoted) {
    errors.push("components.docs.manual must be promoted before Manual Pages promotion metadata is emitted");
  }
}

function requireDocsManualPagesDeployed(manual) {
  const deployed =
    manual?.["pages-deployed"] === true
    || manual?.pages?.deployed === true
    || statusIsPassed(manual?.["pages-status"])
    || statusIsPassed(manual?.["deployment-status"])
    || statusIsPassed(manual?.pages?.status)
    || statusIsPassed(manual?.deployment?.status);
  if (!deployed) {
    errors.push("components.docs.manual must include passed Pages deployment evidence");
  }
}

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${label} is required`);
  }
}

function statusIsPassed(value) {
  return String(value ?? "").toLowerCase() === "passed";
}

function rejectPatchSpecificManualPath(value, label) {
  if (typeof value === "string" && /\/manual\/0\.\d+\.\d+(?:\/|\b)/.test(value)) {
    errors.push(`${label} must use a major/minor Manual path, got "${value}"`);
  }
}

function hasPath(value, keyPath) {
  let cursor = value;
  for (const key of keyPath) {
    if (!cursor || typeof cursor !== "object" || !Object.hasOwn(cursor, key)) {
      return false;
    }
    cursor = cursor[key];
  }
  return true;
}

function isInlineJson(value) {
  const text = String(value ?? "").trimStart();
  return text.startsWith("{") || text.startsWith("[");
}

function workflowRunUrl() {
  const serverUrl = process.env.GITHUB_SERVER_URL;
  const repository = process.env.GITHUB_REPOSITORY;
  const runId = process.env.GITHUB_RUN_ID;
  if (!serverUrl || !repository || !runId) {
    return null;
  }
  return `${serverUrl}/${repository}/actions/runs/${runId}`;
}

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
