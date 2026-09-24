import * as React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  doi: string | null;
}

export function LatestPublications({
  publications,
}: {
  publications: PublicationItem[];
}) {
  return (
    <section className="w-full bg-[var(--background)] py-20 sm:py-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="editorial-kicker">Scholarly Output</span>
              <span className="text-[var(--border-strong)]">•</span>
              <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                INDEXED LITERATURE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-[var(--text-primary)]">
              Recent Publications
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Peer-reviewed discoveries authored by BTIB Lab researchers with verified DOIs across Elsevier, Springer, and Nature journals.
            </p>
          </div>

          <Link
            href="/publications"
            className="text-xs font-bold font-sans text-[var(--bio-teal)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
          >
            <span>Complete bibliography & BibTeX export</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {publications.slice(0, 4).map((pub) => (
            <div
              key={pub.id}
              className="p-6 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--bio-teal)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xs group"
            >
              <div className="space-y-2.5 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/20">
                    {pub.year}
                  </span>
                  <span className="font-mono uppercase text-[var(--text-muted)] font-medium">
                    {pub.type}
                  </span>
                  {pub.venue && (
                    <span className="text-[var(--text-secondary)] font-medium">
                      — {pub.venue}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold font-sans text-[var(--text-primary)] group-hover:text-[var(--bio-teal)] transition-colors leading-snug">
                  {pub.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {pub.authors.join(", ")}
                </p>
              </div>

              {pub.doi && (
                <div className="shrink-0 self-start md:self-auto">
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] hover:border-[var(--bio-teal)] transition-colors"
                  >
                    <span>DOI Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
