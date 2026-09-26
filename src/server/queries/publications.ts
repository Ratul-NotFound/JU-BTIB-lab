import { db } from "@/lib/db";
import { PublicationType, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedPublicationsCount = unstable_cache(
  async () => {
    return await db.publication.count({
      where: { published: true },
    });
  },
  ["publications-count"],
  {
    tags: [CACHE_TAGS.PUBLICATIONS],
    revalidate: 3600,
  }
);

export async function getPublicationsCount() {
  try {
    return await getCachedPublicationsCount();
  } catch (error) {
    console.error("Error fetching publications count:", error);
    return 0;
  }
}

const getCachedPublications = unstable_cache(
  async (
    year?: number,
    type?: PublicationType,
    areaSlug?: string,
    featuredOnly?: boolean
  ) => {
    const where: Prisma.PublicationWhereInput = { published: true };

    if (year) {
      where.year = year;
    }

    if (type) {
      where.type = type;
    }

    if (featuredOnly) {
      where.featured = true;
    }

    if (areaSlug) {
      where.areas = {
        some: {
          researchArea: {
            slug: areaSlug,
          },
        },
      };
    }

    return await db.publication.findMany({
      where,
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      include: {
        areas: {
          include: {
            researchArea: true,
          },
        },
        teamMembers: {
          include: {
            teamMember: true,
          },
        },
      },
    });
  },
  ["publications-list"],
  {
    tags: [CACHE_TAGS.PUBLICATIONS],
    revalidate: 3600,
  }
);

export async function getPublications(options?: {
  year?: number;
  type?: PublicationType;
  areaSlug?: string;
  featuredOnly?: boolean;
  search?: string;
  includeUnpublished?: boolean;
}) {
  try {
    // If searching or requesting unpublished drafts, query database directly
    if (options?.includeUnpublished || options?.search) {
      const where: Prisma.PublicationWhereInput = {};

      if (!options?.includeUnpublished) {
        where.published = true;
      }

      if (options?.year) {
        where.year = options.year;
      }

      if (options?.type) {
        where.type = options.type;
      }

      if (options?.featuredOnly) {
        where.featured = true;
      }

      if (options?.areaSlug) {
        where.areas = {
          some: {
            researchArea: {
              slug: options.areaSlug,
            },
          },
        };
      }

      if (options?.search) {
        where.OR = [
          { title: { contains: options.search, mode: "insensitive" } },
          { venue: { contains: options.search, mode: "insensitive" } },
          { abstract: { contains: options.search, mode: "insensitive" } },
        ];
      }

      return await db.publication.findMany({
        where,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        include: {
          areas: {
            include: {
              researchArea: true,
            },
          },
          teamMembers: {
            include: {
              teamMember: true,
            },
          },
        },
      });
    }

    return await getCachedPublications(
      options?.year,
      options?.type,
      options?.areaSlug,
      options?.featuredOnly
    );
  } catch (error) {
    console.error("Error fetching publications:", error);
    return [];
  }
}

const getCachedPublicationsTimeline = unstable_cache(
  async () => {
    const publications = await db.publication.findMany({
      where: { published: true },
      select: { year: true },
    });

    const yearCounts: Record<number, number> = {};
    for (const pub of publications) {
      yearCounts[pub.year] = (yearCounts[pub.year] || 0) + 1;
    }

    const sortedYears = Object.keys(yearCounts)
      .map(Number)
      .sort((a, b) => a - b);

    return sortedYears.map((year) => ({
      year,
      count: yearCounts[year],
    }));
  },
  ["publications-timeline"],
  {
    tags: [CACHE_TAGS.PUBLICATIONS],
    revalidate: 3600,
  }
);

export async function getPublicationsTimeline() {
  try {
    return await getCachedPublicationsTimeline();
  } catch (error) {
    console.error("Error computing publications timeline:", error);
    return [];
  }
}
