---
status: active
sidebar_position: 16
---

# Objects

An object is executable behavior with a stable interface, internal state, and
Runtime-owned semantics.

In the Manual, a node is the graph instance the user places and wires. An
object is the user-facing authoring unit: the user types an `objectSpec`, sees
the accepted interface, connects endpoints, and repairs diagnostics. Execution
decisions belong to Runtime and providers.
For the node-family catalog, see [Nodes](../nodes/index.md).

`objectSpec` is the typed source text for an object, such as `osc~ 440`,
`+`, `message hello`, or a package-provided object name. Runtime may preserve it
for editing and diagnostics, but `objectSpec` is not authority for whether the
object exists, which interface it exposes, or how it executes.

Runtime is the object and node authority. Studio sends node operation requests
and renders Runtime results. Studio may keep in-progress editor text, offer
search, show completion hints, and present repair UI, but Studio does not decide
object existence and does not materialize live graph nodes locally.

Objects are not data types. A float value is data. A numeric UI box that stores,
updates, and emits a float is an object. A message box is an object. A bang box
is an object. Boolean and string values do not become object kinds merely
because they can be displayed or emitted.

## Object Resolution

Runtime resolves object definitions from first-party registries, project
patches, installed packages, and development packages. Studio may offer object
search, palette UI, and unresolved-object repair, but the live object
definition and live node state are Runtime-owned.

Object identity follows the canonical rules in
[Object Identity And Specs](object-identity-and-specs.md). In short,
the user-facing `objectSpec` is resolver input, while persisted execution
identity is the Runtime-accepted `implementation` plus `objectResolution`.

When Studio asks to create, replace, delete, update, input, or connect a node,
Runtime must be able to answer:

- whether the object can be resolved
- which endpoints it exposes
- which value policies those endpoints accept or emit
- whether the requested operation is accepted
- which diagnostic explains rejection

For a resolved object, Studio receives the accepted object interface, not the
implementation. That interface is enough to draw the box, draw inlets and
outlets, show labels/help text, and validate future user operations against
Runtime.
The executable implementation remains inside Runtime or the provider package.

Alias collisions, unresolved names, ambiguous provider matches, stale
providers, and invalid object specs are user-facing display states. Runtime
should preserve the user-facing `objectSpec` when possible and return a
structured `objectResolution` diagnostic. Studio should render the Runtime
result as an unresolved or ambiguous object instead of deleting the user's
input, silently choosing a provider, or pretending that the object exists. A
normal Studio presentation is an object with an error outline using the design
system's error color, plus the Runtime diagnostic in the inspector/log surface.

For the conceptual Runtime command boundary, see
[Runtime Node Commands](runtime-node-commands.md). For the WebSocket frame
shape and event flow, see
[Runtime Realtime Protocol](runtime-realtime-protocol.md).

## Project Patches And Package Objects

A project patch can define an object-like abstraction that is local to the
project. A package can provide reusable objects or patches. Both must resolve
to an object interface before Runtime accepts connections to them.

If a user types a name that matches several available providers, Studio must not
choose one silently. It should keep the object unresolved or ambiguous and ask
the user to choose. Persisted graph state should be based on the selected
provider identity and the object interface that Runtime accepted, not on a
guess made from display text.

Package and project objects must not encode publisher, package, version, URL, or
filesystem identity into a single dotted object id. Persist provider identity as
structured metadata, such as provider kind, lock entry, package id, capability
kind, and provided id.

## Object Inventory

The first-party object inventory is not defined by this page. It belongs to the
Runtime object registry and SDK authoring surfaces. The Manual node catalog
groups object families for users, but Runtime remains the live registry.
Contracts may define the shared shape used to describe an object's interface,
but Contracts should not own the runtime object list or object execution
behavior.

This boundary keeps custom objects and first-party objects on the same runtime
path: both provide definitions, both are validated by Runtime, and both report
diagnostics through the same channels.
