---
status: draft
---

# Domain Crossing

Domain crossing changes delivery semantics. Skenion requires explicit nodes for
these crossings.

## Examples

| From | To | Explicit node kind |
| --- | --- | --- |
| audio signal/buffer | control value/event | analyzer: RMS, peak, onset, pitch. |
| control value | audio signal | smoothing, sample-and-hold, control-to-signal. |
| asset.video | stream video frame | video decoder. |
| video frame | GPU texture | GPU upload. |
| GPU texture | control value | readback or analysis node. |
| render frame | preview/output | explicit output selector. |

## Rule

Implicit conversion is allowed only for compatible semantic values and
representations. Crossing clocks, rates, ownership domains, or resource
lifetimes needs an explicit node.

The editor may offer to insert a crossing node, but the saved graph must contain
that node.
