---
status: active
sidebar_position: 2
---

# Manual Versions

The published Manual has stable documentation paths:

- `/manual/` for the current Manual source.
- `/manual/<major>.<minor>/` for frozen product minor Manuals, such as `/manual/0.33/`.

Product patch releases do not mint separate Manual versions. A product version
such as `0.22.5` normalizes to Manual version `0.22` and is served from
`/manual/0.22/`, not from a patch-specific Manual path.

This keeps patch-level release notes and compatibility fixes tied to the same
minor Manual surface.
