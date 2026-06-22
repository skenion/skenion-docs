---
status: draft
---

# Render And GPU

Render and GPU work are related but not identical.

## Render

Render nodes run on a render frame clock. A render node may produce a render
frame, GPU resource, preview output, or diagnostic result depending on its
contract.

## GPU

GPU textures and buffers are runtime/device resources. They are not copied as
ordinary values through the graph.

GPU resources need clear ownership and lifetime rules:

- Which runtime/device owns the resource?
- Can it be shared between passes?
- Is it transient, cached, or externally backed?
- Does it need explicit readback to become CPU/control data?

## Preview Output

Preview output selection must be explicit. A runtime should not guess the first
render-like node in a graph.

## Error Surface

Shader analysis, WGSL generation, compile, pipeline, and frame errors should be
separate diagnostics. Studio should show the layer that failed.
