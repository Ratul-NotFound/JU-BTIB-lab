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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* Header */}
      <section className="space-y-2 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
          Photographic Archive & Scientific Field Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
          Laboratory <span className="text-[var(--brand-primary)]">Visual Documentation</span>
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light max-w-3xl">
          High-resolution photographic documentation of microalgal cultures, photobioreactor deployments, 
          fermentation kinetic trials, and academic field expeditions at Jahangirnagar University.
        </p>
      </section>

      {/* Gallery interactive component */}
      <GalleryClient albums={albums} />
    </div>
  );
}
