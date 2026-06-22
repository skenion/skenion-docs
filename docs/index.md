---
status: active
slug: /
sidebar_position: 1
---

# Skenion Manual

The Skenion Manual explains how patches, objects, runtime behavior, and authoring
tools fit together. It is the product-facing companion to the machine-readable
contracts in `skenion-contracts`.

Start with the [Data Delivery Model](model/data-delivery-model.md) for graph
semantics, then use [Object Layer](model/object-layer.md) and
[Object Text Parser](model/object-text-parser.md) when authoring behavior needs
to line up with Studio and Runtime.

For the active graph model, start with
[Graph 0.1 Current Contract](model/graph-01-current.md). It explains that
`ProjectDocumentV01`, patch libraries, live help, graph fragments, and Runtime
graph targets are current 0.1/V01 surfaces, and that unsupported versions are
rejected with structured diagnostics. Then read [Subpatches](model/subpatches.md),
[Live Help](model/live-help.md), and [Graph Fragments](model/graph-fragments.md).

For Runtime session behavior, read
[Desktop Runtime Sessions](model/desktop-runtime-sessions.md) and
[Realtime Collaborative Editing](model/realtime-collaboration.md).
