<script setup>
import { computed } from "vue";
import { useLocale } from "../../composables/useLocale";
import { useTypewriter } from "../../composables/useTypewriter";
import TerminalWindow from "../common/TerminalWindow.vue";

const { t } = useLocale();
const profile = computed(() => t.value.profile);
const lines = computed(() => t.value.hero.typewriter);

const { text } = useTypewriter(lines);
</script>

<template>
  <section id="hero" class="hero-section section-band">
    <div class="hero-copy">
      <p class="section-eyebrow">{{ t.hero.eyebrow }}</p>
      <h1>{{ profile.brand }}</h1>
      <p class="hero-lede">{{ profile.headline }}</p>
      <div class="hero-actions">
        <a class="button-primary" href="#projects">{{ t.hero.primaryAction }}</a>
        <a class="button-ghost" href="#resume-agent">{{ t.hero.secondaryAction }}</a>
      </div>
    </div>

    <TerminalWindow :title="t.hero.terminalTitle">
      <div class="terminal-line muted">{{ t.hero.whoami }}</div>
      <div class="terminal-line">Ethan :: {{ profile.alias }}</div>
      <div class="terminal-line muted">{{ t.hero.mission }}</div>
      <div class="terminal-line accent">{{ profile.summary }}</div>
      <div class="terminal-line muted">$ {{ text }}<span class="cursor"></span></div>
    </TerminalWindow>
  </section>
</template>
