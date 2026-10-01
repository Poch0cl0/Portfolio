"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { sectionHref, sectionNavigation } from "@/config/navigation";
import { CopyButton } from "@/components/ui/copy-button";
import { Container } from "@/components/ui/container";
import { useDictionary } from "@/i18n/dictionary-provider";

export function Footer() {
  const { dict } = useDictionary();
  const footerDescription = dict.common.footer.description
    .replace("{location}", siteConfig.location)
    .replace("{university}", siteConfig.university);

  return (
    <footer className="bg-surface-container-lowest text-on-surface-variant">
      <Container className="py-space-xl">
        <div className="mb-space-lg grid grid-cols-1 gap-space-lg md:grid-cols-12">
          <div className="flex flex-col gap-space-sm md:col-span-5">
            <span className="text-headline-sm text-on-surface">{siteConfig.name}</span>
            <p className="max-w-sm text-body-sm">{footerDescription}</p>
            <div className="mt-space-xs flex items-center gap-space-xs text-label-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {siteConfig.location} · {siteConfig.university}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs md:col-span-3">
            <span className="mb-space-xs font-mono text-label-caps uppercase tracking-wider text-on-surface">
              {dict.common.footer.navigation}
            </span>
            {sectionNavigation.map((item) => (
              <Link
                key={item.id}
                href={sectionHref(item.id)}
                className="py-0.5 text-body-sm transition-all duration-200 hover:scale-105 hover:text-primary motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                {dict.common.nav[item.labelKey]}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-space-sm md:col-span-4">
            <span className="font-mono text-label-caps uppercase tracking-wider text-on-surface">
              {dict.common.footer.directContact}
            </span>
            <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-low p-space-sm">
              <span className="select-all font-mono text-code-block text-on-surface">
                {siteConfig.email}
              </span>
              <CopyButton value={siteConfig.email} label="" copiedLabel="" />
            </div>
            <div className="flex flex-wrap gap-space-xs pt-space-xs">
              <span className="inline-flex items-center gap-1 rounded bg-surface-container px-space-sm py-1 text-label-sm">
                {dict.common.footer.githubTodo}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-surface-container px-space-sm py-1 text-label-sm">
                {dict.common.footer.linkedinTodo}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-space-md flex flex-col items-center justify-between gap-space-sm border-t border-outline-variant pt-space-md text-center lg:flex-row lg:text-left">
          <div className="flex items-center gap-space-xs font-mono text-code-block">
            <span className="relative flex h-1.5 w-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
            </span>
            <span>{dict.common.footer.builtWith}</span>
          </div>
          <div className="text-label-sm">
            © {new Date().getFullYear()} {siteConfig.name}. {dict.common.footer.copyright}
          </div>
        </div>
      </Container>
    </footer>
  );
}
