export const supportedLocales = ["zh-CN", "en-US"];
export const defaultLocale = "zh-CN";

export const localeLabels = {
  "zh-CN": "中文",
  "en-US": "EN",
};

export const messages = {
  "zh-CN": {
    nav: [
      { label: "首页", href: "#hero" },
      { label: "关于", href: "#about" },
      { label: "项目", href: "#projects" },
      { label: "Agent", href: "#resume-agent" },
      { label: "笔记", href: "https://note.weiqiang.me", external: true },
    ],
    shell: {
      brandAria: "返回首页",
      navAria: "主导航",
      languageAria: "切换语言",
    },
    profile: {
      name: "Ethan",
      alias: "weiqiang / 围墙",
      brand: "打破技术壁垒",
      headline: "专注高并发系统与 AI 工程实践的 Java 后端工程师。",
      summary:
        "我构建边界清晰、可靠性可衡量的后端系统，并用可检查的方式解释复杂架构。",
      location: "中国",
      contacts: [
        { label: "GitHub", href: "https://github.com/", value: "github.com/weiqiang" },
        { label: "Email", href: "mailto:ethan@example.com", value: "ethan@example.com" },
      ],
      methodology: [
        {
          step: "Why",
          title: "澄清压力",
          text: "先看业务压力、流量形态、一致性要求和失败成本。",
        },
        {
          step: "What",
          title: "定义模型",
          text: "把问题拆成有限状态、数据契约、队列、缓存和可观测接口。",
        },
        {
          step: "How",
          title: "落地路径",
          text: "只在能降低真实风险的地方引入 Spring Boot、Redis、MySQL、消息队列和 AI 编排。",
        },
        {
          step: "Deep Dive",
          title: "证明边界",
          text: "用图、压测路径和代码级取舍说明系统在高负载下如何运转。",
        },
      ],
    },
    hero: {
      eyebrow: "Ethan / weiqiang / 围墙",
      primaryAction: "查看项目",
      secondaryAction: "询问简历 Agent",
      tertiaryAction: "浏览笔记",
      terminalTitle: "ethan@portfolio:~/system",
      whoami: "$ whoami",
      mission: "$ mission",
      typewriter: [
        "boot portfolio --brand weiqiang",
        "load Java backend depth",
        "inspect high-concurrency architecture",
        "attach AI Agent and RAG practice",
      ],
    },
    about: {
      eyebrow: "About",
      title: "用可解释架构呈现后端深度",
      description:
        "作品集围绕具体工程证据组织：系统压力、设计决策和实现取舍。",
      techTitle: "技术重点",
    },
    techStack: [
      { name: "Java / Spring Boot", level: 92, group: "后端" },
      { name: "MySQL / MyBatis", level: 86, group: "持久化" },
      { name: "Redis / Lua", level: 88, group: "并发" },
      { name: "缓存设计", level: 84, group: "架构" },
      { name: "AI Agent / RAG", level: 78, group: "AI 工程" },
      { name: "Vue / Vite", level: 72, group: "前端" },
    ],
    projectsSection: {
      eyebrow: "Projects",
      title: "值得在面试中展开讨论的系统",
      description:
        "每个项目都按系统视角呈现：负载路径、状态模型、缓存策略，以及 AI 如何改善工程工作流。",
    },
    projects: [
      {
        id: "sky-takeout",
        name: "苍穹外卖",
        subtitle: "具备状态安全与 AI 意图识别的外卖后端",
        summary:
          "基于 Spring Boot 的外卖系统，用于解释订单生命周期建模、并发安全状态流转和 AI 辅助运营流程。",
        highlights: [
          "以状态机思维约束订单状态流转，保证并发操作安全。",
          "预留 GLM 意图识别 Agent，用于自然语言操作和知识查询。",
          "RAG 增强知识库流程，承载项目笔记、API 解释和问题排查。",
        ],
        techStack: ["Spring Boot", "MyBatis", "MySQL", "Redis", "WebSocket", "GLM Agent", "RAG"],
        diagramType: "mermaid",
        diagramSource: "订单状态 + Agent 知识流",
      },
      {
        id: "hm-dianping",
        name: "黑马点评",
        subtitle: "高并发本地生活服务平台",
        summary:
          "面向缓存架构、秒杀安全和 Redis 实战模式的高并发练习项目。",
        highlights: [
          "Caffeine + Redis 两级缓存路径，用于热点店铺数据和降低尾延迟。",
          "基于 Lua 脚本扣减库存，避免秒杀场景下超卖。",
          "用请求流图解释缓存穿透、击穿和雪崩治理策略。",
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "Caffeine", "MySQL", "Redisson"],
        diagramType: "mermaid",
        diagramSource: "缓存 + 防超卖请求流",
      },
    ],
    projectCard: {
      diagramLabel: "Mermaid 预留区域",
      flowNodes: ["Controller", "Service", "Redis", "MySQL"],
    },
    agent: {
      launcher: "简历 Agent",
      panelAria: "简历 Agent 模拟面板",
      title: "Resume Agent",
      mode: "模拟流式模式",
      closeAria: "关闭简历 Agent",
      welcome:
        "可以询问 Ethan 的 Java 后端经历、高并发项目，或 AI Agent / RAG 实践。",
      placeholder: "询问苍穹外卖、黑马点评、RAG...",
      send: "发送",
      sending: "...",
      roles: {
        user: "你",
        assistant: "Agent",
      },
      sources: {
        mockMode: "模拟模式",
        mockKnowledge: "前端模拟知识",
        productDirection: "AGENTS.md 产品方向",
      },
      mockReplies: [
        "我可以从架构、并发路径和技术取舍解释 Ethan 的后端项目。苍穹外卖可以从订单状态安全和 Agent 知识流开始看。",
        "黑马点评最强的叙事是高并发路径：Caffeine + Redis 缓存、Lua 扣减库存，以及秒杀流量下的失败处理。",
        "当前还没有接入真实 API。这个面板保留了 POST /api/chat/stream 的交互形态，后续可以平滑切换到 SSE。",
      ],
    },
    notFound: {
      title: "页面不存在",
      action: "回到作品集",
    },
  },
  "en-US": {
    nav: [
      { label: "Home", href: "#hero" },
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Agent", href: "#resume-agent" },
      { label: "Notes", href: "https://note.weiqiang.me", external: true },
    ],
    shell: {
      brandAria: "Back to hero",
      navAria: "Primary navigation",
      languageAria: "Switch language",
    },
    profile: {
      name: "Ethan",
      alias: "weiqiang / 围墙",
      brand: "Breaking technical barriers",
      headline: "Java backend engineer focused on high-concurrency systems and AI-enabled engineering.",
      summary:
        "I build backend systems with clear boundaries, measurable reliability, and explanations that make complex architecture easier to inspect.",
      location: "China",
      contacts: [
        { label: "GitHub", href: "https://github.com/", value: "github.com/weiqiang" },
        { label: "Email", href: "mailto:ethan@example.com", value: "ethan@example.com" },
      ],
      methodology: [
        {
          step: "Why",
          title: "Clarify pressure",
          text: "Start from the business pressure, traffic shape, consistency requirement, and failure cost.",
        },
        {
          step: "What",
          title: "Define the model",
          text: "Turn the problem into bounded states, data contracts, queues, caches, and observable interfaces.",
        },
        {
          step: "How",
          title: "Engineer the path",
          text: "Choose Spring Boot, Redis, MySQL, message queues, and AI orchestration only where they reduce real risk.",
        },
        {
          step: "Deep Dive",
          title: "Prove the edge cases",
          text: "Use diagrams, stress paths, and code-level tradeoffs to explain how the system behaves under load.",
        },
      ],
    },
    hero: {
      eyebrow: "Ethan / weiqiang / 围墙",
      primaryAction: "Inspect Projects",
      secondaryAction: "Ask Resume Agent",
      tertiaryAction: "Browse Notes",
      terminalTitle: "ethan@portfolio:~/system",
      whoami: "$ whoami",
      mission: "$ mission",
      typewriter: [
        "boot portfolio --brand weiqiang",
        "load Java backend depth",
        "inspect high-concurrency architecture",
        "attach AI Agent and RAG practice",
      ],
    },
    about: {
      eyebrow: "About",
      title: "Backend depth with explainable architecture",
      description:
        "The portfolio is organized around concrete engineering evidence: system pressure, design decisions, and implementation tradeoffs.",
      techTitle: "Technical Focus",
    },
    techStack: [
      { name: "Java / Spring Boot", level: 92, group: "Backend" },
      { name: "MySQL / MyBatis", level: 86, group: "Persistence" },
      { name: "Redis / Lua", level: 88, group: "Concurrency" },
      { name: "Caching Design", level: 84, group: "Architecture" },
      { name: "AI Agent / RAG", level: 78, group: "AI Engineering" },
      { name: "Vue / Vite", level: 72, group: "Frontend" },
    ],
    projectsSection: {
      eyebrow: "Projects",
      title: "Systems worth discussing in an interview",
      description:
        "Each project is framed as a system: load path, state model, cache strategy, and where AI can improve engineering workflows.",
    },
    projects: [
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
    ],
    projectCard: {
      diagramLabel: "Mermaid reserved",
      flowNodes: ["Controller", "Service", "Redis", "MySQL"],
    },
    agent: {
      launcher: "Resume Agent",
      panelAria: "Resume Agent mock panel",
      title: "Resume Agent",
      mode: "mock streaming mode",
      closeAria: "Close resume agent",
      welcome:
        "Ask about Ethan's Java backend work, high-concurrency projects, or AI Agent/RAG practice.",
      placeholder: "Ask about 苍穹外卖, 黑马点评, RAG...",
      send: "Send",
      sending: "...",
      roles: {
        user: "You",
        assistant: "Agent",
      },
      sources: {
        mockMode: "Mock mode",
        mockKnowledge: "Frontend mock knowledge",
        productDirection: "AGENTS.md product direction",
      },
      mockReplies: [
        "I can explain Ethan's backend projects through architecture, concurrency paths, and tradeoffs. For 苍穹外卖, start with order state safety and the agent knowledge flow.",
        "For 黑马点评, the strongest story is the high-concurrency path: Caffeine + Redis cache, Lua stock deduction, and failure handling around flash-sale traffic.",
        "The live API is not connected yet. This panel keeps the same interaction shape planned for POST /api/chat/stream so the frontend can switch to SSE later.",
      ],
    },
    notFound: {
      title: "Route not found",
      action: "Back to portfolio",
    },
  },
};
