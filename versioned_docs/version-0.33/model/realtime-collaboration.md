---
status: draft
sidebar_position: 7
---

# Realtime Collaborative Editing

Realtime collaboration is coordinated by Runtime. Studio windows may show local
optimistic updates, cursors, selections, and inspector state, but the accepted
graph document belongs to the Runtime session. Active collaboration targets use
the 0.1 model described in
[Graph 0.1 Current Contract](./graph-01-current.md).

## Runtime Session Authority

A Runtime `sessionId` names the shared editing session. Graph mutations,
copy/paste requests, validation, preview, execution, history, and runtime events
are addressed to that session and to a graph target inside it.

Runtime accepts, rejects, rebases, and broadcasts graph operations. Clients can
prepare operations from their local view, but they reconcile against Runtime
acknowledgements and session events before treating the operation as committed.
When clients reconnect, they resume from a known session revision or replay
window and ask Runtime for the latest accepted session state if their local view
is stale.

## Participants And Presence

Runtime assigns participant ids and connection ids for collaborative sessions
so it can describe presence, operation causality, idempotency, and
actor-scoped undo metadata. These ids are collaboration identifiers, not
authentication identities.

In remote deployments, security identity should come from the authenticated
connection or deployment policy. Studio should not ask the user to type an
identity string that Runtime then trusts as authorization.

Presence is lightweight shared editing context. Runtime and Studio can expose
which participants are connected, which graph target each participant is
viewing, and optional cursor, viewport, or selected node and edge summaries.
Presence helps people avoid stepping on each other, but it is not the graph
document and should not make graph operations valid or invalid on its own.

## Operation Acknowledgement

Each graph operation is sent with the target graph, a base revision, operation
payload, and optional attribution metadata. Runtime responds with one of these
outcomes:

- `ack`: the operation applied at a new accepted revision.
- `reject`: the operation did not apply, with diagnostics the client can show.
- `rebase`: Runtime transformed or reordered the operation against newer
  accepted changes and reports the resulting operation, revision, and id remaps.

After an acknowledgement, Studio updates optimistic UI to match Runtime's
accepted result. After a rejection, Studio rolls back or marks the local edit as
unapplied. After a rebase, Studio keeps the accepted transformed result and
updates local selections, inspector state, and pending operations using the
returned id and revision mapping.

## Copy And Paste

Copying creates a `GraphFragmentV01` from the selected nodes and valid internal
edges. Pasting applies that fragment to a Runtime graph target. This has the
same meaning in `local-managed`, `local-shared`, and `remote` connection
profiles; the profile changes process lifecycle, not graph semantics.

Paste requests include the target graph, base revision, fragment, placement, and
options such as id conflict handling and outside endpoint policy. Runtime is
responsible for accepting the paste, rejecting it, or rebasing it against newer
changes. Accepted pastes return id remaps so Studio can keep selection,
inspector, history, and undo metadata pointing at the pasted content.

Read-only help views still support selection and copy. Pasting from help into a
project graph creates normal project-owned graph content and does not mutate the
first-party or package help source.

## Same-Session Windows

Two Studio windows that connect to the same Runtime `sessionId` are two views of
one shared session. Graph documents, patch libraries, diagnostics, runtime
events, history, control state, and execution state are shared through Runtime.

Viewport, zoom, local selection, open inspectors, active text edit state, and
drag gestures are window-local. A user can keep two windows on different parts
of the same patch without creating separate graph documents.

Help windows use volatile help working copies by default. A help working copy is
local to that help window unless the user promotes it into the project or pastes
selected fragments into a project graph. If a help working copy is explicitly
shared in a later workflow, Runtime should treat it like any other graph target
with its own revisions and accepted operations.

## Conflicts And Convergence

Concurrent edits are expected. Runtime uses stable graph ids, base revisions,
and deterministic merge rules so all clients converge on the same accepted
graph state after they process the same Runtime acknowledgements and broadcasts.

Non-overlapping changes should normally compose. Direct conflicts, invalid graph
targets, stale ids, type mismatches, missing capabilities, or policy violations
may be rejected with diagnostics. When Runtime can preserve the user's intent by
rebasing an operation, it should report the accepted transformed result rather
than leaving clients to guess.

## Undo Metadata

Runtime history can store participant or actor metadata so Studio can offer
actor-scoped undo and readable history labels. That metadata helps decide which
operations belong to a participant's undo stack, but it is not an authorization
claim.

If a participant undo is accepted, Runtime records it as another graph operation
and broadcasts the result. Other clients reconcile it through the same
acknowledgement and convergence path as any other edit.
