import fs from "node:fs";
import process from "node:process";
import manualVersioning from "../src/manual-versioning.cjs";

const { normalizeManualVersion } = manualVersioning;

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
  fail("GITHUB_EVENT_PATH is required to resolve Manual promotion inputs.");
}

const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
const eventName = process.env.GITHUB_EVENT_NAME ?? "";
const inputs = event.inputs ?? {};
const payload = event.client_payload ?? {};

const trainVersion = firstString(
  inputs["compatibility-version"],
  payload["compatibility-version"],
  inputs["train-version"],
  payload["train-version"]
);
const manifest = firstManifest(
  inputs["compatibility-matrix"],
  payload["compatibility-matrix"],
  inputs.manifest,
  payload.manifest
);
const manifestRef = firstString(
  inputs["manifest-ref"],
  payload["manifest-ref"]
);
const manifestRepository = firstString(
  inputs["manifest-repository"],
  payload["manifest-repository"]
) || "skenion/skenion";
const legacyKeys = presentLegacyKeys(inputs, "inputs", [
  "train_version",
  "release-train-manifest",
  "manifest_ref",
  "manifest_repository"
]).concat(presentLegacyKeys(payload, "client_payload", [
  "trainVersion",
  "train_version",
  "productVersion",
  "product_version",
  "version",
  "trainManifest",
  "releaseTrainManifest",
  "release-train-manifest",
  "manifestRef",
  "manifest_ref",
  "manifestRepository",
  "manifest_repository",
  "ref",
  "sha"
]));
const manifestIsInline = isInlineJson(manifest);

if (legacyKeys.length) {
  fail(
    `Manual promotion accepts current kebab-case event keys only; replace ${legacyKeys.join(", ")} with compatibility-version or train-version, compatibility-matrix or manifest, manifest-ref, and manifest-repository.`
  );
}

if (eventName !== "workflow_dispatch" && eventName !== "repository_dispatch") {
  fail(`Manual promotion must run from workflow_dispatch or repository_dispatch, got "${eventName}".`);
}
if (!trainVersion) {
  fail("Manual promotion requires a compatibility-version or train-version input or client payload.");
}
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(trainVersion)) {
  fail(`Manual promotion compatibility version must be registry-compatible SemVer, got "${trainVersion}".`);
}
if (!manifest) {
  fail("Manual promotion requires a compatibility matrix path or inline JSON manifest.");
}
if (!manifestRef) {
  fail("Manual promotion requires manifest-ref to identify the immutable compatibility matrix commit.");
}
if (!/^[0-9a-f]{40}$/i.test(manifestRef)) {
  fail(`Manual promotion manifest-ref must be a 40-character commit SHA, got "${manifestRef}".`);
}
if (!manifestIsInline && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(manifestRepository)) {
  fail(`Manual promotion manifest-repository must be in owner/name form, got "${manifestRepository}".`);
}

const trainId = normalizeManualVersion(trainVersion);
if (trainId === "latest") {
  fail(`Manual promotion compatibility version "${trainVersion}" did not resolve to a major/minor Manual track.`);
}

setOutput("train-version", trainVersion);
setOutput("train-id", trainId);
setOutput("compatibility-version", trainVersion);
setOutput("compatibility-line", trainId);
setOutput("manifest", manifest);
setOutput("compatibility-matrix", manifest);
setOutput("manifest-ref", manifestRef);
setOutput("manifest-repository", manifestRepository);
setOutput("manifest-is-inline", manifestIsInline ? "true" : "false");

console.log(`Resolved Manual promotion for compatibility line ${trainId} (${trainVersion}).`);

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
}

function firstManifest(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
    if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
  }
  return "";
}

function presentLegacyKeys(source, label, keys) {
  return keys
    .filter((key) => Object.hasOwn(source, key))
    .map((key) => `${label}.${key}`);
}

function isInlineJson(value) {
  const text = String(value ?? "").trimStart();
  return text.startsWith("{") || text.startsWith("[");
}

function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }
  const text = String(value ?? "");
  if (!text.includes("\n")) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${text}\n`);
    return;
  }
  const delimiter = `skenion_manual_${Math.random().toString(36).slice(2)}`;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${text}\n${delimiter}\n`);
}

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}
