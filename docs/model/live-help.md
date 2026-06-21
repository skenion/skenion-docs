---
status: draft
sidebar_position: 16
---

# Live Help

Live help is an executable Manual example attached to an object or concept. It
should feel like opening a small patch from the Manual, not like reading a static
annotation or running undocumented demo code.

## Help Payload

A live-help payload should identify:

- the object or Manual topic it documents
- the Manual version used to resolve prose and examples
- a graph or project fixture that can be validated with the same contracts as
  ordinary compatibility samples
- expected diagnostics, if the help patch intentionally demonstrates an error

The help graph should be small, deterministic, and safe to preview. It may use
comments and panels for explanation, but the behavior should remain visible in
the graph itself.

## Version Resolution

Studio and Runtime should normalize product patch versions before resolving
Manual help. For example, `0.22.5` normalizes to `0.22` and resolves through
`/manual/0.22/`. Patch releases can update fixtures and notes without creating
separate patch-specific Manual pages.

## Runtime Boundary

Live help does not create a privileged runtime mode. A help patch is loaded,
validated, previewed, and stopped through the same project/session lifecycle as
other examples. Any native IO used by a help patch is modeled through explicit
node/object behavior and binding configuration.

## Fixture Criteria

Examples should include at least one valid v0.2 project payload for a subpatch
or help patch and at least one invalid fixture that proves diagnostics are tied
to explicit contract rules rather than UI-only conventions.
