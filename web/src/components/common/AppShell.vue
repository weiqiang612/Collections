<script setup>
import { useLocale } from "../../composables/useLocale";

const { t, currentLabel, nextLabel, toggleLocale } = useLocale();
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <a class="brand-mark" href="#hero" :aria-label="t.shell.brandAria">
        <span class="brand-dot"></span>
        <span>weiqiang</span>
      </a>
      <div class="header-actions">
        <nav class="site-nav" :aria-label="t.shell.navAria">
          <a v-for="item in t.nav" :key="item.href" :href="item.href">
            {{ item.label }}
          </a>
        </nav>
        <button
          class="language-toggle"
          type="button"
          :aria-label="t.shell.languageAria"
          @click="toggleLocale"
        >
          <span>{{ currentLabel }}</span>
          <span>/</span>
          <span>{{ nextLabel }}</span>
        </button>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
