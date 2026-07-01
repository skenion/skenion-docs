---
status: active
sidebar_position: 8
---

# Annotations And Diagnostics

Annotation and diagnostic nodes are graph nodes that help users understand or
repair a patch. They do not turn text, bool, or arbitrary payloads into data
type families.

## Runtime-Backed Now

| Implementation object id | Common object spec | Role |
| --- | --- | --- |
| `comment` | `comment` | Stores visible annotation text. |

Unresolved, ambiguous, stale, or invalid object specs are represented by the
node's `objectResolution` state and diagnostics. Runtime should keep the
editable `objectSpec` on the same node instead of materializing a separate
unresolved object kind or deleting the user's input.

## Reference Or Pending Registry Alignment

Panel and layout-oriented nodes may exist in Studio reference/help material.
They should become live graph authority only after Runtime exposes them through
the Runtime registry and accepts their node operations.

## Display Responsibility

Studio owns presentation details such as outlines, labels, inspector panels,
and hover text. Runtime owns whether the node is resolved, ambiguous,
unresolved, or invalid, and returns structured diagnostics for Studio to show.
