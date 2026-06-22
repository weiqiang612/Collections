<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "../../composables/useLocale";
import { gsap } from "gsap";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const { t } = useLocale();

const navigateToDetail = () => {
  router.push(`/projects/${props.project.id}`);
};

const cardContainer = ref(null);
let ctx;

onMounted(() => {
  if (!cardContainer.value) return;
  ctx = gsap.context(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Card entrance animation on scroll
    gsap.from(cardContainer.value, {
      scrollTrigger: {
        trigger: cardContainer.value,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
    });

    // Content fade in stagger
    gsap.from(
      [
        cardContainer.value.querySelector(".project-kicker"),
        cardContainer.value.querySelector("h3"),
        cardContainer.value.querySelector(".project-content p"),
        cardContainer.value.querySelectorAll(".project-preview-point"),
        cardContainer.value.querySelector(".stack-list"),
        cardContainer.value.querySelector(".project-detail-cta-btn"),
      ].filter(Boolean),
      {
        scrollTrigger: {
          trigger: cardContainer.value,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        autoAlpha: 0,
        y: 15,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
      }
    );
  }, cardContainer.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <article
    class="project-card"
    ref="cardContainer"
  >
    <div
      class="project-content"
      role="button"
      tabindex="0"
      @click="navigateToDetail"
      @keydown.enter="navigateToDetail"
    >
      <p class="project-kicker">{{ project.subtitle }}</p>
      <div class="project-title-row">
        <h3>{{ project.name }}</h3>

        <button
          class="project-detail-cta-btn"
          @click.stop="navigateToDetail"
          :title="t.projectDetail.viewCaseStudy"
        >
          <span>{{ t.projectDetail.viewCaseStudy }}</span>
          <svg class="cta-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      <p>{{ project.summary }}</p>
      <div class="project-preview-points">
        <article
          v-for="highlight in project.highlights.slice(0, 2)"
          :key="highlight"
          class="project-preview-point"
        >
          <span class="project-preview-marker"></span>
          <span v-html="highlight"></span>
        </article>
      </div>
      <div class="stack-list">
        <span
          v-for="tech in project.techStack"
          :key="tech"
        >{{ tech }}</span>
      </div>
      <div class="project-card-footer">
        <span
          v-for="outcome in project.detail.outcomes.slice(0, 2)"
          :key="outcome"
          class="project-outcome-chip"
        >
          {{ outcome }}
        </span>
      </div>
    </div>
  </article>
</template>
