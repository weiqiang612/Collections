<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AppShell from "../components/common/AppShell.vue";
import HeroSection from "../components/hero/HeroSection.vue";
import AboutSection from "../components/about/AboutSection.vue";
import ProjectsSection from "../components/projects/ProjectsSection.vue";
import ResumeAgentLauncher from "../components/agent/ResumeAgentLauncher.vue";
import ResumeAgentPanel from "../components/agent/ResumeAgentPanel.vue";

const agentOpen = ref(false);

const handleGlobalClick = (e) => {
  // Catch any clicks on elements with href="#resume-agent" or their children
  const target = e.target.closest('a[href="#resume-agent"]');
  if (target) {
    e.preventDefault();
    agentOpen.value = true;
  }
};

let scrollTimeout;
const handleScroll = () => {
  document.body.classList.add("is-scrolling");
  
  clearTimeout(scrollTimeout);
  scrollTimeout = window.setTimeout(() => {
    document.body.classList.remove("is-scrolling");
  }, 150);
};

onMounted(() => {
  window.addEventListener("click", handleGlobalClick);
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("click", handleGlobalClick);
  window.removeEventListener("scroll", handleScroll);
  clearTimeout(scrollTimeout);
});
</script>

<template>
  <AppShell>
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
    <ResumeAgentPanel v-if="agentOpen" @close="agentOpen = false" />
    <ResumeAgentLauncher :open="agentOpen" @toggle="agentOpen = !agentOpen" />
  </AppShell>
</template>
