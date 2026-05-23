<script setup>
import { computed } from "vue";
import SectionTitle from "../common/SectionTitle.vue";
import { useLocale } from "../../composables/useLocale";
import { getProfile } from "../../services/profileClient";

const { t } = useLocale();
const profile = getProfile();

const methodologySteps = computed(() => {
  const steps = profile.methodology ?? [];
  const order = ["Why", "What", "How", "Deep Dive"];
  return order.map((stepName) => steps.find((item) => item.step === stepName || item.title === stepName)).filter(Boolean);
});

const techGroups = computed(() => profile.techStack ?? []);
const description = computed(() => profile.summary || t.value.about.description);
</script>

<template>
  <section id="about" class="section-band">
    <SectionTitle
      :eyebrow="t.about.eyebrow"
      :title="t.about.title"
      :description="description"
    />

    <div class="about-grid">
      <div class="methodology-panel">
        <div class="panel-caption">Why -> What -> How -> Deep Dive</div>
        <div v-for="item in methodologySteps" :key="item.step" class="methodology-item">
          <span class="methodology-step">{{ item.step }}</span>
          <div class="methodology-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="tech-panel">
        <h3>{{ t.about.techTitle }}</h3>
        <div class="tech-groups">
          <div v-for="group in techGroups" :key="group.category" class="tech-group">
            <div class="tech-meta">
              <span>{{ group.category }}</span>
              <small>{{ group.items.length }} items</small>
            </div>
            <div class="tech-chip-list">
              <span v-for="item in group.items" :key="item" class="tech-chip">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
