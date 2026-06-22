const fs = require("node:fs");
const path = require("node:path");

function normalizeManualVersion(version) {
  const raw = String(version ?? "").trim();
  if (raw.length === 0 || raw === "latest" || raw === "current" || raw === "main") {
    return "latest";
  }

  const unprefixed = raw.replace(/^v/i, "");
  const zeroMinor = /^(0)\.(\d+)(?:\.\d+)?(?:[-+].*)?$/.exec(unprefixed);
  if (zeroMinor) {
    return `${zeroMinor[1]}.${Number(zeroMinor[2])}`;
  }

  throw new Error(`Unsupported Manual version "${version}"`);
}

function assertManualMinorVersion(version, label = "Manual version") {
  const text = String(version ?? "").trim();
  if (!/^0\.\d+$/.test(text)) {
    throw new Error(`${label} must be a v0 major/minor value such as "0.43", got "${version}"`);
  }
  if (normalizeManualVersion(text) !== text) {
    throw new Error(`${label} must already be normalized to major/minor, got "${version}"`);
  }
}

function readManualVersionList() {
  const versionsPath = path.join(__dirname, "..", "versions.json");
  const versions = JSON.parse(fs.readFileSync(versionsPath, "utf8"));
  if (!Array.isArray(versions)) {
    throw new Error("versions.json must contain an array of Manual major/minor versions");
  }

  const seen = new Set();
  const normalized = [];
  for (const version of versions) {
    assertManualMinorVersion(version, "versions.json entry");
    if (seen.has(version)) {
      throw new Error(`versions.json contains duplicate Manual version "${version}"`);
    }
    seen.add(version);
    normalized.push(version);
  }

  return Object.freeze(normalized);
}

function buildManualDocusaurusVersions(versions) {
  const entries = {
    current: {
      label: "latest",
      badge: false
    }
  };

  for (const version of versions) {
    entries[version] = {
      label: version,
      path: version,
      badge: false
    };
  }

  return Object.freeze(entries);
}

const manualVersions = readManualVersionList();
const manualDocusaurusVersions = Object.freeze({
  ...buildManualDocusaurusVersions(manualVersions)
});

function manualRouteForVersion(version) {
  const normalized = normalizeManualVersion(version);
  if (normalized === "latest") {
    return "/manual/";
  }

  if (normalized.startsWith("0.")) {
    return `/manual/${normalized}`;
  }

  return "/manual/";
}

module.exports = {
  assertManualMinorVersion,
  manualDocusaurusVersions,
  manualVersions,
  manualRouteForVersion,
  normalizeManualVersion
};
