const manualDocusaurusVersions = Object.freeze({
  current: {
    label: "latest",
    badge: false
  },
  "0.33": {
    label: "0.33",
    path: "0.33",
    badge: false
  }
});

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
  manualDocusaurusVersions,
  manualRouteForVersion,
  normalizeManualVersion
};
