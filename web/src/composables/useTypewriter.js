import { computed, onBeforeUnmount, ref, unref, watch, watchEffect } from "vue";

export function useTypewriter(lines, options = {}) {
  const delay = options.delay ?? 34;
  const hold = options.hold ?? 900;
  const lineIndex = ref(0);
  const charIndex = ref(0);
  const timer = ref(null);

  const lineList = computed(() => unref(lines) ?? []);
  const currentLine = computed(() => lineList.value[lineIndex.value] ?? "");
  const text = computed(() => currentLine.value.slice(0, charIndex.value));

  function clearTimer() {
    if (timer.value) {
      window.clearTimeout(timer.value);
      timer.value = null;
    }
  }

  watchEffect(() => {
    clearTimer();

    if (!lineList.value.length) {
      return;
    }

    if (charIndex.value < currentLine.value.length) {
      timer.value = window.setTimeout(() => {
        charIndex.value += 1;
      }, delay);
      return;
    }

    timer.value = window.setTimeout(() => {
      lineIndex.value = (lineIndex.value + 1) % lineList.value.length;
      charIndex.value = 0;
    }, hold);
  });

  watch(lineList, () => {
    lineIndex.value = 0;
    charIndex.value = 0;
  });

  onBeforeUnmount(clearTimer);

  return { text, lineIndex };
}
