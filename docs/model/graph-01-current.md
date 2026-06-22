---
status: draft
sidebar_position: 15
---

# Graph 0.1 Current Contract

Graph 0.1 is the single current graph and project contract for Skenion
authoring. Studio, Runtime, SDK, examples, packages, and Manual behavior use
`ProjectDocumentV01`, `GraphDocumentV01`, patch libraries,
`PatchDefinitionV01`, `GraphFragmentV01`, and 0.1 Runtime graph targets.

Unsupported graph, project, patch, fragment, package, Runtime HTTP, manifest,
or protocol versions are rejected with structured diagnostics. Skenion v0 does
not provide deprecated aliases or alternate active graph contract surfaces.

## Active Project Documents

A current project is stored as `ProjectDocumentV01`. The project owns the root
`GraphDocumentV01`, project metadata, view state, package references, and a
project patch library. Studio and Runtime treat that 0.1 project document as
the source of truth for user-authored project state.

The root graph is still just one graph target inside the project. Additional
targetable graph surfaces can come from project patch definitions, package patch
definitions, embedded patch instances, and volatile help working copies. Those
surfaces share 0.1 graph semantics even when their persistence and ownership
rules differ. A payload that declares any other graph contract version is not a
current document and must be rejected before authoring or Runtime planning.

## Patch Libraries

Reusable patches live in patch libraries as named `PatchDefinitionV01` entries.
The same definition shape is used for project patches, first-party package
patches, extension package patches, and live-help patches.

When Studio resolves object text such as `p chorus_voice`, it should resolve the
name against a 0.1 patch library and materialize a patch-backed node in the
parent graph. Editing a referenced project patch definition changes all project
references to that definition unless the author explicitly copies or embeds a
separate patch.

## Live Help

Live help uses the same 0.1 patch primitive as user projects. A help topic
opens a real graph surface backed by a `PatchDefinitionV01`; first-party or
package help source may be protected as read-only, but users can still select
nodes and copy useful content.

Opening help should not create a special documentation-only graph model. A
volatile help working copy is a Runtime graph target around the same 0.1 graph
API, with source protection handled by ownership and persistence rules.

## Graph Fragments

Selections, snippets, help examples, duplicate, copy, cut, paste, encapsulate,
and de-encapsulate operations use `GraphFragmentV01`. The fragment records
selected 0.1 nodes, valid internal edges, optional omitted edge metadata, view
data, and paste options.

Pasting a fragment is a Runtime graph operation. Runtime applies the fragment to
a 0.1 graph target with a base revision, placement, id-conflict policy, and
outside-endpoint policy. The meaning of the paste does not depend on whether the
client is connected through a managed local Runtime, a shared local Runtime, or
a remote Runtime.

## Runtime Graph Targets

Runtime operations address a session and a graph target. A target can name the
project root graph, a project patch definition, a package patch definition, an
embedded patch instance, or a `help-working-copy`.

The active Runtime target contract is 0.1. Validation, planning, preview,
execution, copy/paste, and collaborative graph operations use 0.1 graph
documents and target paths. A target that declares any other graph contract
version must fail with diagnostics before validation, planning, preview,
execution, package resolution, marketplace installation, live help, or
collaborative editing continues.

## Strict Version Handling

The version field on a graph, project, patch definition, graph fragment, package
manifest, Runtime HTTP request, or protocol payload is an exact current-version
discriminator. For this Manual track, the accepted graph contract label is
0.1/V01. Payloads with any other version are unsupported.

Diagnostics should identify the unsupported version, the expected current
version, and the document or API surface where the mismatch was found. They
should not silently reinterpret payloads, accept deprecated aliases, or continue
through a parallel contract path.
