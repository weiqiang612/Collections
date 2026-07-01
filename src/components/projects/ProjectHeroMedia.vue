<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  media: {
    type: Object,
    required: true,
  },
});

const isVideoMode = computed(() => props.media.type === "video");
const hasDemoScreens = computed(() => {
  return isVideoMode.value && Array.isArray(props.media.demoScreens) && props.media.demoScreens.length > 0;
});
const hasMediaScreens = computed(() => {
  return Array.isArray(props.media.screens) && props.media.screens.length > 0;
});
const activeDemoIndex = ref(0);
const prefersReducedMotion = ref(false);
const isPaused = ref(false);
let rotationTimer = null;

const activeDemoScreen = computed(() => {
  if (!hasDemoScreens.value) return null;
  return props.media.demoScreens[activeDemoIndex.value];
});

const stopRotation = () => {
  isPaused.value = true;
  if (rotationTimer) {
    window.clearInterval(rotationTimer);
    rotationTimer = null;
  }
};

const startRotation = () => {
  isPaused.value = false;
  stopRotation();
  isPaused.value = false;

  if (!hasDemoScreens.value || prefersReducedMotion.value || props.media.demoScreens.length < 2) {
    return;
  }

  rotationTimer = window.setInterval(() => {
    activeDemoIndex.value = (activeDemoIndex.value + 1) % props.media.demoScreens.length;
  }, 4200);
};

const selectDemoScreen = (index) => {
  activeDemoIndex.value = index;
  startRotation();
};

const showPreviousDemo = () => {
  if (!hasDemoScreens.value) return;
  activeDemoIndex.value =
    (activeDemoIndex.value - 1 + props.media.demoScreens.length) % props.media.demoScreens.length;
  startRotation();
};

const showNextDemo = () => {
  if (!hasDemoScreens.value) return;
  activeDemoIndex.value = (activeDemoIndex.value + 1) % props.media.demoScreens.length;
  startRotation();
};

watch(
  () => props.media.demoScreens,
  () => {
    activeDemoIndex.value = 0;
    startRotation();
  },
  { deep: true }
);

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  startRotation();
});

onUnmounted(() => {
  stopRotation();
});
</script>

<template>
  <section class="project-media-shell" :data-mode="media.type">
    <div class="media-frame">
      <div class="media-header">
        <div class="media-dots" aria-hidden="true">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="media-title">{{ media.label }}</span>
      </div>

      <div class="project-media-body">
        <template v-if="hasDemoScreens">
          <div class="project-media-hero-copy has-demo-screens">
            <div class="project-media-badges" v-if="media.badges?.length">
              <span v-for="badge in media.badges" :key="badge" class="project-media-badge">
                {{ badge }}
              </span>
            </div>

            <div class="project-media-intro-row">
              <div v-if="isVideoMode" class="project-media-play" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>

              <div class="project-media-intro-copy">
                <p class="project-media-eyebrow">{{ media.eyebrow }}</p>
                <h2 class="project-media-headline">{{ media.headline }}</h2>
                <p class="project-media-description">{{ media.description }}</p>
              </div>
            </div>
          </div>

          <div
            class="project-media-surface project-media-surface-demo"
            @mouseenter="stopRotation"
            @mouseleave="startRotation"
          >
            <div class="project-media-demo" :class="{ 'is-paused': isPaused }">
              <div class="project-media-demo-stage">
                <div class="project-media-stage-viewport">
                  <button
                    class="project-media-nav project-media-nav-prev"
                    type="button"
                    :aria-label="`Previous step`"
                    @click="showPreviousDemo"
                  >
                    ‹
                  </button>

                  <div class="project-media-phone-shell">
                    <div class="project-media-phone-header" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="project-media-phone-images-container">
                      <img
                        v-for="(screen, index) in media.demoScreens"
                        :key="screen.title"
                        class="project-media-phone-image-layered"
                        :class="{ 'is-active': index === activeDemoIndex }"
                        :src="screen.src"
                        :alt="screen.title"
                        :loading="index === 0 ? 'eager' : 'lazy'"
                      />
                    </div>
                  </div>

                  <button
                    class="project-media-nav project-media-nav-next"
                    type="button"
                    :aria-label="`Next step`"
                    @click="showNextDemo"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div v-if="activeDemoScreen" class="project-media-demo-copy">
                <p class="project-media-demo-step">{{ activeDemoScreen.stepLabel }}</p>
                <p class="project-media-demo-title">{{ activeDemoScreen.title }}</p>
                <p class="project-media-demo-description">{{ activeDemoScreen.description }}</p>
              </div>

              <div class="project-media-demo-steps" role="tablist" aria-label="Demo steps">
                <button
                  v-for="(screen, index) in media.demoScreens"
                  :key="screen.title"
                  class="project-media-step-tab"
                  :class="{ 'is-active': index === activeDemoIndex }"
                  type="button"
                  role="tab"
                  :aria-selected="index === activeDemoIndex"
                  @click="selectDemoScreen(index)"
                >
                  <span class="project-media-step-index">{{ String(index + 1).padStart(2, "0") }}</span>
                  <span class="project-media-step-label">{{ screen.stepLabel }}</span>
                  
                  <div class="project-media-step-progress-bar">
                    <div 
                      class="project-media-step-progress-fill"
                      :class="{
                        'is-completed': index < activeDemoIndex,
                        'is-active': index === activeDemoIndex,
                        'is-pending': index > activeDemoIndex
                      }"
                    ></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="project-media-feature">
          <div class="project-media-hero-copy">
            <div class="project-media-badges" v-if="media.badges?.length">
              <span v-for="badge in media.badges" :key="badge" class="project-media-badge">
                {{ badge }}
              </span>
            </div>

            <div v-if="isVideoMode" class="project-media-play" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>

            <p class="project-media-eyebrow">{{ media.eyebrow }}</p>
            <h2 class="project-media-headline">{{ media.headline }}</h2>
            <p class="project-media-description">{{ media.description }}</p>
          </div>

          <div class="project-media-surface">
            <div v-if="hasMediaScreens" class="project-media-screens-grid">
              <article
                v-for="screen in media.screens"
                :key="screen.title"
                class="project-media-screen-card"
              >
                <img
                  class="project-media-screen-image"
                  :src="screen.src"
                  :alt="screen.title"
                  loading="lazy"
                />
                <div class="project-media-screen-copy">
                  <p class="project-media-frame-title">{{ screen.title }}</p>
                  <p class="project-media-frame-text">{{ screen.description }}</p>
                </div>
              </article>
            </div>

            <div v-else class="project-media-grid">
              <article
                v-for="frame in media.frames"
                :key="frame.title"
                class="project-media-frame-card"
              >
                <p class="project-media-frame-title">{{ frame.title }}</p>
                <p class="project-media-frame-text">{{ frame.description }}</p>
              </article>
            </div>
          </div>
        </div>

        <div class="project-media-footer" v-if="media.footer">
          <span class="project-media-footer-label">{{ media.footer.label }}</span>
          <span class="project-media-footer-value">{{ media.footer.value }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
