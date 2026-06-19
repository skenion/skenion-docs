---
status: draft
---

# Pd Baseline Matrix

This document records the Pure Data inspired baseline Skenion should understand
before implementing Pd-style object authoring. It is a review matrix, not a
promise that every object is implemented in the first runtime pass.

## Baseline Categories

| Category | Vanilla Pd baseline | Skenion status |
| --- | --- | --- |
| Object text | `[+ 1]`, `[*~ 0.5]`, `[osc~ 440]` parse into a class symbol plus creation arguments. | Must be parsed into explicit canonical node ids, params, and instance ports. |
| Control values | Float number atom, `float`, `int`, `symbol`, `bang`, message box. | Covered by control/message model; needs object text and operator integration. |
| Control operators | `+`, `-`, `*`, `/`, `pow`, `min`, `max`, `sqrt`, `clip`, relational and logical operators. | First baseline should include arithmetic and sqrt only. |
| Signal operators | `+~`, `-~`, `*~`, `/~`, `sqrt~`, `clip~`, `abs~`, `wrap~`, conversions such as `mtof~`. | First baseline should include arithmetic and sqrt only. |
| Oscillator/noise | `osc~`, `phasor~`, `cos~`, `noise~`, `tabosc4~`. | First baseline should include `osc~`, `phasor~`, `cos~`, and `noise~`. |
| Control/signal crossing | `sig~`, `snapshot~`, `env~`, `line~`, `vline~`. | First baseline should include `sig~` and `snapshot~`; smoothing and envelope nodes come later. |
| Expression objects | `expr`, `expr~`, `fexpr~`. | Deferred until object text and DSP contracts are stable. |
| Audio IO | `adc~`, `dac~`. | Deferred until the Rust audio backend is selected. |
| Subpatch DSP context | `block~`, `switch~`. | Deferred, but DSP docs must leave room for scoped block size and switch state. |

## Vanilla Versus Extension

Skenion may provide nicer high-level nodes than vanilla Pd, but those nodes must
be labeled as Skenion extensions. For example:

- `osc~` is a vanilla sine oscillator.
- `phasor~` is a vanilla ramp/phase generator and can be used to build saw-like
  shapes.
- `cos~` is a vanilla phase-domain cosine lookup object.
- `sin~` is not part of the first vanilla baseline. Sine can be expressed with
  `osc~`, `expr~ sin($v1)`, or a future Skenion extension.
- `square~` is not part of the first vanilla baseline. It can be built from
  `phasor~` plus comparison/expression logic, or provided later as an extension.

## Minimum First Contract Slice

The first contract slice should make these object forms parseable and
machine-checkable:

- `[+ 1]`, `[+ 1.]`, `[* 0.5]`, `[/ 0.5]`
- `[+~]`, `[*~ 0.5]`, `[/~ 0.5]`
- `[osc~ 440]`, `[phasor~ 1]`, `[sqrt~]`

Runtime execution is intentionally not required for this slice. The purpose is
to lock class resolution, creation argument semantics, port shape, and domain
classification.

