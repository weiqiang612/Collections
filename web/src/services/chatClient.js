import { messages } from "../data/i18n";

async function sendMockMessage(message, sessionId, locale, onDelta) {
  const agentCopy = messages[locale]?.agent ?? messages["zh-CN"].agent;
  const normalized = message.toLowerCase();
  const reply = normalized.includes("点评") || normalized.includes("redis")
    ? agentCopy.mockReplies[1]
    : normalized.includes("api") || normalized.includes("rag")
      ? agentCopy.mockReplies[2]
      : agentCopy.mockReplies[0];

  const tokens = locale === "zh-CN" ? Array.from(reply) : reply.split(" ");

  for (const token of tokens) {
    await new Promise((resolve) => window.setTimeout(resolve, 36));
    onDelta(locale === "zh-CN" ? token : `${token} `);
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
  return Boolean(apiBaseUrl);
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
