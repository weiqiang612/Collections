<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
});
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
      <div class="diagram-label">Mermaid reserved</div>
      <div class="diagram-node primary">{{ project.diagramSource }}</div>
      <div class="diagram-flow">
        <span>Controller</span>
        <span>Service</span>
        <span>Redis</span>
        <span>MySQL</span>
      </div>
    </div>
  </article>
</template>
