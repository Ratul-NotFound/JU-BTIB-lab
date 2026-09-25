import { db } from "@/lib/db";
import { ActivityType, Prisma } from "@prisma/client";

export async function getActivities(options?: {
  type?: ActivityType;
  includeUnpublished?: boolean;
}) {
  try {
    const where: Prisma.ActivityWhereInput = {};

    if (!options?.includeUnpublished) {
      where.published = true;
    }

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
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

export async function getActivityBySlug(slug: string) {
  try {
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
  } catch (error) {
    console.error(`Error fetching activity by slug ${slug}:`, error);
    return null;
  }
}
