import { createRouter, createWebHistory } from "vue-router";
import Hero from "../views/Hero.vue";
import About from "../views/About.vue";
import Projects from "../views/Projects.vue";
import ResumeAgent from "../views/ResumeAgent.vue";

const routes = [
  { path: "/", name: "Hero", component: Hero },
  { path: "/about", name: "About", component: About },
  { path: "/projects", name: "Projects", component: Projects },
  { path: "/resume-agent", name: "ResumeAgent", component: ResumeAgent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
