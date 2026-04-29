import { ref } from "vue";
import { sendMessage as sendChatMessage } from "../services/chatClient";

export function useChatMock() {
  const isStreaming = ref(false);

  async function sendMessage(message, sessionId, locale, onDelta) {
    isStreaming.value = true;
    try {
      return await sendChatMessage(message, sessionId, locale, onDelta);
    } finally {
      isStreaming.value = false;
    }
  }

  return { isStreaming, sendMessage };
}
