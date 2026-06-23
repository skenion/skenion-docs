---
status: draft
---

# Object Text Parser

Pd-style object text is a compact authoring surface. It is not the runtime
implementation. skenion parses object text into explicit node kind, params, and
instance ports before validation and execution.

## Parse Output

An object text parse result should include:

- original input text
- class symbol
- creation arguments
- resolved canonical node kind
- resolved kind version
- params produced from creation arguments
- instance ports produced by class and argument specialization
- display text
- diagnostics

## Object Classes And Creation Arguments

The first atom selects the object class. Remaining atoms are creation
arguments.

Examples:

| Object text | Class symbol | Creation arguments | Result |
| --- | --- | --- | --- |
| `[+ 1]` | `+` | `1` | `core.operator.add` with right operand `1`. |
| `[* 0.5]` | `*` | `0.5` | `core.operator.mul` with right operand `0.5`. |
| `[*~]` | `*~` | none | audio signal multiply with two signal inputs. |
| `[*~ 0.5]` | `*~` | `0.5` | audio signal multiply with scalar right operand. |
| `[osc~ 440]` | `osc~` | `440` | audio oscillator with frequency `440`. |

Creation arguments may specialize ports. This is required for tilde arithmetic:
`[*~]` has two signal inputs, while `[*~ 0.5]` has one signal input and one
latched control/scalar operand.

## Message Boxes

Message box text is parsed separately from object box text. A message box stores
a selector plus atoms and evaluates on click or `bang`. A leading `set` selector
updates stored text silently.

Message-box dollar expansion such as `$1` is runtime message evaluation. Object
box creation arguments are creation-time data. These two substitution phases
must not be collapsed.

## Unsupported Objects

Unsupported vanilla Pd objects should produce a valid parse result with
`ok: false` diagnostics rather than silently creating an approximate node.
Unsupported skenion extension candidates should be marked as extension
candidates, not vanilla baseline.

