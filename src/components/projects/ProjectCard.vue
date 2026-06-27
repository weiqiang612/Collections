<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "../../composables/useLocale";
import { gsap } from "gsap";
import { renderInlineMarkdown } from "../../utils/renderInlineMarkdown";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  projectIndex: {
    type: Number,
    required: true,
  },
  variant: {
    type: String,
    default: "feature",
  },
  isMeasurement: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["select"]);

const router = useRouter();
const { t } = useLocale();
const isFeature = () => props.variant === "feature";
const isSupport = () => props.variant === "support";
const isShadow = () => props.variant === "shadow";
const projectLabel = `${String(props.projectIndex + 1).padStart(2, "0")}`;
const highlightLimit = () => (isFeature() ? 2 : isSupport() ? 1 : 0);
const techLimit = () => (isFeature() ? props.project.techStack.length : isSupport() ? 4 : 2);
const outcomeLimit = () => (isFeature() ? 2 : isSupport() ? 1 : 0);
const shouldShowSummary = () => !isShadow();

const navigateToDetail = () => {
  router.push(`/projects/${props.project.id}`);
};

const selectProject = () => {
  emit("select", props.projectIndex);
};

const cardContainer = ref(null);
let ctx;

onMounted(() => {
  if (!cardContainer.value || props.isMeasurement) return;
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
    const highlightNodes = Array.from(
      cardContainer.value.querySelectorAll(".project-preview-point")
    );
    const animationTargets = [
      cardContainer.value.querySelector(".project-kicker"),
      cardContainer.value.querySelector("h3"),
      cardContainer.value.querySelector(".project-content p"),
      ...highlightNodes,
      cardContainer.value.querySelector(".stack-list"),
      cardContainer.value.querySelector(".project-entry-badge"),
    ].filter(Boolean);

    gsap.from(
      animationTargets,
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
    :class="[`project-card-${variant}`]"
    ref="cardContainer"
  >
    <div
      class="project-content"
      :class="{ clickable: !isMeasurement }"
      :role="isMeasurement ? undefined : 'button'"
      :tabindex="isMeasurement ? undefined : 0"
      @click="isMeasurement ? undefined : isFeature() ? navigateToDetail() : selectProject()"
      @keydown.enter="isMeasurement ? undefined : isFeature() ? navigateToDetail() : selectProject()"
      @keydown.space.prevent="isMeasurement ? undefined : isFeature() ? navigateToDetail() : selectProject()"
    >
      <div class="project-card-meta">
        <span class="project-index-badge">{{ projectLabel }}</span>
        <span class="project-mode-badge">
          {{ isFeature() ? "FOCUS" : isSupport() ? "NEXT" : "SHADOW" }}
        </span>
      </div>
      <p class="project-kicker">{{ project.subtitle }}</p>
      <div class="project-title-row">
        <h3>{{ project.name }}</h3>
        <span class="project-entry-badge">
          <span class="project-entry-badge-text">{{ isFeature() ? t.projectDetail.viewCaseStudyAction : t.projectDetail.focusProjectAction }}</span>
          <svg class="cta-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
      <p v-if="shouldShowSummary()">{{ project.summary }}</p>
      <p v-else class="project-shadow-hint">{{ t.projectDetail.focusHint }}</p>
      <div class="project-preview-points">
        <article
          v-for="highlight in project.highlights.slice(0, highlightLimit())"
          :key="highlight"
          class="project-preview-point"
        >
          <span class="project-preview-marker"></span>
          <span v-html="renderInlineMarkdown(highlight)"></span>
        </article>
      </div>
      <div class="stack-list">
        <span
          v-for="tech in project.techStack.slice(0, techLimit())"
          :key="tech"
        >{{ tech }}</span>
      </div>
      <div v-if="outcomeLimit() > 0" class="project-card-footer">
        <span
          v-for="outcome in project.detail.outcomes.slice(0, outcomeLimit())"
          :key="outcome"
          class="project-outcome-chip"
        >
          {{ outcome }}
        </span>
      </div>
    </div>
  </article>
</template>
