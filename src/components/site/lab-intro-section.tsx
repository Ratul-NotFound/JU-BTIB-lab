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
    <section className="w-full bg-[var(--background)] py-16 sm:py-20 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
        
        {/* Synchronized Section Header (Unified with all landing page sections) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-3xl">

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
              From bioresource to <span className="text-[var(--brand-primary)]">bioproduct</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
              The Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University
              translates biological wealth into scalable biotechnological applications, bringing together scientific
              expertise to solve environmental, food security, and industrial challenges.
            </p>
          </div>

          <Link
            href="/about"
            className="text-xs font-bold font-sans text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
          >
            <span>Explore laboratory history & vision</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Clean, Non-Redundant Tenets (Motto, Mission, Target, Motive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {ABOUT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.key}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.12)] transition-all flex flex-col justify-between space-y-4 shadow-xs group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center transition-colors group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[var(--surface-raised)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-primary)] leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
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
