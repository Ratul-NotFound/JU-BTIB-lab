"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Role, NoticeCategory, NoticePriority, NoticeAudience } from "@prisma/client";
import { z } from "zod";

const noticeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title cannot exceed 200 characters"),
  content: z.string().min(5, "Notice content must be at least 5 characters"),
  category: z.nativeEnum(NoticeCategory).default(NoticeCategory.GENERAL),
  priority: z.nativeEnum(NoticePriority).default(NoticePriority.NORMAL),
  targetAudience: z.nativeEnum(NoticeAudience).default(NoticeAudience.ALL),
  pinned: z.boolean().default(false),
  published: z.boolean().default(true),
  expiresAt: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
});

export type NoticeInput = z.infer<typeof noticeSchema>;

/**
 * Super Admin / Editor: Create a new laboratory notice or announcement.
 */
export async function createNoticeAction(input: NoticeInput) {
  try {
    const adminUser = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = noticeSchema.parse(input);

    const author = validated.authorName?.trim() || adminUser.name || "Lab Administration";

    const notice = await db.labNotice.create({
      data: {
        title: validated.title.trim(),
        content: validated.content.trim(),
        category: validated.category,
        priority: validated.priority,
        targetAudience: validated.targetAudience,
        pinned: validated.pinned,
        published: validated.published,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
        authorName: author,
        userId: adminUser.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: adminUser.id,
        userName: adminUser.name,
        userEmail: adminUser.email,
        action: "CREATE",
        entity: "LabNotice",
        entityId: notice.id,
        details: {
          title: notice.title,
          category: notice.category,
          priority: notice.priority,
          targetAudience: notice.targetAudience,
          pinned: notice.pinned,
        },
      },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/portal");
    revalidatePath("/portal/notices");
    revalidatePath("/faculty");

    return {
      success: true,
      message: "Notice posted successfully.",
      notice,
    };
  } catch (error: unknown) {
    console.error("Create notice error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation failed." };
    }
    const msg = error instanceof Error ? error.message : "Failed to create notice.";
    return { success: false, error: msg };
  }
}

/**
 * Super Admin / Editor: Update an existing notice.
 */
export async function updateNoticeAction(id: string, input: Partial<NoticeInput>) {
  try {
    const adminUser = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const partialSchema = noticeSchema.partial();
    const validated = partialSchema.parse(input);

    const existing = await db.labNotice.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Notice not found." };
    }

    const updated = await db.labNotice.update({
      where: { id },
      data: {
        ...(validated.title !== undefined && { title: validated.title.trim() }),
        ...(validated.content !== undefined && { content: validated.content.trim() }),
        ...(validated.category !== undefined && { category: validated.category }),
        ...(validated.priority !== undefined && { priority: validated.priority }),
        ...(validated.targetAudience !== undefined && { targetAudience: validated.targetAudience }),
        ...(validated.pinned !== undefined && { pinned: validated.pinned }),
        ...(validated.published !== undefined && { published: validated.published }),
        ...(validated.expiresAt !== undefined && {
          expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
        }),
        ...(validated.authorName !== undefined && { authorName: validated.authorName?.trim() || null }),
      },
    });

    await db.auditLog.create({
      data: {
        userId: adminUser.id,
        userName: adminUser.name,
        userEmail: adminUser.email,
        action: "UPDATE",
        entity: "LabNotice",
        entityId: id,
        details: { title: updated.title },
      },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/portal");
    revalidatePath("/portal/notices");
    revalidatePath("/faculty");

    return {
      success: true,
      message: "Notice updated successfully.",
      notice: updated,
    };
  } catch (error: unknown) {
    console.error("Update notice error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation failed." };
    }
    const msg = error instanceof Error ? error.message : "Failed to update notice.";
    return { success: false, error: msg };
  }
}

/**
 * Super Admin / Editor: Delete a notice.
 */
export async function deleteNoticeAction(id: string) {
  try {
    const adminUser = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const notice = await db.labNotice.findUnique({ where: { id } });
    if (!notice) {
      return { success: false, error: "Notice not found." };
    }

    await db.labNotice.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: adminUser.id,
        userName: adminUser.name,
        userEmail: adminUser.email,
        action: "DELETE",
        entity: "LabNotice",
        entityId: id,
        details: { title: notice.title },
      },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/portal");
    revalidatePath("/portal/notices");
    revalidatePath("/faculty");

    return { success: true, message: "Notice deleted successfully." };
  } catch (error: unknown) {
    console.error("Delete notice error:", error);
    const msg = error instanceof Error ? error.message : "Failed to delete notice.";
    return { success: false, error: msg };
  }
}

/**
 * Super Admin / Editor: Toggle pinned status of a notice.
 */
export async function togglePinNoticeAction(id: string) {
  try {
    await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const notice = await db.labNotice.findUnique({ where: { id } });
    if (!notice) {
      return { success: false, error: "Notice not found." };
    }

    const updated = await db.labNotice.update({
      where: { id },
      data: { pinned: !notice.pinned },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/portal");
    revalidatePath("/portal/notices");
    revalidatePath("/faculty");

    return {
      success: true,
      message: updated.pinned ? "Notice pinned to top of portal." : "Notice unpinned.",
      pinned: updated.pinned,
    };
  } catch (error: unknown) {
    console.error("Toggle pin notice error:", error);
    const msg = error instanceof Error ? error.message : "Failed to toggle pin status.";
    return { success: false, error: msg };
  }
}

/**
 * Super Admin / Editor: Toggle published visibility status.
 */
export async function togglePublishNoticeAction(id: string) {
  try {
    await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const notice = await db.labNotice.findUnique({ where: { id } });
    if (!notice) {
      return { success: false, error: "Notice not found." };
    }

    const updated = await db.labNotice.update({
      where: { id },
      data: { published: !notice.published },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/portal");
    revalidatePath("/portal/notices");
    revalidatePath("/faculty");

    return {
      success: true,
      message: updated.published ? "Notice published and visible in portal." : "Notice unpublished.",
      published: updated.published,
    };
  } catch (error: unknown) {
    console.error("Toggle publish notice error:", error);
    const msg = error instanceof Error ? error.message : "Failed to toggle published status.";
    return { success: false, error: msg };
  }
}

/**
 * Fetch all notices for the Admin Management Console.
 */
export async function getAllAdminNoticesAction() {
  try {
    await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const notices = await db.labNotice.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });

    return { success: true, data: notices };
  } catch (error: unknown) {
    console.error("Get admin notices error:", error);
    return { success: false, data: [] };
  }
}

/**
 * Fetch active, published notices for the Portal (Students, Faculty, or Admin view).
 * Automatically filters out expired notices and honors targetAudience.
 */
export async function getActivePortalNoticesAction(userRole?: Role) {
  try {
    const now = new Date();

    const audienceFilter = userRole === Role.FACULTY
      ? { in: [NoticeAudience.ALL, NoticeAudience.FACULTY_ONLY] }
      : userRole === Role.STUDENT
      ? { in: [NoticeAudience.ALL, NoticeAudience.STUDENTS_ONLY] }
      : undefined;

    const notices = await db.labNotice.findMany({
      where: {
        published: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        ...(audienceFilter ? { targetAudience: audienceFilter } : {}),
      },
      orderBy: [
        { pinned: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, data: notices };
  } catch (error: unknown) {
    console.error("Get portal notices error:", error);
    return { success: false, data: [] };
  }
}
