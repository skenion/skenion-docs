---
status: draft
---

# Semantic Values

Semantic values describe meaning. Representations describe storage or transport.

## Core Semantic Values

- `number.float`
- `number.int`
- `number.uint`
- `boolean`
- `string`
- `color`

Representation-specific names such as `f32`, `i32`, `u8`, or `rgba8unorm` are
formats, not semantic types.

## Representations

Examples:

- `number.float`: `f64`, `f32`, `f16`, `f8.e4m3`, `f8.e5m2`, `ufloat16`, `ufloat8`
- `number.int`: `i64`, `i32`, `i16`, `i8`
- `number.uint`: `u64`, `u32`, `u16`, `u8`
- `color`: `rgba32f`, `rgba16f`, `rgba8unorm`, `rgb8unorm`

## Implicit Conversion

Numeric and color values may use implicit representation conversion inside the
control/value domain.

- Overflow saturates.
- Float to int/uint clamps, sanitizes NaN/Inf, then truncates toward zero.
- Unsigned targets clamp negative values to zero.
- Narrowing float/color conversions may quantize.
- Conversion warnings belong in inspectors or edge metadata, not as canvas spam.

## What This Does Not Cover

Semantic value conversion is not domain crossing.

- Audio buffer to float needs an analyzer.
- Video frame to GPU texture needs upload/decode nodes.
- GPU texture to color/number needs an explicit readback or analysis node.
