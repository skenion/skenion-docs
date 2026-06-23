---
status: draft
---

# Control And Message

Control messages are event/control-domain payloads. They are not arbitrary
strings and they are not hidden graph edges.

## Message Shape

A control message is a selector plus zero or more typed atoms.

```json
{
  "selector": "set",
  "atoms": [{ "type": "float", "representation": "f32", "value": 0.75 }]
}
```

`bang` is a selector with no atoms:

```json
{
  "selector": "bang",
  "atoms": []
}
```

`bang` is not stored as a value. `set` is not a visual inlet.

## Plain Data

Plain text, symbols, numbers, booleans, and colors may appear as message atoms.
That does not make every message a string value. A message box stores a message
template and emits a message when clicked or banged.

## Dispatch

Objects own selector handling.

- Bang accepts any incoming control message and emits `bang`.
- Value objects treat hot inlet typed values as update-and-emit.
- Value objects treat `bang` as emit-current.
- Value objects treat `set ...` as silent storage update.
- Message boxes emit stored messages on click or `bang`.
- Message boxes update stored text silently on `set ...`.

Dispatch is control-domain work. It must not run in an audio callback or GPU
pass.

## Ownership

Control state belongs to Runtime session state. Studio may display and request
updates, but it does not own canonical runtime control state while connected.

## Pressure And Latency

Control message propagation should be bounded by runtime safety limits. A failed
propagation must not partially mutate session control state.

Control interaction latency should be immediate enough for UI feedback, but it
is still separate from audio sample/block timing and render frame timing.
