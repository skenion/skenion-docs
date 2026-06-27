---
status: active
sidebar_position: 12
---

# Value Occurrences

A value occurrence is one arrival of one typed value at an endpoint.

Occurrences are how values move through a running patch. They are not a
separate type family. A boolean sent once and a boolean sent repeatedly have the
same data type. The difference is the number and timing of occurrences.

Every occurrence is a possible reaction point. An endpoint can react to a
payload-carrying occurrence and use the payload in the same step. A string
occurrence can update text and trigger output. A float occurrence can update a
number and emit a result. Bang is needed only when the occurrence should trigger
without carrying another value.

## Occurrence Rules

- Each occurrence carries one value type.
- Each occurrence carries a payload representation that is valid for that value
  type, except `value.core.bang`, which has no payload.
- Each occurrence may cause zero or more object reactions, depending on the
  receiving endpoint policy.
- Repetition changes runtime scheduling, not value identity.
- A single occurrence can be enough to trigger rendering, state update,
  message dispatch, or no output at all, depending on the object.
- High-throughput occurrences should reference Runtime-announced binding
  metadata instead of repeating full shape, layout, or media metadata.

This means a `value.core.bool` occurrence can be used for one-shot behavior if
the object endpoint declares that reaction. It does not need a separate
`event.bool`, `trigger.bool`, or `render.once` type.

## Bang Occurrences

`value.core.bang` has no payload, so all of its information is in the occurrence
itself. A single `value.core.bang` occurrence means "trigger now without a new
payload". Two bang occurrences mean two trigger opportunities. Repetition is
represented by multiple occurrences, not by changing the value type.

An endpoint that accepts `value.core.bang` decides what bang does. It may emit a
stored value, fire a scheduled action, request a render, reset state, or do
nothing. Those reactions are object behavior, not properties of the bang type.

## State And Triggering

Some objects store the latest value they receive. Some objects immediately emit
a new occurrence when they receive a compatible value. Some inputs update state
without emitting until a trigger occurrence arrives. These are object and
endpoint semantics.

An object may update stored state and emit a new occurrence when it receives a
compatible payload occurrence. Another object may update stored state without
emitting until a later `value.core.bang` occurrence. The data type vocabulary
does not decide that behavior.

## Runtime Guard

Runtime must guard delivery at the receiving endpoint even when an earlier
connection operation was accepted. Provider bugs, external package code, stale
graphs, or collaborative races can still produce an invalid occurrence at
execution time.

If an occurrence does not satisfy the receiving endpoint policy, Runtime must
not deliver that occurrence to the object implementation. Runtime must record a
structured diagnostic and drop the occurrence. A malformed occurrence must not
panic Runtime, poison the session, stop the graph, or become a Studio-owned
semantic rule.

## Runtime Binding Metadata

During execution, Runtime may deliver occurrences with a compact header that
references a live value binding. That header identifies the binding, binding
epoch, value format revision, sequence, clock, timestamp, and payload kind.

The full shape and representation metadata for arrays, audio blocks, image
frames, video frames, render frames, or GPU resources lives in the binding's
announced `ValueFormat`. Occurrences reference that metadata through
`formatRevision`; they do not repeat the full format each time.

See [Runtime Value Bindings](runtime-value-bindings.md) for the binding-scoped
format and revision model.

## Diagnostics

If Runtime rejects an operation involving an occurrence, it should report the
object id, endpoint id, offered value type, accepted value policy, and a stable
diagnostic code. Studio should display that diagnostic without converting the
failure into a different semantic rule.
