<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import SectionTitle from "../common/SectionTitle.vue";
import ProjectCard from "./ProjectCard.vue";
import { useLocale } from "../../composables/useLocale";

const { t } = useLocale();
const activeIndex = ref(0);
const showcaseHeight = ref(0);
const sizerRows = ref([]);

const orderedProjectsFor = (startIndex) => {
  const projects = t.value.projects;

  return [
    {
      project: projects[startIndex],
      index: startIndex,
      variant: "feature",
    },
    {
      project: projects[(startIndex + 1) % projects.length],
      index: (startIndex + 1) % projects.length,
      variant: "support",
    },
    {
      project: projects[(startIndex + 2) % projects.length],
      index: (startIndex + 2) % projects.length,
      variant: "shadow",
    },
  ];
};

const orderedProjects = computed(() => {
  return orderedProjectsFor(activeIndex.value);
});

const selectProject = (index) => {
  activeIndex.value = index;
};

const shiftProject = (direction) => {
  const total = t.value.projects.length;
  activeIndex.value = (activeIndex.value + direction + total) % total;
};

const setSizerRowRef = (element, index) => {
  if (element) {
    sizerRows.value[index] = element;
  }
};

const measureShowcaseHeight = () => {
  const heights = sizerRows.value
    .map((row) => row?.getBoundingClientRect().height ?? 0)
    .filter(Boolean);

  if (!heights.length) return;
  showcaseHeight.value = Math.ceil(Math.max(...heights));
};

const scheduleMeasurement = () => {
  nextTick(() => {
    window.requestAnimationFrame(() => {
      measureShowcaseHeight();
    });
  });
};

const handleResize = () => {
  scheduleMeasurement();
};

onMounted(() => {
  scheduleMeasurement();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

watch(
  () => t.value.projects,
  () => {
    sizerRows.value = [];
    scheduleMeasurement();
  },
  { deep: true }
);
</script>

<template>
  <section id="projects" class="section-band">
    <SectionTitle
      :eyebrow="t.projectsSection.eyebrow"
      :title="t.projectsSection.title"
      :description="t.projectsSection.description"
    />

    <div class="projects-carousel-header">
      <div class="projects-carousel-status">
        <span class="projects-carousel-label">CASE STRIP</span>
        <span class="projects-carousel-count">{{ String(activeIndex + 1).padStart(2, "0") }} / {{ String(t.projects.length).padStart(2, "0") }}</span>
      </div>
    </div>

    <div
      class="projects-carousel-shell"
      :style="showcaseHeight ? { minHeight: `${showcaseHeight}px` } : undefined"
    >
      <button class="projects-carousel-arrow projects-carousel-arrow-left" type="button" @mousedown.prevent @click="shiftProject(-1)" :aria-label="t.projectDetail.prevProject">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <div class="projects-showcase">
        <ProjectCard
          v-for="{ project, index, variant } in orderedProjects"
          :key="`${variant}-${project.id}`"
          :project="project"
          :project-index="index"
          :variant="variant"
          @select="selectProject"
        />
      </div>

      <div class="projects-showcase-sizer-rack" aria-hidden="true">
        <div
          v-for="(startIndex, sizerIndex) in t.projects.map((_, index) => index)"
          :key="`sizer-${startIndex}`"
          :ref="(element) => setSizerRowRef(element, sizerIndex)"
          class="projects-showcase projects-showcase-sizer"
        >
          <ProjectCard
            v-for="{ project, index, variant } in orderedProjectsFor(startIndex)"
            :key="`sizer-${startIndex}-${variant}-${project.id}`"
            :project="project"
            :project-index="index"
            :variant="variant"
            :is-measurement="true"
          />
        </div>
      </div>

      <button class="projects-carousel-arrow projects-carousel-arrow-right" type="button" @mousedown.prevent @click="shiftProject(1)" :aria-label="t.projectDetail.nextProject">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </section>
</template>
