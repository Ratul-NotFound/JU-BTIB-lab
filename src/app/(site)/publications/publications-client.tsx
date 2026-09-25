"use client";

import * as React from "react";
import { PublicationType } from "@prisma/client";
import { Check, Copy, ExternalLink, FileText, Search, X } from "lucide-react";
import { PublicationsHistogram } from "@/components/visuals/publications-histogram";

interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: PublicationType;
  doi: string | null;
  url: string | null;
  pdfUrl: string | null;
  abstract: string | null;
  bibtex: string | null;
  featured: boolean;
  areas: Array<{
    researchArea: {
      id: string;
      slug: string;
      title: string;
    };
  }>;
}

export function PublicationsClient({
  publications,
  timeline,
}: {
  publications: PublicationItem[];
  timeline: Array<{ year: number; count: number }>;
}) {
  const [search, setSearch] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState<string>("ALL");
  const [selectedType, setSelectedType] = React.useState<string>("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [activeBibtex, setActiveBibtex] = React.useState<{ title: string; bibtex: string } | null>(null);

  // Extract unique years
  const years = React.useMemo(() => {
    const set = new Set<number>();
    publications.forEach((p) => set.add(p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [publications]);

  const filtered = React.useMemo(() => {
    return publications.filter((p) => {
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesVenue = p.venue.toLowerCase().includes(query);
        const matchesAuthors = p.authors.some((a) => a.toLowerCase().includes(query));
        const matchesAbstract = p.abstract?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue && !matchesAuthors && !matchesAbstract) {
          return false;
        }
      }

      // Year filter
      if (selectedYear !== "ALL" && p.year !== parseInt(selectedYear, 10)) {
        return false;
      }

      // Type filter
      if (selectedType !== "ALL" && p.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [publications, search, selectedYear, selectedType]);

  const handleCopyBibtex = (id: string, bibtexText: string) => {
    navigator.clipboard.writeText(bibtexText);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Annual Output Histogram */}
      {timeline.length > 0 && <PublicationsHistogram data={timeline} />}

      {/* Search and Filters Controls */}
      <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 sm:space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search title, author, journal, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--bio-teal)] transition-colors font-sans"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* Year and Type Selects */}
          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-mono rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--bio-teal)]"
            >
              <option value="ALL">All Years</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-mono rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--bio-teal)]"
            >
              <option value="ALL">All Types</option>
              <option value="JOURNAL">Journal</option>
              <option value="CONFERENCE">Conference</option>
              <option value="BOOK_CHAPTER">Book Chapter</option>
              <option value="PATENT">Patent</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-[var(--text-muted)] pt-1.5 sm:pt-2 border-t border-[var(--border)]">
          <span>
            Showing {filtered.length} of {publications.length} publications
          </span>
          {(search || selectedYear !== "ALL" || selectedType !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedYear("ALL");
                setSelectedType("ALL");
              }}
              className="text-[var(--bio-teal)] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.map((pub) => {
          const defaultBib =
            pub.bibtex ||
            `@article{btib_${pub.year}_${pub.id.slice(0, 5)},\n  title={${pub.title}},\n  author={${pub.authors.join(" and ")}},\n  journal={${pub.venue}},\n  year={${pub.year}},\n  ${pub.doi ? `doi={${pub.doi}}` : ""}\n}`;

          return (
            <div
              key={pub.id}
              className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.12)] transition-all space-y-2 sm:space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-semibold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25">
                    {pub.year}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono text-[var(--text-secondary)] border border-[var(--border)] bg-[var(--surface-raised)]">
                    {pub.type}
                  </span>
                  {pub.areas.map(({ researchArea }) => (
                    <span
                      key={researchArea.id}
                      className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]"
                    >
                      {researchArea.title}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBibtex({ title: pub.title, bibtex: defaultBib })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--bio-teal)] transition-colors"
                  >
                    <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>BibTeX</span>
                  </button>

                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all"
                    >
                      <span>DOI</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] leading-snug">
                {pub.title}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 sm:line-clamp-none">
                {pub.authors.join(", ")}
              </p>

              <div className="text-[11px] sm:text-xs italic text-[var(--text-secondary)] font-serif">
                {pub.venue} ({pub.year})
              </div>

              {pub.abstract && (
                <details className="pt-1 sm:pt-2 text-xs text-[var(--text-secondary)] leading-relaxed group">
                  <summary className="font-mono text-[10px] sm:text-[11px] text-[var(--bio-teal)] cursor-pointer hover:underline select-none">
                    View Abstract
                  </summary>
                  <p className="mt-1.5 sm:mt-2 p-2.5 sm:p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-light">
                    {pub.abstract}
                  </p>
                </details>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-6 sm:p-8 text-center rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
            No publications match your criteria.
          </div>
        )}
      </div>

      {/* BibTeX Modal */}
      {activeBibtex && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="specimen-tag text-[10px]">CITATION FORMAT</span>
                <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                  BibTeX Record
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveBibtex(null)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[var(--text-secondary)] font-medium line-clamp-2">
              {activeBibtex.title}
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-mono text-[var(--text-primary)] overflow-x-auto whitespace-pre">
                {activeBibtex.bibtex}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleCopyBibtex("modal", activeBibtex.bibtex)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono bg-[var(--bio-teal)] hover:bg-[var(--bio-teal-hover)] text-white shadow-xs transition-colors"
              >
                {copiedId === "modal" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy BibTeX</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveBibtex(null)}
                className="px-4 py-2 rounded-lg text-xs font-mono border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
