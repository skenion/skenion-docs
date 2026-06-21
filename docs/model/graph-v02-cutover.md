---
status: draft
sidebar_position: 15
---

# Graph v0.2 Cutover

Graph v0.2 is the active graph and project model for current Skenion
authoring. New Studio, Runtime, SDK, examples, packages, and Manual behavior
should use `ProjectDocumentV02`, `GraphDocumentV02`, patch libraries,
`PatchDefinitionV02`, `GraphFragmentV02`, and v0.2 Runtime graph targets.

Persisted graph v0.1 documents are legacy import/migration only. Skenion may
load v0.1 content through explicit import or migration paths, but v0.1 is not a
current authoring target, Runtime execution target, collaboration target,
package format, or live-help fixture format.

## Active Project Documents

A current project is stored as `ProjectDocumentV02`. The project owns the root
`GraphDocumentV02`, project metadata, view state, package references, and a
project patch library. Studio and Runtime should treat that v0.2 project
document as the source of truth for user-authored project state.

The root graph is still just one graph target inside the project. Additional
targetable graph surfaces can come from project patch definitions, package patch
definitions, embedded patch instances, and volatile help working copies. Those
surfaces share v0.2 graph semantics even when their persistence and ownership
rules differ.

## Patch Libraries

Reusable patches live in patch libraries as named `PatchDefinitionV02` entries.
The same definition shape is used for project patches, first-party package
patches, extension package patches, and live-help patches.

When Studio resolves object text such as `p chorus_voice`, it should resolve the
name against a v0.2 patch library and materialize a patch-backed node in the
parent graph. Editing a referenced project patch definition changes all project
references to that definition unless the author explicitly copies or embeds a
separate patch.

## Live Help

Live help uses the same v0.2 patch primitive as user projects. A help topic
opens a real graph surface backed by a `PatchDefinitionV02`; first-party or
package help source may be protected as read-only, but users can still select
nodes and copy useful content.

Opening help should not create a special documentation-only graph model. A
volatile help working copy is a Runtime graph target around the same v0.2 graph
API, with source protection handled by ownership and persistence rules.

## Graph Fragments

Selections, snippets, help examples, duplicate, copy, cut, paste, encapsulate,
and de-encapsulate operations use `GraphFragmentV02`. The fragment records
selected v0.2 nodes, valid internal edges, optional omitted edge metadata, view
data, and paste options.

Pasting a fragment is a Runtime graph operation. Runtime applies the fragment to
a v0.2 graph target with a base revision, placement, id-conflict policy, and
outside-endpoint policy. The meaning of the paste does not depend on whether the
client is connected through a managed local Runtime, a shared local Runtime, or
a remote Runtime.

## Runtime Graph Targets

Runtime operations address a session and a graph target. A target can name the
project root graph, a project patch definition, a package patch definition, an
embedded patch instance, or a `help-working-copy`.

The active Runtime target contract is v0.2. Validation, planning, preview,
execution, copy/paste, and collaborative graph operations should use v0.2 graph
documents and target paths. v0.1 content must be migrated before it becomes an
active Runtime graph target.

## Legacy v0.1 Imports

Graph v0.1 remains useful as a compatibility fixture and import source. Import
or migration code may read persisted v0.1 payloads, preserve their meaning where
possible, and produce v0.2 project or graph documents.

After migration, active authoring continues on the produced v0.2 document. Do
not add new v0.1-only features, reinterpret v0.1 as a subpatch format, or route
new Runtime, collaboration, package, marketplace, or live-help behavior through
v0.1 documents.
