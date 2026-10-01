export type ProjectType = "academico-profesional" | "personal";

export type ProjectSlug = "obstetricare" | "amara";

export type ProjectAccent = "primary" | "secondary";

export interface ArchitectureLayer {
  name: string;
  description: string;
}

export interface Architecture {
  summary: string;
  layers: ArchitectureLayer[];
}

export interface Project {
  slug: ProjectSlug;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  context: string;
  solution: string;
  technologies: string[];
  architecture: Architecture;
  features: string[];
  technicalDecisions: string[];
  results: string[];
  demoUrl?: string;
  githubUrl?: string;
  image: string;
  ogImage: string;
  featured: boolean;
  period: string;
  type: ProjectType;
  sector: string;
  accent: ProjectAccent;
}
