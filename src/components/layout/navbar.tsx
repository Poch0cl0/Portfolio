"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { sectionHref, sectionNavigation } from "@/config/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ContactTrigger } from "@/features/contact/components/contact-trigger";
import { MonogramBadge } from "@/components/ui/asset-image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/utils";

const sectionIds = sectionNavigation.map((item) => item.id);

export function Navbar() {
  const pathname = usePathname();
  const { locale, dict } = useDictionary();
  const activeSection = useActiveSection(sectionIds);
  const homeHref = `/${locale}`;

  function scrollToTop(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === homeHref) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/60 bg-surface/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-space-md">
        <Link
          href={homeHref}
          onClick={scrollToTop}
          className="flex shrink-0 items-center gap-space-sm"
        >
          <MonogramBadge />
          <div className="flex flex-col">
            <span className="text-headline-sm leading-none text-on-surface">
              {siteConfig.shortName}
            </span>
            <span className="mt-0.5 font-mono text-label-caps uppercase tracking-wider text-on-surface-variant">
              {siteConfig.role}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-space-xs rounded-full bg-surface-container-low px-space-xs py-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] xl:flex">
          {sectionNavigation.map((item) => {
            const active = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={sectionHref(item.id)}
                className={cn(
                  "rounded-full px-space-sm py-1.5 text-body-sm transition-all duration-200 hover:scale-105 hover:glow-hover-primary motion-reduce:transition-none motion-reduce:hover:scale-100",
                  active
                    ? "bg-surface-container-high font-medium text-primary glow-primary"
                    : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {dict.common.nav[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-space-sm">
          {siteConfig.availableForProjects ? (
            <div className="hidden items-center gap-space-xs rounded-full bg-surface-container-low px-space-sm py-1 text-primary sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-label-caps tracking-wide">
                {dict.common.availability}
              </span>
            </div>
          ) : null}
          <LocaleSwitcher />
          <ThemeToggle />
          <ContactTrigger size="sm" className="hidden md:inline-flex">
            {dict.common.contact}
          </ContactTrigger>
          <MobileNav activeSection={activeSection} />
        </div>
      </Container>
    </header>
  );
}
