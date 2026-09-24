import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, Quote } from "lucide-react";

export function FacultyLeadership() {
  return (
    <section className="w-full bg-[var(--surface)] py-20 sm:py-28 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait & Direct Contact */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left space-y-5">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border border-[var(--border)] shadow-md group">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Prof. Mohammad Shahedur Rahman, Principal Investigator at BTIB Lab"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 176px, 208px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                Prof. Mohammad Shahedur Rahman
              </h3>
              <p className="text-sm font-mono text-[var(--bio-teal)] font-medium mt-1">
                Principal Investigator & Professor
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-light leading-relaxed">
                Department of Biotechnology & Genetic Engineering
                <br />
                Jahangirnagar University, Savar, Dhaka-1342
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="mailto:rahmanms@bgeju.edu.bd"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] hover:border-[var(--bio-teal)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>rahmanms@bgeju.edu.bd</span>
              </a>

              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--bio-teal)] hover:underline"
              >
                <span>Meet all scholars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Scholarly Mission & Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="editorial-kicker">Faculty Leadership</span>
                <span className="text-[var(--border-strong)]">•</span>
                <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                  RESEARCH DIRECTION
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                Academic Direction & Research Philosophy
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
                Professor Rahman directs the Bioresources Technology and Industrial Biotechnology Laboratory within the Department of Biotechnology &amp; Genetic Engineering. His research program investigates microbial biodiversity bioprospecting, fermentation kinetics, and urban microalgae photobioreactors, training doctoral, master’s, and undergraduate thesis scholars in translational biotechnology.
              </p>
            </div>

            {/* Dignified Quote */}
            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-3 relative">
              <Quote className="w-5 h-5 text-[var(--bio-teal)] opacity-60" />
              <p className="text-sm sm:text-base font-serif italic text-[var(--text-primary)] leading-relaxed">
                &ldquo;Our mission is to translate Bangladesh&apos;s indigenous biological wealth into scalable biotechnological solutions that benefit our industry, environment, and scientific community.&rdquo;
              </p>
            </div>

            {/* Core Disciplines */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Primary Supervisory Fields
              </span>
              <div className="flex flex-wrap gap-2">
                {["Microbial Bioprocess Kinetics", "Enzymatic Biocatalysis", "Photobioreactor Design", "Bioresources Valorization"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
