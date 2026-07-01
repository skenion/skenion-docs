---
status: active
sidebar_position: 1
---

# Nodes

A node is the graph instance a user places, moves, connects, copies, deletes,
or edits. A node may represent executable object behavior, a project patch
boundary, an annotation, a issue placeholder, or another Runtime-backed
surface.

An object is not the same thing as a node. An object is executable behavior
resolved by Runtime or by a provider package. An object node is one kind of
node: the graph instance whose behavior comes from a resolved object.

## Authority

Runtime is the source of truth for live node creation, replacement, deletion,
parameter updates, transient inputs, object resolution, connection validation,
and issues. Studio presents the graph and sends node operation requests.
Studio does not decide that an object exists and does not materialize accepted
live graph nodes without Runtime accepting the operation.

## Node Families

Current Manual pages group nodes by user-facing family:

| Family | Page | Runtime-backed status |
| --- | --- | --- |
| Objects | [Object Authoring](object-authoring.md) | Runtime-backed for resolver paths listed in the family pages. |
| Control and message | [Control And Message](control-and-message.md) | Runtime-backed now for `bang`, `float`, `int`, `uint`, and `message`. |
| Operators | [Operators](operators.md) | Runtime-backed now for the listed control operators. |
| Audio | [Audio](audio.md) | Partially Runtime-backed now. Unsupported reference candidates are marked explicitly. |
| Patch boundaries | [Patch Boundaries](patch-boundaries.md) | Runtime-backed now for object spec resolution; full subpatch execution remains a broader graph feature. |
| Render and media | [Render And Media](render-media.md) | Reference catalog and help material until Runtime registry alignment is complete. |
| Annotations and issues | [Annotations And Issues](annotations-and-issues.md) | Runtime-backed for comment objects and object-resolution issues; panel is currently reference/help aligned. |

This Manual is not the authoritative machine-readable registry. The live object
registry belongs to Runtime and provider packages. The SDK authoring surface
must expose the same interface shape for custom providers. This Manual records
the intended user model and the current support boundary.
