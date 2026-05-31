import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

createApp(App).use(router).mount("#app");

