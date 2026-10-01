import type { Dictionary } from "@/i18n/get-dictionary";

export interface EducationMeta {
  id: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  description: string;
}

export const educationMeta: EducationMeta[] = [{ id: "unt-systems" }];

export function getEducation(dict: Dictionary): EducationItem[] {
  return educationMeta.map((meta) => {
    const texts = dict.about.education[meta.id as keyof typeof dict.about.education];
    return {
      id: meta.id,
      ...texts,
    };
  });
}
