<script setup>
import { computed } from "vue";

const props = defineProps({
  media: {
    type: Object,
    required: true,
  },
});

const isVideoMode = computed(() => props.media.type === "video");
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
        <div class="project-media-feature">
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
            <div class="project-media-grid">
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
