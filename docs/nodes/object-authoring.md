---
status: active
sidebar_position: 2
---

# Object Authoring

An object is the editable authoring unit for an object node. The user types an
`objectSpec` such as `osc~ 440`, `+`, `float 0.5`, `message set gain`, or
`p my-patcher`. Runtime resolves that spec in the current session and graph
context.

Runtime may preserve the typed `objectSpec` for editing, diagnostics, and
display. The spec is not proof that the object exists. Successful execution
identity comes from the accepted `implementation` and `objectResolution`.

## Runtime Resolution

Studio sends object authoring edits as Runtime node commands:

- `node.resolve` previews object spec without mutation.
- `node.create` creates a persisted node from object spec.
- `node.replace` keeps an existing node id while replacing the resolved object
  or interface.
- `node.delete` removes a node and Runtime-owned incident edge state.
- `node.update` changes persisted node parameters.
- `node.input` sends transient input to an existing node endpoint.

Runtime returns the accepted node/interface or a diagnostic result. Studio
renders that result. Studio may offer search, completion, and repair UI, but it
does not choose a successful provider when Runtime reports unresolved or
ambiguous input.

## Unresolved And Ambiguous Specs

If no active provider matches the object spec, Runtime returns an unresolved
`objectResolution` state with diagnostics. If more than one provider matches the
same primary spec or alias, Runtime returns an ambiguous resolution with
candidates. Studio should keep the user's input editable and draw the object
with an error treatment instead of deleting it or choosing a provider by
ordering.

## Object Nodes Are Only One Node Family

Object nodes are common, but they are not the whole graph model. Patch boundary
nodes, annotation nodes, diagnostic placeholders, and future package-provided
nodes still use the same Runtime-owned node operation path.
