"use client";

import { assets } from "@/config/assets";
import { ChatAssistantSection } from "@/components/sections/chat-assistant-section";
import { AssetImage } from "@/components/ui/asset-image";
import { ButtonLink } from "@/components/ui/button";
import { ContactTrigger } from "@/features/contact/components/contact-trigger";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { useDictionary } from "@/i18n/dictionary-provider";

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
            <div className="flex flex-col gap-1">
              <h1 className="text-display text-on-surface">
                {dict.home.hero.name}
              </h1>
              <p className="font-mono text-body-md font-medium uppercase tracking-wider text-primary">
                {dict.home.hero.role}
              </p>
            </div>

            <AssetImage
              assetKey="heroPortrait"
              alt={dict.home.hero.photoAlt}
              priority
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />

            <p className="w-full text-body-lg text-on-surface-variant">
              {dict.home.hero.description}
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
          </Reveal>

          <div className="w-full lg:col-span-5">
            <ChatAssistantSection embedded />
          </div>
        </div>
      </Container>
    </Section>
  );
}
