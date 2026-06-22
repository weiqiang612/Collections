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
  skyTakeoutDetail: [
    {
      title: "整体业务流程图 / Overall Flowchart",
      code: `graph TD
    classDef startEnd fill:#ebf5fb,stroke:#2e86c1,stroke-width:2px;
    classDef process fill:#f4f6f7,stroke:#7f8c8d,stroke-width:1px;
    classDef decision fill:#fef9e7,stroke:#f1c40f,stroke-width:1px;
    classDef storage fill:#eafaf1,stroke:#2ecc71,stroke-width:1px;
    classDef alert fill:#fdedec,stroke:#e74c3c,stroke-width:1px;

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

    CheckStepDone -- 是 --> StepDoneFrame[推送 step_done 帧并更新级联插槽参数]
    StepDoneFrame --> StepLoop
    class StepDoneFrame process;

    CheckStepDone -- 否 --> SendDoneFrame[推送 done 或 plan_complete 帧]
    class SendDoneFrame process;
    
    SendDoneFrame --> AsyncMemory[触发 @Async 异步记忆写入服务]
    class AsyncMemory process;
    
    subgraph "异步记忆持久化 (MemoryWriterService)"
        AsyncMemory --> ToolPersist[A. 本地工具响应强一致解析<br/>自动提取成功退款/取消订单事实]
        AsyncMemory --> LLMPersist[B. LLM 语义事实提取<br/>分析 User 语句进行事实修正/遗忘]
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
        name: "苍穹外卖",
        subtitle: "支持自然语言下单、多步任务编排与确认式执行的外卖智能客服 Agent",
        summary:
          "将传统菜单操作升级为自然语言交互的 AI 外卖助手，能够处理订单查询、取消等复杂客户服务场景。",
        highlights: [
          "**Advisor Chain 执行链路**：围绕多意图识别、工具筛选与安全兜底组织完整的 Agent 执行流程。",
          "**多步任务编排**：支持“查询 → 插槽注入 → 确认 → 执行”的级联工作流，能处理取消订单等复杂场景。",
          "**Hybrid Memory**：结合会话记忆、长期用户事实与异步写入，兼顾上下文连续性与关键事实一致性。",
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
        detail: {
          tagline: "基于 Spring AI 驱动的餐饮外卖智能客服 Agent，将客户订单及咨询交付全链路自动化",
          tags: ["Spring AI", "Advisor Chain", "Hybrid RAG", "WebSocket", "MCP"],
          metrics: [
            { label: "FAQ 拦截率", value: "90%+" },
            { label: "平均响应时延", value: "<500ms" },
            { label: "关键事实一致性", value: "100%" }
          ],
          sections: {
            demo: {
              title: "演示背景与业务场景",
              content: "在餐饮外卖服务中，退款、取消订单、修改地址等敏感交易操作占用了大量人工客服精力，且容易因为人工响应不及时导致客诉。本项目将智能客服 Agent 独立为 `sky-ai` 微服务（基于 Spring AI 驱动），引入多意图识别与级联任务编排，使用户能够通过自然语言交互轻松完成复杂查询及高风险操作。本页展示了其底层核心架构流程及在多步高风险事务中的具体执行路径。"
            },
            architecture: {
              title: "系统架构与核心工作流",
              description: "系统围绕 Advisor Chain 管道拦截模式构建，并在编排中心（TaskOrchestratorService）的驱动下实现多步骤插槽绑定；针对资金安全设计了 Human-in-the-Loop 人工卡点机制，保障高风险交易的安全可控。下方为系统全景工作流图及检索驱动型订单取消时序图：",
              diagrams: diagrams.skyTakeoutDetail
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
    projectDetail: {
      backBtn: "返回首页",
      metricsTitle: "核心指标 / KPIs",
      techHighlights: "技术亮点",
      demoVideo: "媒体演示",
      demoPlaceholder: "[ 演示多媒体播放占位 ]",
      videoPlayTip: "交互式系统演示录像",
      viewCaseStudy: "查看项目详情"
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
        subtitle: "Food delivery customer-service Agent with natural-language ordering, multi-step planning, and confirmation-based execution",
        summary:
          "An AI delivery assistant that turns menu-style operations into natural-language interactions for order lookup, cancellation, and other customer-service workflows.",
        highlights: [
          "**Advisor Chain runtime**: Organizes multi-intent recognition, tool filtering, and safety guardrails into one coherent Agent pipeline.",
          "**Multi-step orchestration**: Supports chained flows such as `lookup -> slot injection -> confirmation -> execution` for high-risk order actions.",
          "**Hybrid memory**: Combines session memory, long-term user facts, and async persistence to balance continuity with reliability."
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"],
        diagrams: diagrams.skyTakeout,
        detail: {
          tagline: "Intelligent customer service Agent driven by Spring AI, automating the entire food delivery order and inquiry lifecycle.",
          tags: ["Spring AI", "Advisor Chain", "Hybrid RAG", "WebSocket", "MCP"],
          metrics: [
            { label: "FAQ Block Rate", value: "90%+" },
            { label: "Avg Latency", value: "<500ms" },
            { label: "Fact Consistency", value: "100%" }
          ],
          sections: {
            demo: {
              title: "Demo Context & Business Scenario",
              content: "In food delivery services, transaction operations such as refunds, order cancellations, and address modifications consume massive customer service resources, often leading to customer complaints due to delayed manual responses. This project decouples customer service into an independent `sky-ai` microservice (driven by Spring AI), introducing multi-intent recognition and cascading task orchestration. It allows users to easily execute complex inquiries and high-risk operations via natural language. This page presents its core architectural workflows and execution paths."
            },
            architecture: {
              title: "Architecture & Workflows",
              description: "The system is built on a cascading Advisor Chain pipeline pattern and driven by a central coordinator (TaskOrchestratorService) to bind multi-step parameters. A Human-in-the-Loop mechanism is introduced for transaction safety. Below are the comprehensive workflow flowchart and the lookup-driven sequence diagram:",
              diagrams: diagrams.skyTakeoutDetail
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
    projectDetail: {
      backBtn: "Back to Home",
      metricsTitle: "Key Indicators / KPIs",
      techHighlights: "Technical Highlights",
      demoVideo: "Media Demo",
      demoPlaceholder: "[ Interactive Demo Media Placeholder ]",
      videoPlayTip: "Interactive System Demo Video",
      viewCaseStudy: "View Project Details"
    },
    notFound: {
      title: "Route not found",
      action: "Back to portfolio",
    },
  },
};
