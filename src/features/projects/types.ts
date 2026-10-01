import type { ProjectType } from "@/types/project";

export interface ProjectFiltersState {
  type: ProjectType | "all";
  technology: string | "all";
  search: string;
}

export const defaultProjectFilters: ProjectFiltersState = {
  type: "all",
  technology: "all",
  search: "",
};
