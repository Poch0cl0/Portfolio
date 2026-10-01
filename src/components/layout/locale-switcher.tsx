"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, getLocaleLabel, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const SCROLL_STORAGE_KEY = "portfolio:locale-scroll";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale =
    locales.find(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    ) ?? "es";

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!saved) {
      return;
    }

    const scrollY = Number(saved);
    if (!Number.isFinite(scrollY)) {
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
      return;
    }

    const restore = () => {
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };

    restore();
    const frame = requestAnimationFrame(restore);
    const timeout = window.setTimeout(() => {
      restore();
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    }, 80);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale) {
      return;
    }

    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }

    const nextPath = segments.join("/") || `/${nextLocale}`;
    const hash = window.location.hash;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, String(window.scrollY));
    router.push(`${nextPath}${hash}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center rounded-full bg-surface-container-low p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
      role="group"
      aria-label="Language"
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-label-caps transition-colors",
            currentLocale === locale
              ? "bg-surface-container-high font-medium text-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
          aria-pressed={currentLocale === locale}
        >
          {getLocaleLabel(locale)}
        </button>
      ))}
    </div>
  );
}
