---
status: draft
sidebar_position: 16
---

# Live Help

Live help is a real graph 0.1 surface backed by a patch definition. Opening
help for an object or Manual topic should feel like opening a small, focused
patch from the Manual, not like reading a static diagram or entering a separate
demo model. See [Graph 0.1 Current Contract](./graph-01-current.md) for the
active document and target model.

Help patches use `PatchDefinitionV01`, the same primitive as project and package
patches. A help patch can be displayed read-only to protect first-party or
package source, but the graph itself remains a normal patch graph.

## Help Payload

A live-help payload identifies:

- The object, subpatch, package item, or Manual topic being documented.
- The Manual version and route used to resolve prose.
- The `patchId` of the help `PatchDefinitionV01`.
- The graph or project fixture used for validation and smoke tests.
- Expected diagnostics, when the help intentionally demonstrates an error.

The help graph should be small, deterministic, and safe to preview. It may use
comments and panels for explanation, but the behavior should be visible in the
graph itself. Port and object help text comes from each port or node
`description`; there is no special tooltip-only help schema.

## Opening Help

Opening help creates a graph editor or graph view over a help patch. When the
source patch belongs to skenion or a package, Studio should protect the source by
opening a volatile `help-working-copy`. The working copy may be editable for
experimentation, but closing it does not mutate the source package or Manual
fixture.

A read-only help view still supports multi-node selection and copy. Help source
protection must not block copying useful fragments into a user's graph.

## Copy, Paste, And Promote

Copying from help produces the same `GraphFragmentV01` clipboard payload as
copying from any other graph editor. Pasting that fragment into a project graph
remaps ids, preserves selected internal edges where valid, and leaves the source
help patch unchanged.

Promoting help to a project is different from pasting a fragment. Promotion
copies the help `PatchDefinitionV01` into the user's project `patchLibrary`
under a project-owned id and revision. After promotion, the user edits that
project patch definition and can instantiate it through normal `core.subpatch`
or `p <patch-id>` behavior.

## Version Resolution

Studio and Runtime should normalize product patch versions before resolving
Manual help. For example, product version `0.33.5` normalizes to Manual version
`0.33` and resolves through `/manual/0.33/`. Patch releases can update fixtures
and notes without creating separate patch-specific Manual pages.

## Runtime Boundary

Live help does not create a privileged runtime mode. A help patch is loaded,
validated, previewed, and stopped through the same project/session lifecycle as
other examples. Any native IO used by a help patch is modeled through explicit
node/object behavior and binding configuration.

Live help can target the root graph, a project patch definition, a package patch
definition, an embedded patch instance, or a `help-working-copy`, but those are
graph targets around the same Runtime API. The help model does not depend on
whether Studio is connected to a Tauri-managed local runtime, a shared local
runtime, or a remote runtime.
