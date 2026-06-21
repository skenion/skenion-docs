---
status: draft
sidebar_position: 15
---

# Subpatches

Subpatches are graph-level composition units. A subpatch packages an internal
graph behind explicit boundary ports so Studio can present it as one object
without changing the data delivery model.

## Boundary Contract

A subpatch boundary must declare every inlet and outlet that can be cabled from
the parent graph. Boundary ports use the same `type`, `rate`, cardinality,
merge, fan-out, and feedback fields as graph v0.2 node ports.

The parent graph sees a subpatch as a node. The child graph sees boundary ports
as its external inputs and outputs. There is no hidden cable, implicit global
state, or runtime-owned transport inside the boundary.

## Execution Ownership

Subpatch execution belongs to the node/object that owns the subpatch instance.
MIDI, clock sources, HID, serial, sliders, keyboards, and custom inputs remain
node/object-level behavior. Runtime IO discovery may expose raw descriptors and
binding configuration for editors, but subpatches must not introduce
Runtime-global start, stop, or semantic decoding APIs.

## Revision And Validation

A subpatch has its own graph revision. Editing inside the subpatch mutates that
child graph revision; changing the boundary shape mutates the parent-facing node
interface and must be validated like any other graph v0.2 interface change.

Runtime planning should classify feedback that crosses the subpatch boundary in
the same way it classifies explicit parent-graph feedback. Subpatch boundaries
are organizational, not a way to hide an algebraic loop or bypass port policy.

## Manual And Examples

The Manual should describe the authoring model and review criteria. Compatibility
fixtures in `skenion-examples` should carry the concrete graph and project
payloads used by contracts, Runtime, and Studio smoke tests.
