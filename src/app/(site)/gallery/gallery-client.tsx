"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Columns3,
  ImageIcon,
  LayoutGrid,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";

interface GalleryImageItem {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
}

interface GalleryAlbumItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  images: GalleryImageItem[];
}

interface EnrichedImage extends GalleryImageItem {
  albumTitle: string;
  albumSlug: string;
}

export function GalleryClient({ albums }: { albums: GalleryAlbumItem[] }) {
  // Only display albums that have images to prevent empty (0) buttons
  const validAlbums = React.useMemo(
    () => albums.filter((a) => a.images.length > 0),
    [albums]
  );

  const [selectedAlbumId, setSelectedAlbumId] = React.useState<string>("ALL");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [viewMode, setViewMode] = React.useState<"bento" | "masonry" | "grid">("bento");

  // Flatten images and enrich each image with its parent album title
  const allImages: EnrichedImage[] = React.useMemo(() => {
    if (selectedAlbumId === "ALL") {
      return validAlbums.flatMap((a) =>
        a.images.map((img) => ({
          ...img,
          albumTitle: a.title,
          albumSlug: a.slug,
        }))
      );
    }
    const album = validAlbums.find((a) => a.id === selectedAlbumId);
    return album
      ? album.images.map((img) => ({
          ...img,
          albumTitle: album.title,
          albumSlug: album.slug,
        }))
      : [];
  }, [validAlbums, selectedAlbumId]);

  const totalImagesCount = React.useMemo(
    () => validAlbums.reduce((acc, curr) => acc + curr.images.length, 0),
    [validAlbums]
  );

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : allImages.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null && prev < allImages.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, allImages.length]);

  const activeImage = lightboxIndex !== null ? allImages[lightboxIndex] : null;

  // Bento Span generator for geometric harmony on 3-column layouts
  const getBentoClasses = (index: number, total: number) => {
    if (total <= 2) {
      return "col-span-1 min-h-[300px]";
    }

    const pos = index % 8;
    switch (pos) {
      case 0:
        // Featured Hero (2 cols, 2 rows on desktop)
        return "col-span-1 sm:col-span-2 lg:col-span-2 sm:row-span-2 min-h-[320px] sm:min-h-[520px] lg:min-h-[580px]";
      case 1:
        // Top right stacked (1 col, 1 row)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      case 2:
        // Bottom right stacked (1 col, 1 row)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      case 3:
        // Standard (1 col, 1 row)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      case 4:
        // Wide Panorama banner (2 cols, 1 row)
        return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      case 5:
        // Standard (1 col, 1 row)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      case 6:
        // Standard (1 col, 1 row)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      case 7:
        // Standard (1 col, 1 row)
        return "col-span-1 sm:col-span-2 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px] lg:min-h-[275px]";
      default:
        return "col-span-1 row-span-1 min-h-[240px]";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Controls: Album Filter Tabs & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-3 border-b border-[var(--border)]">
        {/* Album Selector Tabs */}
        {validAlbums.length > 0 && (
          <div className="overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <div className="flex items-center gap-2">
              {/* "All Images" Tab Button */}
              <button
                type="button"
                onClick={() => setSelectedAlbumId("ALL")}
                className={`h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 shrink-0 transition-all border focus:outline-none ${
                  selectedAlbumId === "ALL"
                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-xs"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]/40"
                }`}
              >
                <span>All Images</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedAlbumId === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]"
                  }`}
                >
                  {totalImagesCount}
                </span>
              </button>

              {/* Individual Album Tab Buttons */}
              {validAlbums.map((album) => {
                const isSelected = selectedAlbumId === album.id;
                return (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => setSelectedAlbumId(album.id)}
                    className={`h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 shrink-0 transition-all border focus:outline-none ${
                      isSelected
                        ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-xs"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]/40"
                    }`}
                  >
                    <span className="truncate max-w-[220px] sm:max-w-none">{album.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]"
                      }`}
                    >
                      {album.images.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Creative Grid Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("bento")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "bento"
                ? "bg-[var(--brand-primary)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title="Creative Editorial Bento Grid"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Bento</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("masonry")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "masonry"
                ? "bg-[var(--brand-primary)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title="Flowing Masonry Columns"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Masonry</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "grid"
                ? "bg-[var(--brand-primary)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title="Uniform Classic Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Uniform</span>
          </button>
        </div>
      </div>

      {/* Selected Album Description Banner */}
      {selectedAlbumId !== "ALL" && (() => {
        const currentAlbum = validAlbums.find((a) => a.id === selectedAlbumId);
        if (!currentAlbum?.description) return null;
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
            <span className="font-semibold text-[var(--text-primary)] mr-2">Archive Series:</span>
            {currentAlbum.description}
          </div>
        );
      })()}

      {/* ================================================================= */}
      {/* 1. CREATIVE BENTO GRID (Default)                                  */}
      {/* ================================================================= */}
      {viewMode === "bento" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {allImages.map((img, idx) => {
            const bentoClasses = getBentoClasses(idx, allImages.length);
            const isHero = (idx % 8 === 0) && allImages.length > 2;

            return (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className={`group relative rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden cursor-pointer hover:border-[var(--brand-primary)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-xs flex flex-col justify-end ${bentoClasses}`}
              >
                {/* Background Image */}
                <Image
                  src={img.url}
                  alt={img.alt || "Laboratory specimen"}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes={
                    isHero
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                />

                {/* Subtle base gradient for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-300 group-hover:via-black/45" />

                {/* Top Overlay Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-black/65 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {isHero && <Sparkles className="w-3 h-3 text-[var(--brand-primary)]" />}
                    <span className="truncate max-w-[180px]">{img.albumTitle}</span>
                  </span>

                  <div className="w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-[var(--brand-primary)] transition-all shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Content / Caption Lockup */}
                <div className="relative p-4 sm:p-5 sm:pb-6 z-10 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--brand-primary)] uppercase tracking-wider font-semibold">
                    <span>Specimen #{String(idx + 1).padStart(2, "0")}</span>
                  </div>

                  <h3
                    className={`font-bold font-sans text-white leading-snug group-hover:text-[var(--brand-primary)] transition-colors ${
                      isHero
                        ? "text-lg sm:text-2xl font-black line-clamp-2"
                        : "text-sm sm:text-base line-clamp-2"
                    }`}
                  >
                    {img.alt}
                  </h3>

                  {img.caption && (
                    <p
                      className={`text-white/80 font-light leading-relaxed ${
                        isHero
                          ? "text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 pt-0.5"
                          : "text-[11px] sm:text-xs line-clamp-1 group-hover:line-clamp-2 pt-0.5"
                      }`}
                    >
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. FLOWING MASONRY COLUMNS                                        */}
      {/* ================================================================= */}
      {viewMode === "masonry" && (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {allImages.map((img, idx) => {
            const aspectStyle =
              idx % 4 === 0
                ? "aspect-[4/5]"
                : idx % 4 === 1
                ? "aspect-[16/10]"
                : idx % 4 === 2
                ? "aspect-square"
                : "aspect-[4/3]";

            return (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="break-inside-avoid group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden cursor-pointer hover:border-[var(--brand-primary)] hover:shadow-xl transition-all duration-300 shadow-xs"
              >
                <div className={`relative w-full ${aspectStyle} overflow-hidden bg-[var(--surface-raised)]`}>
                  <Image
                    src={img.url}
                    alt={img.alt || "Laboratory specimen"}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/65 backdrop-blur-md text-white border border-white/15">
                      {img.albumTitle.split("&")[0].trim()}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-10 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {img.alt}
                    </h4>
                    {img.caption && (
                      <p className="text-[11px] text-white/80 line-clamp-2 font-light">
                        {img.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. UNIFORM CLASSIC GRID                                           */}
      {/* ================================================================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {allImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-[16/10] rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden cursor-pointer hover:border-[var(--brand-primary)] hover:shadow-lg transition-all duration-300 shadow-xs"
            >
              <Image
                src={img.url}
                alt={img.alt || "Laboratory specimen"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Top Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-md text-white border border-white/20">
                  {img.albumTitle.split("&")[0].trim()}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-10 space-y-0.5">
                <span className="text-xs font-bold text-white line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                  {img.alt}
                </span>
                {img.caption && (
                  <span className="text-[11px] text-white/80 line-clamp-1 block font-light">
                    {img.caption}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {allImages.length === 0 && (
        <div className="p-16 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <ImageIcon className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50" />
          <h4 className="text-base font-bold text-[var(--text-primary)]">No images found in this series</h4>
          <p className="text-xs text-[var(--text-secondary)]">
            Try selecting &apos;All Images&apos; to view all archived laboratory photos.
          </p>
          <button
            type="button"
            onClick={() => setSelectedAlbumId("ALL")}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            Reset Album Filter
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. IMMERSIVE LIGHTBOX MODAL                                       */}
      {/* ================================================================= */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6">
          {/* Top Bar with info and close */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20">
                {lightboxIndex! + 1} / {allImages.length}
              </span>
              <span className="hidden sm:inline text-xs text-white/70 font-medium">
                {activeImage.albumTitle}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all focus:outline-none"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : allImages.length - 1
              )
            }
            className="absolute left-3 sm:left-6 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev < allImages.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-3 sm:right-6 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image & Caption Container */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3 sm:gap-4 z-10 w-full">
            <div className="relative max-h-[72vh] max-w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.url}
                alt={activeImage.alt}
                className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
              />
            </div>

            <div className="text-center max-w-3xl px-4 space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {activeImage.alt}
              </h3>
              {activeImage.caption && (
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                  {activeImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
