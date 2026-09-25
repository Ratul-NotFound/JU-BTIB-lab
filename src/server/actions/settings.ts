"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { siteSettingSchema, contentBlockSchema, type SiteSettingInput, type ContentBlockInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role, Prisma } from "@prisma/client";

export async function updateSiteSettings(input: SiteSettingInput) {
  // SUPER_ADMIN only for global laboratory settings
  const user = await requireRole([Role.SUPER_ADMIN]);
  const validated = siteSettingSchema.parse(input);

  const updated = await db.siteSetting.upsert({
    where: { id: "singleton" },
    update: {
      ...validated,
      socialLinks: validated.socialLinks ?? undefined,
      defaultSeo: validated.defaultSeo ?? undefined,
    },
    create: {
      id: "singleton",
      ...validated,
      socialLinks: validated.socialLinks ?? undefined,
      defaultSeo: validated.defaultSeo ?? undefined,
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "SiteSetting",
      entityId: "singleton",
      details: { labName: updated.labName },
    },
  });

  invalidateCache(CACHE_TAGS.SETTINGS);
  return { success: true, data: updated };
}

export async function updateContentBlock(input: ContentBlockInput) {
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

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "ContentBlock",
      entityId: updated.id,
      details: { key: updated.key },
    },
  });

  invalidateCache(CACHE_TAGS.CONTENT_BLOCKS);
  return { success: true, data: updated };
}
