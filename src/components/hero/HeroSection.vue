<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useLocale } from "../../composables/useLocale";
import { getProfile } from "../../services/profileClient";
import TerminalWindow from "../common/TerminalWindow.vue";
import TypewriterIntro from "./TypewriterIntro.vue";
import { gsap } from "gsap";

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

const heroContainer = ref(null);
let ctx;

onMounted(() => {
  if (!heroContainer.value) return;
  ctx = gsap.context(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.from(".section-eyebrow", { autoAlpha: 0, y: 10, duration: 0.6 })
      .from(".hero-title", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.4")
      .from(".hero-brandline", { autoAlpha: 0, y: 15, duration: 0.7 }, "-=0.5")
      .from(".typewriter-intro", { autoAlpha: 0, y: 15, duration: 0.7 }, "-=0.5")
      .from(".hero-lede", { autoAlpha: 0, y: 15, duration: 0.7 }, "-=0.5")
      .from(".hero-chip", { 
        autoAlpha: 0, 
        scale: 0.8, 
        y: 10, 
        stagger: 0.08, 
        duration: 0.5, 
        ease: "back.out(1.5)" 
      }, "-=0.4")
      .from(".hero-actions a", { 
        autoAlpha: 0, 
        y: 15, 
        stagger: 0.1, 
        duration: 0.6 
      }, "-=0.3")
      .from(".terminal-window", { 
        autoAlpha: 0, 
        x: 30, 
        duration: 0.8 
      }, "-=0.8");
  }, heroContainer.value);
});

onUnmounted(() => {
  ctx?.revert();
});

const handleChipMouseMove = (e) => {
  const chip = e.currentTarget;
  const rect = chip.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  gsap.to(chip, {
    x: x * 0.35,
    y: y * 0.35,
    scale: 1.05,
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto"
  });
};

const handleChipMouseLeave = (e) => {
  const chip = e.currentTarget;
  gsap.to(chip, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: "power3.out",
    overwrite: "auto"
  });
};
</script>

<template>
  <section id="hero" ref="heroContainer" class="hero-section section-band">
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
        <span
          v-for="chip in focusChips"
          :key="chip"
          class="hero-chip"
          @mousemove="handleChipMouseMove"
          @mouseleave="handleChipMouseLeave"
        >{{ chip }}</span>
      </div>
      <div class="hero-actions">
        <a class="button-primary" href="#projects">{{ t.hero.primaryAction }}</a>
        <a class="button-ghost" href="#resume-agent">{{ t.hero.secondaryAction }}</a>
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
