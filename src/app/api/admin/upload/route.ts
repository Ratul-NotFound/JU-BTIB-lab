import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";
import { isSupabaseStorageConfigured, uploadToSupabaseStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Maximum allowed input file size before compression: 25 MB
const MAX_RAW_FILE_SIZE = 25 * 1024 * 1024;

// Configure Cloudinary only if real non-placeholder credentials exist in environment
const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_API_KEY.includes("your-") &&
  !process.env.CLOUDINARY_CLOUD_NAME.includes("your-") &&
  !process.env.CLOUDINARY_API_SECRET.includes("your-")
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload a buffer to Cloudinary using upload_stream
 */
async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `btib_lab/${folder}`,
        public_id: publicId,
        resource_type: "image",
        format: "webp",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

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

    // Generate clean safe identifier
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40)
      .replace(/^-|-$/g, "");
    
    const outputFilename = `${safeBaseName || "img"}-${timestamp}-${randomSuffix}`;

    // Compress & Optimize Image using Sharp:
    // 1. Max dimensions 1800x1400 (scale down if larger, preserve aspect ratio)
    // 2. Convert to WebP with balanced 82% quality (typically 50 KB - 180 KB)
    // 3. Auto-orient based on EXIF
    const sharpInstance = sharp(inputBuffer)
      .rotate()
      .resize({
        width: 1800,
        height: 1400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 5,
      });

    const compressedBuffer = await sharpInstance.toBuffer();
    const metadata = await sharp(compressedBuffer).metadata();
    const compressedSizeKb = Math.round(compressedBuffer.length / 1024);
    let publicUrl = "";
    let cloudPublicId = `storage_${randomSuffix}`;
    let storageProvider = "local";

    // 1. Priority: Supabase Storage (500 MB fast CDN storage)
    if (isSupabaseStorageConfigured()) {
      try {
        const storagePath = `${sanitizedFolder}/${outputFilename}.webp`;
        const supabaseRes = await uploadToSupabaseStorage(compressedBuffer, storagePath, "image/webp");
        publicUrl = supabaseRes.publicUrl;
        cloudPublicId = `supabase_${supabaseRes.path}`;
        storageProvider = "supabase";
      } catch (supabaseErr) {
        console.error("Supabase storage upload failed, checking fallbacks:", supabaseErr);
        if (!hasCloudinary) {
          throw supabaseErr;
        }
      }
    }

    // 2. Fallback to Cloudinary if Supabase is not configured or failed
    if (!publicUrl && hasCloudinary) {
      const cloudRes = await uploadToCloudinary(compressedBuffer, sanitizedFolder, outputFilename);
      publicUrl = cloudRes.secure_url;
      cloudPublicId = cloudRes.public_id;
      storageProvider = "cloudinary";
    }

    // 3. Fallback to local storage (for local dev environments)
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);
        await fs.mkdir(uploadDir, { recursive: true });
        const outputPath = path.join(uploadDir, `${outputFilename}.webp`);
        await fs.writeFile(outputPath, compressedBuffer);
        publicUrl = `/uploads/${sanitizedFolder}/${outputFilename}.webp`;
        storageProvider = "local";
      } catch (fsErr) {
        console.error("Local filesystem write failed on serverless:", fsErr);
        return NextResponse.json(
          {
            message:
              "Storage error: Could not persist uploaded file. Please configure SUPABASE_SERVICE_ROLE_KEY or CLOUDINARY credentials in environment variables.",
          },
          { status: 500 }
        );
      }
    }

    // Index in Media database for audit and media management
    try {
      const media = await db.media.create({
        data: {
          cloudinaryId: cloudPublicId,
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
            storage: storageProvider,
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
      filename: `${outputFilename}.webp`,
      sizeKb: compressedSizeKb,
      originalSizeKb,
      savedPercent: originalSizeKb > 0 ? Math.round((1 - compressedSizeKb / originalSizeKb) * 100) : 0,
      width: metadata.width,
      height: metadata.height,
      format: "webp",
      storage: storageProvider,
    });
  } catch (error: unknown) {
    console.error("Direct image upload error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Image upload and compression failed" },
      { status: 500 }
    );
  }
}
