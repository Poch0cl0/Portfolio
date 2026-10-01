"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectDetailModal } from "@/features/projects/components/project-detail-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/dictionary-provider";

interface ProjectShowcaseContentProps {
  project: Project;
}

export function ProjectShowcaseContent({ project }: ProjectShowcaseContentProps) {
  const { dict } = useDictionary();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-between gap-space-md p-space-md lg:p-space-xl">
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={project.accent === "primary" ? "health" : "default"}>
              {(dict.projects.types[project.type] ?? project.type).toUpperCase()}
            </Badge>
            <span className="font-mono text-label-caps text-outline">
              {project.sector} · {project.period}
            </span>
          </div>

          <h3 className="text-headline-lg font-semibold text-on-surface">
            {project.title} — {project.subtitle}
          </h3>
          <p className="text-body-md leading-relaxed text-on-surface-variant">
            {project.description}
          </p>

          <div className="grid grid-cols-1 gap-space-sm pt-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1 rounded-lg bg-surface-container p-space-sm transition-all duration-200 hover:glow-hover-primary hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <span className="flex items-center gap-1 font-mono text-label-caps uppercase tracking-wider text-error">
                <AlertTriangle className="h-3.5 w-3.5" />
                {dict.projects.sections.problem}
              </span>
              <p className="text-body-sm text-on-surface-variant">{project.problem}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-surface-container p-space-sm transition-all duration-200 hover:glow-hover-primary hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <span className="flex items-center gap-1 font-mono text-label-caps uppercase tracking-wider text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {dict.projects.sections.solution}
              </span>
              <p className="text-body-sm text-on-surface-variant">{project.solution}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-2">
            <span className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.sections.technologies}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 12).map((tech) => (
                <Badge
                  key={tech}
                  variant="tech"
                  className="transition-transform duration-200 hover:scale-105 hover:glow-hover-secondary motion-reduce:transition-none motion-reduce:hover:scale-100"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm pt-space-md">
          <Button type="button" variant="outline" onClick={() => setModalOpen(true)}>
            {dict.common.learnMore}
          </Button>
          {project.demoUrl ? (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary-container px-space-md py-2.5 text-body-sm font-semibold text-on-secondary-container transition-all duration-200 hover:glow-hover-secondary hover:scale-[1.04] hover:bg-secondary active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              {dict.common.viewDemo}
            </Link>
          ) : null}
        </div>
      </div>

      <ProjectDetailModal
        project={project}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
