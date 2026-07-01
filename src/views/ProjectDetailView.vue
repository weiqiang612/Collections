<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "../composables/useLocale";
import AppShell from "../components/common/AppShell.vue";
import MermaidDiagram from "../components/projects/MermaidDiagram.vue";
import ProjectHeroMedia from "../components/projects/ProjectHeroMedia.vue";
import { renderInlineMarkdown } from "../utils/renderInlineMarkdown";

const route = useRoute();
const router = useRouter();
const { t } = useLocale();

const projectId = computed(() => route.params.projectId);
const project = computed(() => {
  return t.value.projects.find((p) => p.id === projectId.value);
});
const isHeroStacked = computed(() => {
  return project.value?.id === "sky-takeout" || project.value?.detail?.media?.layout === "stacked";
});

const goBack = () => {
  router.push("/").then(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
};
</script>

<template>
  <AppShell v-if="project">
    <div class="project-detail-page-container">
      <button @click="goBack" class="back-home-btn" :aria-label="t.projectDetail.backBtn">
        <svg class="back-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>{{ t.projectDetail.backBtn }}</span>
      </button>

      <header :class="['detail-hero-grid', { 'detail-hero-grid-stacked': isHeroStacked }]">
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

          <a
            v-if="project.detail.liveUrl"
            class="detail-live-link"
            :href="project.detail.liveUrl.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="detail-live-link-label">{{ project.detail.liveUrl.label }}</span>
            <span class="detail-live-link-value">{{ project.detail.liveUrl.value }}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 17L17 7"></path>
              <path d="M8 7h9v9"></path>
            </svg>
          </a>

          <div class="detail-metrics-grid">
            <div class="detail-metric-card" v-for="m in project.detail.metrics" :key="m.label">
              <span class="detail-metric-val">{{ m.value }}</span>
              <span class="detail-metric-lbl">{{ m.label }}</span>
            </div>
          </div>
        </div>

        <div v-if="!isHeroStacked" class="detail-hero-media">
          <ProjectHeroMedia :media="project.detail.media" />
        </div>
      </header>

      <section v-if="isHeroStacked" class="detail-hero-media detail-hero-media-expanded">
        <ProjectHeroMedia :media="project.detail.media" />
      </section>

      <main class="detail-body">
        <section class="detail-section detail-overview-section">
          <h2 class="section-title-highlight">{{ project.detail.sections.overview.title }}</h2>
          <div class="section-content text-block">
            <p v-html="renderInlineMarkdown(project.detail.sections.overview.content)"></p>

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

        <section
          v-if="project.detail.sections.productProof?.screens?.length"
          class="detail-section product-proof-section"
        >
          <h2 class="section-title-highlight">{{ project.detail.sections.productProof.title }}</h2>
          <div class="section-content">
            <p class="arch-desc">{{ project.detail.sections.productProof.description }}</p>

            <div class="product-proof-grid">
              <article
                v-for="screen in project.detail.sections.productProof.screens"
                :key="screen.title"
                class="product-proof-card"
                :class="{ 'product-proof-card-contain': screen.fit === 'contain' }"
              >
                <div class="product-proof-image-shell">
                  <img
                    class="product-proof-image"
                    :src="screen.src"
                    :alt="screen.title"
                    loading="lazy"
                  />
                </div>
                <div class="product-proof-copy">
                  <p class="product-proof-title">{{ screen.title }}</p>
                  <p class="product-proof-text">{{ screen.description }}</p>
                </div>
              </article>
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
                v-html="renderInlineMarkdown(hl)"
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
                  <span class="ownership-prefix">&gt; </span>
                  <span v-html="renderInlineMarkdown(item)"></span>
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
                    <span v-html="renderInlineMarkdown(ch.problem)"></span>
                  </div>
                  <div class="retro-solution">
                    <span class="retro-lbl solution-lbl">{{ t.projectDetail.solutionLabel }}</span>
                    <span v-html="renderInlineMarkdown(ch.solution)"></span>
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
