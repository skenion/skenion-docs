---
status: active
sidebar_position: 18
---

# Runtime Node Commands

This page describes the conceptual Runtime API boundary for node operations. It
is for implementers. The user-facing Manual concepts remain in
[Objects](objects.md) and
[Object Identity And Specs](object-identity-and-specs.md). The concrete
WebSocket frame envelope and lifecycle are documented in
[Runtime Realtime Protocol](runtime-realtime-protocol.md).

Studio presents nodes and objects to the user. Runtime owns whether a node
exists, which object it resolves to, which live interface is materialized, how
commands are routed, and which graph or runtime state changes are applied.

The Runtime-owned node catalog is the read model that lets Studio show
available nodes before it sends commands. Studio renders that catalog and
dispatches node operation requests, but Runtime remains the authority for active
providers, available objects, accepted interfaces, endpoint policy, and
diagnostics.

## Command Kinds

Node commands use `kind` as the only command discriminator. There is no outer
`intent` wrapper.

The conceptual command kinds are:

- `node.resolve`
- `node.create`
- `node.replace`
- `node.delete`
- `node.update`
- `node.input`

Do not use stale object-prefixed command variants. The operation target is a
node, even when the request carries `objectSpec` or resolves an object
definition.

## Command Meanings

`node.resolve` asks Runtime to resolve `objectSpec` or a structured
implementation reference in the selected graph context. It returns the
resolution result, accepted interface data when available, and diagnostics for
unresolved or ambiguous input. It does not make Studio an object registry.

`node.create` asks Runtime to create a persisted graph node. Runtime performs
registry lookup, resolution, materialization, id assignment, endpoint policy
checks, and diagnostics before it reports the applied node state.

`node.replace` asks Runtime to replace the object/interface behind an existing
node. Runtime decides whether node identity can be preserved, which endpoint
interface is accepted, which existing edges remain valid, and which edges or
state must be removed or reported.

`node.delete` asks Runtime to remove a graph node. Runtime owns the deletion
policy, edge cleanup, runtime teardown, diagnostics, and resulting applied graph
state.

`node.update` asks Runtime to mutate persisted graph or node parameters. It is a
saved graph/node state change, such as changing an object argument, stored
parameter, display-relevant node property, or other persisted node metadata that
Runtime accepts.

`node.input` sends a transient runtime/control occurrence to a live node or
input endpoint. It is not persisted graph state. Use it for delivered control
values such as bang, message, numeric, or other accepted runtime occurrences.
Do not use `node.input` for saved parameter mutation, and do not use
`node.update` for transient control delivery.

## Runtime Ownership

Runtime owns the WebSocket envelope and realtime command transport. Runtime also
owns ACK/applied framing, idempotency handling, session and graph routing,
supported-kind negotiation, registry lookup, object materialization, endpoint
and edge policy, diagnostics, and applied-state events.

An ACK only speaks for command receipt or protocol acceptance. The applied
result is the Runtime-owned answer about whether graph or runtime state changed,
which node interface is now authoritative, and which diagnostics Studio should
render.

Studio sends node operation requests and renders Runtime results. Studio may
show search, completion, palette, unresolved, ambiguous, collision, and repair
UI, but Studio does not decide object existence, does not own the live registry,
and does not materialize accepted live graph nodes locally.

Contracts may define shared payload shapes that Studio and Runtime both need to
understand. Runtime remains the authority for protocol framing, supported
command kinds, registry behavior, command application, and edge policy.

Runtime concurrency policy is documented in
[Runtime Concurrency](runtime-concurrency.md). In particular, async server
capacity does not mean same-session graph mutations are applied in parallel.

## Node Catalog Boundary

Studio should receive live node catalog state through the WebSocket live session
documented in [Runtime Realtime Protocol](runtime-realtime-protocol.md). The
HTTP `GET /v0/sessions/{sessionId}/node-catalog` endpoint is an independent
read-only snapshot for debug, CLI, health-check, and fallback use. It is not a
polling transport, not a command path, and not a second source of truth.

`catalogRevision` tracks provider, interface, and catalog-visible metadata
changes. It is not a graph content revision. Creating or rewiring nodes, moving
nodes, sending `node.input`, or editing ordinary node parameters changes graph
or runtime state as Runtime accepts those operations, but it does not by itself
require a new catalog revision.
