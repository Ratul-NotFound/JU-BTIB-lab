import { db } from "@/lib/db";
import { MemberCategory, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedTeamMembers = unstable_cache(
  async (category?: MemberCategory) => {
    const where: Prisma.TeamMemberWhereInput = { published: true };
    if (category) {
      where.category = category;
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
  },
  ["team-members-list"],
  {
    tags: [CACHE_TAGS.TEAM],
    revalidate: 3600,
  }
);

export async function getTeamMembers(options?: {
  category?: MemberCategory;
  includeUnpublished?: boolean;
}) {
  try {
    if (options?.includeUnpublished) {
      const where: Prisma.TeamMemberWhereInput = {};
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
    }

    return await getCachedTeamMembers(options?.category);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

const getCachedTeamMemberBySlug = unstable_cache(
  async (slug: string) => {
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
  },
  ["team-member-by-slug"],
  {
    tags: [CACHE_TAGS.TEAM],
    revalidate: 3600,
  }
);

export async function getTeamMemberBySlug(slug: string) {
  try {
    return await getCachedTeamMemberBySlug(slug);
  } catch (error) {
    console.error(`Error fetching team member by slug ${slug}:`, error);
    return null;
  }
}
