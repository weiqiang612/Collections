<script setup>
import { useLocale } from "../../composables/useLocale";

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle"]);

const { t } = useLocale();
</script>

<template>
  <button class="agent-launcher" type="button" :aria-expanded="open" @click="$emit('toggle')">
    <span class="launcher-core">AI</span>
    <span class="launcher-label">{{ t.agent.launcher }}</span>
  </button>
</template>
