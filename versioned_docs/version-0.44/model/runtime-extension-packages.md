---
status: draft
---

# Runtime Extension Packages

skenion loads extension contract surfaces from package directories. A package
directory owns a `skenion.extension.json` manifest at its root. First-party core
packages and third-party packages use the same manifest shape; the difference is
publisher and trust policy, not a separate interface.

## Package Boundary

The manifest declares the static contract surface:

- node definitions exposed to graphs and Studio palettes
- codec descriptors for transport-neutral decoder and encoder flows
- transport descriptors
- help entries
- package-local tests and fixtures
- optional native artifact metadata

Paths in the manifest are relative to the package root. Runtime rejects paths
that escape the package directory.

## Native Rust Extensions

Rust extensions are built outside the running Runtime, usually through SDK or
authoring tooling. Runtime does not compile arbitrary Rust source while serving.
Instead, a native package declares a prebuilt artifact and the C ABI entrypoint:

```json
{
  "schema": "skenion.extension.manifest",
  "schemaVersion": "0.1.0",
  "id": "example/native-sensor",
  "version": "0.1.0",
  "runtimeAbiVersion": "0.1.0",
  "kind": "native-runtime",
  "native": {
    "entrypoint": "skenion_extension_init",
    "artifacts": [
      {
        "os": "macos",
        "arch": "aarch64",
        "abi": "c",
        "path": "target/release/libexample_native_sensor.dylib"
      }
    ]
  },
  "provides": {},
  "permissions": []
}
```

This keeps runtime startup deterministic and lets the same extension package be
authored in Rust, C/C++, Zig, or any toolchain that can emit a compatible C ABI.
