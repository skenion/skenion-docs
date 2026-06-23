---
status: active
sidebar_position: 2
---

# Manual Versions

The published Manual has stable documentation paths:

- `/manual/` for the current Manual source.
- `/manual/<major>.<minor>/` for frozen product minor Manuals, such as `/manual/0.33/`.

Product patch releases do not mint separate Manual versions. A release version
such as `0.22.5` normalizes to Manual version `0.22` and is served from
`/manual/0.22/`, not from a patch-specific Manual path.

This keeps patch-level release notes and compatibility fixes tied to the same
minor Manual surface.

## Latest Manual Promotion

Pull requests and ordinary `main` builds may validate Manual content, but they
do not promote the latest published Manual by themselves. Latest Manual and
GitHub Pages promotion happens only from a compatibility matrix promotion that
carries or references a verified `skenion.compatibility-matrix` document.

The active compatibility target is Contracts line `0.45`. A compatibility
matrix for that line records `contracts-line: "0.45"`, the canonical
`contracts-range: ">=0.45.0 <0.46.0"`, component artifact versions, the Manual
version, and the deployed Manual path `/manual/0.45/`. The docs deployment
verifies that the repository contains the matching major/minor Manual track
before publishing the Pages artifact. Patch releases on the same product minor
continue to resolve to the same major/minor path; patch-specific Manual paths
are not valid. Historical Manuals, such as `0.43`, remain available from their
frozen major/minor paths.

## Artifact Verification

Manual deployment is one compatibility-matrix promotion gate. The matrix also
names the registry packages, Runtime binary assets, Studio desktop packages,
Runtime sidecars, examples conformance evidence, checksums, and Pages URL that
were verified together.

A compatibility matrix is not promoted just because the docs build succeeds. It
is promoted only after the matrix verifier confirms the expected artifacts and
the GitHub Pages deployment for the normalized Manual path has succeeded.

## Strict v0 Version Policy

skenion v0 treats version fields as exact current-version discriminators, not
as compatibility ranges. A graph, project, node, operation, extension package,
Runtime HTTP request, manifest, protocol payload, or Manual metadata record that
declares an unsupported version is rejected with a structured diagnostic before
authoring, validation, planning, execution, package installation, or help
rendering continues.

The v0 Manual does not define legacy compatibility modes, deprecated
compatibility modes, or import-only modes. It also does not define
compatibility aliases for old graph labels, project shapes, package manifests,
Runtime routes, or protocol names. Public examples should name the current
contract label and artifact version directly.

## Contracts Lines And Matrices

skenion v0 releases are coordinated by compatibility matrices. Component
repositories use their natural Release Please versions; the promoted matrix
records which released component artifacts are compatible with a Contracts line.

Before a v0 matrix is promoted, verification must cover these surfaces:

- `@skenion/contracts` and the `skenion-contracts` Rust crate inside the
  declared Contracts line.
- `@skenion/sdk`, when listed, with the declared supported Contracts range.
- Runtime OS/arch GitHub Release binary assets, sidecars, checksums, and
  smoke-test evidence.
- Studio web deployment artifacts and desktop GitHub Release packages.
- skenion examples conformance evidence, fixture tag, or recorded commit.
- Manual metadata, Pages deployment evidence, and the deployed major/minor
  Manual path.

The Manual path remains major/minor, while the compatibility matrix records the
exact component artifacts. For example, a `0.45.1` Manual patch release still
publishes Manual content under `/manual/0.45/`, while the matrix identifies the
exact component artifact versions and evidence that were promoted.

See [Compatibility Matrix And Install Artifacts](release-train-install.md) for
the compatibility matrix, Runtime standalone binaries, Studio desktop packages,
sidecar requirements, promotion gates, and updater status.

## No Broad Version Promises

Manual pages should avoid wildcard labels, forward-looking version promises,
broad SemVer ranges, or fallback alias promises. The exception is the canonical
Contracts compatibility line range recorded by the matrix, such as
`>=0.45.0 <0.46.0`. Wire/schema discriminator fields remain exact
current-version checks, not package SemVer ranges.
