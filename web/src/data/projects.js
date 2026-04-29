export const projects = [
  {
    id: "sky-takeout",
    name: "苍穹外卖",
    subtitle: "Food delivery backend with state safety and AI intent recognition",
    summary:
      "A Spring Boot delivery system used to explain order lifecycle modeling, concurrency-safe state transitions, and AI-assisted operation flows.",
    highlights: [
      "State-machine thinking for order status transitions and concurrent operation safety.",
      "GLM intent recognition Agent reserved for natural-language operations and knowledge lookup.",
      "RAG-enhanced knowledge base flow for project notes, API explanations, and troubleshooting.",
    ],
    techStack: ["Spring Boot", "MyBatis", "MySQL", "Redis", "WebSocket", "GLM Agent", "RAG"],
    diagramType: "mermaid",
    diagramSource: "Order State + Agent Knowledge Flow",
  },
  {
    id: "hm-dianping",
    name: "黑马点评",
    subtitle: "High-concurrency local service platform",
    summary:
      "A high-concurrency practice project focused on cache architecture, flash-sale safety, and practical Redis patterns.",
    highlights: [
      "Caffeine + Redis two-level cache path for hot shop data and lower tail latency.",
      "Lua script based stock deduction to avoid oversell in flash-sale scenarios.",
      "Cache penetration, breakdown, and avalanche strategies explained with request flow diagrams.",
    ],
    techStack: ["Spring Boot", "Redis", "Lua", "Caffeine", "MySQL", "Redisson"],
    diagramType: "mermaid",
    diagramSource: "Cache + Anti-oversell Request Flow",
  },
];
