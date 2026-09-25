import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

const PILLARS = [
  {
    title: "Microbial Biotechnology & Biocatalysis",
    slug: "microbial-biotechnology",
    summary:
      "Isolating indigenous bacterial and fungal strains from wetlands and soils across Bangladesh, metabolic profiling, and industrial enzyme production.",
    photo: "/images/domains/microbial-biotech.jpg",
    alt: "Molecular structure and enzymatic active site modeling",
    tag: "Enzymes & Biocatalysis",
  },
  {
    title: "Bioprocess Engineering & Fermentation",
    slug: "bioprocess-engineering",
    summary:
      "Kinetic modeling, stirred-tank and airlift bioreactor scale-up, and statistical media optimization for sustainable bio-manufacturing.",
    photo: "/images/domains/bioprocess-eng.jpg",
    alt: "Automated stirred-tank bioreactor system with digital process control",
    tag: "Bioreactor Scale-Up",
  },
  {
    title: "Algae Biotechnology & Photobioreactors",
    slug: "algae-biotechnology",
    summary:
      "High-density cultivation of native Chlorella vulgaris for metropolitan carbon dioxide capture, oxygen generation, and bio-feedstocks.",
    photo: "/images/domains/algae-carbon.jpg",
    alt: "Microalgal photobioreactor column with carbon capture aeration",
    tag: "Urban Carbon Capture",
  },
  {
    title: "Biomaterials & Molecular Engineering",
    slug: "biomaterial-processing",
    summary:
      "Valorizing agricultural residues into renewable biopolymers, enzyme immobilization, and recombinant cellular pathway engineering.",
    photo: "/images/bioplastics.jpg",
    alt: "Biodegradable polymer films and characterization instrumentation",
    tag: "Circular Biopolymers",
  },
];

export function ResearchPillars() {
  return (
    <section className="w-full bg-[var(--surface)] py-6 sm:py-16 lg:py-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-12">
        {/* Synchronized Left-Aligned Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-6 pb-1 sm:pb-2">
          <div className="space-y-1.5 sm:space-y-3 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.14]">
              Explore our <span className="text-[var(--brand-primary)]">main research</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
              From indigenous microbial screening to continuous photobioreactor operation, our investigations
              bridge fundamental biological discovery and scalable industrial application.
            </p>
          </div>

          <Link
            href="/research"
            className="text-xs font-bold font-sans text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
          >
            <span>View all 8 divisions</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Clean, Scaled Pillar Cards (2-Column Mobile Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.slug}
              href={`/research/${pillar.slug}`}
              className="group rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.14)] transition-all flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Image Container with Responsive Aspect Ratio */}
              <div className="relative aspect-[1.8/1] sm:aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
                <Image
                  src={pillar.photo}
                  alt={pillar.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/10" />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className="text-[9px] sm:text-[11px] font-mono font-medium px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[var(--surface)]/95 backdrop-blur-md text-[var(--text-secondary)] border border-[var(--border)] shadow-xs">
                    {pillar.tag}
                  </span>
                </div>
              </div>

              {/* Content Body with Space-Efficient Mobile Typography */}
              <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-bold font-sans text-xs sm:text-lg text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug line-clamp-2">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                    {pillar.summary}
                  </p>
                </div>

                <div className="pt-2 sm:pt-4 border-t border-[var(--border)] flex items-center justify-between text-[10px] sm:text-xs font-mono font-medium text-[var(--text-muted)]">
                  <span>Explore division</span>
                  <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
