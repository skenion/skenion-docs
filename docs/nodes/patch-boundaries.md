---
status: active
sidebar_position: 6
---

# Patch Boundaries

Patch boundary nodes make project patches and patch internals visible as graph
interfaces.

## Runtime-Backed Now

| Implementation object id | Common object spec | Role |
| --- | --- | --- |
| `subpatch` | `p` | Resolves a project patch reference in the current project context. |
| `inlet` | `inlet` | Declares an input boundary inside a patch. |
| `outlet` | `outlet` | Declares an output boundary inside a patch. |

`p my-patcher` is an explicit project patch reference. Runtime resolves the
patch id, derives or validates the external interface, and returns the accepted
node interface to Studio.

## Interface Changes

When a patch boundary changes, Runtime owns the resulting node interface and
incident edge policy. If a removed inlet or outlet invalidates existing edges,
Runtime reports the dropped or invalid edges through issues and applied
graph state. Studio renders that result; it does not silently keep stale wires.

## Help Patches

Live help graphs and example patches should use the same patch graph foundation
as user-created patch definitions. Help is a read-only or copyable view of a
real patch graph, not a separate object model.

