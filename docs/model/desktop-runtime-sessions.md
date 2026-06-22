---
status: draft
sidebar_position: 18
---

# Desktop Runtime Sessions

Skenion Studio desktop uses Tauri as the shell around the web Studio client.
Tauri owns windows, webviews, OS permissions, local child-process lifecycle,
and desktop clipboard bridges. Runtime sessions remain authoritative for graph
documents, patch libraries, diagnostics, execution state, history, and runtime
events.

The desktop shell must not become a second graph authority. A graph operation
has the same meaning whether Studio reaches Runtime through a managed local
sidecar, an already-running local endpoint, or a remote Runtime URL.

## Runtime Connection Profiles

A runtime connection profile describes how Studio reaches Runtime and who, if
anyone, owns the Runtime process. Runtime session info exposes this as a
`RuntimeConnectionProfile` with `mode`, `ownership`, `endpoint`, and optional
`process` metadata.

| Profile | Ownership | Startup | Shutdown |
| --- | --- | --- | --- |
| `local-managed` | `owned-child` | Tauri starts a bundled `skenion-runtime serve` child process on a loopback endpoint, usually with port `0` so Runtime chooses an available port and reports the bound endpoint. | Tauri may terminate only the exact child process it started. Switching away from `local-managed` should stop that owned child by default. |
| `local-shared` | `external` | Studio connects to an already-running local Runtime endpoint. | Studio must not terminate the external Runtime process. |
| `remote` | `remote` | Studio connects to a configured remote Runtime URL and starts no local process. | Studio has no local process to terminate. |

The active profile changes connection and lifecycle behavior; it does not
change graph, patch, paste, validation, planning, preview, or execution
semantics.

## Managed Sidecar Lifecycle

In `local-managed`, Tauri starts Runtime as an owned child process and records
the process ownership in profile metadata. The shell should health-check the
endpoint before treating the profile as connected, surface startup diagnostics
to the user, and include process metadata such as `ownedByHost`,
`ownerWindowId`, executable path, platform, and architecture when available.

When a managed sidecar starts successfully, Studio connects to the Runtime
endpoint reported by the child process. When the owning window closes, or when
the active profile changes to `local-shared` or `remote`, Tauri should stop
only that owned child process. It must not kill an unrelated `skenion-runtime`
process discovered on the same machine.

Isolated demo or test windows can use their own `local-managed` profile key.
Each isolated window owns its own Runtime child, temporary project or session
directory, endpoint, and session id. Closing the isolated window should clean up
only the child process and temporary state that window owns.

## Window Registry

The desktop shell keeps a window registry so multiple windows can be described
without confusing window state with Runtime session state. A window record has
a window id, title, timestamps, scope, and local UI state.

Window scopes are:

- `shared-runtime`: a normal Studio window connected to a Runtime URL,
  profile, and session id that may also be viewed by other windows.
- `isolated-runtime`: a demo or test window connected to its own Runtime child,
  owner window id, profile, endpoint, and session id.
- `volatile-help`: a help window backed by a temporary help working copy rather
  than a persistent Runtime session scope.

Window-local state includes viewport, selection, inspector state, active edit
state, and drag state. It is useful for restoring and coordinating windows, but
it is not the canonical graph document.

## Session Identity And Window Identity

A Runtime `sessionId` identifies the authoritative Runtime session. Windows are
views into that session. Multiple windows may share the same profile, Runtime
URL, and `sessionId`, which means they observe the same graph document, patch
library, diagnostics, runtime events, history, control state, and execution
state.

A window id identifies one desktop view. It should not be required for graph
semantics. Graph mutations, paste operations, validation, planning, preview,
and execution target the Runtime session and graph path with the relevant base
revision and operation payload. Window identity can be attached as attribution
metadata for local UI, presence, history labels, diagnostics, or undo display,
but Runtime must still be able to understand the operation without trusting a
window id as graph authority.

## Same-Session Multi-Window Behavior

When two windows point at the same Runtime session, Runtime is the coordination
point. A graph change accepted by Runtime in one window should be acknowledged
there and broadcast or replayed to the other windows for the same session.

Shared across same-session windows:

- graph documents and project patch libraries
- validation diagnostics, plans, preview state, and execution state
- runtime event streams, history, undo/redo state, and control state
- package and extension resolution visible to that Runtime session

Window-local for each view:

- viewport and zoom
- selected nodes and edges
- inspector open state and active edit state
- drag gestures and transient pointer or keyboard interaction

This split lets the same patch be edited in multiple windows without creating
competing graph documents. It also lets a user keep different views of the same
session open while Runtime remains the single source of accepted session state.

## Help Volatile Copies

Opening help creates a real graph view, but first-party and package help source
should remain protected. Desktop Studio opens those help surfaces as volatile
working copies by default. The user may inspect, select, copy, and experiment
inside the working copy, but closing the help window does not persist changes
back to the help source.

A help working copy is window-local unless the user explicitly promotes it or
pastes selected content into a project-owned graph. Copying from help produces
the same `GraphFragmentV01` clipboard payload as any other graph selection, so
read-only help views still support copying useful fragments. Promotion copies a
whole help `PatchDefinitionV01` into the project patch library under a
project-owned id. See [Live Help](./live-help.md) and
[Graph Fragments](./graph-fragments.md) for the graph-side behavior.

## Runtime API Shape

Runtime exposes the same session API shape for `local-managed`, `local-shared`,
and `remote` profiles. A `RuntimeSessionInfoResponse` reports the `sessionId`,
lifecycle, session snapshot, active `RuntimeConnectionProfile`, capability set,
event replay window, and diagnostics. The capability set may advertise
`multiWindow`, supported `profiles`, and `authPolicy`.

Connection profile metadata is descriptive. It tells Studio which endpoint is
active and whether a host owns a child process. It does not change the meaning
of session operations. A paste, mutation, validation request, preview request,
or control event is addressed to the target Runtime session and graph surface,
with base revisions and operation payloads that remain neutral across local and
remote profiles.

Remote deployments may add authentication and permission policy around the same
Runtime API, but this Manual track does not claim that auth or permissions are
complete. `authPolicy` remains `deferred` until a later Manual section defines
that behavior.
