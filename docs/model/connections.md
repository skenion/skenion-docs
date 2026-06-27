---
status: active
sidebar_position: 15
---

# Connections

A connection routes value occurrences from one output endpoint to one input
endpoint. It does not make the source value into an object, and it does not
create a new data type.

## Acceptance Checklist

Runtime accepts a connection only when the current graph and object/provider
registry satisfy these checks:

1. The source object exists.
2. The source output endpoint exists.
3. The target object exists.
4. The target input endpoint exists.
5. The output value policy is compatible with the input accepted value policy.
6. Fan-in, fan-out, and duplicate connection rules allow the edge.

If any check fails, Runtime rejects the operation with a structured diagnostic.
Studio displays the rejection and leaves the graph in the accepted Runtime
state.

## Execution-Time Protection

An accepted connection does not remove the need for Runtime delivery guards.
External packages, SDK-authored objects, stale graphs, and collaborative races
can still produce malformed value occurrences after an edge was accepted.

When that happens, Runtime must reject delivery at the target input, record a
structured diagnostic, and drop the malformed occurrence. The object
implementation must not receive a value that violates its endpoint policy, and
Studio must not invent a fallback interpretation.

## Paste And Load

Paste and project load use the same acceptance model. If a pasted fragment or
loaded project references an object that cannot be resolved, Studio should keep
the object visibly unresolved and Runtime should report that object as invalid.
If endpoints changed since the graph was authored, edges connected to missing
endpoints are invalid and should be removed or reported according to the
operation policy.

The important rule is that one invalid object or edge must not make the entire
editing surface disappear. Runtime can reject execution or connection
operations while Studio still shows the patch and the diagnostics needed to fix
it.

## Interface Changes

When an object's interface changes, existing edges must pass through the same
connection checks again. Edges to deleted endpoints cannot remain connected.
Edges whose value policies are no longer compatible cannot silently survive.

For a subpatch edited through `p <name>`, this means parent edges connected to a
deleted inlet or outlet are removed or marked invalid by the same Runtime
operation that updates the subpatch interface. For a package or external object,
the project cannot edit the provider directly; Studio should show the object as
changed, unresolved, or incompatible until the user chooses a repair.
