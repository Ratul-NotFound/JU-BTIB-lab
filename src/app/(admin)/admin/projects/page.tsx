import { getProjects } from "@/server/queries/projects";
import { getResearchAreas } from "@/server/queries/research-areas";
import { ProjectsClient } from "./projects-client";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, areas] = await Promise.all([
    getProjects({ includeUnpublished: true }),
    getResearchAreas(true),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ProjectsClient initialData={projects} areas={areas} />
    </div>
  );
}
