import type { Dictionary } from "@/i18n/get-dictionary";

export interface ExperienceMeta {
  id: string;
  technologies: string[];
  type: "academico-profesional" | "personal";
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  technologies: string[];
  type: "academico-profesional" | "personal";
}

export const experienceMeta: ExperienceMeta[] = [
  {
    id: "obstetricare",
    technologies: [
      "FastAPI",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Gemini 2.0 Flash",
      "pytest",
    ],
    type: "academico-profesional",
  },
  {
    id: "amara",
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Supabase",
      "OpenAI GPT-4o-mini",
      "Tailwind CSS 4",
    ],
    type: "personal",
  },
];

export function getExperience(dict: Dictionary): ExperienceItem[] {
  return experienceMeta.map((meta) => {
    const texts = dict.about.experience[meta.id as keyof typeof dict.about.experience];
    return {
      ...meta,
      title: texts.title,
      organization: texts.organization,
      period: texts.period,
      description: texts.description,
    };
  });
}
