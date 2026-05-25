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
        subtitle: "基于 Spring AI 顾问链与三层记忆模型的外卖智能 Agent",
        summary:
          "具有双服务架构的餐饮外卖系统。引入 Spring AI 重构为智能客服 Agent，支持多意图识别、复杂业务工具调用和三层记忆系统。",
        highlights: [
          "采用双服务架构：sky-server 承载核心业务与订单状态机，sky-ai 基于 Spring AI 1.1.5 实现智能客服 Agent 并进行微服务级解耦。",
          "设计 6 层顾问链（Advisor Chain），模块化实现意图识别（13 类意图）、上下文注入、会话与长期记忆管理、FAQ RAG 检索以及动态工具过滤。",
          "实现三层记忆系统：Working 内存、Redis 会话记忆（2h TTL）与 PostgreSQL JPA 长期记忆，利用异步服务（@Async）通过 LLM 自动提取并合并事实。",
          "实现 17 个本地 `@Tool` 业务接口与 Model Context Protocol (MCP) 服务的 SSE 动态注册，支持 WebSocket 流式传输及人工确认安全机制。",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagramType: "mermaid",
        diagramSource: "双服务架构 + Spring AI 顾问链",
        flowNodes: ["sky-server", "sky-ai (Spring AI)", "Redis 缓存", "Postgres 长期记忆"],
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
        flowNodes: ["Controller", "Caffeine 本地缓存", "Redis 锁与缓存", "MySQL 数据库"],
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
        "我可以为你介绍我的后端项目架构。对于「苍穹外卖」，我通过 Spring AI 顾问链重构了智能客服，并集成了三层记忆系统、本地 `@Tool` 与 MCP 工具，欢迎针对 Advisor 链路和事实提取细节提问！",
        "「黑马点评」项目核心在于高并发优化路径：使用 Caffeine + Redis 构建二级缓存以降低尾延迟，设计 Lua 脚本以实现并发安全的秒杀库存扣减，并处理了缓存穿透/击穿/雪崩等典型场景。",
        "「苍穹外卖」的 AI 模块设计中，我采用了 Working Memory、Redis 会话记忆（TTL 2小时）和 PostgreSQL 长期事实表的三层架构，并在对话结束后通过 @Async 异步服务结合 LLM 提取并合并用户的偏好与操作事实。",
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
        name: "Sky Takeout",
        subtitle: "Intelligent Delivery Agent via Spring AI Advisor Chain & 3-Layer Memory",
        summary:
          "A dual-service food delivery system refactored with Spring AI to provide an intelligent customer agent supporting multi-intent routing, automated tool calling, and long-term memory extraction.",
        highlights: [
          "Decoupled architecture: sky-server handles core delivery workflows and order state machine, while sky-ai (Spring AI 1.1.5) operates as an independent agent service.",
          "Engineered a modular 6-layer Advisor Chain for pre-intent classification (13 intent types), context injection, Redis session memory, FAQ RAG retrieval, and dynamic tool filtering.",
          "Designed a 3-layer memory system (Working, Redis Session with 2h TTL, PostgreSQL long-term facts) with an async (@Async) LLM-powered background fact extraction service.",
          "Registered 17 local `@Tool` business callbacks and SSE MCP servers (maps, payments, notifications) over WebSocket with human-in-the-loop confirmation.",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagramType: "mermaid",
        diagramSource: "Dual-Service + Spring AI Advisor Chain",
        flowNodes: ["sky-server", "sky-ai (Spring AI)", "Redis Session", "Postgres Long-term"],
      },
      {
        id: "hm-dianping",
        name: "HM Dianping",
        subtitle: "High-Concurrency Local Life Service Platform",
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
        flowNodes: ["Controller", "Caffeine L1 Cache", "Redis Lock & Cache", "MySQL DB"],
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
      placeholder: "Ask about Sky Takeout, HM Dianping, RAG...",
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
        "I can walk you through my backend architectures. For 'Sky Takeout', I refactored it into an intelligent customer service agent using Spring AI Advisor Chain, featuring a 3-layer memory system, local `@Tool` gateways, and MCP servers. Ask me anything about the advisor chain or memory extraction details!",
        "For 'HM Dianping', the core highlight is the high-concurrency path: Caffeine + Redis two-level caching to reduce tail latency, Lua scripting for concurrent stock deduction, and systematic handling of cache penetration/breakdown/avalanche.",
        "In the 'Sky Takeout' AI system, the memory module utilizes a 3-layer memory: Working context, Redis Session (2h TTL), and PostgreSQL JPA long-term memory, which runs an async (@Async) LLM service to extract and merge facts after each chat turn.",
      ],
    },
    notFound: {
      title: "Route not found",
      action: "Back to portfolio",
    },
  },
};
