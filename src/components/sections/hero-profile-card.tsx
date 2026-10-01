"use client";

import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { useDictionary } from "@/i18n/dictionary-provider";

export function HeroProfileCard() {
  const { dict } = useDictionary();
  const code = dict.home.profileCard.code;

  return (
    <Reveal className="flex w-full flex-col gap-space-md">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-xl">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-error/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-secondary/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            <span className="ml-2 font-mono text-code-block text-outline">
              {dict.home.profileCard.terminalPath}
            </span>
          </div>
          <span className="rounded bg-surface-container-low px-2 py-0.5 font-mono text-label-caps text-primary">
            {dict.home.profileCard.status}
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg bg-surface-dim p-space-sm font-mono text-code-block text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="text-tertiary">const</span>
            <span className="font-medium text-secondary">{code.variable}</span>
            <span className="text-on-surface">=</span>
            <span className="text-on-surface">{"{"}</span>
          </div>
          <div className="flex flex-col gap-1 pl-4">
            <div>
              <span className="text-outline">{code.nameKey}:</span>{" "}
              <span className="text-primary">&quot;{siteConfig.name}&quot;</span>,
            </div>
            <div>
              <span className="text-outline">{code.universityKey}:</span>{" "}
              <span className="text-on-surface">
                &quot;{siteConfig.university} (UNT)&quot;
              </span>
              ,
            </div>
            <div>
              <span className="text-outline">{code.degreeKey}:</span>{" "}
              <span className="text-on-surface">&quot;{code.degreeValue}&quot;</span>,
            </div>
            <div>
              <span className="text-outline">{code.locationKey}:</span>{" "}
              <span className="text-secondary">
                &quot;{siteConfig.location} (UTC-5)&quot;
              </span>
              ,
            </div>
            <div>
              <span className="text-outline">{code.focusKey}:</span>{" "}
              <span className="text-tertiary">&quot;{code.focusValue}&quot;</span>,
            </div>
            <div>
              <span className="text-outline">{code.coreStackKey}:</span>{" "}
              <span className="text-on-surface">
                [{code.coreStack.map((item) => `"${item}"`).join(", ")}]
              </span>
              ,
            </div>
            <div>
              <span className="text-outline">{code.shippedProductsKey}:</span>{" "}
              <span className="text-primary">
                [{code.shippedProducts.map((item) => `"${item}"`).join(", ")}]
              </span>
            </div>
          </div>
          <div className="text-on-surface">{"};"}</div>
        </div>

        <div className="grid grid-cols-2 gap-space-xs pt-1">
          <div className="flex flex-col rounded-lg bg-surface-container p-space-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <span className="font-mono text-label-caps uppercase text-outline">
              {dict.home.profileCard.architectureLabel}
            </span>
            <span className="mt-0.5 text-headline-sm font-semibold text-primary">
              {dict.home.profileCard.architectureTitle}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {dict.home.profileCard.architectureDesc}
            </span>
          </div>
          <div className="flex flex-col rounded-lg bg-surface-container p-space-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <span className="font-mono text-label-caps uppercase text-outline">
              {dict.home.profileCard.validationLabel}
            </span>
            <span className="mt-0.5 text-headline-sm font-semibold text-secondary">
              {dict.home.profileCard.validationTitle}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {dict.home.profileCard.validationDesc}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-sm shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-body-sm font-medium text-on-surface">
            {siteConfig.university} (UNT)
          </span>
          <span className="text-label-sm text-on-surface-variant">
            {dict.home.profileCard.degree}
          </span>
        </div>
      </div>
    </Reveal>
  );
}
