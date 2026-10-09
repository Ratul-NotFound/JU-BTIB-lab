import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://seaiywvzpuulthprsotl.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

import ws from "ws";

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "media";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseKey || !supabaseUrl) {
    return null;
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      realtime: { transport: ws as unknown as typeof WebSocket },
    });
  }
  return _client;
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

/**
 * Uploads an optimized buffer directly to the Supabase Storage bucket.
 * Automatically ensures public bucket existence and returns the fast CDN public URL.
 */
export async function uploadToSupabaseStorage(
  buffer: Buffer,
  filePath: string,
  contentType = "image/webp"
): Promise<{ publicUrl: string; path: string }> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase credentials not configured. Please add SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file."
    );
  }

  // Sanitize path (no double slashes, leading slashes)
  const cleanPath = filePath.replace(/^\/+/, "").replace(/\/+/g, "/");

  // Attempt upload with upsert enabled
  const { error: uploadError } = await client.storage
    .from(BUCKET_NAME)
    .upload(cleanPath, buffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000", // 1 year immutable cache
    });

  if (uploadError) {
    // If bucket does not exist, attempt to auto-create it as public
    if (uploadError.message?.toLowerCase().includes("bucket not found")) {
      const { error: bucketError } = await client.storage.createBucket(
        BUCKET_NAME,
        {
          public: true,
          fileSizeLimit: 25 * 1024 * 1024,
        }
      );
      if (!bucketError) {
        // Retry upload once after creating bucket
        const { error: retryError } = await client.storage
          .from(BUCKET_NAME)
          .upload(cleanPath, buffer, {
            contentType,
            upsert: true,
            cacheControl: "31536000",
          });
        if (retryError) {
          throw new Error(`Failed to upload to Supabase Storage: ${retryError.message}`);
        }
      } else {
        throw new Error(
          `Supabase storage bucket '${BUCKET_NAME}' was not found and could not be auto-created: ${bucketError.message}. Please create a public bucket named '${BUCKET_NAME}' in your Supabase dashboard.`
        );
      }
    } else {
      throw new Error(`Supabase Storage upload error: ${uploadError.message}`);
    }
  }

  // Get the public CDN URL
  const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(cleanPath);

  return {
    publicUrl: data.publicUrl,
    path: cleanPath,
  };
}

/**
 * Removes an image from Supabase Storage by its file path or public URL.
 */
export async function deleteFromSupabaseStorage(urlOrPath: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    let filePath = urlOrPath;

    // If a full Supabase URL was passed, extract the object path
    if (urlOrPath.includes(`/storage/v1/object/public/${BUCKET_NAME}/`)) {
      filePath = urlOrPath.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
    }

    if (!filePath) return false;

    const { error } = await client.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) {
      console.warn("Could not delete file from Supabase storage:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting from Supabase storage:", err);
    return false;
  }
}
