<script setup>
import { nextTick, ref, watch } from "vue";
import ChatMessage from "./ChatMessage.vue";
import { useChatMock } from "../../composables/useChatMock";
import { useLocale } from "../../composables/useLocale";

const emit = defineEmits(["close"]);

const { locale, t } = useLocale();
const sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
const input = ref("");
const messages = ref([
  {
    id: "welcome",
    role: "assistant",
    content: t.value.agent.welcome,
    sources: [{ title: t.value.agent.sources.mockMode, type: "mock", score: 1 }],
  },
]);
const scrollArea = ref(null);
const activeMessageId = ref("");
const { isStreaming, sendMessage } = useChatMock();

watch(locale, () => {
  const welcome = messages.value.find((message) => message.id === "welcome");
  if (welcome) {
    welcome.content = t.value.agent.welcome;
    welcome.sources = [{ title: t.value.agent.sources.mockMode, type: "mock", score: 1 }];
  }
});

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

  const result = await sendMessage(content, sessionId, locale.value, async (delta) => {
    assistantMessage.content += delta;
    await scrollToBottom();
  });

  assistantMessage.sources = result.sources;
  activeMessageId.value = "";
  await scrollToBottom();
}
</script>

<template>
  <aside id="resume-agent" class="agent-panel" :aria-label="t.agent.panelAria">
    <header class="agent-header">
      <div>
        <p>{{ t.agent.title }}</p>
        <span>{{ t.agent.mode }}</span>
      </div>
      <button type="button" :aria-label="t.agent.closeAria" @click="emit('close')">×</button>
    </header>

    <div ref="scrollArea" class="messages">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :streaming="message.id === activeMessageId"
        :roles="t.agent.roles"
      />
    </div>

    <form class="chat-form" @submit.prevent="submitMessage">
      <input
        v-model="input"
        type="text"
        :placeholder="t.agent.placeholder"
        autocomplete="off"
      />
      <button type="submit" :disabled="isStreaming">
        {{ isStreaming ? t.agent.sending : t.agent.send }}
      </button>
    </form>
  </aside>
</template>
