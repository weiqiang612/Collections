<script setup>
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "../../composables/useLocale";
import GeekCursor from "./GeekCursor.vue";

const route = useRoute();
const router = useRouter();
const { t, currentLabel, nextLabel, toggleLocale } = useLocale();

const navigateHomeTop = async () => {
  if (route.path !== "/") {
    await router.push("/");
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};
</script>

<template>
  <div class="app-shell">
    <GeekCursor />
    <header class="site-header">
      <router-link
        class="brand-mark"
        to="/"
        :aria-label="t.shell.brandAria"
        @click.prevent="navigateHomeTop"
      >
        <span class="brand-dot"></span>
        <span>weiqiang</span>
      </router-link>
      <div class="header-actions">
        <nav class="site-nav" :aria-label="t.shell.navAria">
          <a
            v-for="item in t.nav"
            :key="item.href"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
          >
            {{ item.label }}
            <svg v-if="item.external" class="nav-external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
