import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  TeamClient,
  PersonalProject,
  PersonalPublication,
  EducationItem,
  AwardItem,
} from "./team-client";

export const dynamic = "force-dynamic";

const getCachedAdminTeamPageData = unstable_cache(
  async () => {
    const [members, memberProjects, memberPubs, projects, publications, facultyProfiles] = await Promise.all([
      db.teamMember.findMany({
        orderBy: [{ order: "asc" }, { joinYear: "asc" }],
      }),
      db.teamMembersOnProjects.findMany({
        select: { teamMemberId: true, projectId: true },
      }),
      db.teamMembersOnPublications.findMany({
        select: { teamMemberId: true, publicationId: true },
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
      db.facultyProfile.findMany({
        where: { status: "ACTIVE" },
        include: { user: { select: { email: true, name: true } } },
      }),
    ]);

    const projMap = new Map<string, string[]>();
    for (const mp of memberProjects) {
      if (!projMap.has(mp.teamMemberId)) projMap.set(mp.teamMemberId, []);
      projMap.get(mp.teamMemberId)!.push(mp.projectId);
    }

    const pubMap = new Map<string, string[]>();
    for (const mp of memberPubs) {
      if (!pubMap.has(mp.teamMemberId)) pubMap.set(mp.teamMemberId, []);
      pubMap.get(mp.teamMemberId)!.push(mp.publicationId);
    }

    const facultyEmailSet = new Set(
      facultyProfiles.map((fp) => fp.user.email.toLowerCase().trim())
    );
    const facultyNameSet = new Set(
      facultyProfiles.map((fp) => fp.user.name.toLowerCase().trim())
    );

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
      hasFacultyPortalAccount:
        Boolean(m.email && facultyEmailSet.has(m.email.toLowerCase().trim())) ||
        facultyNameSet.has(m.name.toLowerCase().trim()),
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
      projectIds: projMap.get(m.id) || [],
      publicationIds: pubMap.get(m.id) || [],
    }));

    return { formattedMembers, projects, publications };
  },
  ["admin-team-page-data"],
  {
    tags: [CACHE_TAGS.TEAM, CACHE_TAGS.PROJECTS, CACHE_TAGS.PUBLICATIONS],
    revalidate: 3600,
  }
);

export default async function AdminTeamPage() {
  try {
    const { formattedMembers, projects, publications } = await getCachedAdminTeamPageData();

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
