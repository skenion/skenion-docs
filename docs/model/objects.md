---
status: active
sidebar_position: 16
---

# Objects

An object is executable behavior with a stable interface, internal state, and
Runtime-owned semantics.

Objects are not data types. A float value is data. A numeric UI box that stores,
updates, and emits a float is an object. A message box is an object. A bang box
is an object. Boolean and string values do not become object kinds merely
because they can be displayed or emitted.

## Object Resolution

Runtime resolves object definitions from first-party registries, project
patches, installed packages, and development packages. Studio may offer object
search, palette UI, and unresolved-object repair, but the live object
definition is Runtime-owned.

When Studio asks to create or connect an object, Runtime must be able to answer:

- whether the object can be resolved
- which endpoints it exposes
- which value policies those endpoints accept or emit
- whether the requested operation is accepted
- which diagnostic explains rejection

## Project Patches And Package Objects

A project patch can define an object-like abstraction that is local to the
project. A package can provide reusable objects or patches. Both must resolve
to an object interface before Runtime accepts connections to them.

If a user types a name that matches several available providers, Studio must not
choose one silently. It should keep the object unresolved or ambiguous and ask
the user to choose. Persisted graph state should be based on the selected
provider identity and the object interface that Runtime accepted, not on a
guess made from display text.

## Object Inventory

The first-party object inventory is not defined by this page. It belongs to the
Runtime object registry and SDK authoring surfaces. Contracts may define the
shared shape used to describe an object's interface, but Contracts should not
own the runtime object list or object execution behavior.

This boundary keeps custom objects and first-party objects on the same runtime
path: both provide definitions, both are validated by Runtime, and both report
diagnostics through the same channels.
