import type { Stack, StackCategory } from "@/types/stack";
import type { Dictionary } from "@/i18n/get-dictionary";

export const stackCategories = [
  "Frontend",
  "Backend",
  "Base de datos",
  "IA/ML",
  "Infra/DevOps",
  "Testing",
] as const satisfies readonly StackCategory[];

export const stackItemsMeta: Omit<Stack, "description">[] = [
  { name: "Next.js 16", category: "Frontend", usedIn: ["amara"] },
  { name: "React 19", category: "Frontend", usedIn: ["obstetricare", "amara"] },
  { name: "TypeScript", category: "Frontend", usedIn: ["obstetricare", "amara"] },
  { name: "Tailwind CSS", category: "Frontend", usedIn: ["obstetricare", "amara"] },
  { name: "Tailwind CSS 4", category: "Frontend", usedIn: ["amara"] },
  { name: "Vite", category: "Frontend", usedIn: ["obstetricare"] },
  { name: "Recharts", category: "Frontend", usedIn: ["obstetricare"] },
  { name: "i18n", category: "Frontend", usedIn: ["amara"] },
  { name: "FastAPI", category: "Backend", usedIn: ["obstetricare"] },
  { name: "Python 3.12", category: "Backend", usedIn: ["obstetricare"] },
  { name: "SQLAlchemy 2.0 async", category: "Backend", usedIn: ["obstetricare"] },
  { name: "asyncpg", category: "Backend", usedIn: ["obstetricare"] },
  { name: "Alembic", category: "Backend", usedIn: ["obstetricare"] },
  { name: "JWT", category: "Backend", usedIn: ["obstetricare"] },
  { name: "Supabase", category: "Backend", usedIn: ["amara"] },
  { name: "API Routes autenticadas", category: "Backend", usedIn: ["amara"] },
  { name: "PostgreSQL 16", category: "Base de datos", usedIn: ["obstetricare"] },
  { name: "PostgreSQL", category: "Base de datos", usedIn: ["amara"] },
  { name: "RLS", category: "Base de datos", usedIn: ["amara"] },
  { name: "Redis", category: "Base de datos", usedIn: ["obstetricare"] },
  { name: "Gemini 2.0 Flash", category: "IA/ML", usedIn: ["obstetricare"] },
  { name: "OpenAI GPT-4o-mini", category: "IA/ML", usedIn: ["amara"] },
  { name: "Random Forest", category: "IA/ML", usedIn: ["obstetricare"] },
  { name: "CatBoost", category: "IA/ML", usedIn: ["obstetricare"] },
  { name: "SVM", category: "IA/ML", usedIn: ["obstetricare"] },
  { name: "Regresión Logística Ordinal", category: "IA/ML", usedIn: ["obstetricare"] },
  { name: "Árbol de Decisión", category: "IA/ML", usedIn: ["obstetricare"] },
  { name: "Vercel", category: "Infra/DevOps", usedIn: ["amara"] },
  { name: "Migraciones SQL versionadas", category: "Infra/DevOps", usedIn: ["amara"] },
  { name: "YouTube API", category: "Infra/DevOps", usedIn: ["amara"] },
  { name: "WeasyPrint", category: "Infra/DevOps", usedIn: ["obstetricare"] },
  { name: "OpenPyXL", category: "Infra/DevOps", usedIn: ["obstetricare"] },
  { name: "pytest", category: "Testing", usedIn: ["obstetricare"] },
];

export const stackTabMap: Record<string, StackCategory | "all"> = {
  all: "all",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Base de datos",
  aiml: "IA/ML",
  devops: "Infra/DevOps",
  testing: "Testing",
};

export function getStackItems(dict: Dictionary): Stack[] {
  return stackItemsMeta.map((item) => ({
    ...item,
    description:
      dict.stack.descriptions[item.name as keyof typeof dict.stack.descriptions] ?? item.name,
  }));
}

export function getStackByCategory(category: StackCategory, dict: Dictionary): Stack[] {
  return getStackItems(dict).filter((item) => item.category === category);
}

export function getStackEvidence(item: Stack, dict: Dictionary): string {
  if (item.usedIn.includes("amara") && item.name.includes("Next")) {
    return dict.stack.evidence.amara;
  }
  if (item.usedIn.length === 2) {
    return dict.stack.evidence.both;
  }
  if (item.usedIn[0] === "amara") {
    return dict.stack.evidence.amara;
  }
  return dict.stack.evidence.obstetricare;
}

export function getStackCategoryLabel(category: StackCategory, dict: Dictionary): string {
  return dict.stack.categories[category] ?? category;
}
