import { db } from "@/lib/db";
import { ActivityType, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedActivities(type?: ActivityType) {
  const cacheKey = ["activities-list", type ?? "all"];
  return unstable_cache(
    async () => {
      const where: Prisma.ActivityWhereInput = { published: true };
      if (type) {
        where.type = type;
      }

      return await db.activity.findMany({
        where,
        orderBy: { date: "desc" },
        include: {
          albums: {
            include: {
              images: {
                take: 4,
              },
            },
          },
        },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.ACTIVITIES],
      revalidate: 3600,
    }
  )();
}

export async function getActivities(options?: {
  type?: ActivityType;
  includeUnpublished?: boolean;
}) {
  try {
    if (options?.includeUnpublished) {
      const where: Prisma.ActivityWhereInput = {};
      if (options?.type) {
        where.type = options.type;
      }
      return await db.activity.findMany({
        where,
        orderBy: { date: "desc" },
        include: {
          albums: {
            include: {
              images: {
                take: 4,
              },
            },
          },
        },
      });
    }

    return await getCachedActivities(options?.type);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

function getCachedActivityBySlug(slug: string) {
  const cacheKey = ["activity-by-slug", slug];
  return unstable_cache(
    async () => {
      return await db.activity.findUnique({
        where: { slug },
        include: {
          albums: {
            include: {
              images: true,
            },
          },
        },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.ACTIVITIES],
      revalidate: 3600,
    }
  )();
}

export async function getActivityBySlug(slug: string) {
  try {
    return await getCachedActivityBySlug(slug);
  } catch (error) {
    console.error(`Error fetching activity by slug ${slug}:`, error);
    return null;
  }
}
