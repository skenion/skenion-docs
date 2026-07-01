---
status: active
sidebar_position: 10
---

# Object Value Occurrence Model

The core skenion model separates executable objects, data values, value
occurrences, interface endpoints, and connections.

This split is mandatory. A value is not an object. A data type is not a node.
Delivery frequency is not a data type. Studio may present editing helpers, but
Runtime remains the authority for live object resolution, compatibility checks,
operation acceptance, and issues.

## Model Layers

| Layer | Meaning | Owner |
| --- | --- | --- |
| Data type | The shape and identity of a value. | Contracts define the shared type grammar and static invariants. |
| Value occurrence | One arrival of one typed value. | Runtime schedules and delivers occurrences. |
| Interface endpoint | An inlet or outlet on an object. | Runtime validates endpoint compatibility from object/provider definitions. |
| Connection | A route from one output endpoint to one input endpoint. | Runtime accepts or rejects connection operations. |
| Object | Executable behavior with endpoints and state. | Runtime and provider registries own object definitions and execution. |
| Studio | Editing and issue UX. | Studio asks Runtime to mutate or validate, then displays the result. |
| SDK | Authoring support. | SDK helps authors describe packages and objects without redefining Runtime semantics. |

## Reading Order

Read these pages as the current source of truth for the basic model:

- [Data Types](data-types.md)
- [Value Occurrences](value-occurrences.md)
- [Runtime Value Bindings](runtime-value-bindings.md)
- [Interface Endpoints](interface-endpoints.md)
- [Connections](connections.md)
- [Objects](objects.md)
- [Object Identity And Specs](object-identity-and-specs.md)
- [Runtime Node Commands](runtime-node-commands.md)
- [Messages](messages.md)

These pages replace the older public model pages that mixed graph delivery,
object inventory, media domains, runtime sessions, and schema policy into one
surface.

## Non Goals

This section does not define the first-party object registry. It also does not
define Runtime transport internals, collaboration transport, package loading,
or release artifact policy. Those surfaces consume the model here, but they are
owned by their own Runtime, Studio, SDK, package, or release documents.
