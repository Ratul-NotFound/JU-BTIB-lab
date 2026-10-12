import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/cache-tags";

export { CACHE_TAGS, type CacheTag };

const TAG_TO_PRIMARY_PATHS: Record<string, string[]> = {
  [CACHE_TAGS.SETTINGS]: ["/"],
  [CACHE_TAGS.TEAM]: ["/team", "/register", "/admin/faculty", "/faculty"],
  [CACHE_TAGS.RESEARCH_AREAS]: ["/research"],
  [CACHE_TAGS.PROJECTS]: ["/projects"],
  [CACHE_TAGS.PUBLICATIONS]: ["/publications"],
  [CACHE_TAGS.EQUIPMENT]: ["/equipment", "/portal/book", "/admin/equipment", "/admin/bookings"],
  [CACHE_TAGS.ACTIVITIES]: ["/activities"],
  [CACHE_TAGS.GALLERY]: ["/gallery"],
  [CACHE_TAGS.BLOG]: ["/blog"],
  [CACHE_TAGS.CONTENT_BLOCKS]: ["/"],
  [CACHE_TAGS.NOTICES]: ["/portal/notices", "/portal", "/faculty", "/admin/notices"],
};

/**
 * Revalidates cache tags and the primary route path so Server Components
 * dynamically refresh without triggering heavy multi-route re-renders.
 * ONLY called in Server Actions / Server Components.
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
