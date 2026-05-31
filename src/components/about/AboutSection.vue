<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import SectionTitle from "../common/SectionTitle.vue";
import { useLocale } from "../../composables/useLocale";
import { getProfile } from "../../services/profileClient";
import { gsap } from "gsap";

const { t } = useLocale();
const profile = getProfile();

const methodologySteps = computed(() => {
  const steps = profile.methodology ?? [];
  const order = ["Why", "What", "How", "Deep Dive"];
  return order.map((stepName) => steps.find((item) => item.step === stepName || item.title === stepName)).filter(Boolean);
});

const techGroups = computed(() => profile.techStack ?? []);
const description = computed(() => profile.summary || t.value.about.description);

const aboutContainer = ref(null);
let ctx;

onMounted(() => {
  if (!aboutContainer.value) return;
  ctx = gsap.context(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // About Section title reveal (scoped)
    gsap.from(".section-title", {
      scrollTrigger: {
        trigger: ".section-title",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      autoAlpha: 0,
      y: 20,
      duration: 0.7,
      ease: "power2.out"
    });

    // Methodology Panel reveal
    gsap.from(".methodology-item", {
      scrollTrigger: {
        trigger: ".methodology-panel",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      autoAlpha: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out"
    });

    // Tech Panel reveal
    gsap.from(".tech-group", {
      scrollTrigger: {
        trigger: ".tech-panel",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      autoAlpha: 0,
      x: 30,
      stagger: 0.12,
      duration: 0.7,
      ease: "power2.out"
    });

    // Animate tech-chips inside tech groups
    gsap.from(".tech-chip", {
      scrollTrigger: {
        trigger: ".tech-panel",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      autoAlpha: 0,
      scale: 0.8,
      stagger: 0.03,
      duration: 0.4,
      ease: "back.out(1.2)"
    });
  }, aboutContainer.value);
});

onUnmounted(() => {
  ctx?.revert();
});

const handleChipMouseMove = (e) => {
  const chip = e.currentTarget;
  const rect = chip.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  gsap.to(chip, {
    x: x * 0.35,
    y: y * 0.35,
    scale: 1.05,
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto"
  });
};

const handleChipMouseLeave = (e) => {
  const chip = e.currentTarget;
  gsap.to(chip, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: "power3.out",
    overwrite: "auto"
  });
};
</script>

<template>
  <section id="about" ref="aboutContainer" class="section-band">
    <SectionTitle
      :eyebrow="t.about.eyebrow"
      :title="t.about.title"
      :description="description"
    />

    <div class="about-grid">
      <div class="methodology-panel">
        <div class="panel-caption">Why -> What -> How -> Deep Dive</div>
        <div v-for="item in methodologySteps" :key="item.step" class="methodology-item">
          <span class="methodology-step">{{ item.step }}</span>
          <div class="methodology-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="tech-panel">
        <h3>{{ t.about.techTitle }}</h3>
        <div class="tech-groups">
          <div v-for="group in techGroups" :key="group.category" class="tech-group">
            <div class="tech-meta">
              <span>{{ group.category }}</span>
              <small>{{ group.items.length }} items</small>
            </div>
            <div class="tech-chip-list">
              <span
                v-for="item in group.items"
                :key="item"
                class="tech-chip"
                @mousemove="handleChipMouseMove"
                @mouseleave="handleChipMouseLeave"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
