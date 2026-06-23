---
status: draft
---

# Control Operators

Control operators are Pd-style message-domain objects. They run when a hot inlet
receives a value or a `bang`; cold inlets store sticky operands without
triggering output.

## First Baseline

The first skenion control operator baseline is:

- `+`
- `-`
- `*`
- `/`
- `pow`
- `min`
- `max`
- `sqrt`

## Binary Operators

Binary operators have:

- `in`: hot inlet, accepts control messages.
- `right`: cold inlet, stores the right operand.
- `out`: value output.

Creation arguments initialize the cold/right operand. For example `[+ 1]`
creates an add operator with `right = 1`.

Behavior:

- hot float/int/uint input updates left operand and emits the computed result.
- hot `bang` emits the current computed result.
- cold numeric input updates the right operand silently.
- `set ...` updates stored state silently where supported by the object.

## Deterministic Domain Policy

Pd-compatible operators must not leak host-language exceptional values into the
control graph.

- `/` returns `0` when the right operand is zero.
- invalid `pow` domains return `0`.
- `sqrt` returns `0` for nonpositive input.

skenion may later provide strict math operators as extensions, but the Pd-style
baseline uses deterministic Pd-compatible behavior.

## Unary Operators

The first unary baseline is `sqrt`. It has:

- `in`: hot inlet.
- `out`: value output.

It stores the latest input for bang re-output. It does not need a cold inlet
unless a future operator requires one.

