"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { sectionNavigation } from "@/config/navigation";
import { hasLocale, locales, getLocaleLabel, type Locale } from "@/i18n/config";
import { useDictionary } from "@/i18n/dictionary-provider";
import styles from "./navbar.module.css";

interface ScrollPosition {
  top: number;
  anchor?: { id: string; viewportTop: number };
}

interface LocaleNavigation {
  pathname: string;
  position: ScrollPosition;
  keyboardSource?: HTMLButtonElement;
}

let pendingNavigation: LocaleNavigation | undefined;

function cancelLocaleNavigation() {
  pendingNavigation = undefined;
  window.removeEventListener("popstate", cancelLocaleNavigation);
}

function prepareLocaleNavigation(navigation: LocaleNavigation) {
  pendingNavigation = navigation;
  window.addEventListener("popstate", cancelLocaleNavigation, { once: true });
}

function consumeLocaleNavigation(pathname: string) {
  const navigation = pendingNavigation;
  if (navigation?.pathname !== pathname) return undefined;

  cancelLocaleNavigation();
  return navigation;
}

function currentAnchorId() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return "";
  }
}

function captureScrollPosition(): ScrollPosition {
  const top = window.scrollY;
  if (top <= 8) return { top };

  const readingLine = Math.max(112, window.innerHeight * 0.22);
  const ids = [...sectionNavigation.map(({ id }) => id), currentAnchorId()];
  let anchor: ScrollPosition["anchor"];
  for (const id of ids) {
    const element = document.getElementById(id);
    if (!element) continue;

    const viewportTop = element.getBoundingClientRect().top;
    if (viewportTop <= readingLine && (!anchor || viewportTop > anchor.viewportTop)) {
      anchor = { id, viewportTop };
    }
  }

  return { top, anchor };
}

function restoreScrollPosition({ top, anchor }: ScrollPosition) {
  const element = anchor && document.getElementById(anchor.id);
  const target = element && anchor
    ? window.scrollY + element.getBoundingClientRect().top - anchor.viewportTop
    : top;
  if (Math.abs(target - window.scrollY) > 1) {
    window.scrollTo({ top: target, behavior: "instant" });
  }
}

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale: currentLocale, dict } = useDictionary();
  const selector = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = selector.current;
    if (!element) return;

    const navigation = consumeLocaleNavigation(pathname);
    if (!navigation) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) element.dataset.slide = currentLocale;
    restoreScrollPosition(navigation.position);

    const active = document.activeElement;
    if (navigation.keyboardSource && (active === document.body || active === navigation.keyboardSource)) {
      const control = element.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
      // The labeled group is a fallback if the selected button is unavailable.
      (control ?? element).focus({ preventScroll: true });
    }
  }, [currentLocale, pathname]);

  function switchLocale(nextLocale: Locale, event: MouseEvent<HTMLButtonElement>) {
    if (nextLocale === currentLocale) return;

    const segments = pathname.split("/");
    if (hasLocale(segments[1] ?? "")) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }

    const nextPath = segments.join("/") || `/${nextLocale}`;
    prepareLocaleNavigation({
      pathname: nextPath,
      position: captureScrollPosition(),
      keyboardSource: event.detail === 0 ? event.currentTarget : undefined,
    });
    router.push(`${nextPath}${window.location.search}${window.location.hash}`, { scroll: false });
  }

  return (
    <div
      ref={selector}
      className={styles.localeSwitch}
      data-english={currentLocale === "en"}
      role="group"
      tabIndex={-1}
      aria-label={dict.common.header.language}
    >
      <span
        className={styles.localeThumb}
        aria-hidden="true"
        onAnimationEnd={() => {
          if (selector.current) delete selector.current.dataset.slide;
        }}
      />
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          className="motion-transition-colors"
          onClick={(event) => switchLocale(locale, event)}
          aria-pressed={currentLocale === locale}
        >
          <span className={styles.flag} data-locale={locale} aria-hidden="true" />
          <span>{getLocaleLabel(locale)}</span>
        </button>
      ))}
    </div>
  );
}
