---
status: draft
sidebar_position: 4
---

# Live Help

Live help is a Manual-backed graph or project fixture that demonstrates an
object, subpatch, or graph concept with the same validation path as ordinary
examples.

Each live-help payload should identify the documented object or Manual topic,
the Manual version used for lookup, the fixture path, and any expected
diagnostics. Product version `0.33.5` normalizes to Manual version `0.33`, then
resolves through `/manual/0.33/`.

Live help is not a special runtime mode. Help patches should load, validate,
preview, and stop through the normal Runtime project/session lifecycle.
