import * as React from "react";
import Link from "next/link";

export function JoinLabBanner() {
  return (
    <section className="w-full bg-[var(--background)] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="p-8 sm:p-14 lg:p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="editorial-kicker">Academic Opportunities</span>
              <span className="text-[var(--border-strong)]">•</span>
              <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                THESIS & RESEARCH
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Conduct Thesis Research or Establish Industrial Partnerships
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
              BTIB Lab welcomes undergraduate thesis candidates (B.Sc.), graduate researchers (M.Sc., M.Phil., Ph.D.), 
              and industrial partners seeking sustainable bioprocess development at Jahangirnagar University.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold bg-[var(--bio-teal)] hover:bg-[var(--bio-teal-hover)] text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              Inquire About Placement
            </Link>
            <Link
              href="/about"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] transition-all active:scale-[0.98]"
            >
              Laboratory Facilities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
