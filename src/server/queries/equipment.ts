import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedEquipmentList() {
  return unstable_cache(
    async () => {
      return await db.equipment.findMany({
        where: { published: true },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
    },
    ["equipment-list"],
    {
      tags: [CACHE_TAGS.EQUIPMENT],
      revalidate: 3600,
    }
  )();
}

function getCachedAdminEquipmentList() {
  return unstable_cache(
    async () => {
      return await db.equipment.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
    },
    ["admin-equipment-list"],
    {
      tags: [CACHE_TAGS.EQUIPMENT],
      revalidate: 3600,
    }
  )();
}

export const getEquipmentList = cache(async function getEquipmentList(includeUnpublished = false) {
  try {
    if (includeUnpublished) {
      return await getCachedAdminEquipmentList();
    }

    return await getCachedEquipmentList();
  } catch {
    // Graceful fallback to direct db query if running outside incremental cache context
    try {
      return await db.equipment.findMany({
        where: includeUnpublished ? undefined : { published: true },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
    } catch (fallbackErr) {
      console.error("Error fetching equipment list fallback:", fallbackErr);
      return [];
    }
  }
});
