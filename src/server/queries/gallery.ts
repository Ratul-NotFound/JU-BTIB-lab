import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedGalleryAlbums() {
  return unstable_cache(
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
  )();
}

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

function getCachedAlbumBySlug(slug: string) {
  const cacheKey = ["gallery-album-by-slug", slug];
  return unstable_cache(
    async () => {
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
    cacheKey,
    {
      tags: [CACHE_TAGS.GALLERY],
      revalidate: 3600,
    }
  )();
}

export async function getAlbumBySlug(slug: string) {
  try {
    return await getCachedAlbumBySlug(slug);
  } catch (error) {
    console.error(`Error fetching album by slug ${slug}:`, error);
    return null;
  }
}
