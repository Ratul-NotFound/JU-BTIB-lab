"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import {
  galleryAlbumSchema,
  galleryImageSchema,
  type GalleryAlbumInput,
  type GalleryImageInput,
} from "@/server/validators/schemas";
import { Role } from "@prisma/client";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { formatActionError } from "@/lib/action-error";
import { logAuditAsync } from "@/lib/audit";

export async function createGalleryAlbum(input: GalleryAlbumInput) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = galleryAlbumSchema.parse(input);

    const album = await db.galleryAlbum.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        coverImage: validated.coverImage || null,
        activityId: validated.activityId || null,
        order: validated.order ?? 0,
        published: validated.published ?? true,
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "GalleryAlbum",
      entityId: album.id,
      details: { title: album.title, slug: album.slug },
    });

    invalidateCache(CACHE_TAGS.GALLERY);
    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true, data: album };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to create gallery album"));
  }
}

export async function updateGalleryAlbum(id: string, input: Partial<GalleryAlbumInput>) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const album = await db.galleryAlbum.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.slug && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.coverImage !== undefined && { coverImage: input.coverImage || null }),
        ...(input.activityId !== undefined && { activityId: input.activityId || null }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.published !== undefined && { published: input.published }),
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "GalleryAlbum",
      entityId: id,
      details: { title: album.title },
    });

    invalidateCache(CACHE_TAGS.GALLERY);
    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true, data: album };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update gallery album"));
  }
}

export async function deleteGalleryAlbum(id: string) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const album = await db.galleryAlbum.delete({
      where: { id },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "GalleryAlbum",
      entityId: id,
      details: { title: album.title },
    });

    invalidateCache(CACHE_TAGS.GALLERY);
    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to delete gallery album"));
  }
}

export async function addGalleryImage(input: GalleryImageInput) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = galleryImageSchema.parse(input);

    const image = await db.galleryImage.create({
      data: {
        albumId: validated.albumId,
        cloudinaryPublicId: validated.cloudinaryPublicId || "direct",
        url: validated.url,
        width: validated.width || 1200,
        height: validated.height || 800,
        alt: validated.alt,
        caption: validated.caption || null,
        order: validated.order ?? 0,
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "GalleryImage",
      entityId: image.id,
      details: { albumId: validated.albumId, url: validated.url },
    });

    invalidateCache(CACHE_TAGS.GALLERY);
    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true, data: image };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to add gallery image"));
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const image = await db.galleryImage.delete({
      where: { id },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "GalleryImage",
      entityId: id,
      details: { albumId: image.albumId },
    });

    invalidateCache(CACHE_TAGS.GALLERY);
    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to delete gallery image"));
  }
}
