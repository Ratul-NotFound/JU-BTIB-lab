import { db } from "@/lib/db";
import { PublicationType, Prisma } from "@prisma/client";

export async function getPublications(options?: {
  year?: number;
  type?: PublicationType;
  areaSlug?: string;
  featuredOnly?: boolean;
  search?: string;
  includeUnpublished?: boolean;
}) {
  try {
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
  } catch (error) {
    console.error("Error fetching publications:", error);
    return [];
  }
}

export async function getPublicationsTimeline() {
  try {
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
  } catch (error) {
    console.error("Error computing publications timeline:", error);
    return [];
  }
}
