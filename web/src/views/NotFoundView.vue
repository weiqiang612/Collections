<script setup>
import { useLocale } from "../composables/useLocale";

const { t } = useLocale();
</script>

<template>
  <main class="not-found">
    <p class="section-eyebrow">404</p>
    <h1>{{ t.notFound.title }}</h1>
    <a class="button-primary" href="/">{{ t.notFound.action }}</a>
  </main>
</template>
