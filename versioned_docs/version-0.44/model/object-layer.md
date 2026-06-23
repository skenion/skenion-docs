---
status: draft
---

# Object Layer

The object layer is a user-facing layer over the data delivery model. It should
not define transport semantics by itself.

## Object Forms

- Value UI objects: Float, Int, UInt, Bool, Color, String.
- Message objects: Message box, Bang, Comment, Panel.
- Operator objects: `+`, `-`, `*`, `/`, `min`, `max`, and related control operators.
- Render/media/audio objects: user-facing forms for other delivery domains.

## Pd-Style Text Objects

Text such as `[+ 1]` or `[+ 1.]` should parse into:

- class id
- creation arguments
- inferred value representation where needed
- hot/cold inlet shape
- display text

The text is not the runtime implementation. It is a compact authoring surface
for a registered object class.

## Value Versus Operator

`Float` is a value/control UI object.

`[+ 1.]` is an operator object.

They may both display compactly on the canvas, but they do not have the same
runtime role.
