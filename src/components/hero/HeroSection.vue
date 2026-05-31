<script setup>
import { computed } from "vue";
import { useLocale } from "../../composables/useLocale";
import { getProfile } from "../../services/profileClient";
import TerminalWindow from "../common/TerminalWindow.vue";
import TypewriterIntro from "./TypewriterIntro.vue";

const { t } = useLocale();
const profile = getProfile();

const heroLines = computed(() => [
  profile.name,
  "weiqiang",
  "围墙",
  "Java Backend",
  "High-Concurrency",
  "AI Agent",
]);

const focusChips = ["Java Backend", "High-Concurrency", "AI Agent"];
const terminalTitle = "profile://static";
const statusLabel = "source: static profile";
</script>

<template>
  <section id="hero" class="hero-section section-band">
    <div class="hero-copy">
      <p class="section-eyebrow">{{ t.hero.eyebrow }}</p>
      <h1 class="hero-title">{{ profile.name }}</h1>
      <p class="hero-brandline">{{ profile.brand }}</p>
      <TypewriterIntro
        :label="t.hero.terminalTitle"
        prompt="$ echo"
        :status="statusLabel"
        :lines="heroLines"
      />
      <p class="hero-lede">{{ profile.headline }}</p>
      <div class="hero-chip-row" aria-label="core focus areas">
        <span v-for="chip in focusChips" :key="chip" class="hero-chip">{{ chip }}</span>
      </div>
      <div class="hero-actions">
        <a class="button-primary" href="#projects">{{ t.hero.primaryAction }}</a>
        <a class="button-ghost" href="#resume-agent">{{ t.hero.secondaryAction }}</a>
        <a
          class="button-ghost"
          href="https://note.weiqiang.me"
          target="_blank"
          rel="noopener noreferrer"
        >{{ t.hero.tertiaryAction }} ↗</a>
      </div>
    </div>

    <TerminalWindow :title="terminalTitle">
      <div class="hero-terminal-lines">
        <div class="terminal-line muted">$ whoami</div>
        <div class="terminal-line">
          <span class="terminal-key">name</span>
          <span class="terminal-value">{{ profile.name }}</span>
        </div>
        <div class="terminal-line">
          <span class="terminal-key">brand</span>
          <span class="terminal-value">{{ profile.brand }}</span>
        </div>
        <div class="terminal-line accent">{{ profile.summary }}</div>
        <div class="terminal-line muted">
          status: static profile
        </div>
      </div>
    </TerminalWindow>
  </section>
</template>
