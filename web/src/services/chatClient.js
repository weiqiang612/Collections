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

export async function sendMessage(message, sessionId, locale, onDelta) {
  if (!isApiConfigured()) {
    return sendMockMessage(message, sessionId, locale, onDelta);
  }

  const response = await fetch(`${apiBaseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message, locale }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const data = await response.json();
  onDelta(data.answer ?? "");
  return {
    sessionId,
    sources: data.sources ?? [],
  };
}
