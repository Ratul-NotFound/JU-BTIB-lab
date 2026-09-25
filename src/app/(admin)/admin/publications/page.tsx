import { getPublications } from "@/server/queries/publications";
import { PublicationsClient } from "./publications-client";

export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
  const publications = await getPublications({ includeUnpublished: true });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PublicationsClient initialData={publications} />
    </div>
  );
}
