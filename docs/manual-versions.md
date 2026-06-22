---
status: active
sidebar_position: 2
---

# Manual Versions

The published Manual has stable documentation paths:

- `/manual/` for the current Manual source.
- `/manual/<major>.<minor>/` for frozen product minor Manuals, such as `/manual/0.33/`.

Product patch releases do not mint separate Manual versions. A product version
such as `0.22.5` normalizes to Manual version `0.22` and is served from
`/manual/0.22/`, not from a patch-specific Manual path.

This keeps patch-level release notes and compatibility fixes tied to the same
minor Manual surface.

## Latest Manual Promotion

Pull requests and ordinary `main` builds may validate Manual content, but they
do not promote the latest published Manual by themselves. Latest Manual and
GitHub Pages promotion happens only from a release train promotion that carries
or references the train manifest.

For a train such as `0.55.0`, the manifest records `trainId: "0.55"`, the
Manual version `0.55.0`, and the deployed Manual path `/manual/0.55/`. The docs
deployment verifies that the repository contains the matching `0.55` Manual
track before publishing the Pages artifact. A patch train such as `0.55.3` must
continue to resolve to `/manual/0.55/`; patch-specific Manual paths are not
valid.

## Artifact Verification

Manual deployment is one release completion gate in the lockstep train. The
train manifest also names the registry packages, Runtime binary assets, Studio
desktop packages, Runtime sidecars, examples fixture, checksums, and Pages URL
that belong to the same product version.

A train is not complete just because the docs build succeeds. It is complete
only after the release train verifier confirms the expected artifacts and the
GitHub Pages deployment for the train Manual path has succeeded.

## Strict v0 Version Policy

Skenion v0 treats version fields as exact current-version discriminators, not
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

## Lockstep Product Trains

Skenion v0 releases move as one product train. A completed train has one product
version shared by the releasable artifacts in that train, using
registry-compatible SemVer such as `0.55.0` where a three-part version is
required.

Before a v0 train is complete, the release train metadata must align these
surfaces to the same product version:

- `@skenion/contracts` and the `skenion-contracts` Rust crate.
- The `skenion-runtime` crate and Runtime OS/arch binary assets.
- `@skenion/sdk`.
- Studio web and desktop application packages.
- Runtime sidecar assets and checksums.
- Skenion examples fixtures, tag, or commit.
- Manual metadata and the deployed major/minor Manual path.

The Manual path remains major/minor, but the release train manifest records the
exact product version and artifact set. For example, a `0.55.0` train publishes
Manual content under `/manual/0.55/` while the train metadata identifies the
exact `0.55.0` artifacts.

## No Version Range Promises

Manual pages should avoid wildcard train labels, forward-looking version
promises, broad SemVer ranges, or fallback alias promises. When a page
describes a supported v0 surface, it should name the exact current graph
contract, protocol, package, Manual track, or product train version that is
supported.
