import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ResearchGlyph } from "@/components/visuals/research-glyphs";

// Exact 1-to-1 match with database slugs and verified, authentic scientific imagery
const AREA_IMAGES: Record<string, { url: string; alt: string; tag: string }> = {
  "microbial-biotechnology": {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    alt: "Fluorescent microscopic visualization of bacterial and microbial specimens",
    tag: "Microbial Kinetics & Enzymes",
  },
  "bioprocess-engineering": {
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    alt: "Calibrated laboratory flasks and fermentation kinetic equipment on clean bench",
    tag: "Stirred-Tank Fermentation",
  },
  "biomaterial-processing": {
    url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    alt: "Natural botanical bioresources and renewable biopolymers",
    tag: "Biopolymers & Valorization",
  },
  "computational-biology": {
    url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    alt: "In silico computational biology and structural modeling on workstation",
    tag: "Molecular Modeling & Docking",
  },
  "protein-structure-and-engineering": {
    url: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80",
    alt: "Researcher micropipetting enzymatic assays into microtube array",
    tag: "Enzyme Immobilization",
  },
  "algae-biotechnology": {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    alt: "Photosynthetic microalgae cultivation for carbon mitigation and clean air",
    tag: "Photobioreactor Cultivation",
  },
  "molecular-biotechnology": {
    url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80",
    alt: "Scientist with safety goggles analyzing molecular genetics under microscope",
    tag: "Gene Expression & Pathways",
  },
  "nano-biotechnology": {
    url: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80",
    alt: "Synthesized bionanoparticles and diagnostic delivery matrices",
    tag: "Bio-Nanoparticles & Delivery",
  },
};

interface ResearchAreaItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  glyphKey: string;
  _count: {
    projects: number;
    publications: number;
  };
}

export function ResearchShowcase({ areas }: { areas: ResearchAreaItem[] }) {
  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 py-20 sm:py-28 space-y-12 bg-[var(--background)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="editorial-kicker">Research Portfolio</span>
            <span className="text-[var(--border-strong)]">•</span>
            <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
              8 CORE DIVISIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Multidisciplinary Scientific Scope
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
            From environmental microbial bioprospecting to pilot-scale photobioreactors and molecular simulations, 
            our investigations bridge fundamental discovery and scalable industrial application.
          </p>
        </div>
        <Link
          href="/research"
          className="text-xs font-semibold text-[var(--bio-teal)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          View all 8 research divisions & methodology
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {areas.map((area) => {
          const photo = AREA_IMAGES[area.slug] || {
            url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
            alt: area.title,
            tag: "Scientific Research",
          };

          return (
            <Link
              key={area.id}
              href={`/research/${area.slug}`}
              className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--bio-teal)] transition-all flex flex-col justify-between overflow-hidden hover:shadow-lg"
            >
              {/* Distinct Photographic Header */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[var(--surface-raised)]">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/10" />
                
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[var(--surface)]/90 backdrop-blur-md text-[var(--text-secondary)] border border-[var(--border)] shadow-xs">
                    {photo.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3.5 p-2 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] text-[var(--text-secondary)] group-hover:text-[var(--bio-teal)] group-hover:border-[var(--bio-teal)]/40 transition-colors shadow-xs">
                  <ResearchGlyph glyphKey={area.glyphKey} size={18} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--bio-teal)] transition-colors leading-snug">
                    {area.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3 font-light">
                    {area.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Explore division</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--bio-teal)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
