---
status: draft
---

# Data Delivery Model

This document is the review entry point for deciding how a Skenion feature
moves data. It comes before object syntax, UI widgets, runtime implementation,
or render nodes.

Machine-readable contracts live in `skenion-contracts`. This document explains
the model those contracts are expected to serve.

## Delivery Axes

Skenion describes data with several independent axes.

| Axis | Purpose |
| --- | --- |
| `flow` | Temporal delivery shape: value, event, signal, stream, or resource. |
| `rate` | Processing domain: event, control, audio, render, gpu, resource, or io. |
| `clock` | When work runs: control tick, audio block/sample, video frame, render frame, external event. |
| ownership | Who owns the current state or lifetime of the payload. |
| pressure | Whether delivery can queue, drop, block, copy, share, or retain latest. |
| latency | Whether changes must be immediate, next tick, next frame, or block-aligned. |

Do not start by asking whether something is an object. First decide which
delivery model it uses.

## Flow

| Flow | Meaning | Examples |
| --- | --- | --- |
| `value` | Retained current value. | Float value, toggle state, color. |
| `event` | Discrete occurrence. | Bang, MIDI note event, UI click. |
| `signal` | Time-varying sampled data. | Control LFO, audio-rate signal. |
| `stream` | Ordered media/block sequence. | Decoded video frames, audio buffers. |
| `resource` | Handle to external/runtime-owned data. | Asset, GPU texture, file, device. |

`signal` is not just a fast event stream. `stream` is not just an array of
values. `resource` is not a value copied through the graph.

## Rate And Clock

| Rate | Clock | Notes |
| --- | --- | --- |
| `event` | external/event loop | Unscheduled incoming message or UI event. |
| `control` | control tick / runtime state update | Low-rate interactive state and message dispatch. |
| `audio` | audio block or sample | Real-time safe audio callback domain. |
| `render` | render frame | Visual frame production. |
| `gpu` | GPU queue/pass | Device-owned work and resources. |
| `resource` | lifetime/event driven | Asset and runtime resource handles. |
| `io` | external | File, network, device, and host boundaries. |

Clock crossing must be explicit when it changes delivery semantics.

## Review Questions

Every new feature should answer:

- Is the payload retained, event-like, sampled, streamed, or resource-owned?
- Which rate and clock own the work?
- Is the clock a runtime substrate clock, a graph-visible musical clock, or an
  external source projection?
- Can data be copied safely, or should it be shared by handle?
- What happens under pressure: drop, queue, block, retain latest, or reject?
- Is conversion semantic, representational, or a domain crossing?
- Does the graph document need to persist it, or is it runtime/session state?

## Related Model Documents

- [Control And Message](control-and-message.md)
- [Semantic Values](semantic-values.md)
- [Audio Signal](audio-signal.md)
- [Clock And Transport](clock-and-transport.md)
- [Video Stream](video-stream.md)
- [Render And GPU](render-and-gpu.md)
- [Domain Crossing](domain-crossing.md)
- [Object Layer](object-layer.md)
- [Expression Layer](expression-layer.md)
