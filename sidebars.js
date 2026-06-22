const manualSidebar = [
  "index",
  "manual-versions",
  {
    type: "category",
    label: "Graph Model",
    collapsed: false,
    items: [
      "model/data-delivery-model",
      "model/control-and-message",
      "model/semantic-values",
      "model/audio-signal",
      "model/clock-and-transport",
      "model/audio-clock-domains",
      "model/video-stream",
      "model/render-and-gpu",
      "model/domain-crossing",
      "model/object-layer",
      "model/object-text-parser",
      "model/control-operators",
      "model/audio-dsp-model",
      "model/expression-layer",
      "model/graph-01-current",
      "model/subpatches",
      "model/live-help",
      "model/graph-fragments",
      "model/pd-baseline-matrix"
    ]
  },
  {
    type: "category",
    label: "Runtime Sessions",
    collapsed: false,
    items: [
      "model/desktop-runtime-sessions",
      "model/realtime-collaboration"
    ]
  },
  {
    type: "category",
    label: "References",
    items: ["references/pure-data-notes"]
  }
];

module.exports = {
  manualSidebar
};
