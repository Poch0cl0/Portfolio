export type SectionNavKey = "projects" | "about" | "stack";

export interface SectionNavItem {
  id: string;
  labelKey: SectionNavKey;
}

export const sectionNavigation: SectionNavItem[] = [
  { id: "sobre-mi", labelKey: "about" },
  { id: "proyectos-destacados", labelKey: "projects" },
  { id: "stack", labelKey: "stack" },
];

export function sectionHref(id: string): string {
  return `#${id}`;
}
