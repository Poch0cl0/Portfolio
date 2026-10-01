import type { ProjectSlug } from "@/types/project";

export type StackCategory =
  | "Frontend"
  | "Backend"
  | "Base de datos"
  | "IA/ML"
  | "Infra/DevOps"
  | "Testing";

export interface Stack {
  name: string;
  category: StackCategory;
  usedIn: ProjectSlug[];
  description: string;
}
