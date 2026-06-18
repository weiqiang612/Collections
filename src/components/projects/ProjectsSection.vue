<script setup>
import { ref } from "vue";
import SectionTitle from "../common/SectionTitle.vue";
import ProjectCard from "./ProjectCard.vue";
import { useLocale } from "../../composables/useLocale";

const { t } = useLocale();
const activeIndex = ref(0);

const formatIndex = (index) => {
  return (index + 1).toString().padStart(2, "0");
};
</script>

<template>
  <section id="projects" class="section-band">
    <SectionTitle
      :eyebrow="t.projectsSection.eyebrow"
      :title="t.projectsSection.title"
      :description="t.projectsSection.description"
    />

    <!-- horizontal tabs selector -->
    <div class="projects-console-tabs" role="tablist">
      <button
        v-for="(project, index) in t.projects"
        :key="project.id"
        role="tab"
        :aria-selected="activeIndex === index"
        :class="['console-tab-btn', { active: activeIndex === index }]"
        @click="activeIndex = index"
      >
        <span class="tab-index">{{ formatIndex(index) }}</span>
        <span class="tab-name">{{ project.name }}</span>
        <span class="tab-status-dot"></span>
      </button>
    </div>

    <div class="projects-display-wrapper">
      <ProjectCard :project="t.projects[activeIndex]" />
    </div>
  </section>
</template>
