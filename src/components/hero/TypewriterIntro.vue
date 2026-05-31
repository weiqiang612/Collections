<script setup>
import { computed } from "vue";
import { useTypewriter } from "../../composables/useTypewriter";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  prompt: {
    type: String,
    default: "$",
  },
  lines: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: "",
  },
});

const visibleLines = computed(() => props.lines.filter((line) => typeof line === "string" && line.trim().length > 0));
const { text, lineIndex } = useTypewriter(visibleLines, {
  delay: 42,
  hold: 980,
});

const activeLine = computed(() => visibleLines.value[lineIndex.value] ?? "");
</script>

<template>
  <div class="typewriter-intro">
    <div class="typewriter-meta">
      <span v-if="label" class="typewriter-label">{{ label }}</span>
      <span v-if="status" class="typewriter-status">{{ status }}</span>
    </div>
    <div class="typewriter-row">
      <span class="typewriter-prompt">{{ prompt }}</span>
      <span class="typewriter-text">
        {{ text }}
        <span class="cursor" aria-hidden="true"></span>
      </span>
    </div>
    <p v-if="activeLine" class="typewriter-caption">{{ activeLine }}</p>
  </div>
</template>
