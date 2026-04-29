<script setup>
import SectionTitle from "../common/SectionTitle.vue";
import ProjectCard from "./ProjectCard.vue";
import { projects } from "../../data/projects";
</script>

<template>
  <section id="projects" class="section-band">
    <SectionTitle
      eyebrow="Projects"
      title="Systems worth discussing in an interview"
      description="Each project is framed as a system: load path, state model, cache strategy, and where AI can improve engineering workflows."
    />

    <div class="projects-list">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </section>
</template>
