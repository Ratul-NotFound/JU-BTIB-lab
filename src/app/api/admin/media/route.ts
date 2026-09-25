import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

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

    // Safe deletion guard: check if image URL is in active use
    const [projectWithImage, areaWithImage] = await Promise.all([
      db.project.findFirst({ where: { coverImage: media.url } }),
      db.researchArea.findFirst({ where: { coverImage: media.url } }),
    ]);

    if (projectWithImage || areaWithImage) {
      return NextResponse.json(
        {
          message:
            "Cannot delete media: asset is currently referenced by an active project or research area.",
        },
        { status: 409 }
      );
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
