import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

// Maximum allowed input file size before compression: 25 MB
const MAX_RAW_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "activities";
    const customAlt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_RAW_FILE_SIZE) {
      return NextResponse.json(
        { message: "File exceeds 25MB raw limit. Please choose a smaller file." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);
    const originalSizeKb = Math.round(inputBuffer.length / 1024);

    // Sanitize folder name
    const sanitizedFolder = folder.replace(/[^a-z0-9_-]/gi, "");
    const uploadDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate clean filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40)
      .replace(/^-|-$/g, "");
    
    const outputFilename = `${safeBaseName || "img"}-${timestamp}-${randomSuffix}.webp`;
    const outputPath = path.join(uploadDir, outputFilename);

    // Compress & Optimize Image using Sharp:
    // 1. Max dimensions 1600x1200 (scale down if larger, never upscale)
    // 2. Convert to WebP with balanced 80% quality (typically 60 KB - 180 KB)
    // 3. Strip metadata to minimize byte overhead
    const sharpInstance = sharp(inputBuffer)
      .rotate() // auto-orient based on EXIF before stripping
      .resize({
        width: 1600,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 5,
      });

    const compressedBuffer = await sharpInstance.toBuffer();
    const metadata = await sharp(compressedBuffer).metadata();
    const compressedSizeKb = Math.round(compressedBuffer.length / 1024);

    // Write compressed file to public storage
    await fs.writeFile(outputPath, compressedBuffer);

    const publicUrl = `/uploads/${sanitizedFolder}/${outputFilename}`;

    // Index in Media database for audit and media management
    try {
      const media = await db.media.create({
        data: {
          cloudinaryId: `local_${randomSuffix}`,
          url: publicUrl,
          width: metadata.width || 1200,
          height: metadata.height || 800,
          format: "webp",
          bytes: compressedBuffer.length,
          alt: customAlt || file.name.replace(/\.[^/.]+$/, ""),
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
          details: {
            url: publicUrl,
            sizeKb: compressedSizeKb,
            originalSizeKb,
            compressionRatio: `${Math.round((1 - compressedSizeKb / originalSizeKb) * 100)}%`,
          },
        },
      });
    } catch (dbErr) {
      console.warn("Could not record media upload in DB audit, but file was saved:", dbErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: outputFilename,
      sizeKb: compressedSizeKb,
      originalSizeKb,
      savedPercent: originalSizeKb > 0 ? Math.round((1 - compressedSizeKb / originalSizeKb) * 100) : 0,
      width: metadata.width,
      height: metadata.height,
      format: "webp",
    });
  } catch (error: unknown) {
    console.error("Direct image upload error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Image upload and compression failed" },
      { status: 500 }
    );
  }
}
