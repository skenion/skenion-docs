---
status: active
sidebar_position: 7
---

# Render And Media Nodes

Render and media nodes deal with images, frames, GPU resources, preview output,
and media conversion. These are object behaviors and endpoint policies. They
are not separate value type families.

## Reference Or Pending Registry Alignment

Studio reference/help material currently includes render and media ids such as
fullscreen shader, render output, clear color, GPU upload, preview, video asset,
and video decode. These entries document intended UI and help behavior, but the
live Runtime object spec resolver must publish and accept an object before
Studio treats it as a live Runtime-backed object.

Until that alignment is complete, Studio should surface Runtime diagnostics for
unresolved render or media object spec instead of using local reference data as
execution authority.

## Value Types

An image, video frame, render frame, or GPU texture is not a first-party value
type name. Public value identity should use core structured values plus
Runtime value format metadata:

| Situation | Value identity |
| --- | --- |
| One raster image or one decoded video frame | `value.core.tensor` with shape, numeric format, color space, and alpha metadata. |
| A numeric image analysis matrix | `value.core.matrix` with numeric format, shape, and layout metadata. |
| A GPU upload or preview target | Object behavior and binding metadata over accepted value types. |

Cadence is not encoded in the type id. Sixty video frames per second is sixty
occurrences of the accepted value type under endpoint policy. A single frame
triggered by a bang or bool occurrence is still one occurrence of that same
value type.

