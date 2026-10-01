"use client";

import { Terminal } from "lucide-react";
import { getCapabilities } from "@/data/capabilities";
import { Badge } from "@/components/ui/badge";
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

const accentStyles = {
  primary: "bg-primary/20 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  tertiary: "bg-tertiary/20 text-tertiary",
  neutral: "bg-surface-container-highest text-primary",
};

export function Capabilities() {
  const { dict } = useDictionary();
  const capabilities = getCapabilities(dict);

  return (
    <Section surface="lowest">
      <Container>
        <Reveal>
          <SectionHeader className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
            <div className="flex max-w-xl flex-col gap-1">
              <SectionKicker>
                <Terminal className="h-4 w-4" />
                <span>{dict.home.capabilities.kicker}</span>
              </SectionKicker>
              <SectionTitle>{dict.home.capabilities.title}</SectionTitle>
            </div>
            <SectionDescription className="max-w-sm">
              {dict.home.capabilities.description}
            </SectionDescription>
          </SectionHeader>
        </Reveal>

        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Reveal key={capability.id} className={index > 0 ? `[animation-delay:${index * 80}ms]` : undefined}>
                <div className="flex h-full flex-col justify-between gap-space-md rounded-xl border border-transparent bg-surface-container p-space-lg shadow-sm transition-all duration-200 hover:glow-hover-primary hover:-translate-y-1 hover:bg-surface-container-high hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <div className="flex flex-col gap-space-sm">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg",
                        accentStyles[capability.accent],
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-headline-sm font-semibold text-on-surface">
                      {capability.title}
                    </h3>
                    <p className="text-body-sm leading-relaxed text-on-surface-variant">
                      {capability.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {capability.technologies.map((tech) => (
                      <Badge key={tech} variant="tech" className="transition-transform duration-200 hover:scale-105 hover:glow-hover-secondary motion-reduce:transition-none motion-reduce:hover:scale-100">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
