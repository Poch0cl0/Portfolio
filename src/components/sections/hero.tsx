"use client";

import { siteConfig } from "@/config/site";
import { assets } from "@/config/assets";
import { HeroProfileCard } from "@/components/sections/hero-profile-card";
import { AssetImage } from "@/components/ui/asset-image";
import { ButtonLink } from "@/components/ui/button";
import { ContactTrigger } from "@/features/contact/components/contact-trigger";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/dictionary-provider";

const heroStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "FastAPI",
  "Python 3.12",
  "PostgreSQL 16",
  "Supabase",
  "Tailwind CSS",
  "Gemini 2.0 Flash",
  "GPT-4o-mini",
];

export function Hero() {
  const { dict } = useDictionary();

  return (
    <Section id="sobre-mi" className="relative scroll-mt-24 overflow-hidden pt-6 lg:pt-10">
      <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-secondary/5 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-tertiary/5 blur-[90px]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12 lg:gap-12">
          <Reveal className="flex flex-col items-start gap-space-md lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-label-caps uppercase tracking-wider text-primary">
                {dict.home.hero.kicker.replace("{location}", siteConfig.location)}
              </span>
            </div>

            <h1 className="sr-only">{dict.home.hero.srTitle}</h1>
            <AssetImage
              assetKey="heroPortrait"
              alt={dict.home.hero.photoAlt}
              priority
              className="aspect-[4/3] w-full max-w-2xl rounded-2xl object-cover"
            />

            <p className="max-w-xl text-body-lg text-on-surface-variant">
              {dict.home.hero.description.replace("{university}", siteConfig.university)}
            </p>

            <div className="flex w-full flex-wrap items-center gap-space-sm pt-2 sm:w-auto">
              <ButtonLink href="#proyectos-destacados" size="lg">
                {dict.home.hero.viewProjects}
              </ButtonLink>
              <ContactTrigger variant="secondary" size="lg">
                {dict.home.hero.contactMe}
              </ContactTrigger>
              <ButtonLink
                href={assets.cv.src}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
              >
                {dict.common.downloadCv}
              </ButtonLink>
            </div>

            <div className="flex w-full flex-col gap-2 pt-space-sm">
              <span className="font-mono text-label-caps uppercase tracking-widest text-outline">
                {dict.home.hero.stackLabel}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {heroStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="tech"
                    className="transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="w-full lg:col-span-5">
            <HeroProfileCard />
          </div>
        </div>
      </Container>
    </Section>
  );
}
