import { db } from "@/lib/db";

export async function getEquipmentList(includeUnpublished = false) {
  try {
    return await db.equipment.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    return [];
  }
}
