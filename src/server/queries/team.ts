import { db } from "@/lib/db";
import { MemberCategory, Prisma } from "@prisma/client";

export async function getTeamMembers(options?: {
  category?: MemberCategory;
  includeUnpublished?: boolean;
}) {
  try {
    const where: Prisma.TeamMemberWhereInput = {};

    if (!options?.includeUnpublished) {
      where.published = true;
    }

    if (options?.category) {
      where.category = options.category;
    }

    return await db.teamMember.findMany({
      where,
      orderBy: [{ order: "asc" }, { joinYear: "asc" }],
      include: {
        projects: {
          include: {
            project: true,
          },
        },
        publications: {
          include: {
            publication: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export async function getTeamMemberBySlug(slug: string) {
  try {
    return await db.teamMember.findUnique({
      where: { slug },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
        publications: {
          include: {
            publication: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching team member by slug ${slug}:`, error);
    return null;
  }
}
