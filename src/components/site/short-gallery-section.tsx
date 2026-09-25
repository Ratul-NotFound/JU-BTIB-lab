import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";

const GALLERY_PREVIEWS = [
  {
    title: "Liquid-Tree Outdoor Column",
    tag: "Pilot Facility",
    photo: "/images/liquid-tree.jpg",
    alt: "250-Liter Liquid-Tree photobioreactor column deployed outdoors at Jahangirnagar University",
    span: "col-span-2 aspect-[2.2/1] md:col-span-2 md:aspect-[16/10]",
  },
  {
    title: "Cleanroom Bioprocessing Suite",
    tag: "Pilot Cleanroom",
    photo: "/images/facilities/cleanroom-pilot.jpg",
    alt: "Cleanroom pilot fermentation facility with stainless steel bioreactor trains",
    span: "col-span-1 aspect-[4/3] md:aspect-auto",
  },
  {
    title: "Automated Stirred-Tank Bioreactor",
    tag: "Fermentation Kinetics",
    photo: "/images/fermentation.jpg",
    alt: "Sartorius benchtop fermenter with telemetry display",
    span: "col-span-1 aspect-[4/3] md:aspect-auto",
  },
  {
    title: "Biodegradable Composite Matrices",
    tag: "Biomaterials",
    photo: "/images/bioplastics.jpg",
    alt: "Petri dish testing of starch-chitosan composite biodegradable films",
    span: "col-span-2 aspect-[2.2/1] md:col-span-2 md:aspect-[16/10]",
  },
];

export function ShortGallerySection() {
  return (
    <section className="w-full bg-[var(--background)] py-8 sm:py-16 lg:py-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 pb-1 sm:pb-2">
          <div className="space-y-2 sm:space-y-3 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12]">
              Laboratory <span className="text-[var(--brand-primary)]">in action</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
              Authentic photographic archive documenting our bioreactor pilots, microbial cultures, and experimental benchwork.
            </p>
          </div>

          <Link
            href="/gallery"
            className="text-xs font-bold font-sans text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
          >
            <span>View complete archive</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento Photo Grid (Space-Optimized 2-Column on Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5">
          {GALLERY_PREVIEWS.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs ${item.span}`}
            >
              <Image
                src={item.photo}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5">
                <span className="text-[9px] sm:text-[10px] font-mono font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-black/60 backdrop-blur-md text-teal-300 border border-white/15 shadow-xs">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold text-white drop-shadow-xs font-sans truncate pr-2">
                  {item.title}
                </p>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
