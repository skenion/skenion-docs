---
status: active
sidebar_position: 13
---

# Runtime Value Bindings

A Runtime value binding is the live delivery relationship Runtime creates
after it accepts a connection and resolves the source and target endpoints.
It is execution state, not persisted graph state.

Bindings exist so high-throughput values do not need to repeat full media or
array metadata on every occurrence. Runtime announces the binding's current
value format, then later occurrences reference that format with small,
binding-scoped identifiers.

## Binding Identity

Runtime assigns a `bindingId` to a live delivery binding. Runtime also tracks a
monotonic `bindingEpoch` for that binding identity.

The epoch changes when Runtime creates a new live delivery context for the same
logical connection. Examples include reconnect, Runtime-side rebind, endpoint
interface re-resolution, or another session event that makes older delivered
occurrences unsafe to accept.

Do not use graph terms such as `edgeRevision` for this value. An edge is graph
state. A binding is Runtime execution state.

Do not use connection terms such as `connectionRevision` either. Realtime
client connections are a different concept.

## Value Format

`ValueFormat` describes how a value occurrence is represented for one live
binding. It does not define a new data type and it does not decide endpoint
compatibility.

At minimum, a value format can describe:

- value type id, such as `value.core.float32`, `value.core.matrix`, or
  `value.core.tensor`
- concrete numeric or color format, such as `f32`, `rgba8unorm`, or another
  Runtime-supported representation
- shape and dynamic shape policy
- layout, strides, row pitch, plane offsets, and alignment when relevant
- byte-size rules
- audio metadata such as sample rate, channel count, and channel layout
- image, video, or render metadata such as color space, alpha policy, color
  range, transfer, and primaries
- resource metadata when the payload is a Runtime-local resource handle rather
  than inline bytes

For scalar values, the format may be trivial. For arrays, audio blocks, image
frames, video frames, render frames, GPU textures, and other structured values,
the format is the authority for interpreting the payload.

## Format Revision

`formatRevision` is a monotonic positive integer scoped to
`bindingId + bindingEpoch`. It changes when the resolved value format changes
while the live binding remains valid.

Examples:

- audio block shape changes
- sample rate changes
- image or video dimensions change
- tensor element format changes
- GPU resource layout or backend handle policy changes

Each occurrence carries the current `formatRevision`. If Runtime or a receiver
sees an unknown or stale revision, it must fail closed: request or wait for the
format announcement, drop the occurrence, and record a structured diagnostic.
It must not reinterpret old bytes under the new format.

## Format Digest

The format announcement should also carry a `formatDigest`, computed from the
canonical `ValueFormat` content.

`formatRevision` is the hot-path sequencing key. `formatDigest` is for
deduplication, cache reuse, diagnostics, late join validation, and
cross-process equivalence. The digest does not replace the revision, because a
later reconfiguration can intentionally return to a byte-identical format while
still needing new sequencing semantics.

## Occurrence Header

The per-occurrence header should stay small. It should reference already
announced binding metadata rather than repeat the full value format.

Minimum fields:

- `bindingId`
- `bindingEpoch`
- `formatRevision`
- `sequence`
- clock identity and timestamp
- payload kind: empty, inline JSON, bytes, or Runtime-local resource handle
- byte length and offset when bytes are present
- actual shape or frame count when the announced format allows dynamic shape
- continuity flags such as discontinuity, keyframe, dropped-before, or end of
  stream when relevant

`value.core.bang` uses an empty payload kind. It must not carry payload format,
shape, byte length, or resource metadata.

## Audio And Realtime Safety

Audio callbacks must not parse JSON format announcements, hash formats,
allocate, lock graph or session state, perform Studio or HTTP work, perform
file IO, or reconfigure buffers directly.

Format changes that affect an audio callback must prepare immutable runtime
state off the callback path, then switch at a safe block boundary with a new
binding epoch or format revision. Unknown format revisions should produce
silence/drop behavior plus diagnostics rather than invoking object code with
unknown layout.

Audio-rate scalar samples are still `value.core.float32` occurrences. Runtime
may batch them by audio block for transport or scheduling efficiency, but the
value type is not renamed to `audio-sample` or `audio-buffer`.

## Video, Render, And GPU Resources

Image, video, and render frames are structured values, usually
`value.core.tensor` with a binding value format that describes dimensions,
element format, color space, alpha policy, and layout.

If a payload is a GPU or Runtime-local resource handle, the format and binding
metadata must describe the backend, device or context identity, resource kind,
resource format, dimensions, ownership or borrow policy, lifetime, and sync
primitive. Resource handles are session-local and must not be persisted in a
project document.

## Runtime Ownership

Contracts may define reusable value format and occurrence header shapes.
Runtime owns the concrete realtime command and event protocol, session attach
and resume behavior, replay window, delivery policy, object invocation, stale
revision handling, and diagnostics.

Studio displays Runtime state and diagnostics. Studio must not become the
semantic authority for whether an occurrence can be delivered.
