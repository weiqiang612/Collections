<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import mermaid from "../../utils/mermaid.js";
import { useLocale } from "../../composables/useLocale";

const props = defineProps({
  code: { type: String, required: true },
  diagramId: { type: String, required: true },
});

const { t } = useLocale();

const containerRef = ref(null);
const loading = ref(true);
const error = ref(null);

const scale = ref(1.0);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const isFullscreen = ref(false);

let renderSeq = 0;

const updateTransform = () => {
  if (!containerRef.value) return;
  const svgEl = containerRef.value.querySelector("svg");
  if (svgEl) {
    if (scale.value === 1.0 && translateX.value === 0 && translateY.value === 0) {
      svgEl.style.transform = "";
      svgEl.style.transformOrigin = "";
      svgEl.style.transition = "";
    } else {
      svgEl.style.transform = `translate3d(${translateX.value}px, ${translateY.value}px, 0px) scale(${scale.value})`;
      svgEl.style.transformOrigin = "center center";
      svgEl.style.transition = isDragging.value ? "none" : "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  }
};

const resetZoom = () => {
  scale.value = 1.0;
  translateX.value = 0;
  translateY.value = 0;
  updateTransform();
};

const zoomIn = () => {
  scale.value = Math.min(5.0, Number((scale.value * 1.25).toFixed(2)));
  updateTransform();
};

const zoomOut = () => {
  scale.value = Math.max(0.4, Number((scale.value / 1.25).toFixed(2)));
  updateTransform();
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  resetZoom();
};

// Pointer events for unified mouse and touch dragging
let isPointerDown = false;
let startPointerX = 0;
let startPointerY = 0;
let startTranslateX = 0;
let startTranslateY = 0;

const handlePointerDown = (e) => {
  // Only pan on left click (0) or touch/pen pointer types
  if (e.button !== 0 && e.pointerType === "mouse") return;
  if (e.target.closest(".diagram-toolbar")) return;
  if (loading.value || error.value) return;

  isPointerDown = true;
  isDragging.value = true;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
  startTranslateX = translateX.value;
  startTranslateY = translateY.value;

  if (containerRef.value) {
    containerRef.value.setPointerCapture(e.pointerId);
  }
  e.preventDefault();
};

const handlePointerMove = (e) => {
  if (!isPointerDown) return;
  const dx = e.clientX - startPointerX;
  const dy = e.clientY - startPointerY;
  translateX.value = startTranslateX + dx;
  translateY.value = startTranslateY + dy;
  updateTransform();
};

const handlePointerUp = (e) => {
  if (!isPointerDown) return;
  isPointerDown = false;
  isDragging.value = false;
  if (containerRef.value) {
    try {
      containerRef.value.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }
  updateTransform();
};

const handleWheel = (e) => {
  // Zoom on wheel only in fullscreen or when holding Ctrl to prevent scroll hijacking
  if (isFullscreen.value || e.ctrlKey) {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      scale.value = Math.min(5.0, Number((scale.value * zoomFactor).toFixed(2)));
    } else {
      scale.value = Math.max(0.4, Number((scale.value / zoomFactor).toFixed(2)));
    }
    updateTransform();
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Escape" && isFullscreen.value) {
    isFullscreen.value = false;
    resetZoom();
  }
};

const render = async () => {
  if (!containerRef.value) return;
  loading.value = true;
  error.value = null;
  const seq = ++renderSeq;
  const id = `mmd-${props.diagramId}-${seq}`;
  try {
    const { svg } = await mermaid.render(id, props.code);
    if (seq !== renderSeq) return;
    containerRef.value.innerHTML = svg;
    
    const svgEl = containerRef.value.querySelector("svg");
    if (svgEl) {
      svgEl.removeAttribute("height");
      svgEl.style.maxWidth = "100%";
      svgEl.style.maxHeight = "100%";
      svgEl.style.width = "auto";
      svgEl.style.height = "auto";
      svgEl.style.display = "block";
    }
    resetZoom();
  } catch (e) {
    if (seq !== renderSeq) return;
    error.value = e?.message || "Diagram render error";
    console.error("[MermaidDiagram] render error:", e);
  } finally {
    if (seq === renderSeq) loading.value = false;
  }
};

onMounted(() => {
  render();
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

watch(() => props.code, render);
watch(() => props.diagramId, render);
</script>

<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div class="mermaid-wrapper" :class="{ 'is-fullscreen': isFullscreen }">
      <!-- Floating Terminal-style Toolbar -->
      <div v-if="!loading && !error" class="diagram-toolbar">
        <button @click="zoomIn" class="toolbar-btn" :title="t.projectCard.zoomIn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button @click="zoomOut" class="toolbar-btn" :title="t.projectCard.zoomOut">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button @click="resetZoom" class="toolbar-btn" :title="t.projectCard.reset">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </button>
        <button @click="toggleFullscreen" class="toolbar-btn" :title="isFullscreen ? t.projectCard.exitFullscreen : t.projectCard.fullscreen">
          <svg v-if="isFullscreen" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>
          </svg>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="mermaid-loading">
        <span class="mermaid-dots">rendering</span>
        <span class="streaming-cursor" aria-hidden="true"></span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="mermaid-error">
        <span>⚠ {{ error }}</span>
      </div>

      <!-- Interactive diagram canvas -->
      <div
        ref="containerRef"
        class="mermaid-container"
        :class="{ hidden: loading, 'is-dragging': isDragging }"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @wheel="handleWheel"
      ></div>

      <!-- Localized instruction/operation tip -->
      <div v-if="!loading && !error" class="diagram-tip" :class="{ 'fullscreen-tip': isFullscreen }">
        <span>{{ isFullscreen ? t.projectCard.fullscreenTip : t.projectCard.tip }}</span>
      </div>
    </div>
  </Teleport>
</template>
