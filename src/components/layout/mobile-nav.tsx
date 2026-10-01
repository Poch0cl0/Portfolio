"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { sectionHref, sectionNavigation } from "@/config/navigation";
import { ContactTrigger } from "@/features/contact/components/contact-trigger";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeSection: string | null;
}

export function MobileNav({ activeSection }: MobileNavProps) {
  const { dict } = useDictionary();
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 xl:hidden"
        aria-label="Menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[90] bg-black/60" onClick={() => setOpen(false)} />
      ) : null}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[95] flex w-[min(100%,20rem)] flex-col gap-space-md bg-surface-container-low p-space-md shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <LocaleSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {sectionNavigation.map((item) => {
            const active = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={sectionHref(item.id)}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-body-sm transition-all duration-200 hover:scale-[1.02] hover:glow-hover-primary motion-reduce:transition-none motion-reduce:hover:scale-100",
                  active ? "bg-surface-container-high text-primary glow-primary" : "text-on-surface",
                )}
              >
                {dict.common.nav[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        <ContactTrigger className="mt-auto" onClick={() => setOpen(false)}>
          {dict.common.contact}
        </ContactTrigger>
      </div>
    </div>
  );
}
