import { db } from "@/lib/db";
import { MemberCategory, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedTeamMembers(category?: MemberCategory) {
  const cacheKey = ["team-members-list", category ?? "all"];
  return unstable_cache(
    async () => {
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
              project: {
                include: {
                  areas: {
                    include: {
                      researchArea: true,
                    },
                  },
                },
              },
            },
          },
          publications: {
            include: {
              publication: {
                include: {
                  areas: {
                    include: {
                      researchArea: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.TEAM],
      revalidate: 3600,
    }
  )();
}

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
              project: {
                include: {
                  areas: {
                    include: {
                      researchArea: true,
                    },
                  },
                },
              },
            },
          },
          publications: {
            include: {
              publication: {
                include: {
                  areas: {
                    include: {
                      researchArea: true,
                    },
                  },
                },
              },
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

function getCachedTeamMemberBySlug(slug: string) {
  const cacheKey = ["team-member-by-slug", slug];
  return unstable_cache(
    async () => {
      return await db.teamMember.findUnique({
        where: { slug },
        include: {
          projects: {
            include: {
              project: {
                include: {
                  areas: {
                    include: {
                      researchArea: true,
                    },
                  },
                },
              },
            },
          },
          publications: {
            include: {
              publication: {
                include: {
                  areas: {
                    include: {
                      researchArea: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.TEAM],
      revalidate: 3600,
    }
  )();
}

export async function getTeamMemberBySlug(slug: string) {
  try {
    return await getCachedTeamMemberBySlug(slug);
  } catch (error) {
    console.error(`Error fetching team member by slug ${slug}:`, error);
    return null;
  }
}
