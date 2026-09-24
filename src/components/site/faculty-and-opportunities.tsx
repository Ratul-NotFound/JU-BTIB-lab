import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, GraduationCap, Building2, Quote } from "lucide-react";

export function FacultyAndOpportunities() {
  return (
    <section className="w-full bg-[var(--surface)] py-20 sm:py-28 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Faculty & Admissions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-[var(--text-primary)]">
            Exploring innovations with trust experts
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            Nurturing the next generation of bioprocess scientists while delivering translational research solutions for regional industries.
          </p>
        </div>

        {/* 2-Column Balanced Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Principal Investigator Profile (6 cols on lg) */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shrink-0 shadow-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Prof. Mohammad Shahedur Rahman, Principal Investigator at BTIB Lab"
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                    Principal Investigator
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
                    Prof. Mohammad Shahedur Rahman
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Department of Biotechnology & Genetic Engineering
                  </p>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Jahangirnagar University, Savar, Dhaka-1342
                  </p>
                </div>
              </div>

              {/* Research Narrative */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Directs investigations in bioprocess modeling, enzyme immobilization, and algal photobioreactor scale-up. Professor Rahman mentors doctoral, master’s, and undergraduate thesis scholars in translational biotechnology.
              </p>

              {/* Dignified Academic Quote */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] italic leading-relaxed relative flex gap-3">
                <Quote className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  &ldquo;Our mission is to translate Bangladesh&apos;s indigenous biological wealth into scalable biotechnological solutions that benefit industry, society, and the environment.&rdquo;
                </p>
              </div>

            </div>

            {/* Direct Contact & Team Link */}
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
              <a
                href="mailto:rahmanms@bgeju.edu.bd"
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>rahmanms@bgeju.edu.bd</span>
              </a>
              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 text-xs font-bold font-sans text-cyan-600 dark:text-cyan-400 hover:underline group"
              >
                <span>Meet all scholars</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Academic Placements & Industrial Partnerships (6 cols on lg) */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                  Admissions & Collaboration
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
                  Join the Lab or Partner With Us
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  BTIB Lab provides allocated bench space, instrumentation access, and expert faculty supervision across two primary pathways:
                </p>
              </div>

              {/* Two Pathway Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-sans text-[var(--text-primary)]">
                      Thesis Candidates (B.Sc., M.Sc., Ph.D.)
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                      Final-year thesis allocations and postgraduate research opportunities in fermentation kinetics, microalgal photobiology, and recombinant genetics.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-sans text-[var(--text-primary)]">
                      Industrial R&D Partnerships
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                      Collaborative contract research, enzyme activity assays, pilot bioreactor trials, and valorization of agro-industrial byproducts.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Inquire Action Buttons */}
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl text-xs font-bold font-sans bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs transition-all active:scale-[0.98]"
              >
                Inquire About Placement
              </Link>
              <Link
                href="/about"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold font-sans border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] transition-all active:scale-[0.98]"
              >
                Laboratory Facilities
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
