<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useLocale } from "../../composables/useLocale";
import MermaidDiagram from "./MermaidDiagram.vue";
import { gsap } from "gsap";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const { t } = useLocale();
const activeTab = ref(0);
const displayProject = ref(props.project);
const isAnimating = ref(false);

const handleTabsWheel = (e) => {
  if (e.deltaY === 0) return;
  e.currentTarget.scrollLeft += e.deltaY;
};

const hasDiagrams = (p) => p.diagrams && p.diagrams.length > 0;

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
        cardContainer.value.querySelectorAll(".project-content li"),
        cardContainer.value.querySelector(".stack-list"),
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

    // Right-side diagram panel animation
    const rightPanel = cardContainer.value.querySelector(".diagram-panel, .diagram-placeholder");
    if (rightPanel) {
      gsap.from(rightPanel, {
        scrollTrigger: {
          trigger: cardContainer.value,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      });
    }
  }, cardContainer.value);
});

onUnmounted(() => {
  ctx?.revert();
});

// Watch for project prop changes to trigger GSAP slide and fade transitions
watch(
  () => props.project,
  (newVal) => {
    if (!cardContainer.value) {
      displayProject.value = newVal;
      return;
    }

    const contentElements = cardContainer.value.querySelectorAll(
      ".project-content, .diagram-panel, .diagram-placeholder"
    );

    gsap.killTweensOf(contentElements);
    isAnimating.value = true;

    // 1. Exit Animation: Slide Left & Fade Out
    gsap.to(contentElements, {
      autoAlpha: 0,
      x: -30,
      duration: 0.25,
      ease: "power2.in",
      stagger: 0.03,
      onComplete: () => {
        // Update display data in the dark
        displayProject.value = newVal;
        activeTab.value = 0; // Reset active diagram tab

        nextTick(() => {
          // 2. Set Pre-entry Position: Slide Right & Fade Out
          gsap.set(contentElements, {
            x: 30,
            autoAlpha: 0,
          });

          // 3. Entry Animation: Slide Left to Center & Fade In
          gsap.to(contentElements, {
            autoAlpha: 1,
            x: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.04,
            onComplete: () => {
              isAnimating.value = false;
            },
          });
        });
      },
    });
  }
);
</script>

<template>
  <article
    class="project-card"
    ref="cardContainer"
  >
    <!-- Left: text content -->
    <div class="project-content">
      <p class="project-kicker">{{ displayProject.subtitle }}</p>
      <h3>{{ displayProject.name }}</h3>
      <p>{{ displayProject.summary }}</p>
      <ul>
        <li
          v-for="highlight in displayProject.highlights"
          :key="highlight"
          v-html="highlight"
        ></li>
      </ul>
      <div class="stack-list">
        <span
          v-for="tech in displayProject.techStack"
          :key="tech"
        >{{ tech }}</span>
      </div>
    </div>

    <!-- Right: real Mermaid diagrams -->
    <div
      v-if="hasDiagrams(displayProject)"
      class="diagram-panel"
    >
      <!-- Tab bar (only if multiple diagrams) -->
      <div
        v-if="displayProject.diagrams.length > 1"
        class="diagram-tabs"
        role="tablist"
        @wheel.prevent="handleTabsWheel"
      >
        <button
          v-for="(d, i) in displayProject.diagrams"
          :key="i"
          :id="`tab-${displayProject.id}-${i}`"
          role="tab"
          :aria-selected="activeTab === i"
          :class="['diagram-tab', { active: activeTab === i }]"
          @click="activeTab = i"
        >
          {{ d.title }}
        </button>
      </div>
      <div
        v-else
        class="diagram-single-title"
      >{{ displayProject.diagrams[0].title }}</div>

      <!-- Mermaid renderer — key forces remount on tab switch -->
      <MermaidDiagram
        :key="`${displayProject.id}-${activeTab}`"
        :code="displayProject.diagrams[activeTab].code"
        :diagram-id="`${displayProject.id}-${activeTab}`"
      />
    </div>

    <!-- Fallback placeholder for projects without mermaid data -->
    <div
      v-else
      class="diagram-placeholder"
    >
      <div class="diagram-label">{{ t.projectCard.diagramLabel }}</div>
      <div class="diagram-node primary">{{ displayProject.diagramSource }}</div>
      <div class="diagram-flow">
        <span
          v-for="node in displayProject.flowNodes || t.projectCard.flowNodes"
          :key="node"
        >{{ node }}</span>
      </div>
    </div>
  </article>
</template>
