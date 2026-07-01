---
status: active
sidebar_position: 17
---

# Object Identity And Specs

Object identity and `objectSpec` are separate surfaces.

Studio lets a user type short specs such as `float`, `bang`, `message`, `osc~`,
`+ 1`, or a package-provided object name. That `objectSpec` is resolver input.
Runtime executes the object selected by `implementation`, records its
`objectResolution` state, and keeps provider identity separate from the text the
user typed.

## Internal Identity Shape

Executable object implementations use a structured reference:

```json
{
  "provider": { "kind": "core" },
  "objectId": "audio.osc",
  "version": "0.1.0",
  "interfaceDigest": "sha256:..."
}
```

`provider` says where the implementation came from. `objectId` is the
provider's stable object id. `version` and `interfaceDigest` are evidence that
lets Runtime detect stale or incompatible bindings.

Value types still use surface-prefixed ids:

```text
value.core.float32
value.core.bang
value.core.message
```

Do not expose provider namespaces as the default user syntax. Users type
`objectSpec`; Runtime stores the resolved implementation.

## Core Object Ids

Core object ids are stable provider-local resource ids for first-party Runtime
objects. Examples:

```text
float
uint
bang
message
operator.add
audio.output
```

Older `object.core.*` strings may still appear in historical examples or
migration notes, but current graph identity stores `implementation.provider` and
`implementation.objectId`.

## Grammar

Provider-local value and object ids use lowercase ASCII dotted segments.

Allowed:

- lowercase letters
- digits
- hyphen inside a segment
- one or more `.` separators between non-empty segments

Disallowed:

- uppercase letters
- whitespace
- underscores
- slashes
- colons
- `@`
- URL fragments
- versions
- empty segments
- leading or trailing hyphen in a segment
- Unicode or visually confusable characters

Versions, package names, URLs, filesystem paths, and registry locations must not
be embedded into core object ids. They belong in provider metadata, lock
entries, or version/digest fields.

## Object Specs And Aliases

Package and catalog entries expose the user-facing resolver inputs directly:

```json
{
  "objectId": "audio.osc",
  "primaryObjectSpec": "osc~ 440",
  "title": "Oscillator",
  "aliases": ["osc~", "osc", "oscillator"]
}
```

Rules:

- Every object that is creatable from typed input must declare
  `primaryObjectSpec`.
- `aliases` are additional resolver inputs, not alternate implementation ids.
- The last `objectId` segment is not automatically an alias.
- `primaryObjectSpec` is the default spec Studio inserts from a catalog or
  palette.
- `title` is UI text only. It is not resolver input unless it is also listed in
  `primaryObjectSpec` or `aliases`.
- An alias may collide with another provider's alias. Runtime must not resolve a
  collision by arbitrary ordering.

Object spec examples:

| Implementation object id | Primary object spec | Aliases |
| --- | --- | --- |
| `float` | `float` | `f` |
| `bang` | `bang` | `b` |
| `message` | `message` | `msg` |
| `operator.add` | `+` | `add` |
| `audio.osc` | `osc~` | `osc`, `oscillator` |
| `subpatch` | `p` | `patcher`, `subpatch` |

## Resolution

Runtime is the authority for object resolution. Studio can provide search,
completion, palette UI, and repair UI, but it must not invent a successful
resolution that Runtime has not accepted.

The live object registry belongs to Runtime and providers. A typed `objectSpec`
such as `+~`, `osc~ 440`, `float`, `bang`, `message`, or a package object name
is a Runtime resolution request. Studio may preserve the typed text, show
editing hints, and render catalog data that Runtime has already returned, but
Runtime decides whether the object exists, which node operation is accepted,
which provider was selected, which endpoint interface is materialized, and
which applied result Studio should render.

Resolution rules:

1. An `objectSpec` resolves only when exactly one active provider exposes that
   primary spec or alias for the requested context.
2. A provider-qualified implementation may resolve directly when Runtime can
   verify the provider, object id, version, and interface evidence.
3. If multiple active providers expose the same spec or alias, the object
   remains ambiguous until the user chooses one.
4. If no active provider exposes the spec or alias, the object remains
   unresolved.
5. Runtime returns structured `objectResolution` diagnostics for unresolved or
   ambiguous resolution.

Studio may preserve the user's original text as `objectSpec` for editing:

```json
{
  "objectSpec": "osc~ 440",
  "implementation": {
    "provider": { "kind": "core" },
    "objectId": "audio.osc",
    "version": "0.1.0"
  },
  "objectResolution": {
    "id": "res_01",
    "objectSpec": "osc~ 440",
    "status": "resolved"
  }
}
```

`objectSpec` is not authority. It is the typed source text plus arguments.
Runtime execution uses `implementation` and `objectResolution`.

Typical Studio flow:

1. The user types `+~` into an object.
2. Studio sends the typed `objectSpec` and target graph/patch context to
   Runtime, indicating whether the user is checking the spec, creating a new
   object, or updating an existing one.
3. Runtime resolves the spec against first-party objects, project patches,
   installed packages, and development packages.
4. If resolution succeeds, Runtime creates or updates the object instance in
   the session and returns the accepted external interface: implementation,
   object spec, inlet/outlet ids, labels, accepted/emitted value policies,
   defaults, descriptions, and diagnostics.
5. If resolution fails, Runtime returns an unresolved or ambiguous object state
   with diagnostics instead of pretending that the object exists.
6. Studio renders that Runtime result. It does not create a successful `+~`
   object from its own registry.

Studio only needs the interface and display metadata that Runtime accepted. It
does not need the Runtime implementation body, execution closure, native symbol,
or package-internal source.

The conceptual protocol boundary is documented in
[Runtime Node Commands](runtime-node-commands.md). Runtime WebSocket framing is
documented in [Runtime Realtime Protocol](runtime-realtime-protocol.md).
User-facing object spec and alias rules stay on this page.

## Provider Bindings

Core, project, and package objects use structured provider identity because
names can collide.

Project-local object:

```json
{
  "provider": { "kind": "project", "projectId": "project.demo" },
  "objectId": "my-patcher"
}
```

Package object:

```json
{
  "provider": {
    "kind": "package",
    "lockEntryId": "pkg_01h...",
    "packageId": "spectral-tools"
  },
  "objectId": "filter.lowpass"
}
```

`packageId`, `lockEntryId`, and version or digest evidence are stored as
provider metadata. They must not be flattened into a canonical id such as
`object.publisher.package.filter.lowpass`.

This keeps object specs usable while preserving deterministic loads and clear
provider diagnostics:

- users type object specs
- Runtime resolves against active providers
- persisted state records the accepted implementation
- later loads can detect missing, changed, ambiguous, or incompatible providers

## Invalid Patterns

| Pattern | Reason |
| --- | --- |
| `core.object.float` | Encodes provider shape into user-facing text. |
| `object.core.bool` | Bool is a value type, not a core object by default. |
| `object.core.string` | String is a value type, not a core object by default. |
| `value.core.object.float` | Mixes value taxonomy with object identity. |
| `object.publisher.package.name` | Leaks package/provider identity into the object id. Use provider metadata. |

Objects may emit or consume `value.core.bool`, `value.core.string`,
`value.core.bang`, `value.core.message`, and other value types when their
endpoint contracts allow it. That does not make those value types object ids.
