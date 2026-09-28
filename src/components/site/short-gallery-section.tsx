"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem, InteractiveCard } from "@/components/ui/reveal";

const GALLERY_PREVIEWS = [
  {
    title: "Liquid-Tree Outdoor Column",
    tag: "Pilot Facility",
    photo: "/images/liquid-tree.jpg",
    alt: "250-Liter Liquid-Tree photobioreactor column deployed outdoors at Jahangirnagar University",
    span: "col-span-1 md:col-span-2 aspect-[4/3] md:aspect-[16/10]",
  },
  {
    title: "Cleanroom Bioprocessing Suite",
    tag: "Pilot Cleanroom",
    photo: "/images/facilities/cleanroom-pilot.jpg",
    alt: "Cleanroom pilot fermentation facility with stainless steel bioreactor trains",
    span: "col-span-1 md:col-span-1 aspect-[4/3] md:aspect-auto",
  },
  {
    title: "Automated Stirred-Tank Bioreactor",
    tag: "Fermentation Kinetics",
    photo: "/images/fermentation.jpg",
    alt: "Sartorius benchtop fermenter with telemetry display",
    span: "col-span-1 md:col-span-1 aspect-[4/3] md:aspect-auto",
  },
  {
    title: "Biodegradable Composite Matrices",
    tag: "Biomaterials",
    photo: "/images/bioplastics.jpg",
    alt: "Petri dish testing of starch-chitosan composite biodegradable films",
    span: "col-span-1 md:col-span-2 aspect-[4/3] md:aspect-[16/10]",
  },
];

export function ShortGallerySection() {
  return (
    <section className="w-full bg-[var(--background)] py-6 sm:py-16 lg:py-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-12">
        {/* Section Header */}
        <Reveal direction="up" distance={18}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-6 pb-1 sm:pb-2">
            <div className="space-y-1.5 sm:space-y-3 max-w-3xl">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.14]">
                Laboratory Facilities in Action
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
        </Reveal>

        {/* Bento Photo Grid (Clean 2x2 on Mobile, Asymmetric Bento on Desktop) */}
        <StaggerContainer
          staggerDelay={0.08}
          delayChildren={0.06}
          className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5"
        >
          {GALLERY_PREVIEWS.map((item) => (
            <StaggerItem
              key={item.title}
              yOffset={20}
              className={item.span}
            >
              <InteractiveCard hoverY={-3} className="w-full h-full">
                <div
                  className="group relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs"
                >
                  <Image
                    src={item.photo}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5">
                    <span className="text-[9px] sm:text-[10px] font-mono font-medium px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded bg-black/60 backdrop-blur-md text-white/90 border border-white/15 shadow-xs">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between">
                    <p className="text-[11px] sm:text-sm font-bold text-white drop-shadow-xs font-sans truncate pr-1 sm:pr-2">
                      {item.title}
                    </p>
                    <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
