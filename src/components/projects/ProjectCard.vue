<script setup>
import { ref, onMounted, onUnmounted } from "vue";
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
      ease: "power2.out"
    });

    // Content fade in stagger
    gsap.from([
      cardContainer.value.querySelector(".project-kicker"),
      cardContainer.value.querySelector("h3"),
      cardContainer.value.querySelector(".project-content p"),
      cardContainer.value.querySelectorAll(".project-content li"),
      cardContainer.value.querySelector(".stack-list")
    ].filter(Boolean), {
      scrollTrigger: {
        trigger: cardContainer.value,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      autoAlpha: 0,
      y: 15,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out"
    });

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
        delay: 0.2
      });
    }
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
    <!-- Left: text content -->
    <div class="project-content">
      <p class="project-kicker">{{ project.subtitle }}</p>
      <h3>{{ project.name }}</h3>
      <p>{{ project.summary }}</p>
      <ul>
        <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
      </ul>
      <div class="stack-list">
        <span v-for="tech in project.techStack" :key="tech">{{ tech }}</span>
      </div>
    </div>

    <!-- Right: real Mermaid diagrams -->
    <div v-if="hasDiagrams(project)" class="diagram-panel">
      <!-- Tab bar (only if multiple diagrams) -->
      <div v-if="project.diagrams.length > 1" class="diagram-tabs" role="tablist">
        <button
          v-for="(d, i) in project.diagrams"
          :key="i"
          :id="`tab-${project.id}-${i}`"
          role="tab"
          :aria-selected="activeTab === i"
          :class="['diagram-tab', { active: activeTab === i }]"
          @click="activeTab = i"
        >
          {{ d.title }}
        </button>
      </div>
      <div v-else class="diagram-single-title">{{ project.diagrams[0].title }}</div>

      <!-- Mermaid renderer — key forces remount on tab switch -->
      <MermaidDiagram
        :key="`${project.id}-${activeTab}`"
        :code="project.diagrams[activeTab].code"
        :diagram-id="`${project.id}-${activeTab}`"
      />
    </div>

    <!-- Fallback placeholder for projects without mermaid data -->
    <div v-else class="diagram-placeholder">
      <div class="diagram-label">{{ t.projectCard.diagramLabel }}</div>
      <div class="diagram-node primary">{{ project.diagramSource }}</div>
      <div class="diagram-flow">
        <span v-for="node in project.flowNodes || t.projectCard.flowNodes" :key="node">{{ node }}</span>
      </div>
    </div>
  </article>
</template>
