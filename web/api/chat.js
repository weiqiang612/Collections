export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, sessionId, locale } = req.body;

  // TODO: 转发到 Agent 服务
  // const agentRes = await fetch(process.env.AGENT_API_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.AGENT_API_KEY}`,
  //   },
  //   body: JSON.stringify({ message, session_id: sessionId, locale }),
  // });
  // const data = await agentRes.json();

  return res.json({
    answer: `Agent 接口待对接。你的问题是: ${message}`,
    sources: [],
  });
}
