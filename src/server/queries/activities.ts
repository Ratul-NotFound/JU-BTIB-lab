import { db } from "@/lib/db";
import { ActivityType, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedActivities = unstable_cache(
  async (type?: ActivityType) => {
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
  ["activities-list"],
  {
    tags: [CACHE_TAGS.ACTIVITIES],
    revalidate: 3600,
  }
);

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

const getCachedActivityBySlug = unstable_cache(
  async (slug: string) => {
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
  ["activity-by-slug"],
  {
    tags: [CACHE_TAGS.ACTIVITIES],
    revalidate: 3600,
  }
);

export async function getActivityBySlug(slug: string) {
  try {
    return await getCachedActivityBySlug(slug);
  } catch (error) {
    console.error(`Error fetching activity by slug ${slug}:`, error);
    return null;
  }
}
