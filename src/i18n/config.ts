export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const LOCALE_REQUEST_HEADER = "x-portfolio-locale";

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleLabel(locale: Locale): string {
  return locale === "es" ? "ES" : "EN";
}
