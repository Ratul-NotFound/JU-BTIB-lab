import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, ExternalLink, FolderKanban, BookOpen } from "lucide-react";
import { getResearchAreaBySlug } from "@/server/queries/research-areas";
import { ResearchGlyph } from "@/components/visuals/research-glyphs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = await getResearchAreaBySlug(slug);

  if (!area) {
    return { title: "Research Area Not Found | BTIB Lab" };
  }

  return {
    title: `${area.title} | BTIB Lab - Jahangirnagar University`,
    description: area.summary,
  };
}

export const revalidate = 60;

export default async function ResearchAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = await getResearchAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--bio-teal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Research Disciplines</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="p-8 sm:p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/30">
              DIVISION DOSSIER
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              TAXONOMY / {area.slug.toUpperCase()}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--bio-teal)]">
            <ResearchGlyph glyphKey={area.glyphKey} size={36} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
          {area.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl font-light">
          {area.summary}
        </p>

        {area.bodyHtml && (
          <div
            className="prose dark:prose-invert max-w-none text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border)] leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: area.bodyHtml }}
          />
        )}
      </section>

      {/* Linked Projects */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-[var(--brand-primary)]" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Associated Projects ({area.projects.length})
          </h2>
        </div>

        {area.projects.length === 0 ? (
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
            No projects explicitly tagged under this division yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {area.projects.map(({ project }) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]">
                      {project.status}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {project.startYear} – {project.endYear || "Present"}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 font-light">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Linked Publications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--brand-primary)]" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Division Literature ({area.publications.length})
          </h2>
        </div>

        {area.publications.length === 0 ? (
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
            No peer-reviewed publications associated with this division yet.
          </div>
        ) : (
          <div className="space-y-4">
            {area.publications.map(({ publication }) => (
              <div
                key={publication.id}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--bio-teal)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[var(--bio-teal)]">
                      {publication.year}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      • {publication.type}
                    </span>
                    {publication.venue && (
                      <span className="text-xs text-[var(--text-secondary)] font-mono">
                        — {publication.venue}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">
                    {publication.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {publication.authors.join(", ")}
                  </p>
                </div>

                {publication.doi && (
                  <div className="shrink-0">
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--bio-teal)] hover:text-[var(--bio-teal)] transition-colors"
                    >
                      <span>DOI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
