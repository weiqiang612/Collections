<script setup>
import SectionTitle from "../common/SectionTitle.vue";
import ProjectCard from "./ProjectCard.vue";
import { useLocale } from "../../composables/useLocale";

const { t } = useLocale();
</script>

<template>
  <section id="projects" class="section-band">
    <SectionTitle
      :eyebrow="t.projectsSection.eyebrow"
      :title="t.projectsSection.title"
      :description="t.projectsSection.description"
    />

    <div class="projects-list">
      <ProjectCard v-for="project in t.projects" :key="project.id" :project="project" />
    </div>
  </section>
</template>
