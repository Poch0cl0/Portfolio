import esCommon from "@/i18n/locales/es/common.json";
import esHome from "@/i18n/locales/es/home.json";
import esProjects from "@/i18n/locales/es/projects.json";
import esStack from "@/i18n/locales/es/stack.json";
import esAbout from "@/i18n/locales/es/about.json";
import esContact from "@/i18n/locales/es/contact.json";
import enCommon from "@/i18n/locales/en/common.json";
import enHome from "@/i18n/locales/en/home.json";
import enProjects from "@/i18n/locales/en/projects.json";
import enStack from "@/i18n/locales/en/stack.json";
import enAbout from "@/i18n/locales/en/about.json";
import enContact from "@/i18n/locales/en/contact.json";
import { describe, expect, it } from "vitest";

function collectKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      return collectKeys(nested, nextPrefix);
    }
    return [nextPrefix];
  });
}

const esDictionary = {
  common: esCommon,
  home: esHome,
  projects: esProjects,
  stack: esStack,
  about: esAbout,
  contact: esContact,
};

const enDictionary = {
  common: enCommon,
  home: enHome,
  projects: enProjects,
  stack: enStack,
  about: enAbout,
  contact: enContact,
};

describe("i18n dictionaries", () => {
  it("keeps matching keys between es and en", () => {
    const esKeys = collectKeys(esDictionary).sort();
    const enKeys = collectKeys(enDictionary).sort();

    expect(enKeys).toEqual(esKeys);
  });
});
