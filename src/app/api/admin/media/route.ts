import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";
import { deleteFromSupabaseStorage } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const { url, alt } = await req.json();

    if (!url || !alt) {
      return NextResponse.json(
        { message: "Image URL and alt text are required" },
        { status: 400 }
      );
    }

    const cloudinaryId = "media_" + Math.random().toString(36).substring(2, 10);

    const media = await db.media.create({
      data: {
        cloudinaryId,
        url,
        width: 1200,
        height: 800,
        format: url.split(".").pop() || "jpg",
        bytes: 102400,
        alt,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "CREATE",
        entity: "Media",
        entityId: media.id,
        details: { alt: media.alt },
      },
    });

    return NextResponse.json(media);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error saving media" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Media ID required" }, { status: 400 });
    }

    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ message: "Media not found" }, { status: 404 });
    }

    // Safe deletion guard: check if image URL is in active use across the system
    const [
      projectWithImage,
      areaWithImage,
      galleryImageWithUrl,
      albumWithCover,
      memberWithPhoto,
      equipmentWithImage,
      activityWithCover,
      blogWithCover,
    ] = await Promise.all([
      db.project.findFirst({ where: { coverImage: media.url } }),
      db.researchArea.findFirst({ where: { coverImage: media.url } }),
      db.galleryImage.findFirst({ where: { url: media.url } }),
      db.galleryAlbum.findFirst({ where: { coverImage: media.url } }),
      db.teamMember.findFirst({ where: { photoUrl: media.url } }),
      db.equipment.findFirst({ where: { imageUrl: media.url } }),
      db.activity.findFirst({ where: { coverImage: media.url } }),
      db.blogPost.findFirst({ where: { coverImage: media.url } }),
    ]);

    if (
      projectWithImage ||
      areaWithImage ||
      galleryImageWithUrl ||
      albumWithCover ||
      memberWithPhoto ||
      equipmentWithImage ||
      activityWithCover ||
      blogWithCover
    ) {
      let referencedIn = "an active section";
      if (galleryImageWithUrl || albumWithCover) referencedIn = "Photo Gallery";
      else if (projectWithImage) referencedIn = "Projects";
      else if (areaWithImage) referencedIn = "Research Areas";
      else if (memberWithPhoto) referencedIn = "Team Roster";
      else if (equipmentWithImage) referencedIn = "Equipment";
      else if (activityWithCover) referencedIn = "Activities";
      else if (blogWithCover) referencedIn = "News & Blog";

      return NextResponse.json(
        {
          message: `Cannot delete media: this asset is currently referenced and displayed in ${referencedIn}. Please remove it there first.`,
        },
        { status: 409 }
      );
    }

    // Delete from Supabase Storage bucket if hosted there
    if (media.url.includes("supabase.co")) {
      await deleteFromSupabaseStorage(media.url);
    }

    await db.media.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "DELETE",
        entity: "Media",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error deleting media" },
      { status: 500 }
    );
  }
}
