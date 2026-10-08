import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedResearchAreas() {
  return unstable_cache(
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
  )();
}

function getCachedAdminResearchAreas() {
  return unstable_cache(
    async () => {
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
    },
    ["admin-research-areas-all"],
    {
      tags: [CACHE_TAGS.RESEARCH_AREAS],
      revalidate: 3600,
    }
  )();
}

export const getResearchAreas = cache(async function getResearchAreas(includeUnpublished = false) {
  try {
    if (includeUnpublished) {
      return await getCachedAdminResearchAreas();
    }
    return await getCachedResearchAreas();
  } catch (error) {
    console.error("Error fetching research areas:", error);
    return [];
  }
});

function getCachedResearchAreaBySlug(slug: string) {
  const cacheKey = ["research-area-by-slug", slug];
  return unstable_cache(
    async () => {
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
    cacheKey,
    {
      tags: [CACHE_TAGS.RESEARCH_AREAS],
      revalidate: 3600,
    }
  )();
}

export const getResearchAreaBySlug = cache(async function getResearchAreaBySlug(slug: string) {
  try {
    return await getCachedResearchAreaBySlug(slug);
  } catch (error) {
    console.error(`Error fetching research area by slug ${slug}:`, error);
    return null;
  }
});
