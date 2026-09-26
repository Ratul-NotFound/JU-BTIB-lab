import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedResearchAreas = unstable_cache(
  async () => {
    return await db.researchArea.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            projects: true,
            publications: true,
          },
        },
      },
    });
  },
  ["research-areas-all"],
  {
    tags: [CACHE_TAGS.RESEARCH_AREAS],
    revalidate: 3600,
  }
);

export async function getResearchAreas(includeUnpublished = false) {
  try {
    if (includeUnpublished) {
      return await db.researchArea.findMany({
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: {
              projects: true,
              publications: true,
            },
          },
        },
      });
    }
    return await getCachedResearchAreas();
  } catch (error) {
    console.error("Error fetching research areas:", error);
    return [];
  }
}

const getCachedResearchAreaBySlug = unstable_cache(
  async (slug: string) => {
    return await db.researchArea.findUnique({
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
  ["research-area-by-slug"],
  {
    tags: [CACHE_TAGS.RESEARCH_AREAS],
    revalidate: 3600,
  }
);

export async function getResearchAreaBySlug(slug: string) {
  try {
    return await getCachedResearchAreaBySlug(slug);
  } catch (error) {
    console.error(`Error fetching research area by slug ${slug}:`, error);
    return null;
  }
}
