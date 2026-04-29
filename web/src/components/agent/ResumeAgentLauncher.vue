<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle"]);
</script>

<template>
  <button class="agent-launcher" type="button" :aria-expanded="open" @click="$emit('toggle')">
    <span class="launcher-core">AI</span>
    <span class="launcher-label">Resume Agent</span>
  </button>
</template>
