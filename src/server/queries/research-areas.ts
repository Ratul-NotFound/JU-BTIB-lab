import { db } from "@/lib/db";

export async function getResearchAreas(includeUnpublished = false) {
  try {
    return await db.researchArea.findMany({
      where: includeUnpublished ? {} : { published: true },
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
  } catch (error) {
    console.error("Error fetching research areas:", error);
    return [];
  }
}

export async function getResearchAreaBySlug(slug: string) {
  try {
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
  } catch (error) {
    console.error(`Error fetching research area by slug ${slug}:`, error);
    return null;
  }
}
