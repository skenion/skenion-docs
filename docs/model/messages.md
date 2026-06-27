---
status: active
sidebar_position: 17
---

# Messages

A message is a typed value with a key and zero or more arguments. It is not a
selector namespace, not an object kind, and not a separate delivery system.

Current message values should use the value type `value.core.message`. The
message payload carries the key and arguments.

## Shape

The exact serialized shape belongs in Contracts. The model rule is that a
message occurrence carries one `value.core.message` value, and that message
value contains its key and arguments. The key is not a type family such as
`selector.*`.

## Key Policy

An endpoint that accepts messages may restrict accepted keys. Key policy is
part of the endpoint/object contract and must be validated by Runtime. Studio
may display the accepted key policy, but Studio must not become the semantic
authority for whether a message is accepted.

Message keys must not be modeled as `symbol`, `selector.*`, object kinds, or
separate value type families.

## Bang

Bang is `value.core.bang`. It is not modeled as `value.core.message` with key
`bang`.

An object may emit `value.core.bang` as a result of receiving a message, and an
object may use a `value.core.bang` occurrence to emit a stored message. In both
cases, bang remains its own value type. The message value type remains for
keyed payloads such as `set 2.5`.

This does not mean only bang can trigger. If an object should react when a
string, number, identifier string, or structured message arrives, its endpoint
contract declares that accepted payload occurrence as reactive. Bang is the
explicit no-payload trigger value.
