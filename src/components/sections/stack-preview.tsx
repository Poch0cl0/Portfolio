"use client";

import { Puzzle, RotateCw } from "lucide-react";
import type { Stack } from "@/types/stack";
import { getStackItems, stackTabMap } from "@/data/stack";
import { stackTabIds, useStackPreview } from "@/hooks/use-stack-preview";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Container } from "@/components/ui/container";
import { TechnologyLogo } from "@/components/ui/technology-logo";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionKicker,
  SectionTitle,
} from "@/components/ui/section";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/utils";

export function StackPreview() {
  const { dict } = useDictionary();
  const stackItems = getStackItems(dict);
  const { activeTab, setActiveTab, flippedCards, toggleCard } = useStackPreview();

  const filteredItems = stackItems.filter((item) => item.category === stackTabMap[activeTab]);

  return (
    <Section id="stack" className="scroll-mt-24">
      <Container>
        <ScrollReveal id="stack-heading">
          <SectionHeader>
            <SectionKicker>
              <Puzzle className="h-4 w-4" />
              <span>{dict.home.stackPreview.kicker}</span>
            </SectionKicker>
            <SectionTitle>{dict.home.stackPreview.title}</SectionTitle>
            <SectionDescription>{dict.home.stackPreview.description}</SectionDescription>
          </SectionHeader>
        </ScrollReveal>

        <div>
          <div className="mb-8 flex flex-wrap gap-2 pb-2">
            {stackTabIds.map((tabId) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                aria-pressed={activeTab === tabId}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-code-inline transition-all duration-200 hover:scale-105 hover:glow-hover-secondary motion-reduce:transition-none motion-reduce:hover:scale-100",
                  activeTab === tabId
                    ? "bg-surface-container-high font-medium text-primary"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface",
                )}
              >
                {dict.home.stackPreview.tabs[tabId]} (
                {stackItems.filter((item) => item.category === stackTabMap[tabId]).length})
              </button>
            ))}
          </div>
        </div>

        <ScrollReveal id="stack-grid" className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const id = `${item.category}-${item.name}`;

            return (
              <div key={id} className="h-full min-w-0">
                <TechnologyCard item={item} flipped={flippedCards.has(id)} onToggle={() => toggleCard(id)} />
              </div>
            );
          })}
        </ScrollReveal>
      </Container>
    </Section>
  );
}

function TechnologyCard({ item, flipped, onToggle }: {
  item: Stack;
  flipped: boolean;
  onToggle: () => void;
}) {
  const { dict } = useDictionary();
  const { flip, back } = dict.stack.cards;

  return (
    <button type="button" aria-label={`${item.name}: ${flipped ? back : flip}`} aria-pressed={flipped}
      onClick={onToggle}
      className="technology-card h-full w-full rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      <span className="technology-card-inner" data-flipped={flipped}>
        <span className="technology-card-face border border-outline-variant/40 bg-surface-container-low shadow-sm" aria-hidden={flipped}>
          <span className="flex items-center justify-between gap-3">
            <TechnologyLogo item={item} />
            <span className="font-mono text-label-sm text-outline">{dict.stack.categories[item.category]}</span>
          </span>
          <span className="mt-5 block break-words font-mono text-xl font-semibold text-on-surface">{item.name}</span>
          <span className="mt-2 block text-body-sm text-on-surface-variant">{item.usedIn.map((slug) => dict.projects[slug].title).join(" · ")}</span>
          <span className="mt-auto flex items-center gap-2 pt-6 text-body-sm text-primary"><RotateCw size={16} aria-hidden="true" />{flip}</span>
        </span>
        <span className="technology-card-face technology-card-back border border-primary/40 bg-surface-container-high shadow-sm" aria-hidden={!flipped}>
          <span className="flex items-center justify-between gap-3 font-mono text-body-sm font-semibold text-primary">{item.name}<RotateCw size={18} aria-hidden="true" /></span>
          <span className="mt-4 flex flex-col gap-4">
            {item.usedIn.map((slug) => (
              <span key={slug} className="block">
                <span className="block text-body-sm font-semibold text-on-surface">{dict.projects[slug].title}</span>
                <span className="mt-1 block text-body-sm text-on-surface-variant">{dict.stack.projectUsage[item.name as keyof typeof dict.stack.projectUsage]?.[slug] ?? item.description}</span>
              </span>
            ))}
          </span>
          <span className="mt-auto block pt-5 text-body-sm text-primary">{back}</span>
        </span>
      </span>
    </button>
  );
}
