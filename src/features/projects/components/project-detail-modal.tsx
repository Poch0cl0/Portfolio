"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectMedia } from "@/features/projects/components/project-media";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/dictionary-provider";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, open, onClose }: ProjectDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { dict } = useDictionary();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && project) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [open, project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!project) {
    return (
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-[100] m-auto hidden w-[min(100%-2rem,52rem)] rounded-2xl border border-outline-variant bg-surface-container-low p-0 text-on-surface shadow-2xl backdrop:bg-black/60"
      />
    );
  }

  const texts = dict.projects[project.slug];

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[100] m-auto w-[min(100%-2rem,52rem)] max-h-[min(92vh,900px)] overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low p-0 text-on-surface shadow-2xl backdrop:bg-black/60 open:flex open:flex-col"
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
      aria-labelledby="project-detail-title"
    >
      <div className="flex items-start justify-between gap-space-sm border-b border-outline-variant px-space-md py-space-sm">
        <div>
          <p className="font-mono text-label-caps uppercase tracking-wider text-primary">
            {project.sector} · {project.period}
          </p>
          <h2 id="project-detail-title" className="text-headline-sm font-semibold">
            {project.title} — {project.subtitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-on-surface-variant transition-all duration-200 hover:glow-hover-primary hover:bg-surface-container-high hover:text-on-surface motion-reduce:transition-none"
          aria-label={dict.projects.detail.close}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-y-auto">
        <div className="relative h-48 overflow-hidden sm:h-56">
          <ProjectMedia slug={project.slug} className="h-full min-h-0" />
        </div>

        <div className="flex flex-col gap-space-md p-space-md">
          <p className="text-body-md leading-relaxed text-on-surface-variant">
            {project.description}
          </p>

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.detail.pipeline}
            </h3>
            <p className="rounded-lg border border-outline-variant/60 bg-surface-container p-space-sm text-body-sm text-on-surface-variant">
              {texts.pipeline}
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.detail.roles}
            </h3>
            <ul className="space-y-1.5">
              {texts.roles.map((role) => (
                <li
                  key={role}
                  className="rounded-lg border border-outline-variant/60 bg-surface-container px-space-sm py-2 text-body-sm text-on-surface-variant"
                >
                  {role}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.sections.architecture}
            </h3>
            <p className="text-body-sm text-on-surface-variant">{project.architecture.summary}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {project.architecture.layers.map((layer) => (
                <div
                  key={layer.name}
                  className="rounded-lg border border-outline-variant/60 bg-surface-container p-space-sm transition-all duration-200 hover:glow-hover-primary hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <p className="font-mono text-label-caps text-primary">{layer.name}</p>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{layer.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.sections.features}
            </h3>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-lg bg-surface-container px-space-sm py-1.5 text-body-sm text-on-surface-variant"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.sections.technicalDecisions}
            </h3>
            <ul className="space-y-1.5">
              {project.technicalDecisions.map((decision) => (
                <li
                  key={decision}
                  className="rounded-lg bg-surface-container px-space-sm py-1.5 text-body-sm text-on-surface-variant"
                >
                  {decision}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-label-caps uppercase tracking-wider text-outline">
              {dict.projects.sections.results}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.results.map((result) => (
                <Badge key={result} variant="tech">
                  {result}
                </Badge>
              ))}
            </div>
          </section>

          {project.demoUrl ? (
            <div className="pt-2">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-4 text-body-sm font-medium text-on-surface transition-all duration-200 hover:glow-hover-secondary hover:scale-[1.04] hover:bg-surface-container-highest active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                {dict.common.viewDemo}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
