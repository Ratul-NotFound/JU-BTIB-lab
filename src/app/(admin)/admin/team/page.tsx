import { db } from "@/lib/db";
import { TeamClient } from "./team-client";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [members, projects, publications] = await Promise.all([
    db.teamMember.findMany({
      orderBy: [{ order: "asc" }, { joinYear: "asc" }],
      include: {
        projects: {
          select: {
            projectId: true,
          },
        },
        publications: {
          select: {
            publicationId: true,
          },
        },
      },
    }),
    db.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        startYear: true,
        endYear: true,
      },
      orderBy: [{ startYear: "desc" }, { title: "asc" }],
    }),
    db.publication.findMany({
      select: {
        id: true,
        title: true,
        year: true,
        type: true,
        venue: true,
      },
      orderBy: [{ year: "desc" }, { title: "asc" }],
    }),
  ]);

  const formattedMembers = members.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    category: m.category,
    title: m.title,
    bio: m.bio,
    email: m.email,
    photoUrl: m.photoUrl,
    joinYear: m.joinYear,
    leaveYear: m.leaveYear,
    interests: m.interests,
    order: m.order,
    published: m.published,
    profileLinks: (m.profileLinks as Record<string, string> | null) || null,
    projectIds: m.projects.map((p) => p.projectId),
    publicationIds: m.publications.map((p) => p.publicationId),
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <TeamClient
        initialData={formattedMembers}
        availableProjects={projects}
        availablePublications={publications}
      />
    </div>
  );
}
