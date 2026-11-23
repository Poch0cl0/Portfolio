"use client";

import { useLayoutEffect, useRef, type FocusEvent } from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { getFeaturedProjects } from "@/data/projects";
import { useDictionary } from "@/i18n/dictionary-provider";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { ChatAssistantSection } from "./chat-assistant-section";
import styles from "./hero.module.css";

let heroPresented = false;

function showOnFocus(event: FocusEvent<HTMLElement>) {
  event.currentTarget.dataset.interacted = "true";
}

export function Hero() {
  const { dict } = useDictionary();
  const { hero } = dict.home;
  const portrait = assets.heroPortrait;
  const projects = getFeaturedProjects(dict);
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = section.current;
    if (!element || element.dataset.presentation) return;

    // A locale change can remount the Hero without loading a new document.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.dataset.presentation = heroPresented || reduceMotion ? "skip" : "initial";
    heroPresented = true;
  }, []);

  return (
    <section ref={section} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.container}>
        <div className={styles.layout}>
          <div id="sobre-mi" className={styles.intro}>
            <h1 id="hero-title">
              <span className="motion-enter">{hero.headline}</span>{" "}
              <em className="motion-enter">{hero.headlineAccent}</em>
            </h1>
            <p className={`${styles.description} motion-enter`}>{hero.description}</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#proyectos-destacados">{hero.viewProjects}</a>
              <a className={styles.secondary} href={assets.cv.src} download>
                <FileText size={16} aria-hidden="true" />
                {hero.downloadCv}
              </a>
              <div className={styles.socials}>
                <a href={siteConfig.github} aria-label="GitHub"><GitHubIcon width={18} height={18} /></a>
                <a href={siteConfig.linkedin} aria-label="LinkedIn"><LinkedInIcon width={18} height={18} /></a>
              </div>
            </div>

            <ul className={styles.projects}>
              {projects.map(({ slug, title }) => (
                <li key={slug} className="motion-enter" onFocusCapture={showOnFocus}>
                  <a className="motion-hover-lift" href={`#${slug}`}>
                    <strong>{title}</strong>
                    <span>{hero.projectSummaries[slug]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside className={styles.sidebar} aria-label={hero.profileLabel}>
            <figure className={styles.portrait}>
              <Image
                src={portrait.src}
                width={portrait.width}
                height={portrait.height}
                alt={hero.photoAlt}
                sizes="(min-width: 64rem) 39vw, 93vw"
                loading="eager"
                fetchPriority="high"
              />
              <figcaption>{siteConfig.name}</figcaption>
            </figure>
            <div className={`${styles.assistant} motion-enter`} onFocusCapture={showOnFocus}>
              <ChatAssistantSection />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
