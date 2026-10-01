export type SectionNavKey = "projects" | "about" | "stack";

export interface SectionNavItem {
  id: string;
  labelKey: SectionNavKey;
}

export const sectionNavigation: SectionNavItem[] = [
  { id: "proyectos-destacados", labelKey: "projects" },
  { id: "sobre-mi", labelKey: "about" },
  { id: "stack", labelKey: "stack" },
];

export function sectionHref(id: string): string {
  return `#${id}`;
}
