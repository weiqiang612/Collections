import { computed, onBeforeUnmount, ref, watchEffect } from "vue";

export function useTypewriter(lines, options = {}) {
  const delay = options.delay ?? 34;
  const hold = options.hold ?? 900;
  const lineIndex = ref(0);
  const charIndex = ref(0);
  const timer = ref(null);

  const currentLine = computed(() => lines[lineIndex.value] ?? "");
  const text = computed(() => currentLine.value.slice(0, charIndex.value));

  function clearTimer() {
    if (timer.value) {
      window.clearTimeout(timer.value);
      timer.value = null;
    }
  }

  watchEffect(() => {
    clearTimer();

    if (!lines.length) {
      return;
    }

    if (charIndex.value < currentLine.value.length) {
      timer.value = window.setTimeout(() => {
        charIndex.value += 1;
      }, delay);
      return;
    }

    timer.value = window.setTimeout(() => {
      lineIndex.value = (lineIndex.value + 1) % lines.length;
      charIndex.value = 0;
    }, hold);
  });

  onBeforeUnmount(clearTimer);

  return { text, lineIndex };
}
