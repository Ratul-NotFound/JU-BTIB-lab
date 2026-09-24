import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Calendar, Layers, Users } from "lucide-react";
import { getProjectBySlug } from "@/server/queries/projects";
import { PhotobioreactorScene } from "@/components/visuals/photobioreactor-scene";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found | BTIB Lab" };
  }

  return {
    title: `${project.title} | BTIB Lab - Jahangirnagar University`,
    description: project.summary,
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isLiquidTree = project.slug.includes("liquid-tree") || project.slug.includes("photobioreactor");

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--bio-teal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="p-8 sm:p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/30">
              PROJECT DOSSIER
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              STATUS: {project.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <Calendar className="w-4 h-4 text-[var(--bio-teal)]" />
            <span>
              {project.startYear} – {project.endYear || "Ongoing"}
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl font-light">
          {project.summary}
        </p>

        {/* Metadata stats bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Funding Agency
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {project.funder || "University / Institutional Grant"}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Research Status
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {project.status} Phase
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Institution
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Jahangirnagar University
            </span>
          </div>
        </div>

        {/* Rich body description */}
        {project.bodyHtml && (
          <div
            className="prose dark:prose-invert max-w-none text-sm text-[var(--text-secondary)] pt-6 border-t border-[var(--border)] leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
          />
        )}
      </section>

      {/* Signature Algae Photobioreactor Scene if Liquid-Tree */}
      {isLiquidTree && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/30">
              TECHNICAL VISUALIZATION
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              SYSTEM ARCHITECTURE
            </span>
          </div>
          <PhotobioreactorScene />
        </section>
      )}

      {/* Linked Team Members & Research Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Research Areas */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--bio-teal)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Associated Research Disciplines
            </h2>
          </div>

          <div className="space-y-2">
            {project.areas.map(({ researchArea }) => (
              <Link
                key={researchArea.id}
                href={`/research/${researchArea.slug}`}
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--bio-teal)] transition-colors flex items-center justify-between text-xs group"
              >
                <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--bio-teal)]">
                  {researchArea.title}
                </span>
                <span className="font-mono text-[var(--text-muted)]">View branch →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Project Investigators */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--bio-teal)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Investigator Roster
            </h2>
          </div>

          <div className="space-y-2">
            {project.teamMembers.length > 0 ? (
              project.teamMembers.map(({ teamMember }) => (
                <Link
                  key={teamMember.id}
                  href={`/team/${teamMember.slug}`}
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--bio-teal)] transition-colors flex items-center justify-between text-xs group"
                >
                  <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--bio-teal)]">
                    {teamMember.name}
                  </span>
                  <span className="font-mono text-[var(--text-muted)]">Profile →</span>
                </Link>
              ))
            ) : (
              <div className="text-xs font-mono text-[var(--text-muted)] p-3.5">
                Lead: Faculty & Research Scholars (BTIB Lab, JU)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
