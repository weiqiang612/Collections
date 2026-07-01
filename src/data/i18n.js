import skyTakeoutAiRecommendationScreen from "../assets/projects/sky-takeout/ai-recommendation.webp";
import skyTakeoutMenuSelectionScreen from "../assets/projects/sky-takeout/menu-selection.webp";
import skyTakeoutCartConfirmationScreen from "../assets/projects/sky-takeout/cart-confirmation.webp";
import skyTakeoutCancelConfirmationScreen from "../assets/projects/sky-takeout/cancel-confirmation.webp";
import skyTakeoutCancelSuccessScreen from "../assets/projects/sky-takeout/cancel-success.webp";
import skyTakeoutUserMemoryScreen from "../assets/projects/sky-takeout/user-memory.webp";
import personalCrmDashboardScreen from "../assets/projects/personal-crm/dashboard.webp";
import personalCrmContactDetailScreen from "../assets/projects/personal-crm/contact-detail.webp";
import personalCrmAssistantScreen from "../assets/projects/personal-crm/assistant.webp";
import personalCrmMobileDashboardScreen from "../assets/projects/personal-crm/mobile-dashboard.webp";


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
  personalCrm: [
    {
      title: "Personal CRM 产品架构 / Product Architecture",
      code: `flowchart LR
    U["Web / Mobile User"] --> FE["Vue 3 + Vite<br><small>Dashboard / Contacts / Agent UI</small>"]
    FE --> API["Spring Boot API<br><small>Auth / Contacts / Reminders</small>"]
    API --> MYSQL[("MySQL<br><small>Contacts / Notes / Tasks</small>")]
    API --> REDIS[("Redis<br><small>Session / Rate Limit / Cache</small>")]
    FE --> AGENT["Contact Agent Panel<br><small>Controlled write assistant</small>"]
    AGENT --> GUARD["Confirmation Guard<br><small>Preview before mutation</small>"]
    GUARD --> API
    API --> MAIL["Email Service<br><small>Reset / reminder delivery</small>"]
    API --> WEATHER["Weather API<br><small>Context enrichment</small>"]
    API --> DEPLOY["Deployment Boundary<br><small>Static frontend + backend service</small>"]`,
    },
    {
      title: "受控 Contact Agent 写操作 / Controlled Agent Write Flow",
      code: `sequenceDiagram
    participant User as User
    participant UI as Vue Agent Panel
    participant Agent as Contact Agent
    participant API as Spring Boot API
    participant DB as MySQL

    User->>UI: Ask to create or update contact task
    UI->>Agent: Send intent and current contact context
    Agent-->>UI: Return structured draft operation
    UI-->>User: Show confirmation preview
    alt User confirms
        UI->>API: Submit validated write request
        API->>API: Auth and input validation
        API->>DB: Persist contact / reminder change
        DB-->>API: Success
        API-->>UI: Updated entity snapshot
    else User cancels
        UI-->>Agent: Abort without mutation
    end`,
    },
  ],
  skyTakeoutDetail: [
    {
      title: "整体架构分层图 / Layered Architecture",
      code: `flowchart LR
    U["Client<br><small>Web / WebSocket</small>"] --> WS["AgentChatWebSocket<br><small>实时入口</small>"]
    WS --> ORCH["TaskOrchestratorService<br><small>预识别 / 任务规划 / 会话控制</small>"]
    ORCH --> CHAT["AgentChatService<br><small>顾问链装配驱动</small>"]

    subgraph ADVISORS["Advisor Chain"]
      A1["IntentRecognitionAdvisor<br><small>意图识别 + 画像摘要</small>"]
      A2["FaqSemanticCacheAdvisor<br><small>FAQ 语义缓存短路</small>"]
      A3["UserContextAdvisor<br><small>两级工具授权 + 画像注入</small>"]
      A4["MessageChatMemoryAdvisor<br><small>Redis 历史加载</small>"]
      A5["RagAdvisor<br><small>条件式 RAG 检索</small>"]
      A6["ToolFilterAdvisor<br><small>可用工具硬筛选</small>"]
      A7["SafeToolCallAdvisor<br><small>死循环检测与 Fallback</small>"]
      A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7
    end

    CHAT --> A1
    A7 --> LLM["ChatClient / LLM"]
    LLM --> TOOLS["Order / Address / Menu Tools"]
    TOOLS --> CORE["sky-server<br><small>订单状态机 / 业务服务</small>"]
    LLM --> FRAME["WebSocket 控制帧<br><small>token / confirmation / step_done</small>"]
    FRAME --> U

    LLM --> MEMORY["MemoryWriterService<br><small>@Async 异步记忆写入</small>"]
    MEMORY --> REDIS[("Redis<br><small>Session Memory · TTL 2h</small>")]
    MEMORY --> PG[("PostgreSQL<br><small>user_memory_facts</small>")]`,
    },
    {
      title: "整体业务流程图 / Overall Flowchart",
      code: `graph TD
    classDef startEnd fill:#1d3557,stroke:#38bdf8,stroke-width:2px,color:#f8f8f2;
    classDef process fill:#1e293b,stroke:#475569,stroke-width:1px,color:#f8f8f2;
    classDef decision fill:#3f2e0f,stroke:#fbbf24,stroke-width:1px,color:#f8f8f2;
    classDef storage fill:#064e3b,stroke:#10b981,stroke-width:1px,color:#f8f8f2;
    classDef alert fill:#4c0519,stroke:#ef4444,stroke-width:1px,color:#f8f8f2;

    Start([用户通过 WebSocket 发送请求消息]) --> Orchestrator{是否为复杂多步任务?}
    class Start startEnd;
    class Orchestrator decision;

    Orchestrator -- 是 (如: 检索取消/复合提问) --> Planner[RuleBasedTaskPlanner 任务分解与规划]
    Planner --> StepLoop[生成 TaskPlan，开始遍历 TaskStep]
    StepLoop --> AdvisorChainInit
    class Planner,StepLoop process;
    
    Orchestrator -- 否 --> AdvisorChainInit[进入 Advisor Chain 顾问链装配驱动]
    class AdvisorChainInit process;
    
    subgraph "顾问链流转 (Advisor Chain)"
        AdvisorChainInit --> IntentAdvisor[1. IntentRecognitionAdvisor<br/>意图识别与画像摘要拼接]
        IntentAdvisor --> FaqAdvisor[2. FaqSemanticCacheAdvisor<br/>FAQ 语义缓存匹配]
        
        FaqAdvisor --> FaqHit{是否命中缓存 FAQ?}
        
        FaqHit -- 是 --> FaqShortCircuit[短路拦截: 直接封装答复并截断]
        
        FaqHit -- 否 --> UserContextAdvisor[3. UserContextAdvisor<br/>两级工具计算与画像注入等级]
        UserContextAdvisor --> HistoryAdvisor[4. MessageChatMemoryAdvisor<br/>加载 Redis 最近历史消息]
        HistoryAdvisor --> RagAdvisor[5. RagAdvisor<br/>条件挂载 RAG 向量检索]
        RagAdvisor --> ToolFilterAdvisor[6. ToolFilterAdvisor<br/>硬性筛选当前 LLM 可用工具]
        ToolFilterAdvisor --> SafeAdvisor[7. SafeToolCallAdvisor<br/>防死循环安全顾问]
    end
    class IntentAdvisor,FaqAdvisor,UserContextAdvisor,HistoryAdvisor,RagAdvisor,ToolFilterAdvisor,SafeAdvisor process;
    class FaqHit decision;
    class FaqShortCircuit alert;
    
    SafeAdvisor --> LoopCheck{检测到死循环/超过4轮工具调用?}
    LoopCheck -- 是 --> FallbackOutput[触发 Fallback 安全兜底话术截断]
    class LoopCheck decision;
    class FallbackOutput alert;

    LoopCheck -- 否 --> HighRiskCheck{是否为高风险意图<br/>且需要人工确认?}
    class HighRiskCheck decision;
    
    HighRiskCheck -- 是 --> SuspendTurn[挂起当前回合，暂存会话状态]
    SuspendTurn --> SendConfirmFrame[向客户端推送 confirmation 确认帧]
    SendConfirmFrame --> WaitConfirm[等待用户在客户端 UI 点击“确认操作”]
    WaitConfirm --> RecvConfirmFrame[收到确认帧，重置意图置信度为高]
    RecvConfirmFrame --> UserContextAdvisor
    class SuspendTurn,SendConfirmFrame,WaitConfirm,RecvConfirmFrame process;
    
    HighRiskCheck -- 否 --> RunLLM[调用 ChatClient 执行大模型推理 / 工具调用]
    RunLLM --> ToolCallNeeded{是否触发工具调用?}
    class RunLLM process;
    class ToolCallNeeded decision;

    ToolCallNeeded -- 是 --> ExecuteTool[执行本地业务服务工具<br/>例如：取消订单、退款、修改地址]
    ExecuteTool --> SafeAdvisor
    class ExecuteTool process;
    
    ToolCallNeeded -- 否 --> GenerateResponse[生成最终文本/流式 Token]
    class GenerateResponse process;
    
    FaqShortCircuit --> SendResponse[WebSocket 发送响应数据帧]
    FallbackOutput --> SendResponse
    GenerateResponse --> SendResponse
    class SendResponse process;
    
    SendResponse --> CheckStepDone{是否为多步任务且有后续步骤?}
    class CheckStepDone decision;

    CheckStepDone -- 是 --> StepDoneFrame[推送 step_done 帧<br/>并更新级联插槽参数]
    StepDoneFrame --> StepLoop
    class StepDoneFrame process;

    CheckStepDone -- 否 --> SendDoneFrame[推送 done 或<br/>plan_complete 帧]
    class SendDoneFrame process;
    
    SendDoneFrame --> AsyncMemory[触发 @Async 异步记忆写入服务]
    class AsyncMemory process;
    
    subgraph "异步记忆持久化 (MemoryWriterService)"
        AsyncMemory --> ToolPersist[A. 本地工具强一致解析<br/>自动提取退款/取消订单事实]
        AsyncMemory --> LLMPersist[B. LLM 语义事实提取<br/>分析用户语句并修正/遗忘事实]
        AsyncMemory --> SaveHistory[C. 保存历史消息]
        
        ToolPersist --> PG[(PostgreSQL<br/>user_memory_facts 长期记忆)]
        LLMPersist --> PG
        SaveHistory --> Redis[(Redis<br/>会话历史，TTL 2h)]
    end
    class ToolPersist,LLMPersist,SaveHistory process;
    class PG,Redis storage;
    
    AsyncMemory --> End([流程结束])
    class End startEnd;`
    }
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
        name: "餐饮场景 AI 智能客服 Agent 平台",
        subtitle: "面向订单咨询、取消确认与用户记忆沉淀的多轮对话任务执行系统",
        summary:
          "围绕餐饮外卖客户服务场景构建可解释的 AI Agent，将订单查询、取消、推荐与用户偏好沉淀整合进一条自然语言驱动的服务链路。",
        highlights: [
          "**Advisor Chain 执行链路**：围绕多意图识别、工具筛选、确认卡点与安全兜底，组织完整的 Spring AI Agent 执行流程。",
          "**多步任务编排**：支持“查询 → 插槽注入 → 确认 → 执行”的级联工作流，能够稳定处理订单取消等高风险服务场景。",
          "**Hybrid RAG + 三层记忆**：结合 Pgvector 混合检索、会话记忆、长期用户事实与异步写入，兼顾回答相关性与关键事实一致性。",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
        detail: {
          tagline: "基于 Spring AI 构建的餐饮场景智能客服 Agent，将订单咨询、推荐、取消与记忆沉淀串成可解释的自动化服务闭环",
          outcomes: ["已部署可演示", "支持多轮对话", "支持多步任务执行", "具备人工确认闭环"],
          tags: ["Spring AI", "Advisor Chain", "Hybrid RAG", "WebSocket", "MCP"],
          metrics: [
            { label: "FAQ 拦截率", value: "90%+" },
            { label: "平均响应时延", value: "<500ms" },
            { label: "关键事实一致性", value: "100%" }
          ],
          media: {
            type: "video",
            label: "Agent Demo / Interactive Flow",
            eyebrow: "首屏改为脚本化手机演示",
            headline: "从自然语言请求到确认执行的完整客服闭环",
            description: "统一媒体模块继续保留视频位，但当前先用 6 步手机交互演示替代视频，让招聘方在首屏就能看清完整的 Agent 执行闭环。",
            badges: ["Video Ready", "Confirmation Loop", "Multi-step Agent"],
            demoScreens: [
              {
                stepLabel: "推荐菜品",
                title: "AI 推荐菜品与预算约束",
                description: "用户用自然语言提出“减脂、清淡、预算 50 元”的复合诉求后，Agent 结合营业状态、菜品分类与价格约束给出结构化推荐。",
                src: skyTakeoutAiRecommendationScreen,
              },
              {
                stepLabel: "组合决策",
                title: "推荐组合与用户选菜决策",
                description: "Agent 不只罗列菜品，还给出 50 元内的搭配方案与总价，帮助用户从候选项快速过渡到明确下单选择。",
                src: skyTakeoutMenuSelectionScreen,
              },
              {
                stepLabel: "加入购物车",
                title: "购物车写入与结果确认",
                description: "在用户确认“大煮干丝 + 葱烧海参”后，Agent 查询菜品详情并写入购物车，再把金额、菜品名和剩余预算回传给前端。",
                src: skyTakeoutCartConfirmationScreen,
              },
              {
                stepLabel: "取消确认",
                title: "高风险取消的二次确认",
                description: "当用户提出取消请求时，Agent 会先区分“购物车移除”与“订单取消”，再对最新订单发起确认卡点，避免误操作。",
                src: skyTakeoutCancelConfirmationScreen,
              },
              {
                stepLabel: "取消完成",
                title: "取消完成与退款说明",
                description: "确认后，Agent 返回订单号、金额、状态与退款路径说明，完整体现查询、确认、执行、结果反馈的闭环。",
                src: skyTakeoutCancelSuccessScreen,
              },
              {
                stepLabel: "用户记忆",
                title: "长期记忆沉淀与可编辑画像",
                description: "执行完成后，Agent 把清淡口味、减脂偏好和服务摘要沉淀到用户记忆页，形成后续推荐和客服处理可复用的长期画像。",
                src: skyTakeoutUserMemoryScreen,
              },

            ],
            frames: [
              { title: "用户输入", description: "用户以自然语言提出查询、取消或退款请求。" },
              { title: "Agent 规划", description: "意图识别、工具筛选、上下文装配与步骤规划依次展开。" },
              { title: "确认执行", description: "高风险操作进入人工确认卡点，确认后恢复执行。" },
            ],
            footer: {
              label: "演示脚本",
              value: "推荐点餐 / 加购确认 / 订单取消 / 用户记忆沉淀",
            },
          },
          sections: {
            overview: {
              title: "项目定位与业务背景",
              content: "在餐饮外卖服务中，退款、取消订单、修改地址等敏感交易操作占用了大量人工客服精力，且容易因为人工响应不及时导致客诉。本项目将智能客服 Agent 独立为 `sky-ai` 微服务（基于 Spring AI 驱动），引入多意图识别与级联任务编排，使用户能够通过自然语言交互轻松完成复杂查询及高风险操作。本页展示了其底层核心架构流程及在多步高风险事务中的具体执行路径。"
              ,
              proofPoints: [
                { title: "价值定位", description: "把原有菜单式、流程式客服操作升级为可解释、可追踪的自然语言客服 Agent。" },
                { title: "能力边界", description: "重点覆盖查询、取消、退款、推荐、FAQ 等任务型客户服务场景，而非开放式陪聊。" },
                { title: "展示重点", description: "强调多步编排、人工确认、Hybrid RAG 与工程级安全兜底，而不是只展示模型接入。" },
              ]
            },
            architecture: {
              title: "系统架构与核心工作流",
              description: "系统围绕 Advisor Chain 管道拦截模式构建，并在编排中心（TaskOrchestratorService）的驱动下实现多步骤插槽绑定；针对资金安全设计了 Human-in-the-Loop 人工卡点机制，保障高风险交易的安全可控。下方依次展示系统分层架构、全景工作流图与检索驱动型订单取消时序图：",
              diagrams: diagrams.skyTakeoutDetail
            },
            productProof: {
              title: "产品界面与交互证明",
              description: "这条演示链路已经前置到首屏 Hero 媒体区，避免在正文区重复堆叠同一批截图。",
              screens: [],
            },
            ownership: {
              title: "我的职责",
              items: [
                "**独立完成系统重构与 AI 接入**：基于 Spring AI 设计并开发了独立的 `sky-ai` 智能客服服务，与 `sky-server`（核心业务与状态机）实现微服务解耦与流式交互。",
                "**级联 Advisor 链设计**：设计了包含意图识别、历史消息、RAG 及 `SafeToolCallAdvisor` 在内的 6 层级联拦截器链，完成了安全熔断，杜绝大模型死循环工具调用。",
                "**多步复合任务编排**：设计 `RuleBasedTaskPlanner` 自动分解步骤，使用动态插槽占位符实现了「检索驱动型多步取消计划」等前后级联依赖任务的自动绑定。",
                "**高风险操作人工确认卡点**：针对退款、取消订单等敏感行为设计了 `confirmation` 控制帧及会话挂起重入机制，保障交易安全。",
                "**混合长期记忆持久化**：结合 `@Async` 后台语义 facts 提取与本地业务工具响应强一致状态解析器，实现高可靠、零幻觉的长期记忆写入。"
              ]
            },
            retrospective: {
              title: "项目反思与复盘",
              challenges: [
                {
                  problem: "**工具调用死循环与 Token 损耗**：大模型在缺少参数或意图模糊时，容易反复调用 searchOrders 导致响应卡死与资源浪费。",
                  solution: "设计了 Trace 级别的防死循环安全顾问（`SafeToolCallAdvisor`），拦截超出 4 轮的工具调用或完全重复的函数签名，并自动降级为友好提示。"
                },
                {
                  problem: "**AI 自动执行高风险操作的误操作**：完全依赖 AI 识别意图并执行退款、取消订单，极易因为幻觉或用户恶意引导引发资金损失。",
                  solution: "引入人工参与校验（Human-in-the-Loop）。在服务端识别到高风险意图时自动挂起会话并向前端推送 confirmation 帧；只有在收到用户在客户端 UI 点击确认回发的 confirmed 帧后，才利用暂存的 Session 数据恢复执行，保证了资金安全。"
                },
                {
                  problem: "**记忆提取偏差与幻觉**：若仅依赖 AI 异步总结对话作为长期事实，可能会将「用户咨询退款但因未付而退款失败」错误地总结为「已成功退款」，产生事实幻觉。",
                  solution: "实施双通道持久化。核心交易和状态变更事实通过本地业务工具的 SUCCESS 响应解析器强一致落库，100% 避免幻觉；而画像和偏好等非敏感、模糊事实则由 AI 异步提取并处理纠错与遗忘，保障了记忆库的高可信度。"
                }
              ]
            }
          }
        }
      },
      {
        id: "hm-dianping",
        name: "高并发本地生活交易平台",
        subtitle: "围绕缓存治理、秒杀防超卖与异步下单设计的 Redis 高并发系统",
        summary:
          "面向本地生活交易链路的高并发后端实战项目，系统化落地 Redis 缓存治理、Lua 原子校验、异步削峰下单与分层鉴权机制。",
        highlights: [
          "**防穿透与击穿 CacheClient 封装**：统一沉淀“缓存空值防穿透”与“逻辑过期 + 互斥锁双检防击穿”两套策略，通过泛型回调解耦 DB 访问；逻辑过期方案在异步重建期间直接返回旧值，实测高并发吞吐提升约 43%。",
          "**原子化秒杀预扣减**：利用 Redis Lua 脚本完成库存预扣减与一人一单原子校验，再用 Redisson 分布式锁为集群并发兜底，避免超卖与重复下单。",
          "**Redis Stream 异步削峰下单**：主线程只负责快速判定并返回 `orderId`，把落库压力转移到 `stream.orders` 消费线程；异常时自动转入 Pending List 重试，兼顾响应速度与最终一致性。",
          "**双拦截器鉴权链**：将 Token 续期与登录保护拆成 `RefreshTokenInterceptor` 和 `LoginInterceptor` 两层链路，减少公开接口与登录校验的耦合。",
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"],
        diagrams: diagrams.hmDianping,
        detail: {
          tagline: "围绕缓存治理、防超卖、异步下单与身份链路设计的高并发本地生活交易系统",
          outcomes: ["缓存策略可解释", "秒杀链路可复盘", "异步削峰闭环", "认证链分层清晰"],
          tags: ["Redis", "Lua", "Redisson", "Stream", "CacheClient"],
          metrics: [
            { label: "缓存吞吐提升", value: "+43%" },
            { label: "下单主线程响应", value: "毫秒级" },
            { label: "超卖控制", value: "0 容忍" },
          ],
          media: {
            type: "screens",
            label: "Concurrency Highlights / Snapshot",
            eyebrow: "更适合放截图而不是强行录视频",
            headline: "用链路拆解和关键场景截图证明高并发设计",
            description: "这个项目的价值在于缓存策略、秒杀原子性和异步可靠性。相比视频，放压测结果、Redis 关键流程图或接口链路截图更聚焦。",
            badges: ["Screenshot Ready", "Redis Intensive", "Concurrency Focus"],
            frames: [
              { title: "缓存击穿", description: "逻辑过期 + 互斥锁双检，命中过期时立即返回旧值并异步重建。" },
              { title: "秒杀链路", description: "Lua 原子校验 + Stream 异步下单，把库存校验和削峰拆分清楚。" },
              { title: "认证续期", description: "双拦截器将 token 保活与登录保护分层，接口职责更稳定。" },
            ],
            footer: {
              label: "建议素材",
              value: "压测截图 / Redis 数据结构截图 / 秒杀链路图",
            },
          },
          sections: {
            overview: {
              title: "项目定位与业务背景",
              content: "本项目面向高并发本地生活服务场景，核心不是页面效果，而是如何在高流量下稳定处理热点缓存、秒杀库存和用户会话。作品集详情页重点展示 Redis 模式封装、异步订单削峰与接口鉴权链路，帮助面试官快速判断你对高并发系统的真实理解深度。",
              proofPoints: [
                { title: "核心问题", description: "缓存穿透、缓存击穿、超卖、一人一单、会话续期这些问题都直接映射到高并发稳定性设计。" },
                { title: "展示方式", description: "这里更适合用关键场景截图、链路图与压测结果，而不是录制较长的交互视频。" },
                { title: "面试价值", description: "可直接展开到缓存一致性、消息可靠性、锁粒度选择、接口幂等性等高频后端问题。" },
              ],
            },
            architecture: {
              title: "核心链路与并发处理机制",
              description: "详情页集中展示三类最能说明工程能力的链路：热点缓存击穿保护、秒杀异步下单削峰，以及双拦截器身份认证链。这三部分共同构成系统在高流量场景下的稳定性基础。",
              diagrams: diagrams.hmDianping,
            },
            ownership: {
              title: "我的职责",
              items: [
                "**独立实现通用缓存组件**：封装 `CacheClient`，统一处理缓存空值、防击穿与逻辑过期重建，减少业务层重复实现。",
                "**设计秒杀核心链路**：基于 Lua 脚本实现库存预扣减与一人一单原子校验，并配合 Redisson / Stream 构建削峰下单流程。",
                "**实现异步订单消费闭环**：编写 `VoucherOrderHandler` 处理 Redis Stream 消费、异常补偿与 Pending List 重试。",
                "**拆分身份认证职责**：通过 `RefreshTokenInterceptor` 与 `LoginInterceptor` 分离会话续期和登录校验，让接口拦截职责更清晰。"
              ],
            },
            retrospective: {
              title: "项目反思与复盘",
              challenges: [
                {
                  problem: "**缓存命中但数据已过期时如何兼顾可用性与一致性**：直接阻塞重建会拖慢高并发请求，直接返回旧值又会带来短暂陈旧数据。",
                  solution: "采用逻辑过期 + 互斥锁双检策略，请求线程优先返回旧值，后台线程异步重建，在高并发场景下优先保证吞吐和可用性。"
                },
                {
                  problem: "**秒杀场景下主线程做太多事会导致 RT 抬高**：如果库存判断、下单落库和一致性逻辑都在入口线程完成，峰值阶段很容易抖动。",
                  solution: "把校验前移到 Lua，主线程只负责快速判定并返回 `orderId`，再通过 Redis Stream 将持久化压力移到异步消费线程。"
                },
                {
                  problem: "**会话续期和登录校验混在一个拦截器里会让职责变重**：公开接口也会被不必要地耦合进登录判断逻辑。",
                  solution: "拆成双拦截器链，一个负责 token 刷新和 UserHolder 注入，一个负责受保护接口鉴权，链路更清晰也更易维护。"
                }
              ],
            },
          },
        },
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
        detail: {
          tagline: "覆盖领用、维保、报废与治理分析的设备全生命周期管理系统",
          outcomes: ["生命周期闭环", "RBAC 权责清晰", "治理规则可追踪", "AI 只做辅助层"],
          tags: ["RBAC", "Workflow", "Governance", "Audit", "LLM Summary"],
          metrics: [
            { label: "角色层级", value: "4 级" },
            { label: "核心流程", value: "全生命周期" },
            { label: "审计策略", value: "追加写入" },
          ],
          media: {
            type: "static",
            label: "System Proof / Product Screens",
            eyebrow: "更适合放产品截图与流程面板",
            headline: "用产品界面和流程节点证明系统治理能力",
            description: "这个项目不需要强行做演示视频。设备台账、工单流转、治理看板、报表摘要这些截图，比视频更能快速说明系统成熟度。",
            badges: ["Static Proof", "Workflow System", "Governance Ready"],
            frames: [
              { title: "设备台账", description: "体现多角色、多单位下的资产信息、状态和保管责任。" },
              { title: "维保闭环", description: "展示报修、派单、维修、复核到恢复或报废的流程状态推进。" },
              { title: "治理看板", description: "用风险规则、成本占比和闲置设备识别证明系统不只是 CRUD。" },
            ],
            footer: {
              label: "建议素材",
              value: "台账页 / 工单流转页 / 数据治理看板截图",
            },
          },
          sections: {
            overview: {
              title: "项目定位与业务背景",
              content: "该系统面向企业固定资产管理场景，重点不是单点功能，而是如何把设备从入库、领用、维保到报废的全过程组织成有权限边界、有状态约束、有审计记录的闭环系统。详情页会把展示重心放在生命周期流程、治理规则和角色边界上，突出你对“业务系统”而非“单纯后台接口”的理解。",
              proofPoints: [
                { title: "系统属性", description: "它是一个具备角色边界、状态流转和审计要求的业务系统，而不是单表 CRUD 项目。" },
                { title: "设计重点", description: "强调 RBAC、流程事务性、数据治理和产品可用性，AI 只作为辅助摘要与报告生成能力出现。" },
                { title: "展示形式", description: "优先放关键页面截图和流程图，让招聘方先看到业务闭环，再下钻实现细节。" },
              ],
            },
            architecture: {
              title: "生命周期流程与治理结构",
              description: "本页展示两条最能体现系统价值的核心图：物理 E-R 关系设计与维保闭环时序。前者解释数据实体和归属关系，后者解释真实业务流如何在角色之间推进。",
              diagrams: diagrams.equipmentManagement,
            },
            ownership: {
              title: "我的职责",
              items: [
                "**独立设计并实现业务闭环**：围绕固定资产管理要求，完成设备、领用、维保、调拨、报废等核心模块设计与落地。",
                "**实现多级 RBAC 与单位隔离**：在拦截器与业务层建立角色和 `unit_code` 双重约束，控制跨单位访问边界。",
                "**推动治理能力从规则到通知闭环**：设计高频故障、成本异常、无保管人等规则筛查，并把结果推送到消息中心。",
                "**接入 AI 作为辅助分析层**：使用 LLM 生成月度报告草稿和单设备生命周期摘要，但不让 AI 侵入核心事务流程。"
              ],
            },
            retrospective: {
              title: "项目反思与复盘",
              challenges: [
                {
                  problem: "**设备状态流转与保管责任切换容易出现不一致**：例如领用审批通过后设备状态变化了，但保管人或记录未同步。",
                  solution: "把状态校验、记录写入和责任人变更统一纳入事务边界，通过声明式事务和状态前置判断保证原子性。"
                },
                {
                  problem: "**只做台账和工单会让系统停留在记录层**：缺少治理视角时，管理系统难以体现真正的业务价值。",
                  solution: "增加规则驱动的数据治理模块，把高频故障、维修成本偏高和闲置卡片等风险主动识别出来，让系统从“记事”升级为“发现问题”。"
                },
                {
                  problem: "**AI 能力如果直接介入业务判定会破坏系统确定性**：尤其在资产处置或权限边界场景中，不能让模型决定事务结果。",
                  solution: "把 AI 限定在报告生成和摘要提炼层，核心流程仍然由确定性规则、事务和权限模型驱动。"
                }
              ],
            },
          },
        },
      },
      {
        id: "personal-crm",
        name: "Personal CRM 智能联系人管理平台",
        subtitle: "面向个人关系维护、事项提醒与受控 Contact Agent 的产品化全栈 CRM 系统",
        summary:
          "将联系人、互动记录、提醒事项、移动端看板和智能助手整合为一个可部署的个人 CRM 产品，用真实业务闭环证明全栈交付能力。",
        highlights: [
          "**产品化业务闭环**：覆盖注册登录、联系人管理、详情记录、事项提醒、黑名单与设置等完整 CRM 使用路径。",
          "**受控 Contact Agent**：将智能助手限制在草稿生成、上下文解释和确认后写入流程中，避免模型直接越权修改核心数据。",
          "**跨端体验与交付**：同时整理桌面看板、移动端看板和助手页面，证明系统不是停留在后端接口层。",
        ],
        techStack: ["Vue 3", "Spring Boot", "MySQL", "Redis", "JWT", "Agent", "Email", "Responsive UI"],
        diagrams: diagrams.personalCrm,
        detail: {
          tagline: "围绕关系维护、提醒闭环、移动端适配和受控智能助手构建的产品化全栈 CRM 平台",
          outcomes: ["已完成产品闭环", "支持移动端适配", "具备 Agent 助手", "具备部署交付证据"],
          tags: ["Vue 3", "Spring Boot", "MySQL", "Redis", "Contact Agent"],
          liveUrl: { label: "项目上线地址", value: "crm.weiqiang.me", href: "https://crm.weiqiang.me" },
          metrics: [
            { label: "核心模块", value: "8+" },
            { label: "跨端页面", value: "Desktop + Mobile" },
            { label: "Agent 写入", value: "确认后执行" },
          ],
          media: {
            type: "screens",
            layout: "stacked",
            label: "Personal CRM / Product Proof",
            eyebrow: "真实产品截图证明",
            headline: "从看板、联系人详情到智能助手的完整 CRM 使用链路",
            description: "媒体区使用 Personal CRM 已交付页面截图，突出产品闭环、跨端体验和受控 Agent 能力。",
            badges: ["Real Screens", "Full-stack Product", "Mobile Ready"],
            screens: [
              { title: "看板总览", description: "集中展示联系人、提醒和近期互动，帮助用户快速进入关系维护状态。", src: personalCrmDashboardScreen },
              { title: "联系人详情", description: "承载联系人画像、互动记录和后续事项，是 CRM 业务闭环的核心页面。", src: personalCrmContactDetailScreen },
              { title: "智能助手", description: "围绕联系人上下文生成建议，并通过确认流程控制写操作边界。", src: personalCrmAssistantScreen },
            ],
            frames: [
              { title: "看板总览", description: "集中展示联系人、提醒和近期互动，帮助用户快速进入关系维护状态。" },
              { title: "联系人详情", description: "承载联系人画像、互动记录和后续事项，是 CRM 业务闭环的核心页面。" },
              { title: "智能助手", description: "围绕联系人上下文生成建议，并通过确认流程控制写操作边界。" },
            ],
            footer: {
              label: "Evidence",
              value: "Dashboard / Contact detail / Assistant / Mobile dashboard screenshots",
            },
          },
          sections: {
            overview: {
              title: "项目定位与业务场景",
              content: "Personal CRM 面向个人关系维护场景，将联系人档案、互动记录、提醒事项、移动端看板和智能助手组织成一个可部署的全栈产品。作品集详情页重点展示它的产品完整度、账号安全、跨端体验和受控 Agent 写操作边界。",
              proofPoints: [
                { title: "产品闭环", description: "从注册登录到联系人管理、事项提醒、黑名单和设置页面，覆盖真实 CRM 使用链路。" },
                { title: "Agent 边界", description: "智能助手用于生成草稿和解释上下文，真正写入必须经过用户确认和后端校验。" },
                { title: "交付证据", description: "桌面与移动端截图证明系统已经具备产品化界面，而不是只有接口或概念图。" },
              ],
            },
            architecture: {
              title: "系统架构与 Agent 控制边界",
              description: "架构图展示 Vue 前端、Spring Boot API、MySQL、Redis、邮件、天气服务和部署边界；时序图说明 Contact Agent 如何通过确认预览完成受控写操作。",
              diagrams: diagrams.personalCrm,
            },
            productProof: {
              title: "产品截图与交付证明",
              description: "以下截图来自 Personal CRM 已有 artifacts，覆盖桌面看板、联系人详情、智能助手和移动端看板。",
              screens: [
                { title: "Personal CRM 看板页", description: "总览联系人、提醒和近期互动状态。", src: personalCrmDashboardScreen },
                { title: "联系人详情页", description: "呈现联系人资料、互动记录和关系维护上下文。", src: personalCrmContactDetailScreen },
                { title: "智能助手页", description: "围绕联系人上下文提供建议和可确认的操作草稿。", src: personalCrmAssistantScreen },
                { title: "移动端看板首页", description: "验证核心 CRM 能力在移动端仍可访问和阅读。", src: personalCrmMobileDashboardScreen, fit: "contain" },
              ],
            },
            ownership: {
              title: "我的职责",
              items: [
                "**搭建全栈产品闭环**：围绕联系人、提醒、黑名单、设置和账号体系完成端到端功能组织。",
                "**设计受控 Agent 写入边界**：将 AI 输出限制为可确认草稿，关键写操作交由后端鉴权和校验执行。",
                "**完成跨端体验整理**：让桌面看板、详情页和移动端页面保持一致的信息层级与可用性。",
                "**沉淀作品集展示证据**：将真实截图、架构图和职责复盘整理为可面试展开的项目案例。",
              ],
            },
            retrospective: {
              title: "技术复盘",
              challenges: [
                {
                  problem: "**个人 CRM 容易退化成普通 CRUD。** 如果只展示联系人列表，无法证明产品价值。",
                  solution: "我围绕关系维护闭环组织页面和数据，将提醒、互动记录、黑名单和助手能力串成完整使用场景。",
                },
                {
                  problem: "**让 Agent 直接修改联系人数据存在越权和误写风险。**",
                  solution: "我把 Agent 放在草稿和建议层，用户确认后才通过后端 API 执行写入，并保留鉴权与参数校验。",
                },
                {
                  problem: "**全栈项目如果缺少真实界面证据，很难让访客判断完成度。**",
                  solution: "我将桌面和移动端关键截图纳入详情页，使系统能力能够被直接检查。",
                },
              ],
            },
          },
        },
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
      placeholder: "询问 AI 智能客服 Agent、高并发交易平台、RAG...",
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
        "我可以为你介绍我的后端与 AI 架构。对于「餐饮场景 AI 智能客服 Agent 平台」，我基于 Spring AI 级联 Advisor 链（含防循环拦截）重构智能 Agent，集成 RuleBased 多步任务编排、Pgvector 混合 RAG 与长期记忆系统，欢迎针对 Advisor 链路或 Reranker 精排提问。",
        "「高并发本地生活交易平台」的核心在于 Redis 高并发实战：我封装了通用 CacheClient 锁双检逻辑过期防击穿方案，设计 Lua 脚本原子预扣减结合分布式锁防超卖，并通过 Redis Stream 与 Pending List 构建可靠异步下单链路。",
        "「餐饮场景 AI 智能客服 Agent 平台」的 AI 模块采用三层记忆：基于 Map 的 Working 内存、Redis 会话记忆（2h TTL）与 PostgreSQL 长期事实表。除 `@Async` 驱动 LLM 自适应提取事实外，还结合本地成功工具响应解析器实现强一致性关键事实持久化。",
        "「Personal CRM 智能联系人管理平台」展示的是产品化全栈交付能力：我把联系人管理、互动记录、事项提醒、账号安全、移动端适配和受控 Contact Agent 组织成完整业务闭环。Agent 只生成可确认的操作草稿，真正写入仍经过用户确认和后端校验。",
      ],
    },
    projectDetail: {
      backBtn: "返回首页",
      metricsTitle: "核心指标 / KPIs",
      techHighlights: "技术亮点",
      demoVideo: "媒体演示",
      demoPlaceholder: "[ 演示多媒体播放占位 ]",
      videoPlayTip: "交互式系统演示录像",
      viewCaseStudy: "查看项目详情",
      viewCaseStudyAction: "点击查看项目详情",
      focusProject: "设为主卡",
      focusProjectAction: "点击切换为主卡",
      focusHint: "点击卡片切换为主卡，再查看完整项目说明与亮点。",
      prevProject: "查看上一个项目",
      nextProject: "查看下一个项目",
      challengeLabel: "挑战",
      solutionLabel: "解决方案"
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
        name: "AI Customer Service Agent Platform",
        subtitle: "A multi-turn task-execution system for order inquiries, cancellation confirmation, and long-term user memory capture",
        summary:
          "An explainable AI Agent for food-delivery customer service that unifies order lookup, cancellation, dish recommendation, and user-preference capture into one natural-language service loop.",
        highlights: [
          "**Advisor Chain runtime**: Organizes multi-intent recognition, tool filtering, confirmation checkpoints, and safety guardrails into one coherent Spring AI Agent pipeline.",
          "**Multi-step orchestration**: Supports chained flows such as `lookup -> slot injection -> confirmation -> execution` for high-risk customer-service actions.",
          "**Hybrid RAG plus three-layer memory**: Combines Pgvector retrieval, session memory, durable user facts, and async persistence to balance relevance with reliability."
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
        detail: {
          tagline: "A Spring AI-powered customer-service Agent that turns order inquiries, recommendations, cancellations, and memory capture into one explainable service loop.",
          outcomes: ["Deployed and demo-ready", "Multi-turn dialogue", "Multi-step execution", "Human confirmation loop"],
          tags: ["Spring AI", "Advisor Chain", "Hybrid RAG", "WebSocket", "MCP"],
          metrics: [
            { label: "FAQ Block Rate", value: "90%+" },
            { label: "Avg Latency", value: "<500ms" },
            { label: "Fact Consistency", value: "100%" }
          ],
          media: {
            type: "video",
            label: "Agent Demo / Interactive Flow",
            eyebrow: "Scripted mobile walkthrough in the hero",
            headline: "A complete customer-service loop from natural language to confirmed execution",
            description: "The shared media shell still behaves like a video slot, but the hero now uses a scripted 6-step mobile walkthrough so reviewers can understand the Agent loop on first sight.",
            badges: ["Video Ready", "Confirmation Loop", "Multi-step Agent"],
            demoScreens: [
              {
                stepLabel: "Recommend",
                title: "AI dish recommendation under constraints",
                description: "The user asks for light, diet-friendly dishes within a 50 RMB budget, and the Agent turns that request into a structured recommendation list.",
                src: skyTakeoutAiRecommendationScreen,
              },
              {
                stepLabel: "Choose",
                title: "Bundle suggestion and user selection",
                description: "Instead of listing dishes only, the Agent proposes budget-safe combinations and total prices, helping the user move from exploration to a concrete order choice.",
                src: skyTakeoutMenuSelectionScreen,
              },
              {
                stepLabel: "Add to cart",
                title: "Cart write-back and result confirmation",
                description: "Once the user confirms the combo, the Agent resolves the dishes, adds them to the cart, and reports the itemized result plus remaining budget back to the UI.",
                src: skyTakeoutCartConfirmationScreen,
              },
              {
                stepLabel: "Confirm",
                title: "Human confirmation before cancellation",
                description: "When the user asks to cancel, the Agent first disambiguates the intent and then issues an explicit confirmation checkpoint before touching the latest order.",
                src: skyTakeoutCancelConfirmationScreen,
              },
              {
                stepLabel: "Done",
                title: "Cancellation result and refund guidance",
                description: "After confirmation, the Agent returns the order number, amount, status, and refund path, completing the full loop from lookup to execution and post-action feedback.",
                src: skyTakeoutCancelSuccessScreen,
              },
              {
                stepLabel: "Memory",
                title: "Long-term memory capture and editable profile",
                description: "Once the service flow finishes, the Agent writes flavor preference, diet goals, and the operational summary into the user-memory screen so future recommendations and support turns can reuse those facts.",
                src: skyTakeoutUserMemoryScreen,
              },

            ],
            frames: [
              { title: "User Request", description: "The user asks for lookup, cancellation, refund, or another service action in natural language." },
              { title: "Agent Planning", description: "Intent recognition, tool filtering, context loading, and task planning are chained together." },
              { title: "Confirmed Execution", description: "High-risk actions pause for human confirmation before resuming execution." },
            ],
            footer: {
              label: "Walkthrough focus",
              value: "Recommendation / cart write-back / cancellation / memory capture",
            },
          },
          sections: {
            overview: {
              title: "Project Positioning & Business Context",
              content: "In food delivery services, transaction operations such as refunds, order cancellations, and address modifications consume massive customer service resources, often leading to customer complaints due to delayed manual responses. This project decouples customer service into an independent `sky-ai` microservice (driven by Spring AI), introducing multi-intent recognition and cascading task orchestration. It allows users to easily execute complex inquiries and high-risk operations via natural language. This page presents its core architectural workflows and execution paths."
              ,
              proofPoints: [
                { title: "Value Proposition", description: "It upgrades rigid menu-style service operations into an explainable natural-language customer-service Agent." },
                { title: "System Boundary", description: "The focus is task-oriented service flows such as lookup, cancellation, refunds, recommendations, and FAQ handling rather than open-ended chat." },
                { title: "What This Page Proves", description: "The page emphasizes orchestration, human confirmation, hybrid RAG, and safety engineering rather than just model integration." },
              ]
            },
            architecture: {
              title: "Architecture & Workflows",
              description: "The system is built on a cascading Advisor Chain pipeline pattern and driven by a central coordinator (TaskOrchestratorService) to bind multi-step parameters. A Human-in-the-Loop mechanism is introduced for transaction safety. The diagrams below show the layered architecture, the end-to-end workflow, and the lookup-driven sequence diagram:",
              diagrams: diagrams.skyTakeoutDetail
            },
            productProof: {
              title: "Product Screens & Interaction Proof",
              description: "That visual proof chain has been promoted into the hero walkthrough so the same screenshots do not need to be repeated lower on the page.",
              screens: [],
            },
            ownership: {
              title: "My Ownership",
              items: [
                "**Independent Service Refactoring & AI Integration**: Architected and implemented the `sky-ai` service using Spring AI, decoupling customer service logic from the core `sky-server` engine.",
                "**Cascading Advisor Chain**: Built a 6-layer pipeline including intent matching, context loading, RAG, and a custom `SafeToolCallAdvisor` to prevent infinite tool loops and enforce safety boundaries.",
                "**Multi-step Task Orchestration**: Developed `RuleBasedTaskPlanner` to split queries into steps and implemented slot placeholder bindings to seamlessly link queries with sequential operations.",
                "**Human-in-the-Loop Safe Guardrails**: Designed the `confirmation` WebSocket frame protocol and server-side state suspension to pause high-risk actions until explicit user confirmation is received.",
                "**Dual-Channel Memory Persistence**: Combines `@Async` background LLM factual synthesis with a deterministic local tool response parser to guarantee robust, hallucination-free long-term memory updates."
              ]
            },
            retrospective: {
              title: "Project Retrospective",
              challenges: [
                {
                  problem: "**Infinite Tool Loops and Token Waste**: Under ambiguous intents or missing arguments, LLMs can repeatedly invoke lookup tools, stalling responses and wasting tokens.",
                  solution: "Authored `SafeToolCallAdvisor` which monitors trace execution signatures; it intercepts calls exceeding 4 rounds or containing identical signatures, returning safe fallbacks."
                },
                {
                  problem: "**Financial Vulnerability of Auto-Executing Transactions**: Relying purely on AI to perform refunds or cancellations poses severe risks due to potential hallucinations or malicious user prompts.",
                  solution: "Implemented Human-in-the-Loop guardrails. When high-risk intents are detected, the server halts execution, caches session context, and pushes a confirmation frame to the client. The operation only resumes once the user approves the action on the UI."
                },
                {
                  problem: "**Memory Inconsistencies and Hallucinations**: Relying solely on LLMs to extract conversation facts can write false statements (e.g., summarizing an unpaid order query as a successful refund).",
                  solution: "Deployed a dual-channel memory writer. Critical operations (e.g., cancellations, refunds) are parsed from direct tool SUCCESS return values for deterministic writes, while fuzzy user traits are extracted asynchronously by LLMs with correction and forget semantics."
                }
              ]
            }
          }
        }
      },
      {
        id: "hm-dianping",
        name: "High-Concurrency Local Commerce Platform",
        subtitle: "A Redis-centered backend system for cache governance, oversell prevention, and async ordering under burst traffic",
        summary:
          "A high-concurrency backend project for local-commerce transactions, built around Redis cache governance, Lua-based atomic validation, async peak shaving, and layered authentication.",
        highlights: [
          "**Generic CacheClient Utility**: Encapsulates null-value caching for penetration and logical-expiry plus mutex double-checks for cache breakdown. Stale values are served immediately during async rebuilds, improving concurrent throughput by 43%.",
          "**Atomic flash-sale validation**: Uses one Lua script to handle stock pre-deduction and one-user-one-order checks, with `Redisson` distributed locks as a clustered safety fallback against overselling.",
          "**Async peak shaving via Redis Stream**: The request thread returns `orderId` quickly and shifts persistence pressure into `stream.orders`, while the Pending List handles retries for eventual consistency.",
          "**Layered authentication chain**: Separates token renewal from protected-route enforcement with `RefreshTokenInterceptor` and `LoginInterceptor`, keeping the request path easier to reason about."
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"],
        diagrams: diagrams.hmDianping,
        detail: {
          tagline: "A high-concurrency local-commerce system centered on cache governance, flash-sale safety, async ordering, and layered authentication.",
          outcomes: ["Explainable cache strategy", "Replayable seckill flow", "Async peak shaving loop", "Layered auth chain"],
          tags: ["Redis", "Lua", "Redisson", "Stream", "CacheClient"],
          metrics: [
            { label: "Cache Throughput", value: "+43%" },
            { label: "Main-Thread Response", value: "ms-level" },
            { label: "Oversell Tolerance", value: "Zero" },
          ],
          media: {
            type: "screens",
            label: "Concurrency Highlights / Snapshot",
            eyebrow: "This project fits screenshots better than forcing a video",
            headline: "Use key snapshots and flow breakdowns to prove concurrency design",
            description: "The strongest evidence here is caching behavior, seckill atomics, and async reliability. Screenshots of pressure results, Redis flows, or request paths communicate that better than a long demo video.",
            badges: ["Screenshot Ready", "Redis Intensive", "Concurrency Focus"],
            frames: [
              { title: "Cache Breakdown", description: "Logical expiry plus mutex-based double-check returns stale data first and rebuilds asynchronously." },
              { title: "Seckill Path", description: "Lua atomics and Redis Stream split stock validation from order persistence." },
              { title: "Auth Renewal", description: "The dual-interceptor chain cleanly separates token refresh from protected-route enforcement." },
            ],
            footer: {
              label: "Suggested asset",
              value: "Pressure-test screenshots / Redis structures / seckill flow diagrams",
            },
          },
          sections: {
            overview: {
              title: "Project Positioning & Business Context",
              content: "This project targets high-concurrency local-life service scenarios. The real value is not the UI surface but how the system survives cache pressure, flash-sale contention, and session traffic. The detail page focuses on Redis pattern design, async order peak shaving, and authentication flow clarity so interviewers can quickly judge backend depth.",
              proofPoints: [
                { title: "Core Pressure", description: "Cache penetration, cache breakdown, overselling, one-user-one-order, and session renewal all map directly to stability under burst traffic." },
                { title: "Presentation Style", description: "This case is better served by key snapshots, pressure-test evidence, and diagrams than by a long interaction video." },
                { title: "Interview Value", description: "It naturally expands into consistency, reliability, lock granularity, idempotency, and queue tradeoff discussions." },
              ],
            },
            architecture: {
              title: "Core Flows & Concurrency Handling",
              description: "The page focuses on three flows that best demonstrate backend judgment: hotspot cache protection, flash-sale async ordering, and the dual-interceptor authentication chain. Together they show the system's stability foundation under load.",
              diagrams: diagrams.hmDianping,
            },
            ownership: {
              title: "My Ownership",
              items: [
                "**Built a reusable cache component**: Implemented `CacheClient` to unify null-value caching, logical expiry, and cache-rebuild behavior across business calls.",
                "**Designed the seckill critical path**: Used Lua for atomic stock pre-check and one-user-one-order constraints, then paired it with Redisson and Redis Stream for safe ordering under burst traffic.",
                "**Implemented the async order-consumption loop**: Wrote `VoucherOrderHandler` for Redis Stream consumption, failure recovery, and Pending List retries.",
                "**Separated auth responsibilities**: Split token renewal and login enforcement into `RefreshTokenInterceptor` and `LoginInterceptor` to keep the request chain easier to reason about."
              ],
            },
            retrospective: {
              title: "Project Retrospective",
              challenges: [
                {
                  problem: "**How do you balance availability and freshness when cache data is expired but still present?** Blocking callers for rebuild hurts latency, while serving stale data risks temporary inconsistency.",
                  solution: "I adopted logical expiry with a mutex-based double-check flow. Request threads return stale values first while a background worker rebuilds the cache, prioritizing throughput and availability under high concurrency."
                },
                {
                  problem: "**Doing too much in the seckill request thread raises response times.** If stock validation, order writes, and consistency work all happen inline, the peak path becomes fragile.",
                  solution: "I moved validation into Lua, kept the request thread focused on fast success/failure decisions, and pushed persistence pressure into Redis Stream async consumers."
                },
                {
                  problem: "**Mixing session renewal with login checks makes interceptors heavy and leaky.** Public routes become unnecessarily tangled with auth enforcement.",
                  solution: "I split the chain into two interceptors: one for token refresh and UserHolder injection, and one for protected-route authorization."
                }
              ],
            },
          },
        },
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
        detail: {
          tagline: "A lifecycle-based equipment management system spanning claim, maintenance, governance, and reporting.",
          outcomes: ["Lifecycle closed loop", "Clear RBAC boundaries", "Traceable governance rules", "AI kept as an assist layer"],
          tags: ["RBAC", "Workflow", "Governance", "Audit", "LLM Summary"],
          metrics: [
            { label: "Role Levels", value: "4" },
            { label: "Core Flow", value: "Full lifecycle" },
            { label: "Audit Policy", value: "Append-only" },
          ],
          media: {
            type: "static",
            label: "System Proof / Product Screens",
            eyebrow: "Better presented with product screenshots and workflow panels",
            headline: "Use product screens and stateful workflows to prove system maturity",
            description: "This project does not need a forced video. Ledger pages, maintenance workflows, governance dashboards, and report summaries are stronger proof for product-facing backend work.",
            badges: ["Static Proof", "Workflow System", "Governance Ready"],
            frames: [
              { title: "Asset Ledger", description: "Shows role-aware asset records, status, ownership, and unit-level boundaries." },
              { title: "Maintenance Loop", description: "Captures report, assignment, repair, and review states leading to restore or scrap." },
              { title: "Governance Panel", description: "Highlights rules, cost-risk checks, and idle-asset signals beyond plain CRUD." },
            ],
            footer: {
              label: "Suggested asset",
              value: "Ledger screen / workflow screen / governance dashboard captures",
            },
          },
          sections: {
            overview: {
              title: "Project Positioning & Business Context",
              content: "This system targets enterprise fixed-asset management. The value lies not in isolated features but in organizing the full lifecycle of assets into a permission-aware, state-aware, and auditable business system. The detail page therefore emphasizes lifecycle flow, governance rules, and role boundaries rather than superficial interface depth.",
              proofPoints: [
                { title: "System Nature", description: "This is a business system with role boundaries, state transitions, and audit requirements rather than a simple CRUD project." },
                { title: "Design Emphasis", description: "RBAC, transaction-backed workflows, governance rules, and product usability matter more than flashy AI usage." },
                { title: "Presentation Style", description: "Key screens and flow diagrams help interviewers understand the business loop before diving into implementation details." },
              ],
            },
            architecture: {
              title: "Lifecycle Flow & Governance Structure",
              description: "This page focuses on two diagrams that best explain the system: the physical E-R model and the maintenance workflow sequence. Together they clarify both entity ownership and how the real process advances across roles.",
              diagrams: diagrams.equipmentManagement,
            },
            ownership: {
              title: "My Ownership",
              items: [
                "**Designed and implemented the business loop independently**: Built the core modules around asset registration, claiming, maintenance, transfer, and scrapping.",
                "**Implemented multi-level RBAC and unit isolation**: Enforced both role boundaries and `unit_code` scope checks across interceptors and service logic.",
                "**Turned governance from rules into action**: Added automated checks for frequent failures, cost anomalies, and ownerless assets, then pushed signals into a notification loop.",
                "**Integrated AI as an assistive analysis layer**: Used LLMs for monthly report drafting and lifecycle summaries without letting AI invade deterministic transaction paths."
              ],
            },
            retrospective: {
              title: "Project Retrospective",
              challenges: [
                {
                  problem: "**Asset state transitions and ownership handoffs can easily drift apart.** A claim may succeed while the responsible owner or workflow record is left inconsistent.",
                  solution: "I placed state validation, record writes, and ownership changes into the same transaction boundary so that lifecycle transitions stay atomic."
                },
                {
                  problem: "**A system limited to ledgers and tickets stays at the record-keeping layer.** Without a governance view, it is hard to show business value.",
                  solution: "I introduced rule-driven governance checks to proactively surface frequent-failure assets, maintenance-cost risks, and idle cards so the system can identify problems rather than just store them."
                },
                {
                  problem: "**Letting AI decide core business outcomes would weaken determinism.** Asset disposal and permission boundaries should never be model-led.",
                  solution: "I constrained AI to reporting and summarization while keeping the core workflow driven by deterministic rules, transactions, and permission models."
                }
              ],
            },
          },
        },
      },
      {
        id: "personal-crm",
        name: "Personal CRM Intelligent Contact Management Platform",
        subtitle: "A production-grade full-stack CRM for relationship maintenance, reminders, and a controlled Contact Agent",
        summary:
          "A deployable personal CRM product that connects contacts, interaction history, reminders, mobile dashboards, and an intelligent assistant into one practical workflow.",
        highlights: [
          "**Productized business loop**: Covers sign-up, login, contact management, detail records, reminders, blacklist handling, and settings as one complete CRM path.",
          "**Controlled Contact Agent**: Keeps the assistant in draft generation, context explanation, and confirmation-before-write flows instead of letting the model mutate core data directly.",
          "**Cross-device delivery proof**: Uses desktop dashboard, mobile dashboard, contact detail, and assistant screens to prove the project goes beyond backend APIs.",
        ],
        techStack: ["Vue 3", "Spring Boot", "MySQL", "Redis", "JWT", "Agent", "Email", "Responsive UI"],
        diagrams: diagrams.personalCrm,
        detail: {
          tagline: "A production-grade full-stack CRM built around relationship maintenance, reminder loops, mobile adaptation, and a controlled intelligent assistant.",
          outcomes: ["Complete product loop", "Mobile-ready", "Agent assistant", "Deployment evidence"],
          tags: ["Vue 3", "Spring Boot", "MySQL", "Redis", "Contact Agent"],
          liveUrl: { label: "Live URL", value: "crm.weiqiang.me", href: "https://crm.weiqiang.me" },
          metrics: [
            { label: "Core Modules", value: "8+" },
            { label: "Device Coverage", value: "Desktop + Mobile" },
            { label: "Agent Writes", value: "Confirm First" },
          ],
          media: {
            type: "screens",
            layout: "stacked",
            label: "Personal CRM / Product Proof",
            eyebrow: "Real product screenshots",
            headline: "A complete CRM path from dashboard and contact detail to assistant support",
            description: "The media area uses delivered Personal CRM screens to show the product loop, cross-device experience, and controlled Agent capability.",
            badges: ["Real Screens", "Full-stack Product", "Mobile Ready"],
            screens: [
              { title: "Dashboard Overview", description: "Summarizes contacts, reminders, and recent interactions so users can quickly resume relationship work.", src: personalCrmDashboardScreen },
              { title: "Contact Detail", description: "Carries the contact profile, interaction history, and follow-up context at the center of the CRM loop.", src: personalCrmContactDetailScreen },
              { title: "Assistant", description: "Generates contact-aware suggestions while keeping write actions behind a confirmation step.", src: personalCrmAssistantScreen },
            ],
            frames: [
              { title: "Dashboard Overview", description: "Summarizes contacts, reminders, and recent interactions so users can quickly resume relationship work." },
              { title: "Contact Detail", description: "Carries the contact profile, interaction history, and follow-up context at the center of the CRM loop." },
              { title: "Assistant", description: "Generates contact-aware suggestions while keeping write actions behind a confirmation step." },
            ],
            footer: {
              label: "Evidence",
              value: "Dashboard / Contact detail / Assistant / Mobile dashboard screenshots",
            },
          },
          sections: {
            overview: {
              title: "Project Positioning & Business Context",
              content: "Personal CRM targets relationship-maintenance workflows and packages contact profiles, interaction history, reminders, mobile dashboards, and an intelligent assistant into one deployable full-stack product. The portfolio page emphasizes product completeness, account safety, cross-device usability, and the controlled boundary around Agent writes.",
              proofPoints: [
                { title: "Product Loop", description: "From sign-up and login to contacts, reminders, blacklist handling, and settings, the system covers a real CRM usage path." },
                { title: "Agent Boundary", description: "The assistant drafts suggestions and explains context; actual writes still require user confirmation and backend validation." },
                { title: "Delivery Evidence", description: "Desktop and mobile screenshots show a productized interface rather than only APIs or concept diagrams." },
              ],
            },
            architecture: {
              title: "System Architecture & Agent Control Boundary",
              description: "The diagrams show the Vue frontend, Spring Boot API, MySQL, Redis, email, weather service, and deployment boundary, plus the sequence for confirmation-based Contact Agent writes.",
              diagrams: diagrams.personalCrm,
            },
            productProof: {
              title: "Product Screens & Delivery Proof",
              description: "These screenshots come from the existing Personal CRM artifacts and cover the desktop dashboard, contact detail, assistant, and mobile dashboard.",
              screens: [
                { title: "Personal CRM Dashboard", description: "Summarizes contacts, reminders, and recent relationship-maintenance state.", src: personalCrmDashboardScreen },
                { title: "Contact Detail", description: "Shows contact data, interaction records, and relationship context.", src: personalCrmContactDetailScreen },
                { title: "Assistant", description: "Provides context-aware suggestions and confirmable operation drafts.", src: personalCrmAssistantScreen },
                { title: "Mobile Dashboard", description: "Verifies that core CRM capabilities remain usable on mobile screens.", src: personalCrmMobileDashboardScreen, fit: "contain" },
              ],
            },
            ownership: {
              title: "My Ownership",
              items: [
                "**Built the full-stack product loop**: Organized contacts, reminders, blacklist handling, settings, and account flows into an end-to-end CRM experience.",
                "**Designed the controlled Agent write boundary**: Kept AI output as confirmable drafts while backend auth and validation execute the final write.",
                "**Polished cross-device presentation**: Kept the desktop dashboard, detail pages, and mobile screens aligned around the same information hierarchy.",
                "**Turned product evidence into a portfolio case**: Prepared real screens, architecture diagrams, and retrospectives for interview discussion.",
              ],
            },
            retrospective: {
              title: "Project Retrospective",
              challenges: [
                {
                  problem: "**A personal CRM can easily look like ordinary CRUD.** A contact list alone does not prove product value.",
                  solution: "I organized the experience around a relationship-maintenance loop, connecting reminders, interaction records, blacklist handling, and assistant support into one workflow.",
                },
                {
                  problem: "**Letting an Agent directly mutate contact data creates overreach and wrong-write risk.**",
                  solution: "I kept the Agent in the draft and suggestion layer. Confirmed operations go through backend APIs with auth and parameter validation.",
                },
                {
                  problem: "**A full-stack project without real UI evidence is hard to evaluate.**",
                  solution: "I brought desktop and mobile screenshots into the detail page so the system can be inspected directly.",
                },
              ],
            },
          },
        },
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
      placeholder: "Ask about the AI Agent platform, the commerce platform, or RAG...",
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
        "I can walk you through my backend and AI architectures. For the 'AI Customer Service Agent Platform', I refactored the Agent around a cascading Spring AI Advisor Chain with loop-safety guards, RuleBased multi-step planning, Pgvector hybrid RAG, and a mixed long-term memory system. Feel free to ask about the Advisor pipeline or Reranker layer.",
        "For the 'High-Concurrency Local Commerce Platform', the core strengths lie in Redis-heavy backend design: a reusable CacheClient with logical-expiry double-check locks, Lua-based atomic flash-sale validation with Redisson fallback, and async ordering via Redis Stream plus Pending List recovery.",
        "In the 'AI Customer Service Agent Platform', memory is split into three layers: Java map working context, Redis session memory (2h TTL), and PostgreSQL long-term facts. Factual updates combine `@Async` LLM extraction with deterministic local tool-result parsing to guarantee consistency.",
        "The Personal CRM project demonstrates full-stack product delivery: contact management, interaction history, reminders, account safety, mobile adaptation, and a controlled Contact Agent are organized into one usable workflow. The Agent only drafts confirmable operations; actual writes still go through user confirmation and backend validation.",
      ],
    },
    projectDetail: {
      backBtn: "Back to Home",
      metricsTitle: "Key Indicators / KPIs",
      techHighlights: "Technical Highlights",
      demoVideo: "Media Demo",
      demoPlaceholder: "[ Interactive Demo Media Placeholder ]",
      videoPlayTip: "Interactive System Demo Video",
      viewCaseStudy: "View Project Details",
      viewCaseStudyAction: "Open project details",
      focusProject: "Focus Card",
      focusProjectAction: "Click to focus this card",
      focusHint: "Click the card to bring it into focus, then view the full project summary and highlights.",
      prevProject: "Previous project",
      nextProject: "Next project",
      challengeLabel: "Challenge",
      solutionLabel: "Solution"
    },
    notFound: {
      title: "Route not found",
      action: "Back to portfolio",
    },
  },
};



