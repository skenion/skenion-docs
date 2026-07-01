---
status: active
sidebar_position: 20
---

# Runtime Concurrency

Runtime is an async server. It can accept multiple HTTP requests and multiple
WebSocket connections. That does not mean every operation against the same
session is applied in parallel.

## Session Ordering

Persisted graph mutations inside one session must be ordered. Runtime uses
session revision checks, idempotency keys, and applied events to keep graph
state deterministic across multiple Studio windows and clients.

The intended policy is:

| Work | Policy |
| --- | --- |
| Different sessions | May run concurrently when they do not share mutable state. |
| Same-session graph mutation | Ordered and serialized by Runtime. |
| Same-session replay/resume | Ordered by Runtime cursor and retained event window. |
| `node.input` | Low-latency transient path, still validated and ordered by Runtime issues and event emission. |
| Read-only status and metadata | May be served concurrently when it does not mutate session state. |

Studio should assume Runtime is the arbiter. If two clients edit the same
session, Studio sends commands and renders `graph.ack`, `graph.applied`,
`control.emitted`, or issues from Runtime. Studio should not merge live
graph state locally as if it owned the mutation order.

## Non-Blocking Work

Runtime endpoints and realtime handlers should avoid blocking the async event
loop. Long-running or blocking work belongs behind an explicit worker boundary.

Examples:

- native extension execution that may block
- file system scans or package loads
- asset decode or transcode
- GPU or render preparation
- expensive validation or compilation
- network calls made by SDK or package code

Those jobs should report structured progress, issues, cancellation or
failure, and final applied state through Runtime-owned channels. A blocking
package or object must not freeze unrelated realtime session traffic.

## What Parallel Does Not Mean

Parallel server capacity is not a license to apply same-session graph edits out
of order. A fast UI action can be optimistic only as presentation. Runtime still
decides whether the command applies, which revision wins, which edges remain,
and which issues Studio must show.

