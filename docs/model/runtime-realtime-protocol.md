---
status: active
sidebar_position: 19
---

# Runtime Realtime Protocol

Runtime realtime sessions use a WebSocket endpoint:

```text
GET /v0/sessions/{sessionId}
```

`GET /v0/sessions/{sessionId}` is the Studio live-session primary path. Studio
attaches here for the Runtime-owned session snapshot, replay/resume cursors,
node catalog hydration, graph commands, acknowledgements, applied events, and
issues. An ordinary HTTP request to this endpoint is rejected with an
upgrade-required issue. Clients must send a WebSocket Upgrade request.

## Envelope

Every realtime frame uses the same envelope shape:

| Field | Required | Meaning |
| --- | --- | --- |
| `schema` | yes | `skenion.runtime.realtime`. |
| `schemaVersion` | yes | Current realtime schema version. |
| `type` | yes | Frame type, such as `session.hello` or `graph.command`. |
| `messageId` | yes | Client or Runtime frame id. |
| `sessionId` | yes | Runtime session id. |
| `connectionId` | no | Runtime-issued connection id. |
| `clientId` | no | Client identity. |
| `windowId` | no | Window identity for multi-window clients. |
| `commandId` | no | Command-level id. Defaults to `messageId` when omitted. |
| `correlationId` | no | Correlates responses with a client frame. |
| `idempotencyKey` | command frames | Required for mutating or command frames. |
| `sequence` | Runtime events | Monotonic Runtime event sequence. |
| `cursor` | Runtime events and sync | Runtime replay cursor. |
| `createdAt` | Runtime frames | Runtime timestamp. |
| `payload` | yes | Frame-specific data. |

Clients must not use `kind` as the outer frame discriminator. The outer
discriminator is `type`. Node command kind lives inside the `graph.command`
payload.

## Attach And Resume

The first client frame must be `session.hello`. It can include `lastCursor` and
`resumeToken` in `payload` when reconnecting.

Runtime answers with one of:

- `session.attached`, including connection identity, `resumeToken`,
  `globalCursor`, current revisions, and a session snapshot.
- `session.syncRequired`, including the same current session data plus a
  issue explaining why replay or resume could not be satisfied.

If `lastCursor` is within the retained event window, Runtime sends
`session.attached` and then replays missed events after that cursor. If the
cursor is unknown, expired, ahead of the current cursor, or from another session
incarnation, Runtime sends `session.syncRequired`.

## Node Catalog Hydration

Studio hydrates live node catalog data through the attached WebSocket session.
That path is the live-session authority because it shares the same Runtime
session identity, current revisions, issues, and replay/resume boundary as
graph commands.

Runtime also exposes an independent HTTP snapshot endpoint:

```text
GET /v0/sessions/{sessionId}/node-catalog
```

This endpoint is read-only and non-mutating. It is useful for debug tools, CLI
inspection, health checks, and fallback clients that need a one-time catalog
snapshot without attaching to the realtime stream. It must not be used as a
polling or live-sync mechanism, and it must not override catalog state delivered
by an active WebSocket session.

Runtime owns node catalog authority: active providers, object resolution,
accepted node interfaces, endpoint policies, catalog-visible metadata, and
issues. Studio renders catalog data and dispatches node commands; it does
not own the object inventory or locally materialize accepted live nodes.

Contracts owns the shared DTO shape for catalog payloads that Runtime and
Studio exchange. Contracts does not own the node inventory, provider registry,
Runtime resolution behavior, or WebSocket framing.

`catalogRevision` is a provider/interface/catalog-visible metadata revision. It
changes when available providers change, when a patch or provider exposes a
different node interface, or when catalog-visible labels, descriptions,
primary specs, aliases, endpoint metadata, or issues change. Ordinary graph wiring, node
movement, transient `node.input`, and ordinary node parameter edits are graph or
runtime state changes; they do not invalidate the catalog unless they also
change the provider/interface/catalog-visible metadata surface.

## Graph Commands

Live graph edits use a `graph.command` frame. The payload contains a `kind`
field with one of:

- `node.resolve`
- `node.create`
- `node.replace`
- `node.delete`
- `node.update`
- `node.input`

The stale object-prefixed command names are unsupported in v0.

Runtime replies to accepted command frames with `graph.ack`. When a command
changes persisted graph state, Runtime also emits `graph.applied` to attached
clients. `graph.applied` includes the accepted command kind, target, revisions,
issues, node result, and event cursor.

`node.input` is not a persisted graph mutation. It sends transient input to an
existing node endpoint. A successful `node.input` is observed as
`control.emitted`, not as a graph edit.

## Idempotency

Command frames require `idempotencyKey`. Runtime caches command results by
client, window, frame type, and idempotency key. A duplicate command returns the
cached acknowledgement and any local replay result rather than applying the
operation a second time.

## Issues

Protocol errors are returned as Runtime realtime error frames with structured
issues. Node and graph operation failures remain scoped to the command
result whenever possible, so Studio can render the problem on the affected node
instead of replacing the whole graph view.
