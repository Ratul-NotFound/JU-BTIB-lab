import { db } from "@/lib/db";
import {
  TeamClient,
  PersonalProject,
  PersonalPublication,
  EducationItem,
  AwardItem,
} from "./team-client";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  try {
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

    const formattedMembers = (members || []).map((m) => ({
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
      interests: Array.isArray(m.interests) ? m.interests : [],
      order: m.order,
      published: m.published,
      profileLinks:
        m.profileLinks && typeof m.profileLinks === "object"
          ? (m.profileLinks as Record<string, string>)
          : null,
      personalProjects: Array.isArray(m.personalProjects)
        ? (m.personalProjects as unknown as PersonalProject[])
        : [],
      personalPublications: Array.isArray(m.personalPublications)
        ? (m.personalPublications as unknown as PersonalPublication[])
        : [],
      education: Array.isArray(m.education)
        ? (m.education as unknown as EducationItem[])
        : [],
      awards: Array.isArray(m.awards)
        ? (m.awards as unknown as AwardItem[])
        : [],
      projectIds: Array.isArray(m.projects)
        ? m.projects.map((p) => p.projectId).filter(Boolean)
        : [],
      publicationIds: Array.isArray(m.publications)
        ? m.publications.map((p) => p.publicationId).filter(Boolean)
        : [],
    }));

    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <TeamClient
          initialData={formattedMembers}
          availableProjects={projects || []}
          availablePublications={publications || []}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in AdminTeamPage:", error);
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <TeamClient initialData={[]} availableProjects={[]} availablePublications={[]} />
      </div>
    );
  }
}
