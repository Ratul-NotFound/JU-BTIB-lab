import * as React from "react";
import { Metadata } from "next";
import { getGalleryAlbums } from "@/server/queries/gallery";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Photographic Archive | BTIB Lab - Jahangirnagar University",
  description:
    "Photographic documentation of research experiments, microbial specimens, photobioreactor installations, and laboratory milestones at BTIB Lab, Jahangirnagar University.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const albums = await getGalleryAlbums();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-6 sm:space-y-10">
      {/* Header */}
      <section className="space-y-2 sm:space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12] sm:leading-[1.08]">
          Laboratory Visual Documentation
        </h1>

        <p className="text-xs sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          High-resolution photographic documentation of microalgal cultures, photobioreactor deployments, 
          fermentation kinetic trials, and academic field expeditions at Jahangirnagar University.
        </p>
      </section>

      {/* Gallery interactive component */}
      <GalleryClient albums={albums} />
    </div>
  );
}
