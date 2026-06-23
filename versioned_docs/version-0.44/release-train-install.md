---
status: active
sidebar_position: 3
---

# Compatibility Matrix And Install Artifacts

The skenion 0.44 compatibility target is the Contracts line `0.44`. That line
means `>=0.44.0 <0.45.0` for Contracts packages. The matching Manual track is
`0.44`, and promotion deploys it at `/manual/0.44/`.

skenion does not require every component artifact in the 0.44 line to share one
product version. Component repositories release at their natural
Release Please versions, and the hub promotes a verified compatibility matrix
that names the Contracts line, supported Contracts range, component artifact
versions, checksums, examples conformance, and Manual Pages evidence.

## Compatibility Matrix

The compatibility matrix is the install source of truth. It must use schema
`skenion.compatibility-matrix`, declare the Contracts line and canonical range,
and then list the component artifacts that were verified together.

| Surface | Matrix evidence |
| --- | --- |
| Contracts npm package | `@skenion/contracts` version inside the 0.44 Contracts line |
| Contracts Rust crate | `skenion-contracts` version inside the 0.44 Contracts line |
| Runtime standalone binaries | GitHub Release assets, OS/arch target ids, and sha256 checksums |
| SDK npm package | `@skenion/sdk` version plus the supported Contracts range |
| Studio web and desktop artifacts | Deployment or GitHub Release assets and sidecar requirements |
| Studio Runtime sidecars | Runtime assets named by the matrix, not inferred from Studio version |
| Examples fixture | Conformance status, tag, or recorded commit |
| Manual track | `/manual/0.44/` plus Pages deployment evidence |

Downstream release jobs consume released upstream artifacts. Contracts are the
compatibility seed; Runtime, SDK, Studio, Examples, and the Manual should not
publish or promote from unreleased sibling branches.

## Runtime Standalone Binaries

Runtime is an installable product binary distributed through GitHub Release
assets. It is not published as a crate registry release surface. The Runtime
release publishes OS and architecture-specific standalone assets for users who
want to run `skenion-runtime` directly or connect Studio to a shared local or
remote Runtime.

Release-blocking Runtime binary targets for the 0.44 compatibility matrix are:

| Target | Tier |
| --- | --- |
| `aarch64-apple-darwin` | Release-blocking |
| `x86_64-apple-darwin` | Release-blocking |
| `x86_64-pc-windows-msvc` | Release-blocking |
| `x86_64-unknown-linux-gnu` | Release-blocking |

Preview Runtime binary targets for the 0.44 compatibility matrix are:

| Target | Tier |
| --- | --- |
| `aarch64-pc-windows-msvc` | Preview |
| `aarch64-unknown-linux-gnu` | Preview |

Preview targets may be published with checksums and smoke-test notes, but they
do not block matrix promotion when the release-blocking tier has passed.

## Studio Desktop Packages

skenion Studio desktop uses a Tauri shell around the Studio web client. Desktop
packages must bundle or reference Runtime sidecar assets declared by the same
compatibility matrix.

Release-blocking Studio desktop package targets for the 0.44 compatibility
matrix are:

| Platform | Runtime sidecar requirement |
| --- | --- |
| macOS arm64 | Bundles the matrix Runtime asset for `aarch64-apple-darwin` |
| macOS x64 | Bundles the matrix Runtime asset for `x86_64-apple-darwin` |
| Windows x64 | Bundles the matrix Runtime asset for `x86_64-pc-windows-msvc` |
| Linux x64 | Bundles the matrix Runtime asset for `x86_64-unknown-linux-gnu` |

Windows arm64 and Linux arm64 desktop packages are preview when their matching
Runtime sidecar assets are available.

Studio can also connect to a standalone Runtime through the connection profiles
described in [Desktop Runtime Sessions](model/desktop-runtime-sessions.md).
Those profiles change process ownership and connection behavior, not graph
compatibility.

## Promotion Gates

A 0.44 compatibility matrix is promotable only after verification confirms:

- `@skenion/contracts` exists on npm inside the 0.44 Contracts line.
- `skenion-contracts` exists on crates.io inside the 0.44 Contracts line.
- `@skenion/sdk`, when listed, exists on npm and declares the matrix Contracts
  range.
- Runtime standalone GitHub Release assets, checksums, and smoke-test evidence
  exist for the release-blocking OS/architecture tier.
- Studio web deployment artifacts and desktop GitHub Release packages exist with
  the Runtime sidecar assets named by the matrix.
- Examples conformance evidence has passed.
- GitHub Pages has deployed the `0.44` Manual track at `/manual/0.44/`.

Main branch CI, an isolated package publish, or a docs build by itself is not
compatibility-matrix promotion.

## Signing And Updater Status

Release assets should publish checksums for user verification. Platform signing
and notarization status should be reported with the desktop assets when that
status is available.

Full application auto-updater rollout is not required for v0 compatibility
matrix promotion. Missing auto-updater support must not block promotion when
the release-blocking assets, checksums, Studio packages, Runtime sidecars,
examples conformance, and Manual deployment are verified.
