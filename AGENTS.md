# Codex Agent Context

This repository is one part of the Skenion workspace. Do not treat local code
momentum as the source of truth: before committing, pushing, opening a PR, or
writing PR close keywords, check the relevant GitHub milestone and issue with
`/opt/homebrew/bin/gh`.

## Public Manual Boundary

`Skenion-docs` is the public product Manual, not a dumping ground for internal
research, competitor analysis, or strategic UX rationale. Keep internal research
in the private workspace or another explicitly private location, and promote
only sanitized product decisions into docs.

## Strict v0 Manual Policy

Skenion v0 does not support legacy, deprecated, or import-only compatibility
paths. Manual content should describe the current product surface only.
Unsupported schema, protocol, graph, project, package, manifest, extension, or
ABI versions should be documented as rejected inputs, not migration paths or
compatibility modes.

The forward graph/project contract label is `0.1`. Docs should follow Contracts
after v0.2 is merged into the 0.1 label. Do not preserve the old v0.1 meaning as
legacy compatibility, and do not document v0.2 as a parallel product surface. If
a version field remains, document exact current `0.1` acceptance and structured
rejection for all others.

## Manual Versioning

The Manual is versioned by product major/minor path, such as `/manual/0.55/`.
Patch releases such as `0.55.3` belong to the `0.55` Manual path. The latest
Manual must correspond to a verified compatibility matrix and a successful
GitHub Pages deployment for the normalized major/minor path.

## Compatibility Matrix Promotion

Skenion v0 releases are coordinated by verified compatibility matrices, not by
one shared product SemVer across every component. Component repositories use their
natural Release Please versions; the hub promotes a matrix that declares the
Contracts line, supported Contracts range, component artifact versions,
Runtime/Studio assets, examples conformance, and Manual Pages evidence.

A Contracts compatibility line such as `0.45` means `>=0.45.0 <0.46.0`.
Patch releases inside that line are compatible. Graph, project, extension,
Runtime HTTP, manifest, and protocol discriminator fields remain exact
current-version checks and should not be described as SemVer ranges.

## Manager, Worker, And Review Gate Defaults

Codex should operate as a manager/orchestrator on Skenion work. The manager owns
sequencing, milestone and issue hygiene, PR title/body/close-keyword control,
worker assignment, integration, and final reporting. Except for trivial
documentation, context, issue, or status edits, the manager should not directly
modify code. Implementation work and follow-up fixes should be delegated to
focused worker agents, then integrated by the manager. Workers must receive a
clear ownership scope, usually specific files, modules, or repository slices,
and must be told that other agents may be editing nearby code.

Follow-up work is not an exception: if review, CI, or user feedback requires
non-trivial code changes, the manager must assign that work to a worker and send
the completed slice through a separate review gate again. The manager may run
verification and status commands, but should not directly patch non-trivial
implementation code.

Every completed worker slice needs a separate review gate before it is treated
as done. The gate should be a different expert agent from the worker. A gate
review should prioritize correctness, API cleanliness, responsibility
boundaries, readability, test coverage, CI risk, and milestone acceptance
criteria. If the gate fails, the manager must send concrete fixes back to a
worker, then run the gate again until the slice passes or a real blocker is
recorded in the issue. The manager may only make trivial documentation,
context, issue, or status corrections directly.

Default code quality requirements:

- Write code that is easy to read before it is clever.
- Follow clean-code principles: clear names, small responsibilities, explicit
  data flow, predictable control flow, and low incidental coupling.
- Do not introduce interface-based abstraction lightly. Public APIs, traits,
  generated clients, schemas, and extension points must earn their existence and
  remain small, stable, and understandable.
- Keep responsibility ownership clear. Runtime, Studio, Contracts, SDK,
  Examples, and Docs must not duplicate each other's source-of-truth roles.
- UI/UX work must be reviewed for actual workflow quality, not merely rendered
  components.

Issues and milestones are the operating ledger. When work discovers new debt,
missing scope, or a design risk, record it on the relevant GitHub issue or open
a properly milestoned issue before burying it in local context. Close issues
only when the repository-specific acceptance criteria are genuinely complete.
Use `Refs` for partial or cross-repo work and `Closes` only for finished scope.
