<script setup>
import { ref } from "vue";
import AppShell from "../components/common/AppShell.vue";
import HeroSection from "../components/hero/HeroSection.vue";
import AboutSection from "../components/about/AboutSection.vue";
import ProjectsSection from "../components/projects/ProjectsSection.vue";
import ResumeAgentLauncher from "../components/agent/ResumeAgentLauncher.vue";
import ResumeAgentPanel from "../components/agent/ResumeAgentPanel.vue";

const agentOpen = ref(false);
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
