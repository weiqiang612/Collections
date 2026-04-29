<script setup>
import { useLocale } from "../../composables/useLocale";

defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const { t } = useLocale();
</script>

<template>
  <article class="project-card">
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

    <div class="diagram-placeholder">
      <div class="diagram-label">{{ t.projectCard.diagramLabel }}</div>
      <div class="diagram-node primary">{{ project.diagramSource }}</div>
      <div class="diagram-flow">
        <span v-for="node in t.projectCard.flowNodes" :key="node">{{ node }}</span>
      </div>
    </div>
  </article>
</template>
