<script setup>
import StreamingCursor from "./StreamingCursor.vue";

defineProps({
  message: {
    type: Object,
    required: true,
  },
  streaming: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="chat-message" :class="`is-${message.role}`">
    <div class="message-role">{{ message.role === "user" ? "You" : "Agent" }}</div>
    <p>{{ message.content }}<StreamingCursor v-if="streaming" /></p>
    <div v-if="message.sources?.length" class="source-list">
      <span v-for="source in message.sources" :key="source.title">{{ source.title }}</span>
    </div>
  </div>
</template>
