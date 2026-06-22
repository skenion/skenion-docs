---
status: draft
---

# Clock And Transport Model

Skenion does not force one user-facing global master transport. It still has
runtime substrate clocks for execution domains. These two ideas must stay
separate.

## Clock Classes

| Class | Owner | Purpose |
| --- | --- | --- |
| Host monotonic clock | Runtime process | Wall-clock ordering, timestamps, telemetry, timeout accounting. |
| Audio sample clock | `audio.output` / device backend | Determines when audio blocks are rendered and which sample frame is current. |
| Render frame clock | `render.output` / renderer | Determines visual frame index, delta time, elapsed time, and presentation cadence. |
| Musical clock object | Graph node | Carries tempo, phase, tick, bar, beat, and transport information as patch data. |
| External source clock | Adapter node | Imports Link, MIDI Clock, MTC, host transport, OSC, or another source. |

`clock.*` objects do not replace the audio callback or render loop. They carry
musical timing and synchronization state through the graph.

## No Forced Master Transport

Skenion patches may contain multiple independent clock objects:

- `clock.local`
- `clock.follow`
- `clock.divide`
- `clock.multiply`
- `clock.phase`
- `clock.position-display`

Future external source objects include:

- `clock.link`
- `clock.midi-clock`
- `clock.mtc`
- `clock.host-transport`
- `clock.osc`

A patch may choose one source, several sources, or none. Runtime internals still
use substrate clocks to keep audio, render, and control execution safe.

## Clock State

Clock state is graph data. It should be represented with explicit capability
and authority metadata so missing or derived timing does not look authoritative.

Suggested field wrapper:

```ts
type ClockAuthority =
  | "authoritative"
  | "derived"
  | "estimated"
  | "unavailable";

type ClockField<T> = {
  value: T | null;
  authority: ClockAuthority;
  source: string;
  confidence?: number;
};
```

Suggested v0 fields:

| Field | Meaning |
| --- | --- |
| `sourceId` | Stable source instance identifier. |
| `sourceKind` | Source class such as `local`, `audio-device`, `render-frame`, `link`, `midi-clock`, `mtc`, or `host-transport`. |
| `capabilities` | Which fields the source can provide. |
| `running` | Transport running/stopped state. |
| `tempoBpm` | Musical tempo. |
| `phase01` | Normalized phase in the current cycle. |
| `tickIndex` | Discrete tick count where available. |
| `ppqPosition` | Musical PPQ position where available. |
| `songPositionSixteenth` | MIDI SPP-style sixteenth-note position where available. |
| `bar`, `beat`, `division`, `tickInDivision` | Musical position fields. |
| `timeSignature` | Current meter. |
| `timeSeconds`, `timecode` | Absolute or media time projection. |
| `sampleRate`, `sampleFrame` | Audio sample-clock projection. |
| `latencySeconds` | Known or estimated source latency. |
| `lastUpdateHostTimeNs` | Host monotonic timestamp for the latest update. |

## External Source Authority

External sources do not provide the same timing information.

| Source | Strong fields | Weak or unavailable fields |
| --- | --- | --- |
| Ableton Link | tempo, beat/phase, quantum phase, optional start/stop | absolute DAW arrangement bar, tempo map, meter map, loop boundaries |
| MIDI Clock + SPP | tick, start/stop/continue, song position | exact DAW bar when meter map, bar offset, pickup, or loop state is unknown |
| MTC / SMPTE | timecode, absolute media time | musical bar/beat without tempo and meter maps |
| Host transport plugin | tempo, PPQ, time signature, bar position, sample position, transport when host provides them | any field the host marks invalid or unavailable |

Display objects must show whether a position is authoritative, derived,
estimated, or unavailable.

Examples:

```text
BAR 37 authoritative
BAR 37 derived from MIDI SPP
BAR unavailable
TIME 01:26:47:20.62 from MTC
```

## Audio Sample Clock

`audio.output` owns an audio output stream sample clock:

- one endpoint stream
- one sample-rate domain for the connected output partition
- one block size
- one sample format boundary
- one DSP executor for that stream domain

Connected audio DSP subgraphs inherit this sample clock implicitly:

```text
[audio.osc 440] -> [audio.output]
```

The oscillator does not need a `clock.local` input to run. Its phase advances
from the `audio.output` sample rate:

```text
phase += frequency / sampleRate
```

Musical clock inputs may modulate or synchronize audio nodes, but they do not
drive the device callback itself.

Multiple endpoints require explicit clock-domain planning. The same numeric
sample rate does not prove that an input and output stream share a clock
domain. See [Audio Clock Domains](audio-clock-domains.md).

## Render Frame Clock

`render.output` owns the render frame clock:

- frame index
- delta time
- elapsed time
- presentation timestamp
- target or actual FPS

Musical sync remains explicit:

```text
[clock.local 120] -> phase [render.fullscreen-shader]
[render.output]   -> render frame clock
```

The render frame clock decides when to draw. The musical clock decides what the
visual should synchronize to.

## Sync Policies

Clock-following behavior must be explicit.

| Policy | Meaning |
| --- | --- |
| hard sync | Immediately reset phase or position to the source. |
| soft sync | Drift gradually toward the source. |
| tempo follow | Follow source tempo only. |
| phase follow | Follow phase only. |
| transport follow | Follow start/stop only. |
| freewheel on source loss | Continue with the last known tempo/phase estimate. |
| stop on source loss | Stop when the source becomes unavailable. |

Clock sync policies belong in graph-visible nodes such as `clock.follow` or
`clock.sync`, not hidden runtime global state.

## Representation Versus Clock

Do not mix representation fields with clock fields.

| Concept | Category |
| --- | --- |
| `f32`, `i16`, `u16`, `f16` | representation |
| sample format, bit depth | representation |
| sample rate, sample frame | audio clock |
| BPM, beat, bar, phase | musical transport clock |
| frame index, delta time, elapsed time | render frame clock |

Sample-rate conversion is a clock-domain boundary. Bit-depth conversion is a
representation conversion.

## Related Documents

- [Data Delivery Model](data-delivery-model.md)
- [Audio DSP Model](audio-dsp-model.md)
- [Render And GPU](render-and-gpu.md)
- [Domain Crossing](domain-crossing.md)
