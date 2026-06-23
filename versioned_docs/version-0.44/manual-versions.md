---
status: active
sidebar_position: 2
---

# Manual Versions

The 0.44 Manual track is published at `/manual/0.44/`.

Product patch releases do not mint separate Manual versions. A product version
such as `0.44.1` normalizes to Manual version `0.44` and is served from
`/manual/0.44/`, not from a patch-specific Manual path.

This keeps patch-level release notes and compatibility fixes tied to the 0.44
Manual lookup. A `0.44` patch train resolves through this 0.44 Manual track.

## Latest Manual Promotion

Pull requests and ordinary `main` builds may validate Manual content, but they
do not promote the latest published Manual by themselves. Latest Manual and
GitHub Pages promotion happens only from a release train promotion that carries
or references the train manifest.

For the `0.44.0` train, the manifest records `train-id: "0.44"`, the Manual
version `0.44.0`, and this deployed Manual path `/manual/0.44/`. The docs
deployment verifies that the repository contains the matching `0.44` Manual
track before publishing the Pages artifact. Patch trains on the same product
minor continue to resolve to `/manual/0.44/`; patch-specific Manual paths are
not valid.

## Artifact Verification

Manual deployment is one release completion gate in the lockstep train. The
train manifest also names the registry packages, Runtime binary assets, Studio
desktop packages, Runtime sidecars, examples fixture, checksums, and Pages URL
that belong to the same product version.

A train is not complete just because the docs build succeeds. It is complete
only after the release train verifier confirms the expected artifacts and the
GitHub Pages deployment for the train Manual path has succeeded.

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

## Lockstep Product Trains

skenion 0.44 is a lockstep product train. A completed 0.44 release aligns the
releasable artifacts in that train to the same product version, using
registry-compatible SemVer such as `0.44.0` where a three-part version is
required.

The release train metadata must align these surfaces before the train is
complete:

- `@skenion/contracts` and the `skenion-contracts` Rust crate.
- `@skenion/sdk`.
- Runtime OS/arch GitHub Release binary assets, sidecars, checksums, and
  smoke-test evidence.
- Studio web deployment artifacts and desktop GitHub Release packages.
- skenion examples fixtures, tag, or commit.
- Manual metadata and the deployed major/minor Manual path.

Patch releases stay on this major/minor Manual path, but the release train
manifest records the exact product version and artifact set. A `0.44` patch
train still resolves Manual content through `/manual/0.44/` while the train
metadata identifies the exact patch-level artifacts.

See [Release Train And Install Artifacts](release-train-install.md) for the
`0.44.0` compatibility matrix, Runtime standalone binaries, Studio desktop
packages, sidecar requirements, completion gates, and updater status.

## No Version Range Promises

Manual pages should avoid wildcard train labels, forward-looking version
promises, broad SemVer ranges, or fallback alias promises. When a page
describes a supported v0 surface, it should name the exact current graph
contract, protocol, package, Manual track, or product train version that is
supported.
