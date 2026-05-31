<script setup>
defineProps({
  title: {
    type: String,
    default: "terminal",
  },
});
</script>

<template>
  <div class="terminal-window">
    <div class="terminal-bar">
      <div class="terminal-controls" aria-hidden="true">
        <span class="control control-red"></span>
        <span class="control control-orange"></span>
        <span class="control control-green"></span>
      </div>
      <span class="terminal-title">{{ title }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>
