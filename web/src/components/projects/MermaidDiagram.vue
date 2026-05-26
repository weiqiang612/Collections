<script setup>
import { ref, onMounted, watch } from "vue";
import mermaid from "../../utils/mermaid.js";

const props = defineProps({
  code: { type: String, required: true },
  diagramId: { type: String, required: true },
});

const containerRef = ref(null);
const loading = ref(true);
const error = ref(null);

let renderSeq = 0;

const render = async () => {
  if (!containerRef.value) return;
  loading.value = true;
  error.value = null;
  const seq = ++renderSeq;
  const id = `mmd-${props.diagramId}-${seq}`;
  try {
    const { svg } = await mermaid.render(id, props.code);
    // Ignore stale renders
    if (seq !== renderSeq) return;
    containerRef.value.innerHTML = svg;
    // Make SVG responsive
    const svgEl = containerRef.value.querySelector("svg");
    if (svgEl) {
      svgEl.removeAttribute("height");
      svgEl.style.maxWidth = "100%";
      svgEl.style.height = "auto";
    }
  } catch (e) {
    if (seq !== renderSeq) return;
    error.value = e?.message || "Diagram render error";
    console.error("[MermaidDiagram] render error:", e);
  } finally {
    if (seq === renderSeq) loading.value = false;
  }
};

onMounted(render);
watch(() => props.code, render);
watch(() => props.diagramId, render);
</script>

<template>
  <div class="mermaid-wrapper">
    <div v-if="loading" class="mermaid-loading">
      <span class="mermaid-dots">rendering</span>
      <span class="streaming-cursor" aria-hidden="true"></span>
    </div>
    <div v-else-if="error" class="mermaid-error">
      <span>⚠ {{ error }}</span>
    </div>
    <div ref="containerRef" class="mermaid-container" :class="{ hidden: loading }"></div>
  </div>
</template>
