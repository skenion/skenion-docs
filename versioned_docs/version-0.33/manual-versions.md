---
status: active
sidebar_position: 2
---

# Manual Versions

The 0.33 Manual track is published at `/manual/0.33/`.

Skenion product patch releases normalize to their minor Manual version before
Manual lookup. For example, `0.33.5` normalizes to `0.33`, then resolves through
this 0.33 Manual track. Patch-specific Manual paths are not valid.

## Latest Manual Promotion

Pull requests and ordinary `main` builds may validate Manual content, but they
do not promote the latest published Manual by themselves. Latest Manual and
GitHub Pages promotion happens only from a release train promotion that carries
or references the train manifest.

For the `0.33.0` train, the manifest records `trainId: "0.33"`, the Manual
version `0.33.0`, and this deployed Manual path `/manual/0.33/`. The docs
deployment verifies that the repository contains the matching `0.33` Manual
track before publishing the Pages artifact. Patch trains on the same product
minor, such as `0.33.5`, continue to resolve to `/manual/0.33/`; patch-specific
Manual paths are not valid.

## Artifact Verification

Manual deployment is one release completion gate in the lockstep train. The
train manifest also names the registry packages, Runtime binary assets, Studio
desktop packages, Runtime sidecars, examples fixture, checksums, and Pages URL
that belong to the same product version.

A train is not complete just because the docs build succeeds. It is complete
only after the release train verifier confirms the expected artifacts and the
GitHub Pages deployment for this Manual path has succeeded.

## Strict v0 Version Policy

Skenion 0.33 treats version fields as exact current-version discriminators, not
as compatibility ranges. A graph, project, node, operation, extension package,
Runtime HTTP request, manifest, protocol payload, or Manual metadata record that
declares an unsupported version is rejected with a structured diagnostic before
authoring, validation, planning, execution, package installation, or help
rendering continues.

The 0.33 Manual does not define legacy compatibility modes, deprecated
compatibility modes, or import-only modes. It also does not define
compatibility aliases for old graph labels, project shapes, package manifests,
Runtime routes, or protocol names. Public examples name the current contract
label and artifact version directly.

## Lockstep Product Train

Skenion 0.33 is a lockstep product train. A completed 0.33 release aligns the
releasable artifacts to the same product version, using registry-compatible
SemVer such as `0.33.0` where a three-part version is required.

The release train metadata must align these surfaces before the train is
complete:

- `@skenion/contracts` and the `skenion-contracts` Rust crate.
- The `skenion-runtime` crate and Runtime OS/arch binary assets.
- `@skenion/sdk`.
- Studio web and desktop application packages.
- Runtime sidecar assets and checksums.
- Skenion examples fixtures, tag, or commit.
- Manual metadata and this `/manual/0.33/` Manual track.

Patch releases stay on this major/minor Manual path, but the release train
manifest records the exact product version and artifact set. For example, a
`0.33.5` train still resolves Manual content through `/manual/0.33/` while the
train metadata identifies the exact `0.33.5` artifacts.

## No Version Range Promises

Manual pages should avoid wildcard train labels, forward-looking version
promises, broad SemVer ranges, or fallback alias promises. When a page
describes a supported v0 surface, it should name the exact current graph
contract, protocol, package, Manual track, or product train version that is
supported.
