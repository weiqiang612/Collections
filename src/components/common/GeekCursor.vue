<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";

const dotRef = ref(null);
const ringRef = ref(null);
const isHovering = ref(false);
const isMobile = ref(true);

let ctx;

onMounted(async () => {
  // Hide custom cursor on touch/mobile devices or if screen is small
  isMobile.value = window.matchMedia("(max-width: 768px)").matches || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
  
  if (isMobile.value) return;

  // Wait for Vue to update DOM to ensure dotRef and ringRef are rendered
  await nextTick();

  // Add class to body to handle pointer behavior
  document.body.classList.add("custom-cursor-active");

  ctx = gsap.context(() => {
    const dot = dotRef.value;
    const ring = ringRef.value;

    if (!dot || !ring) return;

    // Set initial states
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50, width: 24, height: 24, borderRadius: "50%" });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    // QuickTo operators for fast cursor tracking
    const dotX = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power3" });

    let activeEl = null;
    let activeCenterX = null;
    let activeCenterY = null;

    const resetCursor = () => {
      activeEl = null;
      activeCenterX = null;
      activeCenterY = null;
      isHovering.value = false;

      gsap.to(ring, {
        width: 24,
        height: 24,
        borderRadius: "50%",
        borderColor: "rgba(139, 233, 253, 0.4)", // cyan
        backgroundColor: "transparent",
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto"
      });

      gsap.to(dot, {
        scale: 1.0,
        backgroundColor: "#50fa7b", // green
        duration: 0.2
      });
    };

    const onMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      dotX(pos.x);
      dotY(pos.y);

      // Safety check: if the active element has been removed from DOM, reset cursor immediately
      if (activeEl && !document.body.contains(activeEl)) {
        resetCursor();
      }

      // If we are not hovering over an interactive item, track mouse
      if (!activeEl) {
        ringX(pos.x);
        ringY(pos.y);
      } else if (activeCenterX !== null && activeCenterY !== null) {
        // Calculate viewport-relative center coordinates from cached page-relative coordinates
        const elCenterX = activeCenterX - window.scrollX;
        const elCenterY = activeCenterY - window.scrollY;
        // Subtle magnetic pull on the ring: 85% element center, 15% cursor position
        ringX(elCenterX + (pos.x - elCenterX) * 0.15);
        ringY(elCenterY + (pos.y - elCenterY) * 0.15);
      }
    };

    const onMouseOver = (e) => {
      // Find closest interactive element
      const target = e.target.closest("a, button, .tech-chip, .hero-chip, .diagram-tab, .stack-list span");
      if (target) {
        activeEl = target;
        isHovering.value = true;
        
        const rect = target.getBoundingClientRect();
        // Cache document-relative center coordinates to avoid layout thrashing during mousemove
        activeCenterX = rect.left + window.scrollX + rect.width / 2;
        activeCenterY = rect.top + window.scrollY + rect.height / 2;
        
        // Stop standard tracking coordinates, animate size to wrap element
        gsap.to(ring, {
          width: rect.width + 10,
          height: rect.height + 6,
          borderRadius: "4px",
          borderColor: "rgba(80, 250, 123, 0.85)", // green
          backgroundColor: "rgba(80, 250, 123, 0.04)",
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto"
        });

        // Slight dot scaling or color change
        gsap.to(dot, {
          scale: 1.4,
          backgroundColor: "#8be9fd", // cyan
          duration: 0.2
        });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest("a, button, .tech-chip, .hero-chip, .diagram-tab, .stack-list span");
      if (target && activeEl === target) {
        resetCursor();
      }
    };

    const onGlobalClick = (e) => {
      if (activeEl) {
        const target = e.target.closest("a, button, .tech-chip, .hero-chip, .diagram-tab, .stack-list span");
        if (target && target === activeEl) {
          resetCursor();
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("click", onGlobalClick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("click", onGlobalClick);
    };
  });
});

onUnmounted(() => {
  document.body.classList.remove("custom-cursor-active");
  ctx?.revert();
});
</script>

<template>
  <div v-if="!isMobile" class="geek-cursor-wrapper" aria-hidden="true">
    <div ref="dotRef" class="geek-cursor-dot"></div>
    <div ref="ringRef" class="geek-cursor-ring" :class="{ 'is-hovering': isHovering }"></div>
  </div>
</template>

<style scoped>
.geek-cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  pointer-events: none;
}

.geek-cursor-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  background: var(--color-green, #50fa7b);
  border-radius: 1px; /* terminal block shape */
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 0 8px var(--color-green, #50fa7b);
}

.geek-cursor-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(139, 233, 253, 0.4);
  pointer-events: none;
  z-index: 100000;
  box-shadow: 0 0 10px rgba(139, 233, 253, 0.05);
  transition: border-color 0.15s, background-color 0.15s;
}

.geek-cursor-ring.is-hovering {
  box-shadow: 0 0 12px rgba(80, 250, 123, 0.15);
}
</style>
