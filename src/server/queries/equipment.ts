import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedEquipmentList = unstable_cache(
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
);

export async function getEquipmentList(includeUnpublished = false) {
  try {
    if (includeUnpublished) {
      return await db.equipment.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
    }

    return await getCachedEquipmentList();
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    return [];
  }
}
