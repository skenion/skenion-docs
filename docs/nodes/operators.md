---
status: active
sidebar_position: 4
---

# Operators

Operator nodes are object nodes that compute from input occurrences and emit a
result. Runtime owns their object spec parsing, argument defaults, endpoint
interfaces, and issues.

## Runtime-Backed Now

| Implementation object id | Common object spec | Notes |
| --- | --- | --- |
| `operator.add` | `+`, `add` | Binary control add. |
| `operator.sub` | `-`, `sub` | Binary control subtract. |
| `operator.mul` | `*`, `mul` | Binary control multiply. |
| `operator.div` | `/`, `div` | Binary control divide. |
| `operator.pow` | `pow` | Binary power. |
| `operator.min` | `min` | Minimum. |
| `operator.max` | `max` | Maximum. |
| `operator.sqrt` | `sqrt` | Unary square root. |

Creation arguments such as `* 3` are parsed by Runtime and become accepted
node parameters only if Runtime validates them. Studio should not pre-materialize
the operator from local object spec parsing.

## Value Types

The current Runtime resolver exposes these control operators through
`value.core.float32` ports. Future operator definitions may support more value
types or explicit coercion policies, but those policies must come from Runtime
or a provider registry, not from Studio guesses.

