---
status: draft
---

# Audio Clock Domains

Audio graphs can have more than one endpoint and more than one sample-clock
domain. Skenion must not turn the first single-output backend into a permanent
single-device model.

## Core Distinctions

| Concept | Meaning |
| --- | --- |
| Device | OS or driver-visible audio device. |
| Stream | Open input or output callback on a device. |
| Clock domain | The sample-frame time base that advances a stream or group of streams. |
| Sample rate | Numeric frame rate requested or resolved for a stream. |
| Sample format | Representation at an endpoint boundary. |

The same sample-rate number does not prove that two streams share a clock
domain. Two independent USB devices at `48 kHz` still drift unless an aggregate
driver, hardware clock, or explicit bridge provides synchronization.

## Endpoint Ownership

`audio.output` owns an output stream and its sample clock. The connected DSP
subgraph inherits that sample clock implicitly.

`audio.input` owns an input stream and its sample clock. Direct routing from
input to output is valid only when the runtime can prove both endpoints share a
clock domain.

```text
audio.input(domain=A) -> audio.output(domain=A)
  valid direct signal route

audio.input(domain=A) -> audio.output(domain=B)
  invalid unless an explicit bridge/resampler is present
```

## Same Domain

Direct `signal.audio` routing is allowed when endpoints are in the same
hardware or driver clock domain:

- duplex stream from one device where the backend reports a shared clock
- CoreAudio aggregate device with drift correction policy exposed by the driver
- ASIO device exposing synchronized input/output endpoints
- virtual device whose driver owns both input and output sample clocks

The runtime should record why it believes a route is same-domain. The source may
be authoritative, driver-reported, user-configured, or unavailable.

## Independent Domains

Independent domains require explicit graph-visible crossing:

```text
audio.input -> audio.clock-bridge -> audio.output
audio.input -> audio.resample -> audio.output
```

`audio.clock-bridge` represents a buffering and clock-domain handoff policy.
`audio.resample` represents sample-rate and drift compensation. v0 may keep
these as skeleton validation objects, but the graph must show the boundary.

## Planning Model

The runtime should produce an audio partition plan:

- endpoint descriptors
- requested stream configs
- resolved stream configs
- clock domains
- graph partitions assigned to domains
- bridge/resampler requirements between domains

This planning model exists before high-quality bridge implementation. Its job
is to prevent hidden cross-domain routes from being accepted.

## Realtime Boundary

Audio callbacks must not access graph/session/UI/HTTP/file IO state directly.
They should execute precompiled, allocation-free DSP plans for their own stream
domain and consume bounded snapshots prepared outside the callback.

## Deferred

The following are not part of the v0 clock-domain planning slice:

- multi-device ASIO bridge implementation
- Ableton Link / MIDI Clock / MTC implementation
- plugin host transport
- Studio device selector
- high-quality sample-rate conversion
- graph mutation from the audio callback
