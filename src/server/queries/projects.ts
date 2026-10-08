import { db } from "@/lib/db";
import { ProjectStatus, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedProjects(
  status?: ProjectStatus,
  areaSlug?: string,
  featuredOnly?: boolean
) {
  const cacheKey = [
    "projects-list",
    status ?? "any",
    areaSlug ?? "any",
    featuredOnly ? "featured" : "all",
  ];
  return unstable_cache(
    async () => {
      const where: Prisma.ProjectWhereInput = { published: true };

      if (status) {
        where.status = status;
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

      return await db.project.findMany({
        where,
        orderBy: [{ featured: "desc" }, { order: "asc" }, { startYear: "desc" }],
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
    cacheKey,
    {
      tags: [CACHE_TAGS.PROJECTS],
      revalidate: 3600,
    }
  )();
}

export const getProjects = cache(async function getProjects(options?: {
  status?: ProjectStatus;
  areaSlug?: string;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
}) {
  try {
    if (options?.includeUnpublished) {
      const where: Prisma.ProjectWhereInput = {};

      if (options?.status) {
        where.status = options.status;
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

      return await db.project.findMany({
        where,
        orderBy: [{ featured: "desc" }, { order: "asc" }, { startYear: "desc" }],
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

    return await getCachedProjects(
      options?.status,
      options?.areaSlug,
      options?.featuredOnly
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
});

function getCachedProjectBySlug(slug: string) {
  const cacheKey = ["project-by-slug", slug];
  return unstable_cache(
    async () => {
      return await db.project.findUnique({
        where: { slug },
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
    cacheKey,
    {
      tags: [CACHE_TAGS.PROJECTS],
      revalidate: 3600,
    }
  )();
}

export const getProjectBySlug = cache(async function getProjectBySlug(slug: string) {
  try {
    return await getCachedProjectBySlug(slug);
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return null;
  }
});
