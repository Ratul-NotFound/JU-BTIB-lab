import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FolderKanban,
  Mail,
  Layers,
  GraduationCap,
  Calendar,
  Sparkles,
  FileText,
  Building,
  Award,
} from "lucide-react";
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
    description:
      member.bio ||
      `${member.name} - ${member.title || "Researcher"} at Bioresources Technology and Industrial Biotechnology Laboratory, Jahangirnagar University.`,
  };
}

export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  PI_FACULTY: "Principal Investigator / Faculty",
  POSTDOC: "Postdoctoral Researcher",
  PHD: "Ph.D. Researcher",
  MPHIL: "M.Phil. Researcher",
  MSC: "M.Sc. Student",
  BSC_THESIS: "B.Sc. Thesis Student",
  RESEARCH_ASSISTANT: "Research Assistant",
  ALUMNI: "Lab Alumni",
};

interface PersonalProject {
  id: string;
  title: string;
  role?: string;
  status?: string;
  startYear?: number | string;
  endYear?: number | string;
  funder?: string;
  summary?: string;
  link?: string;
}

interface PersonalPublication {
  id: string;
  title: string;
  authors?: string;
  venue?: string;
  year?: number | string;
  type?: string;
  doi?: string;
  url?: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year?: number | string;
  field?: string;
}

interface AwardItem {
  id: string;
  title: string;
  issuer?: string;
  year?: number | string;
}

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

  // Collect unique affiliated research areas from connected projects and publications
  const uniqueResearchAreasMap = new Map<string, { id: string; title: string; slug: string }>();

  member.projects.forEach(({ project }) => {
    project.areas?.forEach(({ researchArea }) => {
      if (researchArea) {
        uniqueResearchAreasMap.set(researchArea.id, {
          id: researchArea.id,
          title: researchArea.title,
          slug: researchArea.slug,
        });
      }
    });
  });

  member.publications.forEach(({ publication }) => {
    publication.areas?.forEach(({ researchArea }) => {
      if (researchArea) {
        uniqueResearchAreasMap.set(researchArea.id, {
          id: researchArea.id,
          title: researchArea.title,
          slug: researchArea.slug,
        });
      }
    });
  });

  const affiliatedResearchAreas = Array.from(uniqueResearchAreasMap.values());

  const profileLinks = (member.profileLinks as Record<string, string> | null) || {};
  const personalProjects = (member.personalProjects as PersonalProject[] | null) || [];
  const personalPublications = (member.personalPublications as PersonalPublication[] | null) || [];
  const educationList = (member.education as EducationItem[] | null) || [];
  const awardsList = (member.awards as AwardItem[] | null) || [];

  const totalProjectsCount = member.projects.length + personalProjects.length;
  const totalPublicationsCount = member.publications.length + personalPublications.length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-6 sm:space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/team"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--bio-teal)] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Team Members</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <section className="p-5 sm:p-8 lg:p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6 sm:space-y-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            {/* Portrait Image or Monogram */}
            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-2xl border-2 border-[var(--brand-primary)]/40 bg-[var(--surface-raised)] overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 96px, 144px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-serif font-bold text-[var(--bio-teal)]">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
            </div>

            {/* Core Member Details */}
            <div className="space-y-2 sm:space-y-2.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border border-[var(--brand-primary)]/30 bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)]">
                  {CATEGORY_LABELS[member.category] || member.category}
                </span>

                <span className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)]">
                  <Calendar className="w-3.5 h-3.5 text-[var(--bio-teal)]" />
                  {member.leaveYear
                    ? `Affiliated ${member.joinYear} – ${member.leaveYear}`
                    : `Affiliated since ${member.joinYear} – Present`}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)]">
                {member.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--brand-primary)]">
                  {member.title || "Biotechnology Researcher"}
                </span>
                <span className="text-[var(--border)]">•</span>
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  Dept. of Biotechnology & Genetic Engineering, JU
                </span>
              </div>
            </div>
          </div>

          {/* Contact and Dynamic Profile / Scholarly Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-[var(--border)]">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>{member.email}</span>
              </a>
            )}

            {profileLinks.googleScholar && (
              <a
                href={profileLinks.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Scholar</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            )}

            {profileLinks.researchGate && (
              <a
                href={profileLinks.researchGate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--bio-teal)] hover:text-[var(--bio-teal)] transition-colors shadow-2xs"
              >
                <span className="font-bold text-[var(--bio-teal)]">RG</span>
                <span>ResearchGate</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            )}

            {profileLinks.orcid && (
              <a
                href={
                  profileLinks.orcid.startsWith("http")
                    ? profileLinks.orcid
                    : `https://orcid.org/${profileLinks.orcid}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-2xs"
              >
                <span className="font-bold text-emerald-500">iD</span>
                <span>ORCID</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            )}

            {profileLinks.linkedin && (
              <a
                href={profileLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            )}

            {profileLinks.github && (
              <a
                href={profileLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors shadow-2xs"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            )}

            {profileLinks.website && (
              <a
                href={profileLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
              >
                <span>University Webpage</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            )}
          </div>

          {/* Biography */}
          {member.bio && (
            <div className="space-y-2 pt-4 border-t border-[var(--border)]">
              <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Biography & Research Trajectory</span>
              </h2>
              <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light whitespace-pre-line">
                {member.bio}
              </p>
            </div>
          )}

          {/* Research Specializations & Domains */}
          {member.interests && member.interests.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[var(--border)]">
              <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Research Domains & Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/40 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Affiliated Research Disciplines */}
          {affiliatedResearchAreas.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[var(--border)]">
              <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--bio-teal)]" />
                <span>Connected Laboratory Research Disciplines</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {affiliatedResearchAreas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/research/${area.slug}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all flex items-center gap-1.5 shadow-2xs group"
                  >
                    <span>{area.title}</span>
                    <ExternalLink className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Education & Qualifications Section (if present) */}
        {educationList.length > 0 && (
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
              <div className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--brand-primary)]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
                Education & Qualifications ({educationList.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationList.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--text-primary)]">
                      {edu.degree}
                    </span>
                    {edu.year && (
                      <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold">
                        {edu.year}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-light">
                    {edu.institution}
                  </p>
                  {edu.field && (
                    <p className="text-[11px] font-mono text-[var(--text-muted)]">
                      Major: {edu.field}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Honors & Awards Section (if present) */}
        {awardsList.length > 0 && (
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
              <div className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-amber-500">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
                Honors & Academic Awards ({awardsList.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awardsList.map((aw, idx) => (
                <div
                  key={aw.id || idx}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[var(--text-primary)] line-clamp-1">
                      {aw.title}
                    </span>
                    {aw.year && (
                      <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                        {aw.year}
                      </span>
                    )}
                  </div>
                  {aw.issuer && (
                    <p className="text-xs text-[var(--text-muted)] font-light">
                      {aw.issuer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Involved Research Projects (Both Lab & Personal) */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--brand-primary)]">
                <FolderKanban className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
                Involved Research Projects ({totalProjectsCount})
              </h2>
            </div>

            <Link
              href="/projects"
              className="text-xs font-mono text-[var(--brand-primary)] hover:underline hidden sm:inline-block"
            >
              All Projects Directory →
            </Link>
          </div>

          {totalProjectsCount === 0 ? (
            <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-2 shadow-xs">
              <p className="text-xs font-mono text-[var(--text-muted)]">
                No specific research projects currently linked to this profile.
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] font-light">
                Both shared laboratory initiatives and personal projects can be configured from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Shared Lab Projects */}
              {member.projects.map(({ project }) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                            project.status === "ACTIVE"
                              ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)]"
                              : project.status === "COMPLETED"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {project.status}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]">
                          LAB INITIATIVE
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {project.startYear} – {project.endYear || "Present"}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 font-light leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {project.funder ? `Funder: ${project.funder}` : "BTIB Core Lab Grant"}
                    </span>
                    <span className="font-mono text-[var(--brand-primary)] font-semibold flex items-center gap-1">
                      <span>View Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}

              {/* 2. Personal / Specific Projects */}
              {personalProjects.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                            p.status === "ACTIVE"
                              ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)]"
                              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {p.status || "ACTIVE"}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]">
                          PERSONAL PROJECT
                        </span>
                      </div>
                      {(p.startYear || p.endYear) && (
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          {p.startYear} {p.endYear ? `– ${p.endYear}` : "– Present"}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[var(--text-primary)] line-clamp-2">
                      {p.title}
                    </h3>

                    {p.role && (
                      <p className="text-xs font-mono text-[var(--brand-primary)] font-semibold">
                        Role: {p.role}
                      </p>
                    )}

                    {p.summary && (
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 font-light leading-relaxed">
                        {p.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {p.funder ? `Institution/Grant: ${p.funder}` : "Independent Research"}
                    </span>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[var(--brand-primary)] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>Project Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Authored Scholarly Publications (Both Lab & Personal) */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--brand-primary)]">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
                Authored Publications ({totalPublicationsCount})
              </h2>
            </div>

            <Link
              href="/publications"
              className="text-xs font-mono text-[var(--brand-primary)] hover:underline hidden sm:inline-block"
            >
              All Publications Index →
            </Link>
          </div>

          {totalPublicationsCount === 0 ? (
            <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-2 shadow-xs">
              <p className="text-xs font-mono text-[var(--text-muted)]">
                No publications directly associated with this author profile in the repository.
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] font-light">
                Both central lab articles and individual publications can be configured via the admin panel.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1. Shared Lab Publications */}
              {member.publications.map(({ publication }) => (
                <div
                  key={publication.id}
                  className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--brand-primary)]">
                        {publication.year}
                      </span>
                      <span className="text-[var(--border)]">•</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]">
                        {publication.type}
                      </span>
                      {publication.venue && (
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          — {publication.venue}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[var(--text-primary)] leading-snug">
                      {publication.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] font-light">
                      {publication.authors.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    {publication.doi && (
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {publication.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Paper</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* 2. Personal / External Publications */}
              {personalPublications.map((pub, idx) => (
                <div
                  key={pub.id || idx}
                  className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {pub.year && (
                        <span className="text-xs font-mono font-bold text-[var(--bio-emerald)]">
                          {pub.year}
                        </span>
                      )}
                      <span className="text-[var(--border)]">•</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]">
                        {pub.type || "JOURNAL"}
                      </span>
                      {pub.venue && (
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          — {pub.venue}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[var(--text-primary)] leading-snug">
                      {pub.title}
                    </h3>

                    {pub.authors && (
                      <p className="text-xs text-[var(--text-secondary)] font-light">
                        {pub.authors}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    {pub.doi && (
                      <a
                        href={
                          pub.doi.startsWith("http")
                            ? pub.doi
                            : `https://doi.org/${pub.doi}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Paper</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
