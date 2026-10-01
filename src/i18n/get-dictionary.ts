import type { Locale } from "@/i18n/config";
import { hasLocale } from "@/i18n/config";

const dictionaries = {
  es: () =>
    Promise.all([
      import("@/i18n/locales/es/common.json").then((m) => m.default),
      import("@/i18n/locales/es/home.json").then((m) => m.default),
      import("@/i18n/locales/es/projects.json").then((m) => m.default),
      import("@/i18n/locales/es/stack.json").then((m) => m.default),
      import("@/i18n/locales/es/about.json").then((m) => m.default),
      import("@/i18n/locales/es/contact.json").then((m) => m.default),
    ]).then(([common, home, projects, stack, about, contact]) => ({
      common,
      home,
      projects,
      stack,
      about,
      contact,
    })),
  en: () =>
    Promise.all([
      import("@/i18n/locales/en/common.json").then((m) => m.default),
      import("@/i18n/locales/en/home.json").then((m) => m.default),
      import("@/i18n/locales/en/projects.json").then((m) => m.default),
      import("@/i18n/locales/en/stack.json").then((m) => m.default),
      import("@/i18n/locales/en/about.json").then((m) => m.default),
      import("@/i18n/locales/en/contact.json").then((m) => m.default),
    ]).then(([common, home, projects, stack, about, contact]) => ({
      common,
      home,
      projects,
      stack,
      about,
      contact,
    })),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["es"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!hasLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  return dictionaries[locale]();
}
