import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedSiteSettings = unstable_cache(
  async () => {
    return await db.siteSetting.findUnique({
      where: { id: "singleton" },
    });
  },
  ["site-settings"],
  {
    tags: [CACHE_TAGS.SETTINGS],
    revalidate: 3600,
  }
);

export async function getSiteSettings() {
  try {
    return await getCachedSiteSettings();
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

const getCachedContentBlocks = unstable_cache(
  async () => {
    return await db.contentBlock.findMany();
  },
  ["content-blocks-all"],
  {
    tags: [CACHE_TAGS.CONTENT_BLOCKS],
    revalidate: 3600,
  }
);

export async function getContentBlocks() {
  try {
    return await getCachedContentBlocks();
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return [];
  }
}

const getCachedContentBlockByKey = unstable_cache(
  async (key: string) => {
    return await db.contentBlock.findUnique({
      where: { key },
    });
  },
  ["content-block-by-key"],
  {
    tags: [CACHE_TAGS.CONTENT_BLOCKS],
    revalidate: 3600,
  }
);

export async function getContentBlockByKey(key: string) {
  try {
    return await getCachedContentBlockByKey(key);
  } catch (error) {
    console.error(`Error fetching content block ${key}:`, error);
    return null;
  }
}
