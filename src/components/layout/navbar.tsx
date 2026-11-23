"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { sectionHref, sectionNavigation } from "@/config/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ContactTrigger } from "@/features/contact/components/contact-trigger";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDictionary } from "@/i18n/dictionary-provider";
import styles from "./navbar.module.css";

const sectionIds = sectionNavigation.map((item) => item.id);
let navbarEntered = false;

export function Navbar({ fontVariables }: { fontVariables: string }) {
  const pathname = usePathname();
  const { locale, dict } = useDictionary();
  const { activeId, compact } = useActiveSection(sectionIds, pathname);
  const reducedMotion = useReducedMotion();
  const homeHref = `/${locale}`;
  const labels = dict.common.header;
  const active = pathname === homeHref ? activeId : null;
  const shell = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = shell.current;
    if (!element || element.dataset.entry) return;
    element.dataset.entry = navbarEntered ? "skip" : "initial";
    navbarEntered = true;
  }, []);


  function scrollToTop(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== homeHref || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (window.location.hash) window.history.replaceState(null, "", homeHref + window.location.search);
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }

  function renderNavigation(desktop: boolean, onNavigate?: () => void) {
    const items = sectionNavigation.map(({ id, labelKey }) => ({
      id,
      label: labelKey === "stack" ? labels.technologies : dict.common.nav[labelKey],
      href: `${pathname === homeHref ? "" : homeHref}${sectionHref(id)}`,
    }));

    return (
      <nav aria-label={labels.navigation} className={desktop ? styles.dock : styles.mobileDock}>
        {items.map(({ id, label, href }) => (
          <Link
            key={id}
            href={href}
            className={cn(styles.navItem, "motion-transition-colors")}
            aria-current={active === id ? "location" : undefined}
            onClick={onNavigate}
          >
            {desktop && active === id ? (
              <motion.span
                aria-hidden="true"
                className={styles.indicator}
                layoutId={reducedMotion ? undefined : "active"}
                initial={false}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
            <span>{label}</span>
          </Link>
        ))}
        <ContactTrigger variant="ghost" className={cn(styles.navItem, "motion-transition-colors")} onClick={onNavigate}>
          <span>{labels.contact}</span>
        </ContactTrigger>
      </nav>
    );
  }

  return (
    <header className={cn(styles.header, fontVariables)} data-compact={compact}>
      <div className={styles.shell} ref={shell}>
        <Link href={homeHref} onClick={scrollToTop} className={styles.brand}
          aria-label={`${siteConfig.shortName} · ${labels.home}`}>
          <span aria-hidden="true" className={styles.monogram}>JP</span>
          <span className={styles.name}>{siteConfig.shortName}</span>
        </Link>
        <LayoutGroup id="portfolio-navigation">{renderNavigation(true)}</LayoutGroup>
        <div className={styles.preferences}>
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav key={locale}>{(close) => renderNavigation(false, close)}</MobileNav>
        </div>
      </div>
    </header>
  );
}
