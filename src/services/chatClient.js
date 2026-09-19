import { messages } from "../data/i18n";

async function sendMockMessage(message, sessionId, locale, onDelta) {
  const agentCopy = messages[locale]?.agent ?? messages["zh-CN"].agent;
  const normalized = message.toLowerCase();
  const reply = normalized.includes("crm") || normalized.includes("联系人") || normalized.includes("contact")
    ? agentCopy.mockReplies[3]
    : normalized.includes("点评") || normalized.includes("redis")
      ? agentCopy.mockReplies[1]
      : normalized.includes("api") || normalized.includes("rag")
        ? agentCopy.mockReplies[2]
        : agentCopy.mockReplies[0];

  // 模拟真实大模型 SSE 流输出特征：首包小字、突发大 Chunk (50~80字)、偶发网络抖动停顿
  let index = 0;
  const totalLength = reply.length;
  
  // 第一阶段：首包轻量响应（约 6-10 字）
  const firstChunkSize = Math.min(8, totalLength);
  onDelta(reply.slice(0, firstChunkSize));
  index += firstChunkSize;
  await new Promise((resolve) => window.setTimeout(resolve, 80));

  // 第二阶段：突发大 Chunk（模拟 LLM 推理吞吐高潮，一次性输出 50~90 字的大包）
  if (index < totalLength) {
    const burstSize = Math.min(70, totalLength - index);
    onDelta(reply.slice(index, index + burstSize));
    index += burstSize;
    // 模拟网络传输与模型生成微停顿
    await new Promise((resolve) => window.setTimeout(resolve, 160));
  }

  // 第三阶段：余下内容分段吐出（每块 15~30 字）
  while (index < totalLength) {
    const nextSize = Math.min(25, totalLength - index);
    onDelta(reply.slice(index, index + nextSize));
    index += nextSize;
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  return {
    sessionId,
    sources: [
      { title: agentCopy.sources.mockKnowledge, type: "mock", score: 1 },
      { title: agentCopy.sources.productDirection, type: "project-guide", score: 0.92 },
    ],
  };
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function isApiConfigured() {
  const isDeployed = typeof window !== "undefined" && 
    window.location.hostname !== "localhost" && 
    window.location.hostname !== "127.0.0.1" &&
    !window.location.hostname.startsWith("192.168.");
  return isDeployed || Boolean(apiBaseUrl);
}

export async function sendMessage(message, sessionId, locale, onDelta, history = []) {
  if (!isApiConfigured()) {
    return sendMockMessage(message, sessionId, locale, onDelta);
  }

  // Construct target URL. If VITE_API_BASE_URL is relative '/' or similar, call relative path directly.
  const targetUrl = apiBaseUrl.startsWith("http")
    ? `${apiBaseUrl}/api/chat`
    : `/api/chat`;

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message, locale, history }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sources = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep remaining unfinished line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.sources) {
              sources = parsed.sources;
            } else if (parsed.delta) {
              onDelta(parsed.delta);
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            // Ignore JSON parsing issues of partial buffers
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return {
    sessionId,
    sources,
  };
}
