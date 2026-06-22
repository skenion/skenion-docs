---
status: draft
sidebar_position: 5
---

# Graph Fragments

A graph fragment is the clipboard and palette payload for selected graph 0.1
content. It lets Studio copy, cut, paste, duplicate, encapsulate, and
de-encapsulate graph selections without creating a special object family for
snippets or help examples. See
[Graph 0.1 Current Contract](./graph-01-current.md) for the active document and target
model.

Graph fragments use `GraphFragmentV01`. A fragment contains selected nodes,
included edges, optional view data, optional `omittedEdges`, and optional
metadata.

## Selection Semantics

The selected nodes are the center of the fragment. When an edge connects two
selected nodes and remains valid inside the fragment, include it with its normal
graph 0.1 metadata: endpoints, resolved type, order, enabled state, adapter,
feedback policy, style, label, and `description`.

When an edge crosses the selection boundary, the copy operation must choose an
outside endpoint policy:

- `reject` keeps the operation strict and reports that the edge points outside
  the selected nodes.
- `omit` records the edge in `omittedEdges` with reason `outside-fragment` or
  `policy-omit`, then copies the selected nodes and fully internal edges.

This same fragment format applies to built-in nodes, extension nodes,
`core.subpatch`, `core.inlet`, `core.outlet`, IO convenience nodes, and nodes
shown inside help or example patches. Paste destinations may still reject
context-specific content; for example, boundary nodes are meaningful in patch
definitions but not as arbitrary root-graph objects.

## Paste Semantics

Runtime paste applies a fragment to a target graph, not to a Studio-only canvas.
A paste request names the graph target, `baseRevision`, fragment, optional
placement, and options such as `outsideEndpointPolicy`, `idConflictPolicy`, and
`preserveRelativePositions`.

The target path can identify the root graph, a project patch definition, a
package patch definition, an embedded patch instance, or a `help-working-copy`.
The operation has the same meaning whether Studio is connected through
local-managed, local-shared, or remote runtime profiles.

By default, paste should remap conflicting node and edge ids and return the id
remap in the Runtime response. If a client chooses `idConflictPolicy: "reject"`,
Runtime should leave the target unchanged when conflicts are present.

Actor or client identity is attribution metadata for history, presence, audit,
permissions, or actor-scoped undo. It is not required for the graph operation to
make sense. In authenticated deployments, the server should infer security
identity from auth/session context instead of trusting a pasted client string.

## Help Views

Read-only help views still support selection and copy. Copying from help creates
an ordinary `GraphFragmentV01`; pasting into a user graph remaps ids, preserves
valid internal edges, and does not mutate the first-party or package help
source.

If a user wants a whole help patch as a reusable project abstraction, use help
promotion instead of fragment paste. Promotion copies the source
`PatchDefinitionV01` into the project patch library so future `core.subpatch` or
`p <patch-id>` instances reference a project-owned definition.
