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
    C([WebSocket Client]) -->|WebSocket Frame| S["AgentChatService<br><small>(Pre-recognize & Orchestrate)</small>"]
    S --> A1["IntentRecognition<br>Advisor<br><small>(Intent & Profile)</small>"]
    A1 --> A2["UserContext<br>Advisor<br><small>(Access & Perms)</small>"]
    A2 --> A3["MessageChatMemory<br>Advisor<br><small>(Redis History)</small>"]
    A3 --> A4["RagAdvisor<br><small>(Conditional RAG)</small>"]
    A4 --> A5["ToolFilter<br>Advisor<br><small>(Tool Binding)</small>"]
    A5 --> A6["SafeToolCall<br>Advisor<br><small>(Loop Protection)</small>"]
    A6 --> L["LLM<br>ChatClient"]
    L -->|Async Turn| M["MemoryWriterService<br><small>(Async Turn)</small>"]
    M -->|Session Cache| R[("Redis<br><small>(2h TTL)</small>")]
    M -->|Long-term facts| P[("PostgreSQL<br><small>(User Facts)</small>")]`,
    },
    {
      title: "三层记忆系统 / 3-Layer Memory",
      code: `flowchart TD
    MSG([User Message]) --> WM["Working Memory<br><small>(Current-turn only)</small>"]
    WM --> RS["Redis Session Memory<br><small>(2h TTL · N Turns)</small>"]
    RS --> LLM["LLM Processing"]
    LLM --> RES(["Response to User"])
    LLM --> TURNQ{"Turn ends?"}
    TURNQ -->|Yes| AS["Async Service<br><small>(Async Turn)</small>"]
    AS --> EX["LLM Fact Extraction<br><small>(from Chat)</small>"]
    EX --> PG[("PostgreSQL JPA<br><small>(Long-term Memory)</small>")]
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
    A([HTTP 请求]) --> B["RefreshTokenInterceptor<br><small>(order=0 · All Paths)</small>"]
    B --> C{"Authorization<br>请求头存在?"}
    C -->|无| D["游客身份，放行"]
    C -->|有 token| E["Redis HGETALL<br><small>login:token:{token}</small>"]
    E --> F{"用户数据存在?"}
    F -->|不存在 / 已过期| D
    F -->|存在| G["BeanUtil.mapToBean<br><small>(Write UserHolder)</small>"]
    G --> H["EXPIRE<br><small>(Extend 30 min)</small>"]
    H --> I["放行"]
    D --> J["LoginInterceptor<br><small>(order=1 · Protected Paths)</small>"]
    I --> J
    J --> K{"UserHolder<br>有用户?"}
    K -->|无，受保护路径| L(["401 Unauthorized"])
    K -->|有用户 或 公开路径| M["Controller"]
    M --> N["afterCompletion"]
    N --> O["UserHolder.removeUser<br><small>(Clean ThreadLocal)</small>"]`,
    },
  ],
  equipmentManagement: [
    {
      title: "物理表 E-R 关系设计 / Physical E-R Diagram",
      code: `erDiagram
    sys_user ||--o{ t_equipment_claim : "申请人"
    sys_user ||--o{ maintenance_record : "指定维保工"
    equipment }|--|| category : "分类归属"
    equipment }|--|| department : "所属单位"
    equipment ||--o{ t_equipment_claim : "设备领用"
    equipment ||--o{ maintenance_record : "设备检修"
    equipment ||--o{ transfer_record : "设备调拨"
    equipment ||--o| scrap_record : "设备报废"`,
    },
    {
      title: "维保闭环状态流转时序 / Maintenance Workflow Sequence",
      code: `sequenceDiagram
    participant O as 操作员 (Role 0)
    participant A as 资产管理员 (Role 2)
    participant E as 维保工程师 (Role 1)
    participant DB as 数据库 (MySQL)

    O->>DB: 发起报修 (设备状态: 在用->维修, 创建工单)
    A->>DB: 指派工单 (指派维保工, 工单状态: 待指派->维修中)
    E->>DB: 登记完工 (登记费用与说明, 工单状态: 维修中->待复核)
    alt 复核结果：判定可用
        A->>DB: 审批通过 (设备状态: 维修->在用, 保管人恢复)
    else 复核结果：损坏严重
        A->>DB: 审批报废 (设备状态: 维修->报废, 保管人清空, 自动生成报废卡)
    end`,
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
        { label: "GitHub", href: "https://github.com/weiqiang612", value: "github.com/weiqiang612" },
        { label: "Email", href: "mailto:weiqiang0322@gmail.com", value: "weiqiang0322@gmail.com" },
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
          "具有双服务架构的餐饮外卖系统。引入 Spring AI 重构为智能客服 Agent，支持多意图识别、多步任务编排、Hybrid RAG 检索和混合长期记忆系统。",
        highlights: [
          "**双服务微服务架构**：核心业务与订单状态机由 `sky-server` 承载，智能客服 Agent 独立于 `sky-ai` 服务（基于 Spring AI），实现微服务级解耦与 WebSocket 流式传输。",
          "**工业级级联 Advisor 链**：设计 6 层级联 Advisor chain（意图识别、画像注入、历史消息加载、条件式 RAG 注入、可访问工具硬性过滤及尾部防死循环的 `SafeToolCallAdvisor`），实现请求的管道流式拦截与安全熔断（最多4轮或重复签名直接截断）。",
          "**RuleBased 复合任务编排**：设计 `RuleBasedTaskPlanner` 自动划分 `TaskStep`；特别针对模糊提问实现了“检索驱动型多步取消计划”，借助动态插槽占位符 `target_order_slot` 优雅实现前置查询与后置取消的高效级联绑定。",
          "**高风险操作人工卡点机制**：针对取消、退款等涉及资金的高风险意图，服务端主动挂起当前回合，向前端推送 `confirmation` 人工确认控制帧；用户在 UI 交互确认后回发确认帧，服务端提取 Session 暂存数据，以高置信度零冗余重入恢复执行。",
          "**混合式长期记忆持久化**：异步服务（`@Async`）结合 LLM 自适应提取画像事实，支持纠错覆盖与物理删除；辅以强一致性本地工具响应解析器（精准捕获订单取消、退款等工具的成功状态以物理追加事实记录），确保关键事实 100% 准确。",
          "**Hybrid RAG 混合检索与短路优化**：离线支持 QA 问答对与 Markdown 按标题层级切分，在线阶段基于 Pgvector 进行向量与关键词全文检索双通道并行，经 RRF 融合与 Reranker 精排输出；Advisor 链最前置引入 JVM 内存语义缓存 FAQ，余弦匹配命中时短路返回绕过推理，将时延降至毫秒级。",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
      },
      {
        id: "hm-dianping",
        name: "黑马点评",
        subtitle: "基于 Redis 的高并发本地生活服务平台",
        summary:
          "针对社交电商与本地生活场景进行高并发抗压实战，深度实践并封装 Redis 的多种应用模式，涵盖高并发秒杀优化、通用缓存策略与双通道身份校验机制。",
        highlights: [
          "**防穿透与击穿 CacheClient 封装**：通用缓存工具类封装「缓存空值防穿透」与「逻辑过期 + 互斥锁双检防击穿」两套策略，通过泛型 + Function 回调函数解耦数据库访问；逻辑过期方案在异步重建期间返回旧数据，实测高并发吞吐量提升约 43%。",
          "**原子化秒杀预扣减**：秒杀场景下利用 Redis 执行 Lua 脚本完成库存预扣减与用户一人一单原子化校验，通过 Redisson 分布式锁进行并发安全兜底，彻底杜绝集群环境下的超卖问题。",
          "**Redis Stream 异步下单削峰**：主线程预扣减成功后直接返回 orderId，将订单消息写入 `stream.orders`；异步单线程 `VoucherOrderHandler` 消费队列数据进行落库，在抛出异常时自动进入 Pending List 重试以确保数据最终一致性并防止消息丢失。",
          "**双拦截器 Token 认证链**：配置 `RefreshTokenInterceptor`（优先级0）拦截所有路径实现持有 Token 用户的自动 30 分钟保活续期；`LoginInterceptor`（优先级1）仅校验 UserHolder 登录上下文，职责清晰解耦，保障接口安全。",
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"],
        diagrams: diagrams.hmDianping,
      },
      {
        id: "equipment-management",
        name: "企业设备资产管理系统",
        subtitle: "基于 Spring Boot 与 Vue 的设备全生命周期管理与数据治理系统",
        summary:
          "严格遵循国家固定资产管理规范的系统。设计细粒度 4 级 RBAC 权责隔离与水平隔离，实现设备“入库-领用-维保-报废”闭环流转事务，并引入规则引擎驱动的多维数据治理看板与 AI 辅助分析报告生成。",
        highlights: [
          "**细粒度多级 RBAC 与数据隔离**：实现操作员、工程师、管理员、超管四级角色。在拦截器与 Service 层强校验单位代码（`unit_code`），实现跨单位数据物理隔离，防止恶意水平越权。",
          "**高可靠领用审批事务控制**：利用数据库排他锁对设备状态实施强约束校验，使用 `@Transactional` 声明式事务控制，确保设备状态锁定、领用单生成及保管人交接满足原子性与并发一致性。",
          "**报修-派单-维修-复核闭环工单流**：支持设备故障状态自动转移（锁定领用）；实现维保工单在线流转，管理员在复核环节判定“恢复可用”（自动退回原保管人）或“判定报废”（清空保管人并自动生成报废鉴定记录）。",
          "**规则引擎驱动的多维数据治理**：设计定时及事件触发的数据治理模块，智能筛查“高频故障”、“成本超原值 80%”及“无保管人呆滞卡片”等风险设备，通过消息通知中心实现“事找人”处理闭环。",
          "**AI 辅助运营报告与生命周期智能摘要**：基于 Java 11 异步 HttpClient 整合大语言模型，将设备台账及治理汇总指标组装为 Prompt 动态生成月度分析报告 Markdown 草稿；对单台设备提取全生命周期记录（领用/调拨/维保/报废）进行智能生平提炼。",
          "**追加式安全审计与数据物理备份**：所有的用户数据修改动作由 AOP 切面统一拦截并追加记录至审计日志 `operation_log`，该表在 DAO 层只增不改，确保不可篡改性；支持超级管理员一键调用 `mysqldump` 备份并归档。"
        ],
        techStack: ["Spring Boot", "Java 11", "JdbcTemplate", "MySQL", "JWT", "AOP", "Vue 2", "ECharts", "LLM API"],
        diagrams: diagrams.equipmentManagement,
      },
    ],
    projectCard: {
      diagramLabel: "Mermaid 预留区域",
      flowNodes: ["Controller", "Service", "Redis", "MySQL"],
      zoomIn: "放大",
      zoomOut: "缩小",
      reset: "重置",
      fullscreen: "全屏模式",
      exitFullscreen: "退出全屏",
      tip: "拖拽以平移 • 滚动缩放（非全屏按住 Ctrl）",
      fullscreenTip: "全屏模式 • 拖拽以平移 • 滚动鼠标滚轮缩放 • 按 Esc 键退出",
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
        "我可以为你介绍我的后端与 AI 架构。对于「苍穹外卖」，我基于 Spring AI 级联 Advisor 链（防循环拦截）重构了智能 Agent，集成了 RuleBased 多步任务编排、Pgvector 混合 RAG 与混合长期记忆系统，欢迎针对 Advisor 链路或 Reranker 精排提问！",
        "「黑马点评」项目核心在于 Redis 高并发实战：封装通用 CacheClient 锁双检逻辑过期防击穿，设计 Lua 脚本原子预扣减结合分布式锁防超卖，并通过 Redis Stream 与 Pending List 队列处理实现可靠异步下单。",
        "「苍穹外卖」的 AI 模块采用三层记忆：基于 Map 的 Working 内存、Redis 会话记忆（2h TTL）与 PostgreSQL 长期事实表。除 @Async 驱动 LLM 自适应提取事实外，还结合本地成功工具响应解析器实现强一致性关键事实持久化。",
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
        { label: "GitHub", href: "https://github.com/weiqiang612", value: "github.com/weiqiang612" },
        { label: "Email", href: "mailto:weiqiang0322@gmail.com", value: "weiqiang0322@gmail.com" },
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
          "A dual-service food delivery system refactored with Spring AI to provide an intelligent customer agent supporting multi-intent routing, multi-step task orchestration, Hybrid RAG search, and mixed long-term memory.",
        highlights: [
          "**Dual-service Decoupled Architecture**: Core business workflows and order state machines are managed by `sky-server`, while the customer service agent operates independently within the Spring AI-powered `sky-ai` microservice, enabling streaming communications over WebSocket.",
          "**Industrial-grade Cascading Advisor Chain**: Engineered a 6-layer Advisor Chain (pre-intent recognition, profile summary injection, chat history, conditional RAG, tool filtering, and the safety-guarding `SafeToolCallAdvisor`) to intercept requests and prevent infinite loops with 4-round signature checks.",
          "**Rule-based Multi-step Task Orchestration**: Implemented `RuleBasedTaskPlanner` to split complex queries into ordered `TaskStep`s; specifically designed lookup-driven cancellation plans using dynamic `target_order_slot` placeholding to elegantly bind query results with operations.",
          "**Human-in-the-Loop High-risk Guardrails**: For sensitive actions like refund or cancellation, the server suspends LLM execution and pushes a `confirmation` frame to the client; upon user approval, execution resumes seamlessly using cached session context with zero redundant prompts.",
          "**Hybrid Long-term Memory Persistence**: Combines `@Async` background LLM factual analysis (supporting correction updates and active forgetting) with a robust local tool outcome parser (automatically capturing address updates and cancellations from tool responses) to guarantee 100% data consistency.",
          "**Hybrid RAG & Semantic Cache Optimization**: Supports offline QA-pair and hierarchy-based Markdown splitting, online parallel search (Pgvector + BM25) blended via RRF and Reranker; deploys a JVM semantic FAQ cache at the Advisor entry to short-circuit RAG and LLM calls, reducing latency to milliseconds."
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
      },
      {
        id: "hm-dianping",
        name: "HM Dianping",
        subtitle: "High-Concurrency Local Life Service Platform powered by Redis",
        summary:
          "High-concurrency performance tuning in social commerce and local life scenarios. Deeply engineered various Redis patterns, covering seckill optimizations, generic cache management, and dual-channel authentication.",
        highlights: [
          "**Generic CacheClient Utility**: Encapsulated 'null-value caching for penetration' and 'logical expiry + mutex lock for breakdown' with generics and `Function` callbacks decoupling database access. Stale data is returned instantly during async rebuilding, increasing concurrent throughput by 43%.",
          "**Atomic Seckill Stock Deduction**: Accomplished atomic stock subtraction and one-order-per-user constraints in a single Lua script, backed up by `Redisson` distributed locks to prevent overselling and guarantee data safety in clustered environments.",
          "**Async Ordering via Redis Stream**: Returned `orderId` immediately to the main thread upon successful Lua check and appended order tasks to `stream.orders`. Single-threaded `VoucherOrderHandler` asynchronously processes MySQL writes, utilizing the Pending List for retry upon exceptions to ensure eventual consistency.",
          "**Dual-Interceptor Authentication Chain**: Configured `RefreshTokenInterceptor` (order=0) to intercept all paths and auto-renew the 30-minute Redis session token TTL, and `LoginInterceptor` (order=1) to secure protected endpoints, achieving clear separation of concerns."
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"],
        diagrams: diagrams.hmDianping,
      },
      {
        id: "equipment-management",
        name: "Equipment Management System",
        subtitle: "Equipment Lifecycle & Data Governance System via Spring Boot and Vue",
        summary:
          "An enterprise fixed asset system strictly adhering to national standards. Features a fine-grained 4-level RBAC and unit-based physical isolation. Implements transaction-controlled 'procurement-claiming-maintenance-scrap' workflows, coupled with a rule-driven multi-dimensional data governance engine and AI-assisted reporting.",
        highlights: [
          "**Fine-grained RBAC & Data Isolation**: Configures Operator, Engineer, Manager, and Admin roles. Enforces unit code (`unit_code`) checks in intercepts and Service layers to achieve cross-tenant physical isolation, blocking horizontal privilege escalation.",
          "**Transaction-Controlled Claiming Workflows**: Leverages database exclusive locks to validate equipment status. Utilizes `@Transactional` declarations to guarantee atomic, concurrent transitions for status locks, claiming slips, and custodian hangovers.",
          "**Closed-Loop Maintenance Workflows**: Auto-locks equipment for claiming upon breakdown. Manages ticket lifecycle ('reporting - assignment - repair - review'). Managers decide between 'restoring status' (returning to original custodian) or 'appraising scrap' (clearing custodian and logging scrap record).",
          "**Rule-Driven Multi-Dimensional Governance**: Scans for risk vectors such as 'high-frequency failures' (failures >= 3), 'costs exceeding 80% of value', and 'dormant unassigned assets'. Dispatches notifications via event center to transition from 'user searching' to 'event seeking'.",
          "**AI-Powered Reports & Lifecycle Summaries**: Deploys Java 11 async HttpClient to integrate LLM APIs. Automatically compiles ledger indexes and risk summaries into monthly Markdown draft reports. Generates readable 'life biographies' of individual assets from their timeline logs.",
          "**Append-Only Security Audits & Physical Backups**: Automatically intercepts all mutation events via AOP and appends read-only logs to `operation_log` (no UPDATE/DELETE endpoints in DAO). Supports one-click DB archiving using `mysqldump`."
        ],
        techStack: ["Spring Boot", "Java 11", "JdbcTemplate", "MySQL", "JWT", "AOP", "Vue 2", "ECharts", "LLM API"],
        diagrams: diagrams.equipmentManagement,
      },
    ],
    projectCard: {
      diagramLabel: "Mermaid reserved",
      flowNodes: ["Controller", "Service", "Redis", "MySQL"],
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      reset: "Reset Zoom",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
      tip: "Drag to pan • Scroll to zoom (hold Ctrl in windowed mode)",
      fullscreenTip: "Fullscreen focus mode • Drag to pan • Scroll to zoom • Press Esc to exit",
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
        "I can walk you through my backend and AI architectures. For 'Sky Takeout', I refactored the intelligent Agent using a cascading Spring AI Advisor Chain with safety guards, integrating RuleBased multi-step task planning, Pgvector hybrid RAG, and a mixed long-term memory system. Feel free to ask about the Advisor pipeline or Reranker sorting!",
        "For 'HM Dianping', the core highlights lie in high-concurrency Redis patterns: encapsulating a generic CacheClient with logical-expiry double-check locks, atomic seckill Lua scripts with Redisson lock fallback, and async ordering via Redis Stream with Pending List error handling.",
        "In 'Sky Takeout', memory consists of 3 layers: Java map Working context, Redis Session (2h TTL), and PostgreSQL long-term facts. Factual updates combine @Async background LLM extraction with a physical local tool outcome parser (e.g., address updates and cancellations) to guarantee consistency.",
      ],
    },
    notFound: {
      title: "Route not found",
      action: "Back to portfolio",
    },
  },
};
