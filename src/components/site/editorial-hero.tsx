import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";

interface EditorialHeroProps {
  heroSubheading?: string;
  totalDivisions: number;
  totalPublications: number;
}

export function EditorialHero({
  heroSubheading,
  totalDivisions,
  totalPublications,
}: EditorialHeroProps) {
  return (
    <section className="w-full bg-[var(--background)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative & Clear Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Academic Credential Kicker */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-mono text-[var(--bio-teal)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Jahangirnagar University · Dept. of BGE</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[var(--text-primary)] leading-[1.12] tracking-tight">
              Engineering sustainable bioprocesses from{" "}
              <span className="italic font-normal text-[var(--bio-teal)]">indigenous bioresources.</span>
            </h1>

            {/* Humanized Academic Mission */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
              {heroSubheading ||
                "The Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab) investigates microbial biodiversity, enzymatic biocatalysis, and algae photobioreactors to deliver sustainable solutions for human health, clean air, and the bioeconomy."}
            </p>

            {/* Clear Primary Navigation Calls to Action */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[var(--bio-teal)] hover:bg-[var(--bio-teal-hover)] text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Explore Research Domains</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/publications"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-[var(--text-primary)] transition-all active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-[var(--bio-teal)]" />
                <span>Publications</span>
              </Link>
            </div>

            {/* Quiet, Grounded Institutional Metrics */}
            <div className="pt-6 border-t border-[var(--border)] grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">
                  {totalDivisions || 8}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Research Divisions</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">
                  {totalPublications || 45}+
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Peer-Reviewed Papers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">
                  250 L
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Urban Photobioreactor</div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Documentary Photography */}
          <div className="lg:col-span-5 relative aspect-4/3 sm:aspect-5/4 rounded-3xl overflow-hidden border border-[var(--border)] shadow-md group">
            <Image
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=85"
              alt="Researcher in clean laboratory coat conducting analytical measurements at BTIB Lab"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-semibold block">Analytical Biotechnology Suite</span>
              Department of Biotechnology & Genetic Engineering, Jahangirnagar University
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
