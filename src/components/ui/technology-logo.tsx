"use client";

import { useState } from "react";
import Image from "next/image";
import { Braces, BrainCircuit, Cloud, Database, FlaskConical, Languages, Layers, ChartNoAxesCombined, Palette } from "lucide-react";
import type { Stack } from "@/types/stack";

// Brand silhouettes from Simple Icons, stored locally to avoid runtime CDN requests.
const logos: Record<string, { slug: string }> = {
  "Next.js 16": { slug: "nextdotjs" },
  "React 19": { slug: "react" },
  TypeScript: { slug: "typescript" },
  "Tailwind CSS": { slug: "tailwindcss" },
  "Tailwind CSS 4": { slug: "tailwindcss" },
  Vite: { slug: "vite" },
  FastAPI: { slug: "fastapi" },
  "Python 3.12": { slug: "python" },
  "SQLAlchemy 2.0 async": { slug: "sqlalchemy" },
  JWT: { slug: "jsonwebtokens" },
  Supabase: { slug: "supabase" },
  "PostgreSQL 16": { slug: "postgresql" },
  PostgreSQL: { slug: "postgresql" },
  Redis: { slug: "redis" },
  "Gemini 2.0 Flash": { slug: "googlegemini" },
  "OpenAI GPT-4o-mini": { slug: "openai" },
  Vercel: { slug: "vercel" },
  "YouTube API": { slug: "youtube" },
  pytest: { slug: "pytest" },
};

const categoryIcons = {
  Frontend: Braces,
  Backend: Layers,
  "Base de datos": Database,
  "IA/ML": BrainCircuit,
  "Infra/DevOps": Cloud,
  Testing: FlaskConical,
};

export function TechnologyLogo({ item }: { item: Stack }) {
  const [failedSlug, setFailedSlug] = useState<string | null>(null);
  const brand = logos[item.name];
  const Icon = item.name.startsWith("Tailwind CSS") ? Palette
    : item.name === "i18n" ? Languages
    : item.name === "Recharts" ? ChartNoAxesCombined
    : categoryIcons[item.category];

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white text-primary shadow-sm">
      {brand && failedSlug !== brand.slug ? (
        <Image
          src={`/icons/technologies/${brand.slug}.svg`}
          width={32}
          height={32}
          alt=""
          aria-hidden="true"
          unoptimized
          onError={() => setFailedSlug(brand.slug)}
          className="h-8 w-8 object-contain"
        />
      ) : <Icon size={30} aria-hidden="true" />}
    </span>
  );
}
