---
status: active
sidebar_position: 2
---

# Manual Versions

The 0.44 Manual track is published at `/manual/0.44/`.

Product patch releases do not mint separate Manual versions. A release version
such as `0.44.1` normalizes to Manual version `0.44` and is served from
`/manual/0.44/`, not from a patch-specific Manual path.

This keeps patch-level release notes and compatibility fixes tied to the 0.44
Manual lookup. A `0.44` patch release resolves through this 0.44 Manual track.

## Latest Manual Promotion

Pull requests and ordinary `main` builds may validate Manual content, but they
do not promote the latest published Manual by themselves. Latest Manual and
GitHub Pages promotion happens only from a compatibility matrix promotion that
carries or references a verified `skenion.compatibility-matrix` document.

For the `0.44` Contracts line, the matrix records `contracts-line: "0.44"`,
the canonical `contracts-range: ">=0.44.0 <0.45.0"`, component artifact
versions, the Manual version, and this deployed Manual path `/manual/0.44/`.
The docs deployment verifies that the repository contains the matching `0.44`
Manual track before publishing the Pages artifact. Patch releases on the same
product minor continue to resolve to `/manual/0.44/`; patch-specific Manual
paths are not valid.

## Artifact Verification

Manual deployment is one compatibility-matrix promotion gate. The matrix also
names the registry packages, Runtime binary assets, Studio desktop packages,
Runtime sidecars, examples conformance evidence, checksums, and Pages URL that
were verified together.

A compatibility matrix is not promoted just because the docs build succeeds. It
is promoted only after the matrix verifier confirms the expected artifacts and
the GitHub Pages deployment for this Manual path has succeeded.

## Strict v0 Version Policy

skenion 0.44 treats version fields as exact current-version discriminators, not
as compatibility ranges. A graph, project, node, operation, extension package,
Runtime HTTP request, manifest, protocol payload, or Manual metadata record that
declares an unsupported version is rejected with a structured diagnostic before
authoring, validation, planning, execution, package installation, or help
rendering continues.

The 0.44 Manual does not define legacy compatibility modes, deprecated
compatibility modes, or import-only modes. It also does not define
compatibility aliases for old graph labels, project shapes, package manifests,
Runtime routes, or protocol names. Public examples should name the current
contract label and artifact version directly.

## Contracts Lines And Matrices

skenion 0.44 is coordinated by a compatibility matrix. Component repositories
use their natural Release Please versions; the promoted matrix records which
released component artifacts are compatible with the 0.44 Contracts line.

Before a 0.44 matrix is promoted, verification must cover these surfaces:

- `@skenion/contracts` and the `skenion-contracts` Rust crate inside the 0.44
  Contracts line.
- `@skenion/sdk`, when listed, with the declared supported Contracts range.
- Runtime OS/arch GitHub Release binary assets, sidecars, checksums, and
  smoke-test evidence.
- Studio web deployment artifacts and desktop GitHub Release packages.
- skenion examples conformance evidence, fixture tag, or recorded commit.
- Manual metadata, Pages deployment evidence, and the deployed major/minor
  Manual path.

Patch releases stay on this major/minor Manual path, while the compatibility
matrix records the exact component artifacts. A 0.44 patch release still
resolves Manual content through `/manual/0.44/` while the matrix identifies the
exact component artifact versions and evidence that were promoted.

See [Compatibility Matrix And Install Artifacts](release-train-install.md) for
the 0.44 compatibility matrix, Runtime standalone binaries, Studio desktop
packages, sidecar requirements, promotion gates, and updater status.

## No Broad Version Promises

Manual pages should avoid wildcard labels, forward-looking version promises,
broad SemVer ranges, or fallback alias promises. The exception is the canonical
Contracts compatibility line range recorded by the matrix, such as
`>=0.44.0 <0.45.0`. Wire/schema discriminator fields remain exact
current-version checks, not package SemVer ranges.
