<script setup>
import { ref } from "vue";
import { useLocale } from "../../composables/useLocale";
import MermaidDiagram from "./MermaidDiagram.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const { t } = useLocale();
const activeTab = ref(0);

const hasDiagrams = (p) => p.diagrams && p.diagrams.length > 0;
</script>

<template>
  <article class="project-card">
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
