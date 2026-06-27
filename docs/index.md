---
status: active
slug: /
sidebar_position: 1
---

# skenion Manual

The skenion Manual explains how patches, objects, runtime behavior, and authoring
tools fit together. It is the product-facing companion to the machine-readable
contracts in `skenion-contracts`.

Start with the
[Object Value Occurrence Model](model/object-value-occurrence-model.md). It
defines the boundary between executable objects, typed values, value
occurrences, interface endpoints, and connections.

For the base model, read:

- [Data Types](model/data-types.md)
- [Value Occurrences](model/value-occurrences.md)
- [Runtime Value Bindings](model/runtime-value-bindings.md)
- [Interface Endpoints](model/interface-endpoints.md)
- [Connections](model/connections.md)
- [Objects](model/objects.md)
- [Messages](model/messages.md)

For release and install policy, read [Manual Versions](manual-versions.md) and
[Compatibility Matrix And Install Artifacts](release-train-install.md). They
explain strict v0 wire-version rejection, Contracts compatibility lines,
install artifact tiers, and the rule that public Manual pages avoid broad
version promises outside the matrix's canonical Contracts range.
