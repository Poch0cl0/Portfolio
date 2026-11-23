"use client";

import { useLayoutEffect } from "react";
import type { Locale } from "@/i18n/config";

export function SetHtmlLang({ locale }: { locale: Locale }) {
  // The shared root stays mounted during localized client navigations.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.lang !== locale) root.lang = locale;
  }, [locale]);

  return null;
}
