---
status: active
sidebar_position: 3
---

# Release Train And Install Artifacts

The skenion 0.44 release train target is `0.44.0`. The matching Manual track is
`0.44`, and train promotion deploys it at `/manual/0.44/`.

skenion uses one lockstep product version across the release train. A user
install is considered complete only when the Contracts artifacts, Runtime
artifacts, SDK package, Studio packages, examples fixture, checksums, and Manual
track all point at the same product version.

## Compatibility Matrix

For the `0.44.0` train, every released artifact is expected to use version
`0.44.0` unless the artifact type stores only the Manual track id.

| Surface | Expected train value |
| --- | --- |
| Contracts npm package | `@skenion/contracts@0.44.0` |
| Contracts Rust crate | `skenion-contracts 0.44.0` |
| Runtime standalone binaries | `0.44.0` GitHub Release assets with checksums |
| SDK npm package | `@skenion/sdk@0.44.0` |
| Studio web and desktop artifacts | `0.44.0` GitHub Release or deployment assets |
| Studio Runtime sidecars | Matching Runtime `0.44.0` binaries |
| Examples fixture | `0.44.0` tag or recorded commit |
| Manual track | `/manual/0.44/` |

Downstream release jobs consume released upstream artifacts. Contracts are the
seed of the train; Runtime, SDK, Studio, Examples, and the Manual should not
publish from unreleased sibling branches.

## Runtime Standalone Binaries

Runtime is an installable product binary distributed through GitHub Release
assets. It is not published as a crate registry release surface. The Runtime
release publishes OS and architecture-specific standalone assets for users who
want to run `skenion-runtime` directly or connect Studio to a shared local or
remote Runtime.

Release-blocking Runtime binary targets for the `0.44.0` train are:

| Target | Tier |
| --- | --- |
| `aarch64-apple-darwin` | Release-blocking |
| `x86_64-apple-darwin` | Release-blocking |
| `x86_64-pc-windows-msvc` | Release-blocking |
| `x86_64-unknown-linux-gnu` | Release-blocking |

Preview Runtime binary targets for the `0.44.0` train are:

| Target | Tier |
| --- | --- |
| `aarch64-pc-windows-msvc` | Preview |
| `aarch64-unknown-linux-gnu` | Preview |

Preview targets may be published with checksums and smoke-test notes, but they
do not block the `0.44.0` train from completing.

## Studio Desktop Packages

skenion Studio desktop uses a Tauri shell around the Studio web client. Desktop
packages for `0.44.0` must bundle or reference Runtime sidecar assets from the
same `0.44.0` train.

Release-blocking Studio desktop package targets for the `0.44.0` train are:

| Platform | Runtime sidecar requirement |
| --- | --- |
| macOS arm64 | Bundles `aarch64-apple-darwin` Runtime `0.44.0` |
| macOS x64 | Bundles `x86_64-apple-darwin` Runtime `0.44.0` |
| Windows x64 | Bundles `x86_64-pc-windows-msvc` Runtime `0.44.0` |
| Linux x64 | Bundles `x86_64-unknown-linux-gnu` Runtime `0.44.0` |

Windows arm64 and Linux arm64 desktop packages are preview for this train when
their matching Runtime sidecar assets are available.

Studio can also connect to a standalone Runtime through the connection profiles
described in [Desktop Runtime Sessions](model/desktop-runtime-sessions.md).
Those profiles change process ownership and connection behavior, not graph
compatibility.

## Release Completion Gates

A `0.44.0` train is complete only after release verification confirms:

- `@skenion/contracts@0.44.0` exists on npm.
- `skenion-contracts 0.44.0` exists on crates.io.
- `@skenion/sdk@0.44.0` exists on npm.
- Runtime standalone GitHub Release assets, checksums, and smoke-test evidence
  exist for the release-blocking OS/architecture tier.
- Studio web deployment artifacts and desktop GitHub Release packages exist for
  `0.44.0` with matching Runtime sidecar assets.
- The examples fixture tag or recorded commit is part of the train manifest.
- GitHub Pages has deployed the `0.44` Manual track at `/manual/0.44/`.

Main branch CI, an isolated package publish, or a docs build by itself is not
product release completion.

## Signing And Updater Status

Release assets should publish checksums for user verification. Platform signing
and notarization status should be reported with the desktop assets when that
status is available.

Full application auto-updater rollout is not required for the `0.44.0` train.
Missing auto-updater support must not block the train when the
release-blocking assets, checksums, Studio packages, Runtime sidecars, examples
fixture, and Manual deployment are verified.
