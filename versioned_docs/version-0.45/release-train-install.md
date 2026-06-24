---
status: active
sidebar_position: 3
---

# Release Evidence And Install Artifacts

The active skenion compatibility target is the Contracts line `0.45`. That line
means `>=0.45.0 <0.46.0` for Contracts packages. A promoted Manual for the line
uses the normalized path `/manual/0.45/`; patch versions such as `0.45.1` stay
on that same major/minor Manual path.

skenion does not require every component artifact to share one product version.
Component repositories release at their natural Release Please
versions. The hub promotion record names the Contracts line, supported
Contracts range, component artifact versions, artifact URLs, checksums,
examples conformance, and Manual Pages evidence.

Large install artifacts are downloaded from the public DSUB S3 route
`https://cdn.dsub.io/skenion/releases/**`. GitHub Releases remain the compact
release ledger: release notes, source archives, and JSON manifests or indexes
that tell users and operators which DSUB objects to retrieve.

## Promotion Evidence

The compatibility matrix is promotion evidence, not a separate compatibility
authority or artifact host. It must use schema `skenion.compatibility-matrix`,
declare the Contracts line and canonical range, and list the released component
artifacts that were verified together.

| Surface | Matrix evidence |
| --- | --- |
| Contracts npm package | `@skenion/contracts` version inside the declared Contracts line |
| Contracts Rust crate | `skenion-contracts` version inside the declared Contracts line |
| Runtime standalone binaries | Runtime GitHub Release target manifests plus DSUB S3 artifact URLs, target ids, sizes, and sha256 checksums |
| SDK npm package | `@skenion/sdk` version plus the supported Contracts range |
| Studio web artifact | Studio GitHub Release web index plus DSUB S3 bundle URL, size, and checksum |
| Studio desktop packages | Studio GitHub Release per-target desktop indexes plus DSUB S3 package URLs, sizes, checksums, and signing or notarization status |
| Studio local-managed Runtime | Runtime artifact selected from Runtime release manifests, not a Studio-owned sidecar release asset |
| Examples fixture | Conformance status, tag, or recorded commit |
| Manual track | Major/minor path such as `/manual/0.45/` plus Pages deployment evidence |

Downstream release jobs consume released upstream artifacts. Contracts are the
compatibility seed; Runtime, SDK, Studio, Examples, and the Manual should not
publish or promote from unreleased sibling branches.

## Runtime Binary Artifacts

Runtime owns Runtime binary artifacts, checksums, and manifests. It is an
installable product binary distribution, not a crate registry release surface.
Users who want to run `skenion-runtime` directly, connect Studio to a shared
local Runtime, or connect Studio to a remote Runtime use Runtime release
manifests to locate the correct OS and architecture artifact.

The Runtime GitHub Release carries compact manifest JSON assets for each
target. Each target manifest names:

- `artifact.publicUrl` under `https://cdn.dsub.io/skenion/releases/**`.
- `sha256`, `size`, and `target`.
- The Runtime version and release tag that produced the artifact.
- Contracts evidence for the Runtime build.

The large Runtime archive and checksum objects are stored in DSUB S3 and
downloaded through the public CDN URL in the manifest. They are not large
GitHub Release assets.

Release-blocking Runtime binary targets for the active compatibility matrix are:

| Target | Tier |
| --- | --- |
| `aarch64-apple-darwin` | Release-blocking |
| `x86_64-apple-darwin` | Release-blocking |
| `x86_64-pc-windows-msvc` | Release-blocking |
| `x86_64-unknown-linux-gnu` | Release-blocking |

Preview Runtime binary targets for the active compatibility matrix are:

| Target | Tier |
| --- | --- |
| `aarch64-pc-windows-msvc` | Preview |
| `aarch64-unknown-linux-gnu` | Preview |

Preview targets may be published with checksums and smoke-test notes, but they
do not block matrix promotion when the release-blocking tier has passed.

## Studio Web And Desktop Artifacts

skenion Studio owns Studio web and desktop artifacts. The Studio web bundle,
its checksum, desktop packages, desktop checksums, and desktop manifest metadata
are DSUB S3 artifacts. The Studio GitHub Release carries compact JSON indexes
that name those DSUB objects.

For Studio web, the GitHub Release carries a compact web artifact index JSON.
That index points to the DSUB S3 web bundle and checksum.

For Studio desktop, the GitHub Release carries compact per-target desktop index
JSON assets. Each index points to the DSUB S3 desktop package and checksum for
that target and records release status such as signing and notarization
evidence when available.

Runtime sidecar ZIP or tar assets are no longer Studio-owned release assets.
When Studio uses `local-managed` Runtime, Studio stages Runtime binaries from
the Runtime release manifests. `local-managed` describes process lifecycle and
connection ownership, not Studio ownership of Runtime binaries.

Release-blocking Studio desktop package targets for the active compatibility
matrix are:

| Platform | Runtime artifact source |
| --- | --- |
| macOS arm64 | Stages the Runtime manifest artifact for `aarch64-apple-darwin` |
| macOS x64 | Stages the Runtime manifest artifact for `x86_64-apple-darwin` |
| Windows x64 | Stages the Runtime manifest artifact for `x86_64-pc-windows-msvc` |
| Linux x64 | Stages the Runtime manifest artifact for `x86_64-unknown-linux-gnu` |

Windows arm64 and Linux arm64 desktop packages are preview when their matching
Runtime manifest artifacts are available.

Studio can also connect to a standalone Runtime through the connection profiles
described in [Desktop Runtime Sessions](model/desktop-runtime-sessions.md).
Those profiles change process ownership and connection behavior, not graph
compatibility.

## Promotion Gates

A compatibility matrix is promotable only after verification confirms:

- `@skenion/contracts` exists on npm inside the declared Contracts line.
- `skenion-contracts` exists on crates.io inside the declared Contracts line.
- `@skenion/sdk`, when listed, exists on npm and declares the matrix Contracts
  range.
- Runtime GitHub Release target manifests exist, the DSUB S3 Runtime artifacts
  and checksums they reference are retrievable, and smoke-test evidence exists
  for the release-blocking OS/architecture tier.
- Studio GitHub Release web and desktop index JSON assets exist, the DSUB S3
  Studio artifacts and checksums they reference are retrievable, and Studio
  desktop indexes record their signing or notarization status.
- Studio local-managed Runtime staging uses Runtime release manifest artifacts
  for the matching Runtime target.
- Examples conformance evidence has passed.
- GitHub Pages has deployed the normalized Manual path, such as
  `/manual/0.45/`.

Main branch CI, an isolated package publish, or a docs build by itself is not
compatibility-matrix promotion.

## Signing And Updater Status

Release indexes and manifests should publish checksums for user verification.
Platform signing and notarization status should be reported with the desktop
index and release status when that status is available. Unsigned preview
artifacts are allowed for internal or pre-alpha release tracks and do not block
DSUB artifact evidence when build, checksum, staging, retrieval, and smoke
evidence are present.

Full application auto-updater rollout is not required for v0 compatibility
matrix promotion. Missing auto-updater support must not block promotion when
the release-blocking Runtime and Studio DSUB artifacts, checksums, Runtime
manifest staging, examples conformance, and Manual deployment are verified.
