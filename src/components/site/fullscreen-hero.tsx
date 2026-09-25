import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, FlaskConical } from "lucide-react";

interface FullscreenHeroProps {
  heroSubheading?: string;
  totalDivisions?: number;
  totalPublications?: number;
}

export function FullscreenHero({
  heroSubheading,
  totalDivisions = 8,
  totalPublications = 15,
}: FullscreenHeroProps) {
  return (
    <section className="relative w-full min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100vh-4.5rem)] flex items-center justify-center overflow-hidden border-b border-[var(--border)]">
      {/* 1. Full-Bleed High-Definition Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-lab.jpg"
          alt="Bioresources Technology and Industrial Biotechnology Laboratory"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02]"
        />
        {/* Balanced contrast overlay */}
        <div className="absolute inset-0 bg-[#070D18]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/80" />
      </div>

      {/* 2. Hero Content: Clean, Centered Academic Typography (Vertically Space-Optimized for Mobile) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16 md:py-24 flex flex-col items-center text-center">
        
        {/* Institutional Dual Logos (Vertically Compact on Mobile) */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3.5 sm:mb-7">
          <div className="relative w-10 h-10 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
            <Image
              src="/images/btib-logo-white.png"
              alt="BTIB Laboratory Logo"
              width={64}
              height={64}
              priority
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Vertical Divider Line */}
          <div className="w-px h-6 sm:h-11 bg-white/30 shrink-0" aria-hidden="true" />

          <div className="relative w-9 h-9 sm:w-15 sm:h-15 shrink-0 flex items-center justify-center">
            <Image
              src="/images/ju-logo-white.png"
              alt="Jahangirnagar University Logo"
              width={60}
              height={60}
              priority
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Full Name of the Laboratory - Responsive Monumental Heading */}
        <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-extrabold tracking-tight text-white leading-[1.14] max-w-4xl">
          Bioresources Technology & Industrial Biotechnology Laboratory
        </h1>

        {/* Concise Description */}
        <p className="mt-2.5 sm:mt-6 text-xs sm:text-base lg:text-lg text-slate-200 font-light leading-relaxed max-w-3xl line-clamp-3 sm:line-clamp-none">
          {heroSubheading ||
            "Pioneering microbial bioprocess kinetics, urban microalgae photobioreactors, and circular bioproducts from Bangladesh's rich ecological bioresources."}
        </p>

        {/* Actions - Touch-Friendly Responsive Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 mt-4 sm:mt-8">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-[0_4px_20px_rgba(0,146,184,0.45)] transition-all active:scale-[0.98]"
          >
            <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Explore Research</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 text-white backdrop-blur-md transition-all active:scale-[0.98]"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
            <span>Publications</span>
          </Link>
        </div>

        {/* Key Indicators Grid - Compact Spacing on Mobile */}
        <div className="mt-5 sm:mt-12 pt-3.5 sm:pt-7 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-8 w-full max-w-2xl text-center">
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-3xl font-extrabold text-[var(--brand-primary)] font-sans">
              {totalDivisions}
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Research Divisions
            </div>
          </div>
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-3xl font-extrabold text-white font-sans">
              250 <span className="text-[var(--brand-primary)] text-xs sm:text-base">L</span>
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Photobioreactor
            </div>
          </div>
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-3xl font-extrabold text-[var(--brand-primary)] font-sans">
              2012
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Established
            </div>
          </div>
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-3xl font-extrabold text-white font-sans">
              {totalPublications}+
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Indexed Papers
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
