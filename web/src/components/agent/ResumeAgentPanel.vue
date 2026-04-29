<script setup>
import { nextTick, ref } from "vue";
import ChatMessage from "./ChatMessage.vue";
import { useChatMock } from "../../composables/useChatMock";

const emit = defineEmits(["close"]);

const sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
const input = ref("");
const messages = ref([
  {
    id: "welcome",
    role: "assistant",
    content:
      "Ask about Ethan's Java backend work, high-concurrency projects, or AI Agent/RAG practice.",
    sources: [{ title: "Mock mode", type: "mock", score: 1 }],
  },
]);
const scrollArea = ref(null);
const activeMessageId = ref("");
const { isStreaming, sendMessage } = useChatMock();

async function scrollToBottom() {
  await nextTick();
  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}

async function submitMessage() {
  const content = input.value.trim();
  if (!content || isStreaming.value) {
    return;
  }

  const userMessage = { id: crypto.randomUUID(), role: "user", content };
  const assistantMessage = { id: crypto.randomUUID(), role: "assistant", content: "", sources: [] };
  messages.value.push(userMessage, assistantMessage);
  input.value = "";
  activeMessageId.value = assistantMessage.id;
  await scrollToBottom();

  const result = await sendMessage(content, sessionId, async (delta) => {
    assistantMessage.content += delta;
    await scrollToBottom();
  });

  assistantMessage.sources = result.sources;
  activeMessageId.value = "";
  await scrollToBottom();
}
</script>

<template>
  <aside id="resume-agent" class="agent-panel" aria-label="Resume Agent mock panel">
    <header class="agent-header">
      <div>
        <p>Resume Agent</p>
        <span>mock streaming mode</span>
      </div>
      <button type="button" aria-label="Close resume agent" @click="emit('close')">×</button>
    </header>

    <div ref="scrollArea" class="messages">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :streaming="message.id === activeMessageId"
      />
    </div>

    <form class="chat-form" @submit.prevent="submitMessage">
      <input
        v-model="input"
        type="text"
        placeholder="Ask about 苍穹外卖, 黑马点评, RAG..."
        autocomplete="off"
      />
      <button type="submit" :disabled="isStreaming">{{ isStreaming ? "..." : "Send" }}</button>
    </form>
  </aside>
</template>
