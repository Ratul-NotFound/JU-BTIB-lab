import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ChevronRight, FlaskConical, Atom, Dna, ArrowRight } from "lucide-react";
import { getResearchAreas } from "@/server/queries/research-areas";
import { ResearchGlyph } from "@/components/visuals/research-glyphs";

export const metadata: Metadata = {
  title: "Research Scope & Disciplines | BTIB Lab - Jahangirnagar University",
  description:
    "Explore the 8 multidisciplinary research divisions at BTIB Lab, Jahangirnagar University: Microbial Biotech, Bioprocess Engineering, Algae Photobioreactors, and more.",
};

export const revalidate = 60;

const AREA_METADATA: Record<
  string,
  {
    photo: string;
    alt: string;
    focusTags: string[];
    facility: string;
    cluster: string;
  }
> = {
  "microbial-biotechnology": {
    photo: "/images/domains/microbial-biotech.jpg",
    alt: "Fluorescent microscopic visualization of bacterial and microbial specimens",
    focusTags: ["Enzyme Bioprospecting", "Wetland Isolates", "Metabolic Screening"],
    facility: "Microbiology Suite",
    cluster: "Microbial & Environmental",
  },
  "bioprocess-engineering": {
    photo: "/images/domains/bioprocess-eng.jpg",
    alt: "Calibrated laboratory flasks and fermentation kinetic equipment on clean bench",
    focusTags: ["Stirred-Tank Fermentation", "Kinetic Modeling", "Scale-Up Protocols"],
    facility: "Bioprocess Cleanroom",
    cluster: "Bioprocess & Biomanufacturing",
  },
  "biomaterial-processing": {
    photo: "/images/domains/biomaterials.jpg",
    alt: "Natural botanical bioresources and renewable biopolymers",
    focusTags: ["Agro-Waste Bioplastics", "Chitosan Matrices", "Biodegradable Films"],
    facility: "Biopolymer Analytics Lab",
    cluster: "Sustainable Materials",
  },
  "computational-biology": {
    photo: "/images/domains/computational-omics.jpg",
    alt: "In silico computational biology and structural modeling on workstation",
    focusTags: ["Genomic Assembly", "Molecular Docking", "Phylogenetic Trees"],
    facility: "Bioinformatics Cluster",
    cluster: "In Silico & Genomics",
  },
  "protein-structure-and-engineering": {
    photo: "/images/domains/structural-biology.jpg",
    alt: "Enzymatic assay modeling and structural protein engineering",
    focusTags: ["Enzyme Immobilization", "Catalytic Assays", "Thermal Stability"],
    facility: "Protein Engineering Bench",
    cluster: "Molecular & Catalysis",
  },
  "algae-biotechnology": {
    photo: "/images/domains/algae-carbon.jpg",
    alt: "Photosynthetic microalgae cultivation for carbon mitigation and clean air",
    focusTags: ["250L Liquid-Tree", "Chlorella vulgaris", "Carbon Sequestration"],
    facility: "Photobioreactor Yard",
    cluster: "Algal & Climate Tech",
  },
  "molecular-biotechnology": {
    photo: "/images/instruments/gel-electrophoresis.jpg",
    alt: "Molecular genetics assay and nucleic acid electrophoresis",
    focusTags: ["Gene Expression", "PCR Diagnostics", "Plasmid Extraction"],
    facility: "Molecular Biology Suite",
    cluster: "Molecular & Catalysis",
  },
  "nano-biotechnology": {
    photo: "/images/instruments/mass-spec.jpg",
    alt: "Synthesized bionanoparticles and high-resolution analytical instrumentation",
    focusTags: ["Green Synthesis", "Silver/Gold Bionanoparticles", "Antimicrobial Efficacy"],
    facility: "Analytical Core",
    cluster: "Sustainable Materials",
  },
};

const RESEARCH_CAPABILITIES = [
  {
    title: "Kinetic Fermentation Modeling",
    description: "Multi-parameter digital monitoring of Monod kinetic rates, oxygen uptake rates (OUR), and volumetric productivity in stirred-tank fermentors.",
  },
  {
    title: "Photobioreactor Engineering",
    description: "Gas sparging dynamics, photosynthetic photon flux density (PPFD) regulation, and high-density microalgal cultivation for carbon capture.",
  },
  {
    title: "Multi-Enzyme Immobilization",
    description: "Covalent bonding onto natural polysaccharide and chitosan carriers to enhance thermal stability and catalytic reusability over 20+ cycles.",
  },
  {
    title: "Indigenous Bioprospecting",
    description: "Systematic screening of extremophilic and wetland bacterial isolates across Bangladesh for novel hydrolytic enzymes and antimicrobial metabolites.",
  },
];

export default async function ResearchPage() {
  const researchAreas = await getResearchAreas();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-16">
      
      {/* 1. Header with Academic Metrics */}
      <section className="space-y-5 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
          Research Disciplines & <span className="text-[var(--brand-primary)]">Scientific Scope</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          BTIB Lab organizes its scientific investigations across eight dedicated branches, spanning
          computational genomics to pilot-scale photobioreactors and sustainable industrial bioproducts
          at Jahangirnagar University.
        </p>

        {/* Scope Indicators Strip */}
        <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <Atom className="w-4 h-4 text-[var(--bio-teal)]" />
            <span>8 Scientific Divisions</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <FlaskConical className="w-4 h-4 text-[var(--bio-teal)]" />
            <span>Pilot Bioprocess Facility</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <Dna className="w-4 h-4 text-[var(--bio-teal)]" />
            <span>Translational Bioresources</span>
          </div>
        </div>
      </section>

      {/* 2. Flagship Innovation Spotlight Banner */}
      <section className="p-8 sm:p-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/30">
                Flagship Research Initiative
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Campus Deployment · Savar
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              250L Liquid-Tree <span className="text-[var(--brand-primary)]">Urban Microalgae Photobioreactor</span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              Pioneering Bangladesh&apos;s first operational urban microalgal carbon sequestration column. Operating on the Jahangirnagar University campus, the unit continuously fixes ambient CO2 and produces clean oxygen equivalent to two mature 10-year-old trees.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Microalgae: Chlorella vulgaris</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
                <span>Volumetric Capacity: 250 Liters</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/projects/liquid-tree-photobioreactor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-[0_4px_16px_rgba(0,146,184,0.4)] transition-all active:scale-[0.98]"
              >
                <span>Read Full Technical Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-xs">
            <Image
              src="/images/domains/algae-carbon.jpg"
              alt="Liquid-Tree photobioreactor column in Savar"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-white bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/15">
              <span>Operational Unit #01 · Savar Campus</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Structured 3-Column Grid of 8 Research Areas */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
            Explore All 8 <span className="text-[var(--brand-primary)]">Specialized Divisions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {researchAreas.map((area, idx) => {
            const meta = AREA_METADATA[area.slug] || {
              photo: "/images/domains/microbial-biotech.jpg",
              alt: area.title,
              focusTags: ["Translational Biotech", "Applied Research"],
              facility: "BTIB Analytical Suite",
              cluster: "General Biotech",
            };

            return (
              <Link
                key={area.id}
                href={`/research/${area.slug}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.14)] transition-all flex flex-col justify-between overflow-hidden shadow-xs"
              >
                {/* Photo Banner with Standardized Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
                  <Image
                    src={meta.photo}
                    alt={meta.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Division Index Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white">
                      DIV 0{idx + 1}
                    </span>
                  </div>

                  {/* Facility Name Badge */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-black/50 backdrop-blur-md border border-white/10 text-slate-200">
                      {meta.facility}
                    </span>
                  </div>

                  {/* Scientific Glyph */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] text-[var(--brand-primary)] shadow-xs">
                    <ResearchGlyph glyphKey={area.glyphKey} size={20} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug">
                      {area.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light line-clamp-3">
                      {area.summary}
                    </p>

                    {/* Research Focus Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {meta.focusTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3.5 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                    <span>
                      {area._count.projects > 0 ? `${area._count.projects} Active Projects` : "Active Research"}
                      {area._count.publications > 0 && ` · ${area._count.publications} Pubs`}
                    </span>
                    <span className="text-[var(--bio-teal)] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-medium">
                      Division Dossier <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Methodological Core & Technical Capabilities */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
            Core Scientific & <span className="text-[var(--brand-primary)]">Engineering Capabilities</span>
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
            Standard operating procedures and analytical methodologies established across our laboratory units.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESEARCH_CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-xs"
            >
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {cap.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Inquire for Graduate Research Placements Banner */}
      <section className="p-8 sm:p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
            Join One of Our <span className="text-[var(--brand-primary)]">Research Divisions</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
            We are continuously recruiting B.Sc. Hon. thesis scholars and M.Sc./Ph.D. candidates passionate about bioprocess engineering and environmental biotechnology.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-[0_4px_18px_rgba(0,146,184,0.4)] transition-all active:scale-[0.98]"
          >
            <span>Apply to Lab</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
