<script setup>
import { nextTick, ref, watch, onMounted, onUnmounted } from "vue";
import ChatMessage from "./ChatMessage.vue";
import { useChatMock } from "../../composables/useChatMock";
import { useLocale } from "../../composables/useLocale";
import { isApiConfigured } from "../../services/chatClient";
import { gsap } from "gsap";

const emit = defineEmits(["close"]);

const { locale, t } = useLocale();
const sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
const input = ref("");
const isOnline = isApiConfigured();

const messages = ref([
  {
    id: "welcome",
    role: "assistant",
    content: t.value.agent.welcome,
    sources: [
      { 
        title: isOnline 
          ? (locale.value === "zh-CN" ? "在线 RAG 知识库" : "Online RAG Context")
          : t.value.agent.sources.mockMode, 
        type: isOnline ? "online" : "mock", 
        score: 1 
      }
    ],
  },
]);
const scrollArea = ref(null);
const activeMessageId = ref("");
const { isStreaming, sendMessage } = useChatMock();

watch(locale, () => {
  const welcome = messages.value.find((message) => message.id === "welcome");
  if (welcome) {
    welcome.content = t.value.agent.welcome;
    welcome.sources = [
      { 
        title: isOnline 
          ? (locale.value === "zh-CN" ? "在线 RAG 知识库" : "Online RAG Context")
          : t.value.agent.sources.mockMode, 
        type: isOnline ? "online" : "mock", 
        score: 1 
      }
    ];
  }
});

let scrollPending = false;
function scrollToBottom() {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => {
    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
    }
    scrollPending = false;
  });
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
  scrollToBottom();

  // 获取被 Vue 深度响应式代理后的 Proxy 消息对象，以使流式内容修改能够触发实时 UI 渲染
  const targetMessage = messages.value[messages.value.length - 1];

  // Compile dialogue history (exclude welcome and empty/error states)
  const history = messages.value
    .slice(0, -2)
    .filter(msg => msg.id !== "welcome" && msg.content && (msg.role === "user" || msg.role === "assistant"))
    .map(msg => ({ role: msg.role, content: msg.content }));

  let result;
  try {
    result = await sendMessage(content, sessionId, locale.value, (delta) => {
      targetMessage.content += delta;
      scrollToBottom();
    }, history);
  } catch (err) {
    console.error("API call failed, running graceful geek fallback:", err);
    
    // Inject geek-style failure log
    targetMessage.content = `[SYSTEM ERROR] Connection failed: ${err.message || 'API Timeout'}\n[SYSTEM] Automatically falling back to local simulation mode...\n\n`;
    scrollToBottom();

    // Generate local mock reply dynamically
    const normalized = content.toLowerCase();
    const mockReplies = t.value.agent.mockReplies;
    const fallbackText = normalized.includes("点评") || normalized.includes("redis")
      ? mockReplies[1]
      : normalized.includes("api") || normalized.includes("rag")
        ? mockReplies[2]
        : mockReplies[0];

    const tokens = locale.value === "zh-CN" ? Array.from(fallbackText) : fallbackText.split(" ");
    for (const token of tokens) {
      await new Promise((resolve) => window.setTimeout(resolve, 24));
      targetMessage.content += locale.value === "zh-CN" ? token : `${token} `;
      scrollToBottom();
    }

    result = {
      sources: [
        { 
          title: locale.value === "zh-CN" ? "本地模拟数据 (故障切换)" : "Local Simulation Data (Failover)", 
          type: "mock", 
          score: 1 
        }
      ]
    };
  }

  targetMessage.sources = result.sources;
  activeMessageId.value = "";
  scrollToBottom();
}

const panelRef = ref(null);
let ctx;

onMounted(() => {
  if (!panelRef.value) return;
  ctx = gsap.context(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(panelRef.value, 
      { xPercent: 100, autoAlpha: 0 }, 
      { xPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }
    );
  }, panelRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});

const handleClose = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    emit("close");
    return;
  }
  gsap.to(panelRef.value, {
    xPercent: 100,
    autoAlpha: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete: () => {
      emit("close");
    }
  });
};
</script>

<template>
  <aside id="resume-agent" ref="panelRef" class="agent-panel" :aria-label="t.agent.panelAria">
    <header class="agent-header">
      <div>
        <p>{{ t.agent.title }}</p>
        <span class="status-indicator" :class="{ 'is-online': isOnline }">
          <span class="status-dot"></span>
          {{ isOnline ? (locale === 'zh-CN' ? '在线模式 • DeepSeek 驱动' : 'Online • DeepSeek Flash') : t.agent.mode }}
        </span>
      </div>
      <button type="button" :aria-label="t.agent.closeAria" @click="handleClose">×</button>
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

<style scoped>
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-cyan);
}

.status-indicator.is-online .status-dot {
  background: var(--color-green);
  box-shadow: 0 0 6px var(--color-green);
  animation: pulse 1.8s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.6;
  }
}
</style>
