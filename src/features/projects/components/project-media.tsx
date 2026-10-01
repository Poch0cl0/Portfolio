"use client";

import Image from "next/image";
import type { ProjectSlug } from "@/types/project";
import type { AssetKey } from "@/config/assets";
import { getAssetEntry, getAssetUrl } from "@/config/assets";
import { cn } from "@/lib/utils";

const coverBySlug: Record<ProjectSlug, AssetKey> = {
  obstetricare: "obstetricareCover",
  amara: "amaraCover",
};

interface ProjectMediaProps {
  slug: ProjectSlug;
  className?: string;
}

export function ProjectMedia({ slug, className }: ProjectMediaProps) {
  const assetKey = coverBySlug[slug];
  const entry = getAssetEntry(assetKey);

  if (entry.ready) {
    return (
      <div className={cn("relative min-h-[280px] overflow-hidden lg:min-h-full", className)}>
        <Image
          src={getAssetUrl(assetKey)}
          alt={entry.label}
          fill
          unoptimized={process.env.NODE_ENV === "development"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
      </div>
    );
  }

  if (slug === "obstetricare") {
    return <ObstetricareSystemMock className={className} />;
  }

  return <AmaraSystemMock className={className} />;
}

function ObstetricareSystemMock({ className }: { className?: string }) {
  const triageLevels = [
    { label: "VERDE", color: "bg-emerald-500" },
    { label: "AMARILLO", color: "bg-amber-400" },
    { label: "NARANJA", color: "bg-orange-500" },
    { label: "ROJO", color: "bg-red-500" },
  ];

  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col justify-between bg-surface-dim p-space-md lg:min-h-full lg:p-space-lg",
        className,
      )}
    >
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-code-block font-medium text-on-surface">
              Dashboard clínico
            </span>
          </div>
          <span className="rounded bg-surface-container-highest px-2 py-0.5 font-mono text-label-caps text-primary">
            ML-VALIDATED
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Gestantes", value: "128" },
            { label: "Citas hoy", value: "14" },
            { label: "Alertas", value: "6" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-2"
            >
              <p className="font-mono text-label-caps text-outline">{kpi.label}</p>
              <p className="text-headline-sm font-semibold text-primary">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-space-sm">
          <p className="mb-2 font-mono text-label-caps text-outline">
            Triaje de urgencia
          </p>
          <div className="flex flex-wrap gap-1.5">
            {triageLevels.map((level) => (
              <span
                key={level.label}
                className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 font-mono text-label-caps text-on-surface"
              >
                <span className={cn("h-2 w-2 rounded-full", level.color)} />
                {level.label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-space-sm">
          <p className="mb-2 font-mono text-label-caps text-outline">Pipeline activo</p>
          <div className="flex flex-wrap items-center gap-1 font-mono text-code-inline text-on-surface-variant">
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">S-2</span>
            <span>→</span>
            <span className="rounded bg-secondary/15 px-1.5 py-0.5 text-secondary">S-3</span>
            <span>→</span>
            <span className="rounded bg-tertiary/15 px-1.5 py-0.5 text-tertiary">S-4</span>
          </div>
        </div>
      </div>

      <p className="font-mono text-label-caps text-outline">
        ALEMBIC · 14 migraciones · Expediente inteligente
      </p>
    </div>
  );
}

function AmaraSystemMock({ className }: { className?: string }) {
  const heatmap = [
    ["bg-secondary/20", "bg-secondary/40", "bg-secondary/60", "bg-secondary/30"],
    ["bg-secondary/50", "bg-secondary/70", "bg-secondary/40", "bg-secondary/20"],
    ["bg-secondary/30", "bg-secondary/80", "bg-secondary/60", "bg-secondary/40"],
  ];

  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col justify-between bg-surface-dim p-space-md lg:min-h-full lg:p-space-lg",
        className,
      )}
    >
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-code-block font-medium text-on-surface">
            Seguimiento emocional
          </span>
          <span className="rounded bg-surface-container-highest px-2 py-0.5 font-mono text-label-caps text-secondary">
            PRODUCTION LIVE
          </span>
        </div>

        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-space-sm">
          <p className="mb-2 font-mono text-label-caps text-outline">Mapa de calor</p>
          <div className="grid grid-cols-4 gap-1">
            {heatmap.flat().map((tone, index) => (
              <div key={index} className={cn("aspect-square rounded", tone)} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-space-sm">
          <p className="mb-1 font-mono text-label-caps text-outline">Asistente IA</p>
          <div className="space-y-1">
            <div className="h-2 w-3/4 rounded bg-secondary/30" />
            <div className="h-2 w-1/2 rounded bg-primary/20" />
          </div>
        </div>
      </div>

      <p className="font-mono text-label-caps text-outline">DEPLOYED ON VERCEL EDGE</p>
    </div>
  );
}
