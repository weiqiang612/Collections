<script setup>
import SectionTitle from "../common/SectionTitle.vue";
import { useLocale } from "../../composables/useLocale";

const { t } = useLocale();
</script>

<template>
  <section id="about" class="section-band">
    <SectionTitle
      :eyebrow="t.about.eyebrow"
      :title="t.about.title"
      :description="t.about.description"
    />

    <div class="about-grid">
      <div class="methodology-panel">
        <div v-for="item in t.profile.methodology" :key="item.step" class="methodology-item">
          <span>{{ item.step }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>

      <div class="tech-panel">
        <h3>{{ t.about.techTitle }}</h3>
        <div class="tech-list">
          <div v-for="tech in t.techStack" :key="tech.name" class="tech-row">
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
