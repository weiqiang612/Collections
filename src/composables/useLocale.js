import { computed, ref } from "vue";
import { defaultLocale, localeLabels, messages, supportedLocales } from "../data/i18n";

const storageKey = "ethan-portfolio-locale";

function isSupportedLocale(value) {
  return supportedLocales.includes(value);
}

function getUrlLocale() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("lang") ?? "";
}

function getStoredLocale() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(storageKey) ?? "";
}

function resolveInitialLocale() {
  const urlLocale = getUrlLocale();
  if (isSupportedLocale(urlLocale)) {
    return urlLocale;
  }

  if (urlLocale) {
    return defaultLocale;
  }

  const storedLocale = getStoredLocale();
  if (isSupportedLocale(storedLocale)) {
    return storedLocale;
  }

  return defaultLocale;
}

const locale = ref(resolveInitialLocale());

function persistLocale(nextLocale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, nextLocale);
}

function writeLocaleToUrl(nextLocale) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("lang", nextLocale);
  window.history.replaceState(window.history.state, "", url);
}

function setLocale(nextLocale, options = {}) {
  if (!isSupportedLocale(nextLocale)) {
    nextLocale = defaultLocale;
  }

  locale.value = nextLocale;
  persistLocale(nextLocale);

  if (options.updateUrl !== false) {
    writeLocaleToUrl(nextLocale);
  }
}

if (typeof window !== "undefined") {
  persistLocale(locale.value);

  if (!isSupportedLocale(getUrlLocale())) {
    writeLocaleToUrl(locale.value);
  }

  window.addEventListener("popstate", () => {
    const urlLocale = getUrlLocale();
    setLocale(isSupportedLocale(urlLocale) ? urlLocale : defaultLocale, { updateUrl: false });
  });
}

export function useLocale() {
  const t = computed(() => messages[locale.value] ?? messages[defaultLocale]);
  const nextLocale = computed(() => (locale.value === "zh-CN" ? "en-US" : "zh-CN"));
  const currentLabel = computed(() => localeLabels[locale.value]);
  const nextLabel = computed(() => localeLabels[nextLocale.value]);

  function toggleLocale() {
    setLocale(nextLocale.value);
  }

  return {
    locale,
    t,
    nextLocale,
    currentLabel,
    nextLabel,
    setLocale,
    toggleLocale,
  };
}
