import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedGalleryAlbums = unstable_cache(
  async () => {
    return await db.galleryAlbum.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        activity: true,
      },
    });
  },
  ["gallery-albums-list"],
  {
    tags: [CACHE_TAGS.GALLERY],
    revalidate: 3600,
  }
);

export async function getGalleryAlbums(includeUnpublished = false) {
  try {
    if (includeUnpublished) {
      return await db.galleryAlbum.findMany({
        orderBy: { order: "asc" },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          activity: true,
        },
      });
    }

    return await getCachedGalleryAlbums();
  } catch (error) {
    console.error("Error fetching gallery albums:", error);
    return [];
  }
}

const getCachedAlbumBySlug = unstable_cache(
  async (slug: string) => {
    return await db.galleryAlbum.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        activity: true,
      },
    });
  },
  ["gallery-album-by-slug"],
  {
    tags: [CACHE_TAGS.GALLERY],
    revalidate: 3600,
  }
);

export async function getAlbumBySlug(slug: string) {
  try {
    return await getCachedAlbumBySlug(slug);
  } catch (error) {
    console.error(`Error fetching album by slug ${slug}:`, error);
    return null;
  }
}
