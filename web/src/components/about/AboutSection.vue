<script setup>
import SectionTitle from "../common/SectionTitle.vue";
import { profile } from "../../data/profile";
import { techStack } from "../../data/tech-stack";
</script>

<template>
  <section id="about" class="section-band">
    <SectionTitle
      eyebrow="About"
      title="Backend depth with explainable architecture"
      description="The portfolio is organized around concrete engineering evidence: system pressure, design decisions, and implementation tradeoffs."
    />

    <div class="about-grid">
      <div class="methodology-panel">
        <div v-for="item in profile.methodology" :key="item.step" class="methodology-item">
          <span>{{ item.step }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>

      <div class="tech-panel">
        <h3>Technical Focus</h3>
        <div class="tech-list">
          <div v-for="tech in techStack" :key="tech.name" class="tech-row">
            <div class="tech-meta">
              <span>{{ tech.name }}</span>
              <small>{{ tech.group }}</small>
            </div>
            <div class="tech-meter" :aria-label="`${tech.name} ${tech.level}%`">
              <span :style="{ width: `${tech.level}%` }"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
