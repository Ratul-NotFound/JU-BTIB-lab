import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ExternalLink, Quote } from "lucide-react";

export function PiSpotlight() {
  return (
    <section className="w-full border-t border-[var(--border)] bg-gradient-to-br from-[var(--surface-raised)]/50 via-[var(--surface)] to-[var(--surface)] px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Portrait Column */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-md group">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Prof. Mohammad Shahedur Rahman, Principal Investigator at BTIB Lab"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 176px, 208px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-white/90 bg-black/40 backdrop-blur-xs px-2 py-1 rounded">
                Prof. M. Shahedur Rahman
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Prof. Mohammad Shahedur Rahman
              </h3>
              <p className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                Principal Investigator & Professor
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Dept. of Biotechnology & Genetic Engineering
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Jahangirnagar University, Savar, Dhaka
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <a
                href="mailto:rahmanms@bgeju.edu.bd"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] hover:border-[var(--bio-teal)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>rahmanms@bgeju.edu.bd</span>
              </a>
            </div>
          </div>

          {/* Narrative Leadership Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="editorial-kicker">Faculty Leadership</span>
              <span className="text-[var(--border-strong)]">•</span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                RESEARCH PHILOSOPHY
              </span>
            </div>

            <div className="relative pl-6 border-l-2 border-[var(--bio-teal)] space-y-3">
              <Quote className="w-6 h-6 text-[var(--bio-teal)] opacity-60 absolute -left-3 -top-2 bg-[var(--surface)]" />
              <p className="text-base sm:text-lg font-serif italic text-[var(--text-primary)] leading-relaxed">
                &ldquo;Bangladesh is blessed with unparalleled ecological richness, yet historically our industry has depended on imported enzymes and petrochemical inputs. Our laboratory’s mission is to unlock our native microbial biodiversity, optimize bioprocesses locally, and train the next generation of biotechnology leaders.&rdquo;
              </p>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Professor Rahman leads multidisciplinary investigations spanning microbial biotechnology, industrial enzyme immobilization, 
              fermentation kinetics, and microalgae photobioreactors. Under his stewardship, BTIB Lab fosters doctoral scholars, master’s students, 
              and undergraduate researchers collaborating across biochemistry, process engineering, and computational biology.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Doctoral Guidance</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">PhD & MPhil Theses</div>
                <div className="text-[11px] text-[var(--text-muted)]">Bioprocess & Microalgae</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Publications</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">Verified DOIs</div>
                <div className="text-[11px] text-[var(--text-muted)]">Elsevier, Springer, Wiley</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Field Innovation</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">Liquid-Tree PBR</div>
                <div className="text-[11px] text-[var(--text-muted)]">Urban CO₂ Capture Pilot</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--bio-teal)] hover:underline"
              >
                Meet the full research team & scholars
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
