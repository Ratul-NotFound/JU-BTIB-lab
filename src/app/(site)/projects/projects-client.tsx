"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProjectStatus } from "@prisma/client";
import { Calendar, ChevronRight } from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string | null;
  status: ProjectStatus;
  funder: string | null;
  startYear: number;
  endYear: number | null;
  featured: boolean;
  areas: Array<{
    researchArea: {
      id: string;
      slug: string;
      title: string;
    };
  }>;
  teamMembers: Array<{
    teamMember: {
      id: string;
      slug: string;
      name: string;
    };
  }>;
}

export function ProjectsListClient({ projects }: { projects: ProjectItem[] }) {
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");

  const filteredProjects = React.useMemo(() => {
    if (selectedStatus === "ALL") return projects;
    return projects.filter((p) => p.status === selectedStatus);
  }, [projects, selectedStatus]);

  const counts = {
    ALL: projects.length,
    ACTIVE: projects.filter((p) => p.status === ProjectStatus.ACTIVE).length,
    COMPLETED: projects.filter((p) => p.status === ProjectStatus.COMPLETED).length,
    UPCOMING: projects.filter((p) => p.status === ProjectStatus.UPCOMING).length,
  };

  return (
    <div className="space-y-8">
      {/* Filter Tabs - Standardized radius & unified palette */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border)]">
        {(["ALL", "ACTIVE", "COMPLETED", "UPCOMING"] as const).map((status) => {
          const isActive = selectedStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[var(--brand-primary)] text-white shadow-[0_4px_14px_rgba(0,146,184,0.35)]"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <span>{status}</span>
              <span className="ml-1.5 opacity-70">({counts[status]})</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid - Balanced 3-Column, rounded-2xl cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((project) => {
          const defaultImage = "/images/fermentation.jpg";
          const imageSrc = project.coverImage || defaultImage;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.14)] transition-all flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Image Banner with Standardized Aspect Ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
                <Image
                  src={imageSrc}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium backdrop-blur-md border ${
                      project.status === ProjectStatus.ACTIVE
                        ? "bg-emerald-600/90 text-white border-emerald-400/40"
                        : project.status === ProjectStatus.COMPLETED
                        ? "bg-slate-700/90 text-white border-slate-500/40"
                        : "bg-amber-600/90 text-white border-amber-400/40"
                    }`}
                  >
                    {project.status}
                  </span>

                  {project.featured && (
                    <span className="text-[10px] font-mono text-amber-300 font-semibold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-400/30">
                      FEATURED
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                    <span>
                      {project.startYear} – {project.endYear || "Ongoing"}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug line-clamp-2">
                    {project.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light line-clamp-2">
                    {project.summary}
                  </p>

                  {/* Research areas */}
                  {project.areas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.areas.map(({ researchArea }) => (
                        <span
                          key={researchArea.id}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]"
                        >
                          {researchArea.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3.5 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span className="line-clamp-1">
                    {project.funder ? `Funder: ${project.funder}` : "JU Research Grant"}
                  </span>
                  <span className="text-[var(--brand-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-medium shrink-0">
                    Project Dossier <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
