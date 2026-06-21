# Skenion Manual

Human-readable product Manual and design documents for Skenion.

This repository explains how Skenion data moves through the system before it
becomes node UI, runtime code, or renderer behavior. It is intentionally
separate from machine-readable contracts.

## Source Of Truth

| Surface | Owner |
| --- | --- |
| Human-readable model docs | `skenion-docs` |
| JSON Schema, OpenAPI, builtins, generated TS/Rust packages | `skenion-contracts` |
| Runtime behavior and native execution | `skenion-runtime` |
| Studio UI and interaction implementation | `skenion-studio` |
| Compatibility fixtures and tutorials | `skenion-examples` |

Do not copy schema definitions from `skenion-contracts` into this repository.
Docs here should explain intent, ownership, delivery semantics, and review
criteria. Machine contracts remain in `skenion-contracts`.

## Start Here

- [Skenion Manual](docs/index.md)
- [Manual Versions](docs/manual-versions.md)
- [Data Delivery Model](docs/model/data-delivery-model.md)
- [Control And Message](docs/model/control-and-message.md)
- [Semantic Values](docs/model/semantic-values.md)
- [Audio Signal](docs/model/audio-signal.md)
- [Clock And Transport](docs/model/clock-and-transport.md)
- [Audio Clock Domains](docs/model/audio-clock-domains.md)
- [Video Stream](docs/model/video-stream.md)
- [Render And GPU](docs/model/render-and-gpu.md)
- [Domain Crossing](docs/model/domain-crossing.md)
- [Object Layer](docs/model/object-layer.md)
- [Pd Baseline Matrix](docs/model/pd-baseline-matrix.md)
- [Object Text Parser](docs/model/object-text-parser.md)
- [Control Operators](docs/model/control-operators.md)
- [Audio DSP Model](docs/model/audio-dsp-model.md)
- [Expression Layer](docs/model/expression-layer.md)
- [Subpatches](docs/model/subpatches.md)
- [Live Help](docs/model/live-help.md)
- [Pure Data Notes](docs/references/pure-data-notes.md)

## Manual Site

This repository builds a Docusaurus Manual for GitHub Pages:

- current source publishes as `/manual/`
- frozen minor Manual docs publish as paths such as `/manual/0.33`
- product patch versions normalize to minor Manual versions, so `0.22.5`
  normalizes to `0.22`

Local development:

```bash
pnpm run start
```

Static build:

```bash
pnpm run build
```

## Document Status

Model documents use front matter:

```yaml
---
status: draft
---
```

Status values:

- `draft`: review model before implementation.
- `active`: current design reference.
- `deferred`: intentionally documented as future work.

## Validation

```bash
pnpm run ci
```

The validation script checks document status front matter, local markdown links,
Manual version normalization, and the Docusaurus build.

## License And Credit

This repository is licensed under the Apache License, Version 2.0.

Redistributions must preserve copyright, license, and NOTICE information as
required by Apache-2.0. If Skenion helps your artwork, research, publication,
installation, or tool, please credit Skenion and EchoVisionLab.
