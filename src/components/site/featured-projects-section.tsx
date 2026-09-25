import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Activity, Cpu, Leaf } from "lucide-react";

const PROJECTS = [
  {
    title: "250L Urban Liquid-Tree Photobioreactor",
    tag: "Flagship Engineering",
    icon: Leaf,
    photo: "/images/liquid-tree.jpg",
    alt: "250L urban photobioreactor column on campus grounds",
    description:
      "Decentralized microalgal air purification system engineered for urban carbon dioxide sequestration and high-density biomass production.",
    metrics: "250 L Volume · kLa > 0.018 s⁻¹",
    href: "/projects/liquid-tree-photobioreactor",
  },
  {
    title: "Automated Fermentation & Kinetic Modeling",
    tag: "Bioprocess Engineering",
    icon: Activity,
    photo: "/images/fermentation.jpg",
    alt: "Benchtop stirred-tank bioreactors with process controls",
    description:
      "Real-time parameter monitoring and feeding strategies in stirred-tank fermenters to maximize production of industrial enzymes and secondary metabolites.",
    metrics: "5L Stirred-Tank · Automated Telemetry",
    href: "/research/bioprocess-engineering",
  },
  {
    title: "Agricultural Biomaterial Synthesis",
    tag: "Circular Bioeconomy",
    icon: Cpu,
    photo: "/images/bioplastics.jpg",
    alt: "Biodegradable polymer films in petri dishes on laboratory table",
    description:
      "Converting regional agro-industrial byproducts into biodegradable polysaccharide-protein composite films for eco-friendly packaging.",
    metrics: "100% Bio-based · Marine Degradable",
    href: "/research/biomaterial-processing",
  },
];

export function FeaturedProjectsSection() {
  return (
    <section className="w-full bg-[var(--background)] py-6 sm:py-16 lg:py-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-6 pb-1 sm:pb-2">
          <div className="space-y-1.5 sm:space-y-3 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.14]">
              Excellence in <span className="text-[var(--brand-primary)]">research & discovery</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
              Translating fundamental bioresource research into functional prototypes, bioprocess platforms, and sustainable materials.
            </p>
          </div>

          <Link
            href="/projects"
            className="text-xs font-bold font-sans text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
          >
            <span>View all active projects</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Scaled Project Cards (Smart 2-Column Mobile Bento) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
          {PROJECTS.map((project, index) => {
            const Icon = project.icon;
            const isFirst = index === 0;
            return (
              <Link
                key={project.title}
                href={project.href}
                className={`group rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.14)] transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                  isFirst ? "col-span-2 md:col-span-1" : "col-span-1 md:col-span-1"
                }`}
              >
                {/* Image Header with Responsive Aspect Ratio */}
                <div
                  className={`relative w-full overflow-hidden bg-[var(--surface-raised)] ${
                    isFirst
                      ? "aspect-[2.2/1] sm:aspect-[16/10]"
                      : "aspect-[1.8/1] sm:aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={project.photo}
                    alt={project.alt}
                    fill
                    sizes={
                      isFirst
                        ? "(max-width: 768px) 100vw, 33vw"
                        : "(max-width: 768px) 50vw, 33vw"
                    }
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/10" />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-mono font-medium px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[var(--surface)]/95 backdrop-blur-md border shadow-xs text-[var(--brand-primary)] border-[var(--border)]">
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--brand-primary)]" />
                      <span className="truncate max-w-[120px] sm:max-w-none">{project.tag}</span>
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <h3
                      className={`font-bold font-sans text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug line-clamp-2 ${
                        isFirst ? "text-sm sm:text-lg" : "text-xs sm:text-lg"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-[9px] sm:text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[130px] sm:max-w-none">
                      {project.metrics}
                    </span>
                    <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
