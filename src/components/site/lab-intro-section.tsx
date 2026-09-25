import * as React from "react";
import Link from "next/link";
import { ArrowRight, Compass, Target, FlaskConical, Layers } from "lucide-react";

const ABOUT_PILLARS = [
  {
    key: "motto",
    badge: "Core Motto",
    icon: Compass,
    title: "Bioresource to Bioproduct",
    description:
      "Our foundational scientific ethos — converting indigenous natural resources into scalable industrial, agricultural, and healthcare solutions.",
  },
  {
    key: "mission",
    badge: "Scientific Mission",
    icon: Target,
    title: "Indigenous Bioprospecting",
    description:
      "Isolating, cataloging, and characterizing extremophilic bacterial, fungal, and microalgal strains from diverse ecosystems across Bangladesh.",
  },
  {
    key: "target",
    badge: "Research Target",
    icon: FlaskConical,
    title: "Bioprocess Kinetics",
    description:
      "Bridging molecular biology with chemical engineering through digital parameter telemetry, Monod kinetic rates, and automated bioreactors.",
  },
  {
    key: "motive",
    badge: "Applied Motive",
    icon: Layers,
    title: "Circular Bioeconomy",
    description:
      "Translating benchtop discoveries into field deployments, including 250L urban photobioreactors and compostable agricultural biopolymers.",
  },
];

export function LabIntroSection() {
  return (
    <section className="w-full bg-[var(--background)] py-8 sm:py-16 lg:py-20 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-10">
        
        {/* Synchronized Section Header (Unified with all landing page sections) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 pb-1 sm:pb-2">
          <div className="space-y-2 sm:space-y-3 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12]">
              From bioresource to <span className="text-[var(--brand-primary)]">bioproduct</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
              The Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University
              translates biological wealth into scalable biotechnological applications, bringing together scientific
              expertise to solve environmental, food security, and industrial challenges.
            </p>
          </div>

          <Link
            href="/about"
            className="text-xs font-bold font-sans text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
          >
            <span>Explore history & vision</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Clean Tenets - Compact Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {ABOUT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.key}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.12)] transition-all flex flex-col justify-between space-y-3 shadow-xs group"
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center transition-colors group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-md bg-[var(--surface-raised)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
