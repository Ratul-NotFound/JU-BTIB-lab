import { db } from "@/lib/db";

export async function getSiteSettings() {
  try {
    const settings = await db.siteSetting.findUnique({
      where: { id: "singleton" },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function getContentBlocks() {
  try {
    return await db.contentBlock.findMany();
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return [];
  }
}

export async function getContentBlockByKey(key: string) {
  try {
    return await db.contentBlock.findUnique({
      where: { key },
    });
  } catch (error) {
    console.error(`Error fetching content block ${key}:`, error);
    return null;
  }
}
