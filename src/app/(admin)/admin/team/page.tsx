import { getTeamMembers } from "@/server/queries/team";
import { TeamClient } from "./team-client";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await getTeamMembers({ includeUnpublished: true });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <TeamClient initialData={members} />
    </div>
  );
}
