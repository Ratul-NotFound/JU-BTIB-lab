import { db } from "@/lib/db";
import { MediaClient } from "./media-client";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await db.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <MediaClient initialData={media} />
    </div>
  );
}
