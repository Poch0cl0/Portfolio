import type { Dictionary } from "@/i18n/get-dictionary";
import type {
  Architecture,
  Project,
  ProjectAccent,
  ProjectSlug,
  ProjectType,
} from "@/types/project";

export interface ProjectMeta {
  slug: ProjectSlug;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  image: string;
  ogImage: string;
  featured: boolean;
  type: ProjectType;
  accent: ProjectAccent;
}

export const projectsMeta: ProjectMeta[] = [
  {
    slug: "obstetricare",
    technologies: [
      "FastAPI",
      "Python 3.12",
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "PostgreSQL 16",
      "SQLAlchemy 2.0 async",
      "asyncpg",
      "Alembic",
      "JWT",
      "Redis",
      "Gemini 2.0 Flash",
      "Random Forest",
      "CatBoost",
      "SVM",
      "Regresión Logística Ordinal",
      "Árbol de Decisión",
      "Recharts",
      "WeasyPrint",
      "OpenPyXL",
      "pytest",
    ],
    demoUrl: undefined,
    githubUrl: undefined,
    image: "/images/projects/obstetricare/cover.jpg",
    ogImage: "/images/projects/obstetricare/cover.jpg",
    featured: true,
    type: "academico-profesional",
    accent: "primary",
  },
  {
    slug: "amara",
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "App Router",
      "Tailwind CSS 4",
      "Supabase",
      "PostgreSQL",
      "RLS",
      "Migraciones SQL versionadas",
      "API Routes autenticadas",
      "OpenAI GPT-4o-mini",
      "YouTube API",
      "i18n",
      "Vercel",
    ],
    demoUrl: "https://amar-gold.vercel.app/",
    githubUrl: undefined,
    image: "/images/projects/amara/cover.jpg",
    ogImage: "/images/projects/amara/cover.jpg",
    featured: true,
    type: "personal",
    accent: "secondary",
  },
];

type ProjectTexts = Dictionary["projects"][ProjectSlug];

function buildArchitecture(texts: ProjectTexts): Architecture {
  const layerKeys = Object.keys(texts.architecture.layers) as Array<
    keyof ProjectTexts["architecture"]["layers"]
  >;

  return {
    summary: texts.architecture.summary,
    layers: layerKeys.map((key) => texts.architecture.layers[key]),
  };
}

export function mergeProject(meta: ProjectMeta, texts: ProjectTexts): Project {
  return {
    ...meta,
    title: texts.title,
    subtitle: texts.subtitle,
    description: texts.description,
    problem: texts.problem,
    context: texts.context,
    solution: texts.solution,
    sector: texts.sector,
    period: texts.period,
    architecture: buildArchitecture(texts),
    features: texts.features,
    technicalDecisions: texts.technicalDecisions,
    results: texts.results,
  };
}

export function getProjects(dict: Dictionary): Project[] {
  return projectsMeta.map((meta) => mergeProject(meta, dict.projects[meta.slug]));
}

export function getProjectBySlug(slug: string, dict: Dictionary): Project | undefined {
  const meta = projectsMeta.find((project) => project.slug === slug);
  if (!meta || !(slug in dict.projects)) {
    return undefined;
  }
  return mergeProject(meta, dict.projects[slug as ProjectSlug]);
}

export function getFeaturedProjects(dict: Dictionary): Project[] {
  return getProjects(dict).filter((project) => project.featured);
}

export function getAllProjectSlugs(): ProjectSlug[] {
  return projectsMeta.map((project) => project.slug);
}
