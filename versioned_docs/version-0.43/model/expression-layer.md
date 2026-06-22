---
status: draft
---

# Expression Layer

Expression objects are a layer over control or signal domains. They should not
be the base data delivery model.

## Families

- `expr`: control-rate expression evaluation.
- `expr~`: signal/audio-rate expression evaluation.
- `fexpr~`: signal expression evaluation with indexed sample history.

## Reference Syntax

Initial syntax to review:

- `$f1`: float/control inlet 1.
- `$i1`: integer/control inlet 1.
- `$s1`: string/control inlet 1.
- `$v1`: signal vector inlet 1.
- `$x1[n]`: indexed signal input sample.
- `$y[n]`: indexed signal output/history sample.

## Deferred Decisions

The full parser grammar, function list, security policy, optimization strategy,
and runtime backend are deferred. This document only establishes that expr-like
objects sit on top of the delivery model and must respect control versus audio
domain boundaries.

## Relationship To Pd Baseline

`expr`, `expr~`, and `fexpr~` are not the base transport model. They are
expression objects over the control and audio models. They should be specified
after object text parsing and the first DSP contract are stable.

Initial review targets:

- `$f1`, `$i1`, and `$s1` reference control inlets.
- `$v1` references a signal vector inlet.
- `$x1[n]` references indexed signal input samples.
- `$y[n]` references output/history samples in feedback expressions.

The first DSP baseline does not implement expression evaluation. It only leaves
room for expression objects to consume the same port, rate, and clock model.
