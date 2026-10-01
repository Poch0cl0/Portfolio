"use client";

import { Mail, MapPin, Send, GitBranch } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { useDictionary } from "@/i18n/dictionary-provider";

export function CTA() {
  const { dict } = useDictionary();

  return (
    <Section surface="lowest" id="contacto-banner" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      <Container size="narrow" className="relative z-10">
        <Reveal>
          <div className="flex flex-col gap-space-md rounded-2xl bg-surface-container p-space-lg shadow-2xl lg:p-space-xl">
          <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
            <div className="flex max-w-xl flex-col gap-1">
              <div className="inline-flex items-center gap-2 font-mono text-label-caps uppercase tracking-widest text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span>{dict.home.cta.kicker}</span>
              </div>
              <h2 className="mt-1 text-headline-lg font-bold tracking-tight text-on-surface">
                {dict.home.cta.title}
              </h2>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {dict.home.cta.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2 rounded-xl bg-surface-container-low p-space-md md:w-64">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                <span className="text-label-sm font-medium text-on-surface">
                  {siteConfig.location}
                </span>
              </div>
              <span className="text-label-sm text-on-surface-variant">
                {siteConfig.university} · {dict.home.cta.timezone}
              </span>
              <div className="flex items-center gap-1.5 pt-1 font-mono text-code-inline text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{dict.home.cta.emailResponse}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm sm:flex-row">
            <div className="flex w-full items-center gap-space-sm sm:w-auto">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <span className="select-all break-all font-mono text-code-block text-on-surface sm:break-normal">
                {siteConfig.email}
              </span>
            </div>
            <CopyButton
              value={siteConfig.email}
              label={dict.common.copyEmail}
              copiedLabel={dict.common.copied}
            />
          </div>

          <div className="flex flex-wrap items-center gap-space-sm pt-2">
            <ButtonLink href={`mailto:${siteConfig.email}`} size="lg">
              <Send className="h-4 w-4" />
              {dict.home.cta.writeEmail}
            </ButtonLink>
            <ButtonLink href="#stack" variant="secondary" size="lg">
              <GitBranch className="h-4 w-4" />
              {dict.home.cta.viewStack}
            </ButtonLink>
          </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
