import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, BookOpen, ExternalLink, FolderKanban, Mail } from "lucide-react";
import { getTeamMemberBySlug } from "@/server/queries/team";
import { getPersonJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    return { title: "Team Member Not Found | BTIB Lab" };
  }

  return {
    title: `${member.name} | BTIB Lab - Jahangirnagar University`,
    description: member.bio || `${member.name} - Researcher at BTIB Lab, Jahangirnagar University`,
  };
}

export const revalidate = 60;

export default async function TeamMemberProfilePage({ params }: Props) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const personJsonLd = getPersonJsonLd({
    name: member.name,
    title: member.title,
    email: member.email,
    bio: member.bio,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-6 sm:space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/team"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--bio-teal)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Team Members</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <section className="p-4 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 sm:space-y-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl border-2 border-[var(--brand-primary)]/40 bg-[var(--surface-raised)] overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="112px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-serif font-bold text-[var(--bio-teal)]">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--bio-teal)]">
                  {member.category}
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)]">
                  Affiliated since {member.joinYear}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)]">
                {member.name}
              </h1>

              <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)]">
                {member.title || "Biotechnology Researcher"}
              </p>

              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                Dept. of Biotechnology & Genetic Engineering, Jahangirnagar University
              </p>
            </div>
          </div>

          {/* Contact and profile links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[var(--border)]">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--bio-teal)] hover:text-[var(--bio-teal)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{member.email}</span>
              </a>
            )}

            {member.profileLinks &&
              typeof member.profileLinks === "object" &&
              Object.entries(member.profileLinks as Record<string, string>).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--bio-teal)] hover:text-[var(--bio-teal)] transition-colors"
                >
                  <span className="capitalize">{key}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
          </div>

          {/* Biography */}
          {member.bio && (
            <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-[var(--border)]">
              <h2 className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Biography & Academic Background
              </h2>
              <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
                {member.bio}
              </p>
            </div>
          )}

          {/* Research Interests */}
          {member.interests && member.interests.length > 0 && (
            <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-[var(--border)]">
              <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Research Domains & Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Linked Projects */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[var(--brand-primary)]" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Involved Projects ({member.projects.length})
            </h2>
          </div>

          {member.projects.length === 0 ? (
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
              No specific projects currently linked to this profile.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.projects.map(({ project }) => (
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
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 font-light">
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
              Authored Publications ({member.publications.length})
            </h2>
          </div>

          {member.publications.length === 0 ? (
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
              No publications directly associated with this author profile in the repository.
            </div>
          ) : (
            <div className="space-y-4">
              {member.publications.map(({ publication }) => (
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
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
