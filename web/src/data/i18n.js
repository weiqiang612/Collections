export const supportedLocales = ["zh-CN", "en-US"];
export const defaultLocale = "zh-CN";

export const localeLabels = {
  "zh-CN": "中文",
  "en-US": "EN",
};

// ─── Mermaid diagram code ────────────────────────────────────────────────────
// Stored once and referenced in both locale objects to avoid duplication.

const diagrams = {
  skyTakeout: [
    {
      title: "Advisor Chain 架构 / Architecture",
      code: `flowchart TD
    C([WebSocket Client]) --> F[ChatController]
    F --> A1[Advisor 1\\nIntent Classifier\\n13 intent types]
    A1 --> A2[Advisor 2\\nContext Injector\\nUser profile injection]
    A2 --> A3[Advisor 3\\nSession Memory\\nRedis · 2 h TTL]
    A3 --> A4[Advisor 4\\nFAQ RAG Retriever\\nPostgreSQL VectorStore]
    A4 --> A5[Advisor 5\\nTool Filter\\nDynamic whitelisting]
    A5 --> A6[Advisor 6\\nLLM API Call]
    A6 --> T1[Local @Tool ×17\\nOrder / Menu / Cart / Address]
    A6 --> T2[MCP SSE Servers\\nMaps · Payment · Notification]
    T1 --> SS[sky-server\\nOrder State Machine · MySQL]
    A3 <-.->|read / write| R[(Redis\\nSession Cache)]
    A4 <-.->|vector search| V[(PostgreSQL\\nVectorStore)]
    SS <-.-> DB[(MySQL)]`,
    },
    {
      title: "三层记忆系统 / 3-Layer Memory",
      code: `flowchart TD
    MSG([User Message]) --> WM[Working Memory\\nCurrent-turn context only]
    WM --> RS[Redis Session Memory\\nRecent N turns · 2h TTL]
    RS --> LLM[LLM Processing]
    LLM --> RES([Response to User])
    LLM --> TURNQ{Turn ends?}
    TURNQ -->|Yes| AS[Async Service @Async]
    AS --> EX[LLM fact extraction\\nfrom conversation]
    EX --> PG[(PostgreSQL JPA\\nLong-term Memory\\nUser prefs and facts)]
    PG -.->|inject into next session| RS`,
    },
  ],
  hmDianping: [
    {
      title: "缓存击穿防护（逻辑过期）",
      code: `sequenceDiagram
    participant C  as 客户端
    participant CS as CacheClient
    participant R  as Redis
    participant TP as 线程池 CACHE_REBUILD_EXECUTOR
    participant DB as MySQL

    C  ->> CS: queryById(id)
    CS ->> R : GET cache:shop:{id}

    alt 缓存未命中（key 不存在）
        R  -->> CS: null（缓存预热未覆盖）
        CS -->> C : null（店铺不存在）

    else 命中，逻辑时间未到
        R  -->> CS: RedisData（expireTime 未过）
        CS -->> C : 反序列化 Shop 对象返回

    else 命中，逻辑时间已过
        R  -->> CS: RedisData（expireTime 已过）
        CS ->>  R : SETNX lock:shop:{id}（互斥锁）
        CS -->> C : 立即返回旧数据（不阻塞）
        CS ->>  TP: 提交缓存重建任务
        Note over TP,DB: 异步线程 Double-Check 再重建
        TP ->>  R : 再次 GET 做 Double-Check
        TP ->>  DB: getById(id)
        DB -->> TP: Shop
        TP ->>  R : SET key + 新逻辑过期时间
        TP ->>  R : DEL lock:shop:{id}
    end`,
    },
    {
      title: "秒杀异步下单流程",
      code: `sequenceDiagram
    participant C    as 客户端
    participant Ctrl as VoucherOrderController
    participant L    as seckill.lua（原子执行）
    participant Q    as Redis Stream stream.orders
    participant W    as VoucherOrderHandler（单线程）
    participant DB   as MySQL

    C    ->> Ctrl: POST /voucher-order/{voucherId}
    Ctrl ->> Ctrl: RedisIdWorker 生成全局唯一 orderId
    Ctrl ->> L   : EVALSHA(voucherId, userId, orderId)

    alt 库存不足（DECR 后 <= 0）
        L  -->> Ctrl: 1（库存不足）
        Ctrl -->> C: 返回错误：库存不足

    else 重复下单（SISMEMBER 命中）
        L  -->> Ctrl: 2（一人一单限制）
        Ctrl -->> C: 返回错误：每人限购一单

    else 库存充足且首次下单
        L  ->>  L : DECR seckill:stock:{id}
        L  ->>  L : SADD seckill:order{id} userId
        L  ->>  Q : XADD stream.orders * voucherId userId id
        L  -->> Ctrl: 0（校验通过）
        Ctrl -->> C: 返回 orderId（主线程快速响应）

        W  ->>  Q : XREADGROUP GROUP g1 c1 COUNT 1 BLOCK 2s
        Q  -->> W : 订单消息
        W  ->>  DB: createVoucherOrder()\\n扣减 stock + 写 tb_voucher_order
        W  ->>  Q : XACK stream.orders g1 {msgId}
        Note over W: 异常时处理 Pending List 保障消息可靠性
    end`,
    },
    {
      title: "双拦截器 Token 认证链",
      code: `flowchart TD
    A([HTTP 请求]) --> B[RefreshTokenInterceptor\\norder=0 · 拦截所有路径]
    B --> C{Authorization\\n请求头存在?}
    C -->|无| D[游客身份，放行]
    C -->|有 token| E["Redis HGETALL\\nlogin:token:{token}"]
    E --> F{用户数据\\n存在?}
    F -->|不存在 / 已过期| D
    F -->|存在| G[BeanUtil.mapToBean\\n写入 UserHolder ThreadLocal]
    G --> H[EXPIRE 续期 30 min]
    H --> I[放行]
    D --> J[LoginInterceptor\\norder=1 · 仅保护路径]
    I --> J
    J --> K{UserHolder\\n有用户?}
    K -->|无，受保护路径| L([401 Unauthorized])
    K -->|有用户 或 公开路径| M[Controller]
    M --> N[afterCompletion]
    N --> O[UserHolder.removeUser\\n清理 ThreadLocal 防内存泄漏]`,
    },
  ],
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
          "实现 17 个本地 @Tool 业务接口与 Model Context Protocol (MCP) 服务的 SSE 动态注册，支持 WebSocket 流式传输及人工确认安全机制。",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
      },
      {
        id: "hm-dianping",
        name: "黑马点评",
        subtitle: "基于 Redis 的高并发本地生活服务平台",
        summary:
          "深度实践 Redis 在高并发场景下的多种应用模式。涵盖逻辑过期 + 互斥锁防缓存击穿、Lua 脚本原子秒杀防超卖、Redis Stream 异步可靠下单、Feed 流 ZSet 滚动分页、GEO 附近商铺查询以及 BitMap 签到统计。",
        highlights: [
          "封装通用 CacheClient：「缓存空值防穿透」与「逻辑过期 + 互斥锁防击穿」两套策略，通过泛型 + Function<ID, T> 回调解耦 DB 访问；逻辑过期方案在异步重建期间返回旧数据，实测高并发吞吐量提升约 43%。",
          "秒杀原子化：seckill.lua 在单次 EVALSHA 内完成库存 DECR 与一人一单 SISMEMBER 校验，成功后写入 Redis Stream；主线程立即返回 orderId，异步 VoucherOrderHandler 消费 Stream 落库，Pending List + XACK 保障消息不丢。",
          "双拦截器认证链：RefreshTokenInterceptor（order=0）拦截所有请求并对持有有效 Token 的用户自动续期 30 min；LoginInterceptor（order=1）仅校验 UserHolder，两者职责清晰、互不侵入。",
          "多场景 Redis 实战：点赞榜 ZSet 按时间戳排序 → 关注共同好友 Set 求交集 → Feed 流游标滚动分页 → 附近商铺 GEO GEOSEARCH → 用户签到 BitMap 连续天数位运算统计 → 全局唯一 ID 时间戳拼接高位 + Redis INCR 低位。",
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"],
        diagrams: diagrams.hmDianping,
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
        "我可以为你介绍我的后端项目架构。对于「苍穹外卖」，我通过 Spring AI 顾问链重构了智能客服，并集成了三层记忆系统、本地 @Tool 与 MCP 工具，欢迎针对 Advisor 链路和事实提取细节提问！",
        "「黑马点评」核心在于多场景 Redis 高并发实战：逻辑过期 + 互斥锁防缓存击穿，Lua 脚本原子秒杀防超卖，Redis Stream 异步可靠下单，以及 ZSet/Set/GEO/BitMap 等数据结构的业务场景实践。",
        "「苍穹外卖」的 AI 模块采用三层记忆：Working 上下文、Redis 会话记忆（TTL 2小时）和 PostgreSQL 长期事实表，每轮对话结束后由 @Async 异步服务结合 LLM 提取并合并用户偏好与操作事实。",
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
          "Registered 17 local @Tool business callbacks and SSE MCP servers (maps, payments, notifications) over WebSocket with human-in-the-loop confirmation.",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
      },
      {
        id: "hm-dianping",
        name: "HM Dianping",
        subtitle: "High-Concurrency Local Life Service Platform powered by Redis",
        summary:
          "A deep-dive into Redis patterns for high-concurrency systems: logical expiry + mutex lock to prevent cache breakdown, Lua-script atomic seckill to prevent oversell, Redis Stream for reliable async order processing, ZSet-based feed scroll pagination, GEO for nearby shops, and BitMap for sign-in streaks.",
        highlights: [
          "Generic CacheClient utility encapsulates two strategies — null-value caching for penetration, and logical expiry + setnx mutex lock for breakdown — via generics and Function<ID,T> callbacks decoupling the DB layer. The logical-expiry path returns stale data immediately and rebuilds asynchronously.",
          "Seckill atomicity: a single EVALSHA call executes stock DECR and one-order-per-user SISMEMBER within one Lua script, then writes to Redis Stream. Main thread returns orderId instantly; VoucherOrderHandler single-thread consumer processes the DB write with Pending List + XACK for message reliability.",
          "Dual-interceptor auth: RefreshTokenInterceptor (order=0) intercepts every request and auto-renews TTL on valid tokens; LoginInterceptor (order=1) only checks UserHolder — clean separation of concerns, no coupling.",
          "Five Redis data structures in production patterns: ZSet for like-leaderboard & feed scroll cursor; Set for mutual-follows intersection; GEO + GEOSEARCH for nearby shop ranking; BitMap + bit-shift for consecutive sign-in counting; Redis INCR high-bits + timestamp low-bits for globally unique IDs.",
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"],
        diagrams: diagrams.hmDianping,
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
        "I can walk you through my backend architectures. For 'Sky Takeout', I refactored it into an intelligent customer service agent using Spring AI Advisor Chain, featuring a 3-layer memory system, local @Tool gateways, and MCP servers. Ask me anything about the advisor chain or memory extraction details!",
        "For 'HM Dianping', the core highlights are multi-pattern Redis usage: logical expiry + mutex lock to prevent cache breakdown, Lua script for atomic seckill stock deduction, Redis Stream + XACK for reliable async ordering, and five different Redis data structures applied to real business scenarios.",
        "In the 'Sky Takeout' AI system, memory uses 3 layers: Working context, Redis Session (2h TTL), and PostgreSQL JPA long-term memory. After each turn, an @Async service calls the LLM to extract and merge user preferences and operation facts into the long-term store.",
      ],
    },
    notFound: {
      title: "Route not found",
      action: "Back to portfolio",
    },
  },
};
