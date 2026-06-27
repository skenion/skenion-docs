---
status: active
sidebar_position: 14
---

# Interface Endpoints

An interface endpoint is an inlet or outlet on an object. Endpoints are the
boundary between executable object behavior and graph connections.

Endpoints accept or emit value occurrences. They do not accept "events",
"frames", "streams", or "controls" as separate top-level data categories.
Those words may describe object behavior, scheduling, buffering, or UI, but
they must not replace value type compatibility.

## Endpoint Contract

An endpoint contract should describe:

- endpoint id
- direction
- label and description
- accepted or emitted value type policy
- whether a value is required for object operation
- fan-in or fan-out policy when relevant
- reaction policy for bang, message, numeric, string, media, or other accepted value
  occurrences

The endpoint contract should not encode first-party object inventory. It also
should not force Studio-only validation fields that Runtime does not own.

## Accepted Value Policy

Accepted value policy is separate from data type identity. First-party endpoint
contracts may use these policy forms:

- Exact: accepts only `value.core.float64`.
- Numeric: accepts `value.core.bool`, `value.core.int64`, and
  `value.core.float64` with declared coercion.
- Trigger: accepts `value.core.bang` as a trigger and does not treat it as
  stored data.
- Reactive payload: accepts `value.core.string` and reacts immediately using
  that string payload.
- Message: accepts `value.core.message` with declared key policy.
- Identifier: accepts `value.core.string` and lets the object or its Runtime
  utility interpret that string.

An endpoint may support several policies, but the policies must be explicit in
the object/provider definition that Runtime uses.

The accepted policy must be expressed in terms of value types and endpoint
reaction behavior. It must not introduce `event.*`, `frame.*`, `stream.*`,
`control.*`, `selector.*`, or `symbol` as substitute type families.

## Runtime Delivery Guard

Runtime validates connection operations before accepting an edge. Runtime also
guards each delivered occurrence before invoking the target object. If the
occurrence does not satisfy the endpoint's accepted value policy, Runtime must
drop that occurrence and record a structured diagnostic. Studio must not
reinterpret that failed delivery as a different type rule.

## Runtime Authority

Runtime is the final authority for endpoint compatibility. Studio may prevent
obvious invalid operations for a better editing experience, but Studio must
submit connection and mutation intent to Runtime and honor Runtime diagnostics.

This is required for collaboration. Multiple Studio clients can edit the same
Runtime-owned graph. A local UI cache cannot be the source of truth for whether
an endpoint exists or whether a connection is accepted.
