import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const manifestInput = required(process.env.SKENION_MANUAL_MANIFEST, "SKENION_MANUAL_MANIFEST");
const manifestRoot = process.env.SKENION_MANUAL_MANIFEST_ROOT ?? ".";
const manifestJson = readManifest(manifestInput);

JSON.parse(manifestJson);
setOutput("manifest", manifestJson);
console.log("Materialized Manual promotion compatibility matrix.");

function readManifest(value) {
  const text = String(value ?? "").trim();
  if (isInlineJson(text)) {
    return JSON.stringify(JSON.parse(text));
  }

  const relativePath = safeRelativePath(text);
  const manifestPath = path.join(process.cwd(), manifestRoot, relativePath);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest path ${relativePath} was not found under ${manifestRoot}.`);
  }
  return JSON.stringify(JSON.parse(fs.readFileSync(manifestPath, "utf8")));
}

function safeRelativePath(value) {
  const relative = String(value ?? "").trim();
  if (!relative || path.isAbsolute(relative)) {
    throw new Error("Manifest path must be a non-empty relative path.");
  }
  const normalized = path.normalize(relative);
  if (normalized === "." || normalized.startsWith("..") || path.isAbsolute(normalized)) {
    throw new Error(`Manifest path ${relative} must stay within the checked-out manifest repository.`);
  }
  return normalized;
}

function isInlineJson(value) {
  const text = String(value ?? "").trimStart();
  return text.startsWith("{") || text.startsWith("[");
}

function required(value, name) {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new Error(`${name} is required.`);
  }
  return text;
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
  const delimiter = `skenion_manual_manifest_${Math.random().toString(36).slice(2)}`;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${text}\n${delimiter}\n`);
}
