"use client";

import { ArrowRight, ListVideo } from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectShowcase } from "@/features/projects/components/project-showcase";
import { ContactTrigger } from "@/features/contact/components/contact-trigger";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  Section,
  SectionKicker,
  SectionTitle,
} from "@/components/ui/section";
import { useDictionary } from "@/i18n/dictionary-provider";

export function FeaturedProjects() {
  const { dict } = useDictionary();
  const featuredProjects = getFeaturedProjects(dict);

  return (
    <Section id="proyectos-destacados" className="scroll-mt-24">
      <Container className="flex flex-col gap-space-xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <SectionKicker className="text-secondary">
                <ListVideo className="h-4 w-4" />
                <span>{dict.home.featuredProjects.kicker}</span>
              </SectionKicker>
              <SectionTitle>{dict.home.featuredProjects.title}</SectionTitle>
            </div>
            <ContactTrigger
              variant="ghost"
              className="flex items-center gap-1 px-0 text-body-sm text-primary hover:bg-transparent hover:underline"
            >
              <span>{dict.home.featuredProjects.customArchitecture}</span>
              <ArrowRight className="h-4 w-4" />
            </ContactTrigger>
          </div>
        </Reveal>

        <div className="flex flex-col gap-space-xl">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} className={index > 0 ? `[animation-delay:${index * 100}ms]` : undefined}>
              <ProjectShowcase project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
