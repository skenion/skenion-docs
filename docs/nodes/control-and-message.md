---
status: active
sidebar_position: 3
---

# Control And Message Nodes

Control and message nodes are object nodes that store, trigger, or emit core
values. They are executable objects, not data types.

## Runtime-Backed Now

| Implementation object id | Common object spec | Emitted or accepted value |
| --- | --- | --- |
| `bang` | `bang`, `b` | Emits `value.core.bang`. |
| `float` | `float`, `f`, `number` | Stores and emits `value.core.float32` in the current Runtime resolver. |
| `int` | `int`, `i` | Stores and emits `value.core.int32`. |
| `uint` | `uint`, `u` | Stores and emits `value.core.uint32`. |
| `message` | `message`, `msg` | Stores and emits `value.core.message`. |

`value.core.bool` and `value.core.string` are valid value types. They are not
default first-party object ids. An object may consume or emit bool or string
values when its interface says so, but that does not create `object.core.bool`
or `object.core.string`.

## Stored Value Versus Transient Input

Changing a stored value is a persisted node update and uses `node.update`.
Clicking a bang, triggering a message, or dragging a live control is transient
Runtime input and uses `node.input`.

An endpoint can react to any accepted value occurrence when its endpoint policy
says that occurrence is reactive. Bang is the no-payload value for "trigger now";
it is not the only possible trigger mechanism.

