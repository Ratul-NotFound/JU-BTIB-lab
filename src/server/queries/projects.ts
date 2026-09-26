import { db } from "@/lib/db";
import { ProjectStatus, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedProjects = unstable_cache(
  async (status?: ProjectStatus, areaSlug?: string, featuredOnly?: boolean) => {
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
  ["projects-list"],
  {
    tags: [CACHE_TAGS.PROJECTS],
    revalidate: 3600,
  }
);

export async function getProjects(options?: {
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
}

const getCachedProjectBySlug = unstable_cache(
  async (slug: string) => {
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
  ["project-by-slug"],
  {
    tags: [CACHE_TAGS.PROJECTS],
    revalidate: 3600,
  }
);

export async function getProjectBySlug(slug: string) {
  try {
    return await getCachedProjectBySlug(slug);
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return null;
  }
}
