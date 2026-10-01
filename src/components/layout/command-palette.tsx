"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sectionHref, sectionNavigation } from "@/config/navigation";
import { Container } from "@/components/ui/container";
import { useDictionary } from "@/i18n/dictionary-provider";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { dict } = useDictionary();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-4 pt-24 backdrop-blur-sm">
      <Container className="max-w-lg rounded-xl border border-border bg-card p-4 shadow-lg">
        <p className="mb-3 text-sm font-medium">Command Palette</p>
        <div className="flex flex-col gap-2">
          {sectionNavigation.map((item) => (
            <Link
              key={item.id}
              href={sectionHref(item.id)}
              className="rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:scale-[1.02] hover:bg-muted motion-reduce:transition-none motion-reduce:hover:scale-100"
              onClick={() => setOpen(false)}
            >
              {dict.common.nav[item.labelKey]}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
