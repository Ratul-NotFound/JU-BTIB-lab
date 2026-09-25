import * as React from "react";
import { Metadata } from "next";
import { getGalleryAlbums } from "@/server/queries/gallery";
import { GalleryAdminClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Photo Gallery Manager | BTIB Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const albums = await getGalleryAlbums(true);

  return <GalleryAdminClient initialAlbums={albums} />;
}
