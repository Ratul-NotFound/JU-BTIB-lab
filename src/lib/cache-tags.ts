import { revalidateTag, revalidatePath } from "next/cache";

export const CACHE_TAGS = {
  SETTINGS: "settings",
  RESEARCH_AREAS: "research-areas",
  PROJECTS: "projects",
  PUBLICATIONS: "publications",
  TEAM: "team",
  EQUIPMENT: "equipment",
  ACTIVITIES: "activities",
  GALLERY: "gallery",
  BLOG: "blog",
  CONTENT_BLOCKS: "content-blocks",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const TAG_TO_PRIMARY_PATHS: Record<string, string[]> = {
  [CACHE_TAGS.SETTINGS]: ["/"],
  [CACHE_TAGS.TEAM]: ["/team"],
  [CACHE_TAGS.RESEARCH_AREAS]: ["/research"],
  [CACHE_TAGS.PROJECTS]: ["/projects"],
  [CACHE_TAGS.PUBLICATIONS]: ["/publications"],
  [CACHE_TAGS.EQUIPMENT]: ["/equipment"],
  [CACHE_TAGS.ACTIVITIES]: ["/activities"],
  [CACHE_TAGS.GALLERY]: ["/gallery"],
  [CACHE_TAGS.BLOG]: ["/blog"],
  [CACHE_TAGS.CONTENT_BLOCKS]: ["/"],
};

/**
 * Revalidates cache tags and the primary route path so Server Components
 * dynamically refresh without triggering heavy multi-route re-renders.
 */
export function invalidateCache(tag: CacheTag | string) {
  try {
    revalidateTag(tag);
  } catch (err) {
    console.error("revalidateTag error:", err);
  }

  const paths = TAG_TO_PRIMARY_PATHS[tag] || ["/"];
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch (err) {
      console.error(`revalidatePath error for ${path}:`, err);
    }
  }
}

