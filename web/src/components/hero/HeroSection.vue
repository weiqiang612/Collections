<script setup>
import { profile } from "../../data/profile";
import { useTypewriter } from "../../composables/useTypewriter";
import TerminalWindow from "../common/TerminalWindow.vue";

const lines = [
  "boot portfolio --brand weiqiang",
  "load Java backend depth",
  "inspect high-concurrency architecture",
  "attach AI Agent and RAG practice",
];

const { text } = useTypewriter(lines);
</script>

<template>
  <section id="hero" class="hero-section section-band">
    <div class="hero-copy">
      <p class="section-eyebrow">Ethan / weiqiang / 围墙</p>
      <h1>{{ profile.brand }}</h1>
      <p class="hero-lede">{{ profile.headline }}</p>
      <div class="hero-actions">
        <a class="button-primary" href="#projects">Inspect Projects</a>
        <a class="button-ghost" href="#resume-agent">Ask Resume Agent</a>
      </div>
    </div>

    <TerminalWindow title="ethan@portfolio:~/system">
      <div class="terminal-line muted">$ whoami</div>
      <div class="terminal-line">Ethan :: {{ profile.alias }}</div>
      <div class="terminal-line muted">$ mission</div>
      <div class="terminal-line accent">{{ profile.summary }}</div>
      <div class="terminal-line muted">$ {{ text }}<span class="cursor"></span></div>
    </TerminalWindow>
  </section>
</template>
