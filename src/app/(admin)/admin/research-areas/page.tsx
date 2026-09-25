import { getResearchAreas } from "@/server/queries/research-areas";
import { ResearchAreasClient } from "./areas-client";

export const dynamic = "force-dynamic";

export default async function AdminResearchAreasPage() {
  const areas = await getResearchAreas(true);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ResearchAreasClient initialData={areas} />
    </div>
  );
}
