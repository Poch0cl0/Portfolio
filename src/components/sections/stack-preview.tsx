"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Puzzle } from "lucide-react";
import { getStackEvidence, getStackItems, stackTabMap } from "@/data/stack";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionKicker,
  SectionTitle,
} from "@/components/ui/section";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/utils";

const tabIds = ["all", "frontend", "backend", "databases", "aiml", "devops", "testing"] as const;

export function StackPreview() {
  const { dict } = useDictionary();
  const stackItems = getStackItems(dict);
  const [activeTab, setActiveTab] = useState<(typeof tabIds)[number]>("all");

  const filteredItems = useMemo(() => {
    const category = stackTabMap[activeTab];
    if (category === "all") {
      return stackItems;
    }
    return stackItems.filter((item) => item.category === category);
  }, [activeTab, stackItems]);

  return (
    <Section id="stack" className="scroll-mt-24">
      <Container>
        <Reveal>
          <SectionHeader>
            <SectionKicker>
              <Puzzle className="h-4 w-4" />
              <span>{dict.home.stackPreview.kicker}</span>
            </SectionKicker>
            <SectionTitle>{dict.home.stackPreview.title}</SectionTitle>
            <SectionDescription>{dict.home.stackPreview.description}</SectionDescription>
          </SectionHeader>
        </Reveal>

        <Reveal>
          <div className="mb-8 flex flex-wrap gap-2 pb-2">
            {tabIds.map((tabId) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-code-inline transition-all duration-200 hover:scale-105 hover:glow-hover-secondary motion-reduce:transition-none motion-reduce:hover:scale-100",
                  activeTab === tabId
                    ? "bg-surface-container-high font-medium text-primary"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface",
                )}
              >
                {dict.home.stackPreview.tabs[tabId]} (
                {tabId === "all" ? stackItems.length : filteredItems.length})
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <Reveal key={`${item.category}-${item.name}`} className={index > 0 ? `[animation-delay:${(index % 4) * 60}ms]` : undefined}>
              <div className="flex h-full flex-col justify-between gap-space-sm rounded-xl border border-transparent bg-surface-container-low p-space-md shadow-sm transition-all duration-200 hover:glow-hover-primary hover:-translate-y-1 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-code-block font-semibold text-primary">
                      {item.name}
                    </span>
                    <span className="font-mono text-label-caps text-outline">
                      {(dict.stack.categories[item.category] ?? item.category).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{item.description}</p>
                </div>
                <div className="flex items-center gap-1 text-label-sm text-outline">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>{getStackEvidence(item, dict)}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
