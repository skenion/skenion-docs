---
status: active
sidebar_position: 11
---

# Data Types

A data type identifies what a value is. It does not identify where the value
came from, how often it arrives, which object produced it, or which subsystem
will consume it.

Data types are shared contract vocabulary. Runtime uses them for endpoint
compatibility. Studio displays them and may preflight obvious mistakes, but
the semantic decision for type acceptance belongs to Runtime.

## Type Identifier Shape

Current value type identifiers use this shape:

```text
value.<namespace>.<name>
```

The `value.` prefix makes the role explicit. It prevents object names,
transport names, package names, and resource paths from being confused with
data type names.

Core scalar and structural value types:

| Type id | Meaning |
| --- | --- |
| `value.core.bang` | A zero-payload unit value. Each occurrence means "trigger now". |
| `value.core.bool` | A boolean value. |
| `value.core.uint8` | An unsigned 8-bit integer value. |
| `value.core.uint16` | An unsigned 16-bit integer value. |
| `value.core.uint32` | An unsigned 32-bit integer value. |
| `value.core.uint64` | An unsigned 64-bit integer value. |
| `value.core.int8` | A signed 8-bit integer value. |
| `value.core.int16` | A signed 16-bit integer value. |
| `value.core.int32` | A signed 32-bit integer value. |
| `value.core.int64` | A signed 64-bit integer value. |
| `value.core.float8` | An 8-bit floating point value. Its persisted occurrence must specify the concrete representation, such as `f8.e4m3` or `f8.e5m2`, when representation matters. |
| `value.core.float16` | A 16-bit floating point value. |
| `value.core.float32` | A 32-bit floating point value. |
| `value.core.float64` | A 64-bit floating point value. |
| `value.core.ufloat8` | A non-negative 8-bit floating point value. |
| `value.core.ufloat16` | A non-negative 16-bit floating point value. |
| `value.core.ufloat32` | A non-negative 32-bit floating point value. |
| `value.core.ufloat64` | A non-negative 64-bit floating point value. |
| `value.core.string` | A text value. |
| `value.core.message` | A structured message with a key and arguments. |
| `value.core.color` | A color value with explicit representation and color-space metadata. |
| `value.core.vector` | A one-dimensional dense numeric array with explicit element format and length metadata. |
| `value.core.matrix` | A two-dimensional dense numeric array with explicit element format, shape, and layout metadata. |
| `value.core.tensor` | An N-dimensional dense numeric array with explicit element format, shape, and layout metadata. |

This page is the human-readable source of truth for the first-party inventory.
The machine-readable Contracts package must mirror this list when the
corresponding schema and generated surfaces are implemented.

## Numeric Types

Numeric values are explicit-width. Do not use ambiguous type ids such as
`value.core.float`, `value.core.int`, or `value.core.uint` in persisted
contracts.

| Family | Type ids |
| --- | --- |
| Unsigned integers | `value.core.uint8`, `value.core.uint16`, `value.core.uint32`, `value.core.uint64` |
| Signed integers | `value.core.int8`, `value.core.int16`, `value.core.int32`, `value.core.int64` |
| Floating point | `value.core.float8`, `value.core.float16`, `value.core.float32`, `value.core.float64` |
| Non-negative floating point | `value.core.ufloat8`, `value.core.ufloat16`, `value.core.ufloat32`, `value.core.ufloat64` |

UI text may display a short label such as `float`, `int`, or `uint` when the
endpoint contract makes the width obvious. Persisted graph data, package
manifests, Runtime issues, and SDK definitions must use the explicit type
id.

`ufloat*` types are constrained floating point value types. They use the same
binary width as their `float*` counterpart, but valid values must be finite and
greater than or equal to zero. They are useful for values such as duration,
frequency, gain magnitude, normalized coordinates, sizes, and other domains
that cannot be negative. If an endpoint needs a narrower range such as `0..1`,
that range is endpoint policy on top of an explicit `ufloat*` type; do not
invent a new ambiguous type id for each range.

## Serialization Boundary

The type id is contract metadata. It is serialized as a stable string in graph
documents, package/provider definitions, Runtime API payloads, issues, and
SDK-authored definitions.

The value payload is serialized according to the value type. Numeric, boolean,
string, message, color, and structured array payloads must not be converted to
display text just because their type id is a string. Numeric value types carry
numeric payloads. Only `value.core.string` carries text as its domain value.

Runtime may lower public type ids into compact internal tags, enum variants, or
binary layouts after validation. That lowering is an implementation detail and
must not change the persisted contract vocabulary. High-throughput Runtime
paths may use binary payload transfer, but they must still be negotiated from
the same endpoint value-type contract.

## Default Numeric Widths

When an object spec or UI control needs a default numeric type, use these
defaults unless the object definition says otherwise:

| User-facing shorthand | Persisted type |
| --- | --- |
| `float` | `value.core.float64` |
| `ufloat` | `value.core.ufloat64` |
| `int` | `value.core.int64` |
| `uint` | `value.core.uint64` |

The shorthand is an authoring convenience only. It is not a separate data type.

## Structured Array Types

Structured array value types describe dense numeric value identity, not the
delivery model. Their concrete representation, shape, layout, color space,
sample rate, and resource-handle policy belong to the Runtime value binding's
`ValueFormat`. A tensor can arrive once, arrive repeatedly, be stored, be
sampled, or be rendered according to endpoint policy. Its type does not mean
"image", "video", "audio", "stream", "event", or "render tick".

Use structured array types this way:

| Situation | Value type |
| --- | --- |
| An audio-rate object emits scalar audio values. | `value.core.float32` with audio-rate endpoint policy. |
| A multi-channel audio object emits multiple scalar channels. | Multiple `value.core.float32` channels or a declared channel layout on the endpoint. |
| An audio file reader or analysis object emits a finite block. | `value.core.matrix` with `shape: [frames, channels]`, `sampleRate`, and numeric `format`. |
| An object emits or receives one raster image or video frame. | `value.core.tensor` with `shape: [height, width, channels]`, numeric `format`, `colorSpace`, and `alphaPolicy` when relevant. |
| A vision, shader, or analysis object receives a numeric 2D matrix. | `value.core.matrix` with numeric `format`, `shape`, and layout policy. |

Do not encode cadence in the type name. If an audio oscillator emits 48,000
samples per second, those are `value.core.float32` occurrences under audio-rate
endpoint policy. If an object emits 60 video frames per second, that is sixty
occurrences of `value.core.tensor`. If it emits one frame because a bool or bang
occurrence triggered a capture, that is still one occurrence of
`value.core.tensor`.

Do not encode media storage format in the value type id. Shape and
representation belong in `ValueFormat` metadata announced by Runtime for the
live binding. Runtime may store a tensor as a flat vector internally, but the
public contract must preserve shape and format metadata so endpoints can
validate compatibility.

First-party structured array metadata must be explicit:

| Value type | Required metadata |
| --- | --- |
| `value.core.vector` | numeric `format`, `shape: [length]`, and layout policy. |
| `value.core.matrix` | numeric `format`, `shape: [rows, columns]` or endpoint-declared axis names, and layout policy. Audio blocks use this shape with `sampleRate` and `channels`. |
| `value.core.tensor` | numeric `format`, N-dimensional `shape`, and layout policy. Images and video frames use this shape with `colorSpace` and `alphaPolicy` when relevant. |

`audio-sample`, `audio-frame`, `audio-buffer`, `image`, `video-frame`, and
`render-frame` are not first-party value type names. They are object behavior,
endpoint policy, occurrence context, or structured-array metadata over core
value types.

Color payloads must declare representation and color-space metadata. A color
value is not a media frame, image, shader texture, or UI theme token.

## Validity

A value type id is valid only when one of these is true:

- It is listed in the core inventory above.
- It is listed in the first-party media inventory above.
- It is provided by a loaded first-party or package provider that Runtime can
  resolve for the current project.

Any unrecognized `value.core.*` or `value.media.*` id is invalid. The `core`
namespace is closed unless this Manual and the matching Contracts surface add
the type explicitly. The `media` namespace is not a first-party value namespace
in the current contract. Invalid closed-namespace ids include
`value.core.float`, `value.core.uint`, `value.core.number`, `value.core.object`,
`value.core.frame`, `value.core.symbol`, `value.media.asset`,
`value.media.stream`, `value.media.video-stream`, `value.media.audio-stream`,
`value.media.audio-sample`, `value.media.audio-frame`,
`value.media.audio-buffer`, `value.media.image`, `value.media.matrix`,
`value.media.render-frame`, and `value.media.video-frame`.

Custom value types must not use the `value.core.*` or `value.media.*`
namespaces. They must use a provider-owned namespace and be declared by the
package or provider that owns the type. Runtime must reject documents,
packages, object definitions, or connection operations that reference unknown
value type ids, and Studio must show the Runtime issue instead of guessing
a fallback type.

## Bang

`value.core.bang` is a first-class value type. It has no payload. Its meaning
comes from occurrence: when one `value.core.bang` occurrence reaches an endpoint,
that endpoint may react according to its declared policy.

Bang is not modeled as an event namespace, a message key, or a UI-only click. A
bang box is an object that emits `value.core.bang`. Other objects may also emit
or consume `value.core.bang` when their endpoint contract declares that
behavior.

Bang is not the only way to trigger behavior. Any value occurrence can be
reactive when the endpoint declares that accepted occurrences of that value type
cause a reaction. `value.core.bang` exists for the no-payload case: trigger this
endpoint now without also carrying a new domain value.

## Invalid Type Families

Do not use subsystem or delivery names as value type families.

Invalid shapes:

| Invalid shape | Why it is wrong |
| --- | --- |
| `control.bool` | `control` is not the data identity. The value is `value.core.bool`. |
| `control.string` | Strings are values, not control objects. |
| `control.color` | Color is `value.core.color`; control is not a type family. |
| `event.bang` | Bang is `value.core.bang`; event is not a value type family. |
| `video.frame` | Video is not the value identity. Use `value.core.tensor` with shape/format metadata. |
| `render.frame` | Rendering is an object behavior, not a data type family. |
| `stream.video.frame` | Stream frequency and media payload are separate concerns. |
| `payload.*` | Payload is a role, not a type namespace. |
| `data.*` | Data is the whole category, not a useful type namespace. |
| `selector.*` | Message keys are payload fields, not value type families. |

If a future structured value is needed, it must still describe the value itself.
Endpoint policy describes how that value is accepted, transformed, buffered, or
rendered.

## Resources

`value.media.asset` is not a valid type. An asset location is
`value.core.string`.

Do not use generic `asset`, `resource`, `ref`, or `handle` type ids as a
stand-in for behavior. Interpreting that string is the responsibility of the
object or a Runtime utility used by that object. Loading, caching, decoding, or
rejecting it is behavior, not data type identity.

## Compatibility

Compatibility is endpoint policy over value types. A numeric input may accept
`value.core.bool`, integer widths, and floating point widths only when the
object definition declares that coercion. Another input may accept
`value.core.float64` exactly. Another may accept `value.core.bang` only as a
trigger without updating stored numeric state.

The value type does not encode that policy. The endpoint does.

## Object Boundary

Value type ids and object ids are different namespaces.

Examples:

| Value type | Related object, when one exists |
| --- | --- |
| `value.core.float64` | `float` |
| `value.core.bang` | `bang` |
| `value.core.message` | `message` |

This relationship is not automatic. `value.core.bool` and `value.core.string`
are valid value types, but there is no default bool or string object just
because those values exist. An object may display, store, emit, or transform
those values, but the object identity must be defined by the Runtime or provider
registry.

See [Object Identity And Specs](object-identity-and-specs.md) for object
implementation identity and `objectSpec` rules.
