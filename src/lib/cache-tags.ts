import { revalidateTag } from "next/cache";

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

/**
 * Revalidates a cache tag so that Server Components dynamically update.
 */
export function invalidateCache(tag: CacheTag | string) {
  revalidateTag(tag);
}
