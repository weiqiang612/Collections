<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "../composables/useLocale";
import AppShell from "../components/common/AppShell.vue";
import MermaidDiagram from "../components/projects/MermaidDiagram.vue";
import ProjectHeroMedia from "../components/projects/ProjectHeroMedia.vue";

const route = useRoute();
const router = useRouter();
const { t } = useLocale();

const projectId = computed(() => route.params.projectId);
const project = computed(() => {
  return t.value.projects.find((p) => p.id === projectId.value);
});

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <AppShell v-if="project">
    <div class="project-detail-page-container">
      <!-- Back Button -->
      <button @click="goBack" class="back-home-btn" :aria-label="t.projectDetail.backBtn">
        <svg class="back-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>{{ t.projectDetail.backBtn }}</span>
      </button>

      <!-- Hero Section -->
      <header class="detail-hero-grid">
        <div class="detail-hero-info">
          <p class="detail-kicker">{{ project.subtitle }}</p>
          <h1 class="detail-title">{{ project.name }}</h1>
          <p class="detail-tagline">{{ project.detail.tagline }}</p>

          <div class="detail-outcomes" v-if="project.detail.outcomes?.length">
            <span v-for="outcome in project.detail.outcomes" :key="outcome" class="detail-outcome">
              {{ outcome }}
            </span>
          </div>

          <div class="detail-tags">
            <span v-for="tag in project.detail.tags" :key="tag" class="detail-tag">
              {{ tag }}
            </span>
          </div>

          <div class="detail-metrics-grid">
            <div class="detail-metric-card" v-for="m in project.detail.metrics" :key="m.label">
              <span class="detail-metric-val">{{ m.value }}</span>
              <span class="detail-metric-lbl">{{ m.label }}</span>
            </div>
          </div>
        </div>

        <div class="detail-hero-media">
          <ProjectHeroMedia :media="project.detail.media" />
        </div>
      </header>

      <main class="detail-body">
        <section class="detail-section detail-overview-section">
          <h2 class="section-title-highlight">{{ project.detail.sections.overview.title }}</h2>
          <div class="section-content text-block">
            <p>{{ project.detail.sections.overview.content }}</p>

            <div
              v-if="project.detail.sections.overview.proofPoints?.length"
              class="detail-proof-grid"
            >
              <article
                v-for="point in project.detail.sections.overview.proofPoints"
                :key="point.title"
                class="detail-proof-card"
              >
                <p class="detail-proof-title">{{ point.title }}</p>
                <p class="detail-proof-text">{{ point.description }}</p>
              </article>
            </div>
          </div>
        </section>

        <section class="detail-section architecture-section">
          <h2 class="section-title-highlight">{{ project.detail.sections.architecture.title }}</h2>
          <div class="section-content">
            <p class="arch-desc">{{ project.detail.sections.architecture.description }}</p>

            <div class="detail-diagrams-container">
              <div 
                v-for="(diag, idx) in project.detail.sections.architecture.diagrams" 
                :key="idx" 
                class="detail-diagram-block"
              >
                <h3 class="diagram-heading">
                  <span class="heading-prefix">0{{ idx + 1 }}.</span>
                  {{ diag.title }}
                </h3>
                
                <div class="diagram-render-wrapper">
                  <MermaidDiagram
                    :code="diag.code"
                    :diagram-id="`${project.id}-detail-${idx}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="detail-section highlights-section">
          <h2 class="section-title-highlight">{{ t.projectDetail.techHighlights }}</h2>
          <div class="section-content">
            <ul class="highlights-list">
              <li 
                v-for="hl in project.highlights" 
                :key="hl" 
                v-html="hl"
                class="highlight-item"
              ></li>
            </ul>
          </div>
        </section>

        <div class="detail-bottom-grid">
          <section class="detail-section ownership-section">
            <h2 class="section-title-highlight">{{ project.detail.sections.ownership.title }}</h2>
            <div class="section-content">
              <ul class="ownership-list">
                <li v-for="item in project.detail.sections.ownership.items" :key="item" class="ownership-item">
                  <span class="ownership-prefix">> </span>
                  <span v-html="item"></span>
                </li>
              </ul>
            </div>
          </section>

          <section class="detail-section retrospective-section">
            <h2 class="section-title-highlight">{{ project.detail.sections.retrospective.title }}</h2>
            <div class="section-content">
              <div class="retrospective-cards">
                <div 
                  v-for="ch in project.detail.sections.retrospective.challenges" 
                  :key="ch.problem" 
                  class="retro-card"
                >
                  <div class="retro-problem">
                    <span class="retro-lbl problem-lbl">{{ t.projectDetail.challengeLabel }}</span>
                    <span v-html="ch.problem"></span>
                  </div>
                  <div class="retro-solution">
                    <span class="retro-lbl solution-lbl">{{ t.projectDetail.solutionLabel }}</span>
                    <span v-html="ch.solution"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </AppShell>
</template>
