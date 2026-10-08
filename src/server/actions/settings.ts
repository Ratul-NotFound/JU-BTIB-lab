"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { siteSettingSchema, contentBlockSchema, type SiteSettingInput, type ContentBlockInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { formatActionError } from "@/lib/action-error";
import { logAuditAsync } from "@/lib/audit";
import { Role, Prisma } from "@prisma/client";

export async function updateSiteSettings(input: SiteSettingInput) {
  try {
    // SUPER_ADMIN only for global laboratory settings
    const user = await requireRole([Role.SUPER_ADMIN]);
    const validated = siteSettingSchema.parse(input);

    const updated = await db.siteSetting.upsert({
      where: { id: "singleton" },
      update: {
        ...validated,
        bannerImages: validated.bannerImages !== undefined ? (validated.bannerImages ?? Prisma.DbNull) : undefined,
        socialLinks: validated.socialLinks ?? undefined,
        defaultSeo: validated.defaultSeo ?? undefined,
      },
      create: {
        id: "singleton",
        ...validated,
        bannerImages: validated.bannerImages !== undefined ? (validated.bannerImages ?? Prisma.DbNull) : undefined,
        socialLinks: validated.socialLinks ?? undefined,
        defaultSeo: validated.defaultSeo ?? undefined,
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "SiteSetting",
      entityId: "singleton",
      details: { labName: updated.labName },
    });

    invalidateCache(CACHE_TAGS.SETTINGS);
    return { success: true, data: updated };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update site settings"));
  }
}

export async function updateContentBlock(input: ContentBlockInput) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = contentBlockSchema.parse(input);

    const updated = await db.contentBlock.upsert({
      where: { key: validated.key },
      update: {
        title: validated.title,
        content: validated.content as Prisma.InputJsonValue,
      },
      create: {
        key: validated.key,
        title: validated.title,
        content: validated.content as Prisma.InputJsonValue,
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "ContentBlock",
      entityId: updated.id,
      details: { key: updated.key },
    });

    invalidateCache(CACHE_TAGS.CONTENT_BLOCKS);
    return { success: true, data: updated };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update content block"));
  }
}
