export const config = {
  runtime: "edge",
};

// Static context data matching Ethan's profile and projects in i18n.js
const CONTEXT_DATA = {
  "zh-CN": {
    name: "Ethan (围墙 / weiqiang)",
    role: "Java 后端开发工程师 / AI 工程实践者",
    contacts: {
      github: "https://github.com/weiqiang",
      email: "weiqiang0322@gmail.com"
    },
    summary: "专注高并发系统与 AI 工程实践 of Java 后端工程师。构建边界清晰、可靠性可衡量的后端系统，并用可检查的方式解释复杂架构。",
    methodology: [
      "1. 澄清压力：先看业务压力、流量形态、一致性要求和失败成本。",
      "2. 定义模型：把问题拆成有限状态、数据契约、队列、缓存和可观测接口。",
      "3. 落地路径：只在能降低真实风险的地方引入 Spring Boot、Redis、MySQL、消息队列和 AI 编排。",
      "4. 证明边界：用图、压测路径 and 代码级取舍说明系统在高负载下如何运转。"
    ],
    projects: [
      {
        id: "sky-takeout",
        name: "苍穹外卖 (Spring AI 智能 Agent)",
        subtitle: "基于 Spring AI 顾问链与三层记忆模型的外卖智能 Agent",
        details: [
          "双服务架构：sky-server 承载核心业务与订单状态机，sky-ai 基于 Spring AI 1.1.5 实现智能客服 Agent 并进行微服务级解耦。",
          "6 层顾问链（Advisor Chain）：模块化实现意图识别（13 类意图）、上下文注入、会话与长期记忆管理、FAQ RAG 检索以及动态工具过滤。",
          "三层记忆系统：Working 内存、Redis 会话记忆（2h TTL）与 PostgreSQL JPA 长期记忆，利用异步服务（@Async）通过 LLM 自动提取并合并事实。",
          "多维度工具注册：实现 17 个本地 @Tool 业务接口与 Model Context Protocol (MCP) 服务的 SSE 动态注册，支持 WebSocket 流式传输及人工确认安全机制。"
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"]
      },
      {
        id: "hm-dianping",
        name: "黑马点评 (Redis 高并发平台)",
        subtitle: "基于 Redis 的高并发本地生活服务平台",
        details: [
          "通用 CacheClient 封装：实现「缓存空值防穿透」与「逻辑过期 + 互斥锁防击穿」两套策略，通过泛型 + Function<ID, T> 回调解耦 DB 访问；逻辑过期方案在异步重建期间返回旧数据，实测高并发吞吐量提升约 43%。",
          "秒杀原子化：seckill.lua 在单次 EVALSHA 内完成库存 DECR 与一人一单 SISMEMBER 校验，成功后写入 Redis Stream；主线程立即返回 orderId，异步 VoucherOrderHandler 消费 Stream 落库，Pending List + XACK 保障消息不丢。",
          "双拦截器认证链：RefreshTokenInterceptor（order=0）拦截所有请求并对持有有效 Token 的用户自动续期 30 min；LoginInterceptor（order=1）仅校验 UserHolder，两者职责清晰、互不侵入。",
          "多场景 Redis 实战：点赞榜 ZSet 按时间戳排序；关注共同好友 Set 求交集；Feed 流游标滚动分页；附近商铺 GEO GEOSEARCH；用户签到 BitMap 连续天数位运算统计；全局唯一 ID 时间戳拼接高位 + Redis INCR 低位。"
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"]
      }
    ]
  },
  "en-US": {
    name: "Ethan (weiqiang / 围墙)",
    role: "Java Backend Engineer / AI Engineering Practitioner",
    contacts: {
      github: "https://github.com/weiqiang",
      email: "weiqiang0322@gmail.com"
    },
    summary: "Java backend engineer focused on high-concurrency systems and AI-enabled engineering. Builds backend systems with clear boundaries, measurable reliability, and explanations that make complex architecture easier to inspect.",
    methodology: [
      "1. Clarify pressure: Start from the business pressure, traffic shape, consistency requirement, and failure cost.",
      "2. Define the model: Turn the problem into bounded states, data contracts, queues, caches, and obsolete interfaces.",
      "3. Engineer the path: Choose Spring Boot, Redis, MySQL, message queues, and AI orchestration only where they reduce real risk.",
      "4. Prove the edge cases: Use diagrams, stress paths, and code-level tradeoffs to explain how the system behaves under load."
    ],
    projects: [
      {
        id: "sky-takeout",
        name: "Sky Takeout (Spring AI Agent)",
        subtitle: "Intelligent Delivery Agent via Spring AI Advisor Chain & 3-Layer Memory",
        details: [
          "Decoupled Architecture: sky-server handles core delivery workflows and order state machine, while sky-ai (Spring AI 1.1.5) operates as an independent agent service.",
          "6-layer Advisor Chain: Engineered a modular chain for pre-intent classification (13 intent types), context injection, Redis session memory, FAQ RAG retrieval, and dynamic tool filtering.",
          "3-layer Memory System: Designed Working context, Redis Session (2h TTL), and PostgreSQL long-term facts with an async (@Async) LLM-powered background fact extraction service.",
          "Multi-dimensional Tool Calling: Registered 17 local @Tool business callbacks and SSE MCP servers (maps, payments, notifications) over WebSocket with human-in-the-loop confirmation."
        ],
        techStack: ["Spring Boot", "Spring AI", "Redis", "PostgreSQL", "MyBatis", "WebSocket", "MCP", "RAG"]
      },
      {
        id: "hm-dianping",
        name: "HM Dianping (Redis High Concurrency)",
        subtitle: "High-Concurrency Local Life Service Platform powered by Redis",
        details: [
          "Generic CacheClient Utility: Encapsulates null-value caching for penetration, and logical expiry + setnx mutex lock for breakdown via generics and Function<ID,T> callbacks decoupling the DB layer. Stale data is returned immediately during async rebuilds, improving throughput by 43%.",
          "Seckill Atomicity: A single EVALSHA call executes stock DECR and one-order-per-user SISMEMBER within a Lua script, then writes to Redis Stream. Main thread returns orderId instantly; VoucherOrderHandler single-thread consumer processes the DB write with Pending List + XACK.",
          "Dual-interceptor Auth Chain: RefreshTokenInterceptor (order=0) intercepts every request and auto-renews TTL on valid tokens; LoginInterceptor (order=1) only checks UserHolder for protected routes.",
          "Redis In Production: ZSet for leaderboard and feed scroll cursor; Set for mutual-follows; GEO + GEOSEARCH for nearby shop ranking; BitMap for sign-in streaks; unique ID generation with Redis INCR."
        ],
        techStack: ["Spring Boot", "Redis", "Lua", "MySQL", "Redisson", "MyBatis-Plus", "Hutool"]
      }
    ]
  }
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { message, sessionId, locale = "zh-CN", history = [] } = await req.json();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OpenRouter API Key not configured" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const normalizedLocale = ["zh-CN", "en-US"].includes(locale) ? locale : "zh-CN";
  const context = CONTEXT_DATA[normalizedLocale];

  // 1. Keyword-based deterministic source detection
  const sources = [];
  const queryText = (message + " " + history.map(h => h.content).join(" ")).toLowerCase();

  const matchesSkyTakeout = /外卖|takeout|spring ai|springai|agent|advisor|顾问|rag|memory|记忆|mcp|websocket/.test(queryText);
  const matchesHmDianping = /点评|dianping|redis|lua|秒杀|seckill|击穿|穿透|雪崩|缓存|lock|锁|setnx|stream|zset|geo|bitmap/.test(queryText);
  const matchesProfile = /简历|resume|联系|contact|邮箱|email|github|微信|wechat|ethan|围墙|weiqiang|方法论|methodology/.test(queryText);

  if (matchesSkyTakeout) {
    sources.push({
      title: normalizedLocale === "zh-CN" ? "苍穹外卖 (Spring AI 智能 Agent)" : "Sky Takeout (Spring AI Agent)",
      id: "sky-takeout",
      type: "project"
    });
  }
  if (matchesHmDianping) {
    sources.push({
      title: normalizedLocale === "zh-CN" ? "黑马点评 (Redis 高并发平台)" : "HM Dianping (Redis High Concurrency)",
      id: "hm-dianping",
      type: "project"
    });
  }
  if (matchesProfile || sources.length === 0) {
    sources.push({
      title: normalizedLocale === "zh-CN" ? "Ethan 个人档案" : "Ethan's Profile",
      id: "about",
      type: "profile"
    });
  }

  // 2. Build the System Prompt
  const systemPrompt = `
You are the AI Resume Assistant for ${context.name}. Your role is to answer questions professionally, showcasing Ethan's backend expertise in Java, High Concurrency, Redis, Spring AI, and RAG architectures.

Here is the authentic background context:
- Role & Focus: ${context.role}
- Summary: ${context.summary}
- Contacts: GitHub: ${context.contacts.github}, Email: ${context.contacts.email}
- Engineering Methodology:
${context.methodology.join("\n")}

Key Projects:
${context.projects.map(proj => `
### Project: ${proj.name} (${proj.subtitle})
- Tech Stack: ${proj.techStack.join(", ")}
- Highlights & Core Architecture Details:
${proj.details.map(d => `  * ${d}`).join("\n")}
`).join("\n")}

Guidelines:
1. Speak in a highly technical, confident, yet humble and precise tone, representing Ethan's work.
2. Use professional geek/programmer terminology. Keep formatting clean with standard markdown.
3. Keep answers focused, precise, and directly backed by the architectural facts provided. Do not hallucinate highlights or experiences not mentioned in the context.
4. Respond in the language matching the locale: ${normalizedLocale}. (If user asks in another language, adapt gracefully).
5. If the user asks general questions or off-topic questions, politely guide them back to Ethan's backend skills, project architectures, or contact details.
`;

  // 3. Prepare Chat messages including past history
  const apiMessages = [
    { role: "system", content: systemPrompt }
  ];

  history.forEach(item => {
    if (item.role === "user" || item.role === "assistant") {
      apiMessages.push({
        role: item.role,
        content: item.content
      });
    }
  });

  apiMessages.push({ role: "user", content: message });

  try {
    const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://weiqiang.me",
        "X-Title": "Ethan Portfolio",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const encoder = new TextEncoder();

    // Create ReadableStream utilizing browser/edge-native streaming
    const stream = new ReadableStream({
      async start(controller) {
        // Enqueue sources first
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.slice(6);
              if (dataStr === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(dataStr);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: content })}\n\n`));
                }
              } catch (e) {
                // Ignore incomplete JSON chunks
              }
            }
          }
        }

        // Process remaining buffer
        if (buffer) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr !== "[DONE]") {
              try {
                const parsed = JSON.parse(dataStr);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: content })}\n\n`));
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      }
    });

  } catch (error) {
    console.error("AI Chat edge error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
