---
status: draft
---

# Video Stream

Video is media stream data with timing and pressure policy. It is not a retained
control value.

## Delivery Model

| Property | Rule |
| --- | --- |
| flow | `stream` for decoded frames, `resource` for assets. |
| rate | video/render/media dependent. |
| clock | video frame time, render frame, or external clock. |
| pressure | drop, queue, retain latest, or backpressure by explicit policy. |
| ownership | asset store, decoder, or runtime media pipeline. |

## Asset Boundary

`asset.video` is a resource. It must be decoded before frame data is available.

```text
asset.video -> video decode -> stream<video.frame>
```

## GPU Boundary

Decoded frames are not GPU textures. Upload is explicit.

```text
stream<video.frame> -> gpu upload -> resource<gpu.texture2d>
```

## Timing

Video nodes must declare whether they follow source timestamps, render frame
clock, external sync, or a timeline. Dropping or repeating frames should be a
runtime policy, not an accidental side effect.
