import type { LucideIcon } from "lucide-react";
import { Brain, Database, Layers, Rocket } from "lucide-react";
import type { Dictionary } from "@/i18n/get-dictionary";

export interface CapabilityMeta {
  id: string;
  icon: LucideIcon;
  accent: "primary" | "secondary" | "tertiary" | "neutral";
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  accent: "primary" | "secondary" | "tertiary" | "neutral";
}

export const capabilityMeta: CapabilityMeta[] = [
  { id: "fullstack", icon: Layers, accent: "primary" },
  { id: "ai-ml", icon: Brain, accent: "tertiary" },
  { id: "persistence", icon: Database, accent: "secondary" },
  { id: "devops", icon: Rocket, accent: "neutral" },
];

export function getCapabilities(dict: Dictionary): Capability[] {
  return capabilityMeta.map((meta) => {
    const texts = dict.home.capabilities.items[meta.id as keyof typeof dict.home.capabilities.items];
    return {
      ...meta,
      title: texts.title,
      description: texts.description,
      technologies: texts.technologies,
    };
  });
}
