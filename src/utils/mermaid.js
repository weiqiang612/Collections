import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    // Background & panels
    background: "#0b0f14",
    mainBkg: "#111821",
    nodeBorder: "#8be9fd",
    // Text
    primaryTextColor: "#f8f8f2",
    secondaryTextColor: "#98a2ad",
    tertiaryTextColor: "#f8f8f2",
    // Nodes
    primaryColor: "#1a2535",
    primaryBorderColor: "#8be9fd",
    secondaryColor: "#0b1620",
    secondaryBorderColor: "rgba(139,233,253,0.3)",
    tertiaryColor: "#0b0f14",
    tertiaryBorderColor: "rgba(139,233,253,0.2)",
    // Lines & edges
    lineColor: "#50fa7b",
    edgeLabelBackground: "#0b0f14",
    // Sequence diagram specific
    actorBkg: "#111821",
    actorBorder: "#8be9fd",
    actorTextColor: "#f8f8f2",
    actorLineColor: "#50fa7b",
    signalColor: "#50fa7b",
    signalTextColor: "#f8f8f2",
    labelBoxBkgColor: "#0b0f14",
    labelBoxBorderColor: "rgba(139,233,253,0.24)",
    labelTextColor: "#f8f8f2",
    loopTextColor: "#f8f8f2",
    noteBorderColor: "#ffb86c",
    noteBkgColor: "rgba(255,184,108,0.1)",
    noteTextColor: "#f8f8f2",
    activationBorderColor: "#8be9fd",
    activationBkgColor: "rgba(139,233,253,0.1)",
    // Flowchart
    clusterBkg: "rgba(17,24,33,0.8)",
    clusterBorder: "rgba(139,233,253,0.28)",
    titleColor: "#8be9fd",
  },
  sequence: {
    actorFontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    messageFontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    noteFontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    actorFontSize: 12,
    messageFontSize: 12,
    noteFontSize: 11,
    useMaxWidth: true,
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    useMaxWidth: true,
  },
});

export default mermaid;
