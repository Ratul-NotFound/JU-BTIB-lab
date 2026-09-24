import { db } from "@/lib/db";
import { ProjectStatus, Prisma } from "@prisma/client";

export async function getProjects(options?: {
  status?: ProjectStatus;
  areaSlug?: string;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
}) {
  try {
    const where: Prisma.ProjectWhereInput = {};

    if (!options?.includeUnpublished) {
      where.published = true;
    }

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
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
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
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return null;
  }
}
