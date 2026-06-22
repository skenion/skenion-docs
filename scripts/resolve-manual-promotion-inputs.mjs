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
  inputs.train_version,
  payload.trainVersion,
  payload.train_version,
  payload.productVersion,
  payload.product_version,
  payload.version
);
const manifest = firstManifest(inputs.manifest, payload.manifest, payload.trainManifest, payload.releaseTrainManifest);
const manifestRef = firstString(inputs.manifest_ref, payload.manifestRef, payload.manifest_ref, payload.ref, payload.sha);

if (eventName !== "workflow_dispatch" && eventName !== "repository_dispatch") {
  fail(`Manual promotion must run from workflow_dispatch or repository_dispatch, got "${eventName}".`);
}
if (!trainVersion) {
  fail("Manual promotion requires a train_version input or trainVersion client payload.");
}
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(trainVersion)) {
  fail(`Manual promotion train version must be registry-compatible SemVer, got "${trainVersion}".`);
}
if (!manifest) {
  fail("Manual promotion requires a release train manifest path or inline JSON manifest.");
}

const trainId = normalizeManualVersion(trainVersion);
if (trainId === "latest") {
  fail(`Manual promotion train version "${trainVersion}" did not resolve to a major/minor Manual track.`);
}

setOutput("train-version", trainVersion);
setOutput("train-id", trainId);
setOutput("manifest", manifest);
setOutput("manifest-ref", manifestRef);

console.log(`Resolved Manual promotion for train ${trainId} (${trainVersion}).`);

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
