<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="section-title">
    <p v-if="eyebrow" class="section-eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description" class="section-description">{{ description }}</p>
  </div>
</template>
