import { getActivities } from "@/server/queries/activities";
import { ActivitiesClient } from "./activities-client";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await getActivities({ includeUnpublished: true });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ActivitiesClient initialData={activities} />
    </div>
  );
}
