---
status: draft
---

# Audio DSP Model

Audio DSP is a real-time block/vector execution domain. It must not be modeled
as per-sample UI events or ordinary control message dispatch.

## Execution Model

The Rust runtime should compile an audio subgraph into a stable DSP plan:

- stable node order
- preallocated buffers
- explicit block size and sample rate
- bounded control update queue
- no blocking file, network, or UI work in the audio callback

Actual device IO and backend selection are deferred. This document only fixes
the contract shape needed to implement a high-performance Rust DSP engine later.

## First Signal Operator Baseline

The first audio operator baseline is:

- `+~`
- `-~`
- `*~`
- `/~`
- `sqrt~`

Without creation arguments, binary tilde operators use two signal inputs and
one signal output. With one numeric creation argument, they specialize to one
signal input plus a latched scalar operand.

Examples:

| Object text | Port shape |
| --- | --- |
| `[*~]` | `left: signal.audio`, `right: signal.audio`, `out: signal.audio` |
| `[*~ 0.5]` | `in: signal.audio`, `right: number.float`, `out: signal.audio` |
| `[/~ 0.5]` | `in: signal.audio`, `right: number.float`, `out: signal.audio` |

`/~` returns zero when the denominator is zero. `sqrt~` returns zero for
negative input in the Pd-compatible baseline.

## Oscillator And Noise Baseline

The first source baseline is:

- `osc~`: sine oscillator, frequency input/argument.
- `phasor~`: phase ramp generator.
- `cos~`: phase-domain cosine lookup.
- `noise~`: stateful pseudo-random audio signal source.

These nodes are stateful. Phase and random seed are runtime state, not pure
function arguments.

## Control And Signal Crossing

The first crossing baseline is:

- `sig~`: converts the latest control value into a signal block.
- `snapshot~`: samples a signal into a control value on trigger.

Control-to-signal crossing is block-aligned unless a later ramp/smoothing node
defines finer timing. Signal-to-control crossing must be explicit so the patch
can show latency and sampling policy.

