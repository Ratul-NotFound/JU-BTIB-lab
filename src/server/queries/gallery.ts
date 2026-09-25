import { db } from "@/lib/db";

export async function getGalleryAlbums(includeUnpublished = false) {
  try {
    return await db.galleryAlbum.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: { order: "asc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        activity: true,
      },
    });
  } catch (error) {
    console.error("Error fetching gallery albums:", error);
    return [];
  }
}

export async function getAlbumBySlug(slug: string) {
  try {
    return await db.galleryAlbum.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        activity: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching album by slug ${slug}:`, error);
    return null;
  }
}
