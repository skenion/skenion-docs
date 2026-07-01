---
status: active
sidebar_position: 5
---

# Audio Nodes

Audio nodes are object nodes whose endpoints use audio-rate policy. Audio rate
is endpoint behavior, not a separate value type family. Scalar audio samples
are still typed values such as `value.core.float32`.

## Runtime-Backed Now

| Implementation object id | Common object spec | Notes |
| --- | --- | --- |
| `audio.sig` | `sig~` | Converts a control number into an audio-rate signal. |
| `audio.osc` | `osc~` | Oscillator with a Runtime-parsed frequency argument. |
| `audio.operator.mul` | `*~` | Audio multiply in the current Runtime substrate. |
| `audio.input` | `adc~` | Runtime audio input endpoint. |
| `audio.output` | `dac~` | Runtime audio output endpoint. |

## Reference Or Pending Registry Alignment

Some audio ids may exist in Studio reference/help material but are not currently
accepted by the live Runtime object spec resolver. Examples include additional
audio operators, oscillators, resampling, clock bridging, and analysis helpers.
Until Runtime publishes them through its registry, Studio must display them only
as reference/help content or issue states, not as accepted live objects.

## Timing And Value Identity

Do not encode audio cadence in the value type name. A signal stream of
`value.core.float32` occurrences under audio-rate endpoint policy is still a
sequence of `value.core.float32` values. Sample rate, channel layout, and buffer
shape belong to endpoint policy or Runtime value binding metadata.

