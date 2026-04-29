import { createApiUrl, isApiConfigured } from "./apiClient";

const mockReplies = [
  "I can explain Ethan's backend projects through architecture, concurrency paths, and tradeoffs. For 苍穹外卖, start with order state safety and the agent knowledge flow.",
  "For 黑马点评, the strongest story is the high-concurrency path: Caffeine + Redis cache, Lua stock deduction, and failure handling around flash-sale traffic.",
  "The live API is not connected yet. This panel keeps the same interaction shape planned for POST /api/chat/stream so the frontend can switch to SSE later.",
];

async function sendMockMessage(message, sessionId, onDelta) {
  const normalized = message.toLowerCase();
  const reply = normalized.includes("点评") || normalized.includes("redis")
    ? mockReplies[1]
    : normalized.includes("api") || normalized.includes("rag")
      ? mockReplies[2]
      : mockReplies[0];

  for (const token of reply.split(" ")) {
    await new Promise((resolve) => window.setTimeout(resolve, 36));
    onDelta(`${token} `);
  }

  return {
    sessionId,
    sources: [
      { title: "Frontend mock knowledge", type: "mock", score: 1 },
      { title: "AGENTS.md product direction", type: "project-guide", score: 0.92 },
    ],
  };
}

export async function sendMessage(message, sessionId, onDelta) {
  if (!isApiConfigured()) {
    return sendMockMessage(message, sessionId, onDelta);
  }

  const response = await fetch(createApiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message, locale: "zh-CN" }),
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
