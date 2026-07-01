import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProjectDetailView from "../views/ProjectDetailView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  {
    path: "/projects/:projectId",
    name: "ProjectDetail",
    component: ProjectDetailView,
    beforeEnter: (to) => {
      const allowedProjects = ["sky-takeout", "hm-dianping", "equipment-management", "personal-crm"];
      if (allowedProjects.includes(to.params.projectId)) {
        return true;
      }

      return { name: "NotFound", replace: true };
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.path !== from.path) {
      return { top: 0, left: 0 };
    }

    return undefined;
  },
});

export default router;

