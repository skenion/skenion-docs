---
status: draft
sidebar_position: 3
---

# Subpatches

Subpatches are graph v0.2 composition units within the
[active v0.2 project model](./graph-v02-cutover.md). A subpatch packages a
patch graph behind explicit boundary ports so Studio can present that patch as
one object in another graph without changing the data delivery model.

Graph v0.2 is the forward contract for subpatch authoring. Persisted graph v0.1
documents remain compatibility and import surfaces; do not reinterpret old v0.1
payloads as subpatch definitions.

## Patch Library

A reusable patch is stored as a named `PatchDefinitionV02`. Project patches live
in the project `patchLibrary`; first-party package patches and extension package
patches use the same patch-definition shape when Studio resolves them for
authoring.

A `PatchDefinitionV02` has an `id`, `revision`, graph v0.2 document, optional
metadata, and optional view state. The `id` is the name that a parent graph
references. Editing a referenced project or package patch definition changes all
references to that definition unless the author explicitly copies it into an
embedded or project-owned patch.

Keep the authoring concepts separate:

- A referenced patch definition is a named library entry.
- An embedded patch instance is owned by one subpatch object instance.
- A graph fragment is a selection-based clipboard or palette snippet, not a
  patch definition by itself.
- A help patch is a patch definition opened through live help; its source may be
  read-only, but selected fragments can still be copied.

## Boundary Nodes

Every parent-facing inlet and outlet comes from an explicit boundary node inside
the patch definition:

- `core.inlet` exposes an external input. Inside the patch, it has an output
  port that carries the parent value into the patch graph.
- `core.outlet` exposes an external output. Inside the patch, it has an input
  port that receives the value leaving the patch graph.

The derived `PatchContractV02` is built from those boundary nodes. It preserves
the ordinary graph v0.2 port fields: `type`, `rate`, cardinality,
`mergePolicy`, `fanOutPolicy`, trigger and latch behavior, default and required
state, style/group data, label, and `description`.

Use the port `description` as the source of truth for tooltip and help text. Do
not add a separate tooltip field for subpatch boundaries; the same description
travels with normal nodes, subpatch contracts, help patches, and copied
fragments.

## Materialization

A parent graph materializes a patch definition as a patch-backed node. The
canonical node kind is `core.subpatch`; object text can also use the shorthand
`p <patch-id>`. For example, `p scale_twice` resolves to the patch definition
with id `scale_twice`.

The materialized node's visible ports mirror the derived `PatchContractV02`.
Validation must fail clearly when a node references a missing patch, recursively
references itself, or exposes ports that no longer match the referenced boundary
contract.

Boundary changes are interface changes. Renaming an inlet, changing a type or
rate, tightening cardinality, or changing merge/fan-out policy must be validated
like any other graph v0.2 node interface change.

## Runtime Expansion

Runtime v0 starts with flat expansion. Before validation, planning, and
execution, each `core.subpatch` or `p <patch-id>` node is expanded into the
referenced patch graph, node ids are made stable in the expanded namespace, and
parent edges are rewired through `core.inlet` and `core.outlet` boundaries.

Flat expansion is an MVP execution strategy, not a new nested runtime state
boundary. Subpatches do not create hidden cables, implicit globals, or
Runtime-global start/stop behavior. MIDI, clock sources, HID, serial, sliders,
keyboards, and other inputs remain node/object-level behavior.

Runtime planning classifies feedback that crosses a subpatch boundary the same
way it classifies explicit parent-graph feedback. A subpatch boundary is an
organizational surface; it must not hide an algebraic loop or bypass port
policy.
