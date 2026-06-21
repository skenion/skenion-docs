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
[Graph v0.2 Cutover](model/graph-v02-cutover.md). It explains that
`ProjectDocumentV02`, patch libraries, live help, graph fragments, and Runtime
graph targets are active v0.2 surfaces, while v0.1 remains legacy
import/migration only. Then read [Subpatches](model/subpatches.md),
[Live Help](model/live-help.md), and [Graph Fragments](model/graph-fragments.md).

For Runtime session behavior, read
[Desktop Runtime Sessions](model/desktop-runtime-sessions.md) and
[Realtime Collaborative Editing](model/realtime-collaboration.md).
