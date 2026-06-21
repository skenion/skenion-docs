---
status: draft
sidebar_position: 3
---

# Subpatches

Subpatches in graph v0.2 are composition units with explicit boundary ports.
They package a child graph as a parent-graph node while keeping the same typed
port, edge, cardinality, merge, fan-out, and feedback semantics as ordinary
nodes.

Subpatches do not create Runtime-global IO, clock, MIDI, or transport control.
Device descriptors and binding config can be exposed to node/object parameter
editors, but semantic input behavior remains owned by the object instance.

A subpatch boundary change is an interface change. It must be validated like a
node interface change and must not hide algebraic loops or bypass graph v0.2
feedback classification.
