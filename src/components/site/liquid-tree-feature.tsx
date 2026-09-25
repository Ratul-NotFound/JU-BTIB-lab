import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wind, Sun, CheckCircle2 } from "lucide-react";

export function LiquidTreeFeature() {
  return (
    <section className="w-full bg-[var(--surface)] py-20 sm:py-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Photography of the 250L Column */}
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm group">
            <Image
              src="/images/liquid-tree.jpg"
              alt="250-Liter Liquid-Tree urban microalgal photobioreactor operating on campus grounds"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-bold text-sm block tracking-tight font-sans">
                250-Liter Pilot Photobioreactor Column
              </span>
              <span className="text-white/80 font-mono text-[11px]">
                Department of Biotechnology & Genetic Engineering, Jahangirnagar University
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Validated Kinetics */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="editorial-kicker">Flagship Innovation</span>
                <span className="text-[var(--border-strong)]">•</span>
                <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                  PILOT DEPLOYMENT
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-[var(--text-primary)]">
                The Liquid-Tree Photobioreactor
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                Designed and operated at Jahangirnagar University, the Liquid-Tree project investigates decentralized
                microalgal air purification for dense urban environments where metropolitan space for mature trees is constrained.
              </p>
            </div>

            {/* 3 Clear Engineering Specification Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-start gap-4 transition-colors hover:border-[var(--border-strong)]">
                <div className="p-2.5 rounded-xl bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] shrink-0 mt-0.5">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold font-sans text-[var(--text-primary)]">
                    Pneumatic Sparging & Mass Transfer
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    Micro-porous ceramic spargers disperse urban air into fine microbubbles, achieving volumetric mass transfer coefficients (kLa &gt; 0.018 s⁻¹) for rapid CO₂ dissolution.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-start gap-4 transition-colors hover:border-[var(--border-strong)]">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold font-sans text-[var(--text-primary)]">
                    Native <em>Chlorella vulgaris</em> Strain
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    Isolated locally from Savar freshwater bodies, offering high thermal resilience (20°C–38°C) suited to Bangladesh’s subtropical climate.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-start gap-4 transition-colors hover:border-[var(--border-strong)]">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold font-sans text-[var(--text-primary)]">
                    Tree Equivalence & Civic Footprint
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    Provides the daily carbon fixation capacity of 1–2 mature deciduous trees within a physical footprint under 2 square meters.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/projects/liquid-tree-photobioreactor"
                className="inline-flex items-center gap-2 text-sm font-bold font-sans text-[var(--bio-teal)] hover:underline group"
              >
                <span>Read detailed project documentation & kinetics</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
