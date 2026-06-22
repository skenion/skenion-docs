---
status: draft
---

# Audio Signal

Audio is a real-time processing domain. It must not be modeled as a fast stream
of normal control messages.

## Delivery Model

| Property | Rule |
| --- | --- |
| flow | `signal` for sample-rate data, `stream` for audio buffers. |
| rate | `audio`. |
| clock | audio sample or audio block. |
| pressure | real-time safe; no UI/network blocking. |
| ownership | runtime audio engine owns block processing and device interaction. |

## Real-Time Safety

Audio processing must not depend on:

- Runtime HTTP requests.
- Studio UI event dispatch.
- Blocking file or network IO.
- Allocating unbounded memory in the audio callback.
- Graph mutation inside the callback.

## Control To Audio

Control values may modulate audio through explicit smoothing, sample-and-hold,
or control-rate-to-audio nodes. The crossing must define latency and smoothing.

## Audio To Control

Audio analysis requires explicit nodes such as RMS, peak, envelope follower, or
onset detection. These nodes decide block size, update rate, and event policy.

## Tilde Objects

Pd-style `~` object names indicate audio/signal-rate behavior, but Skenion must
still represent the underlying rate, flow, and clock explicitly.
