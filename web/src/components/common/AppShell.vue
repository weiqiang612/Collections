<script setup>
const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Agent", href: "#resume-agent" },
];
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <a class="brand-mark" href="#hero" aria-label="Back to hero">
        <span class="brand-dot"></span>
        <span>weiqiang</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a v-for="item in navItems" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
