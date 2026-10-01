import type { Project } from "@/types/project";
import { ProjectMedia } from "@/features/projects/components/project-media";
import { ProjectShowcaseContent } from "@/features/projects/components/project-showcase-content";

interface ProjectShowcaseProps {
  project: Project;
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  return (
    <article
      id={project.slug}
      className="group scroll-mt-24 flex flex-col overflow-hidden rounded-2xl bg-surface-container-low shadow-xl transition-all duration-200 hover:glow-hover-primary hover:-translate-y-1 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        <div className="relative min-h-[280px] overflow-hidden lg:col-span-5 lg:min-h-[420px]">
          <ProjectMedia slug={project.slug} className="absolute inset-0 h-full min-h-0" />
        </div>
        <div className="lg:col-span-7">
          <ProjectShowcaseContent project={project} />
        </div>
      </div>
    </article>
  );
}
