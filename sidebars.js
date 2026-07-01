const manualSidebar = [
  "index",
  "manual-versions",
  "release-train-install",
  {
    type: "category",
    label: "Nodes",
    collapsed: false,
    items: [
      "nodes/index",
      "nodes/object-authoring",
      "nodes/control-and-message",
      "nodes/operators",
      "nodes/audio",
      "nodes/patch-boundaries",
      "nodes/render-media",
      "nodes/annotations-and-diagnostics"
    ]
  },
  {
    type: "category",
    label: "Core Model",
    collapsed: false,
    items: [
      "model/object-value-occurrence-model",
      "model/data-types",
      "model/value-occurrences",
      "model/interface-endpoints",
      "model/connections",
      "model/objects",
      "model/object-identity-and-specs",
      "model/runtime-node-commands",
      "model/runtime-realtime-protocol",
      "model/runtime-concurrency",
      "model/messages"
    ]
  }
];

module.exports = {
  manualSidebar
};
