"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MemberCategory } from "@prisma/client";
import { ArrowRight, Mail } from "lucide-react";

export interface TeamMemberData {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  category: MemberCategory;
  photoUrl: string | null;
  email: string | null;
  bio: string | null;
  interests: string[];
  joinYear: number;
  leaveYear: number | null;
  projects: Array<{
    project: {
      id: string;
      title: string;
    };
  }>;
  publications: Array<{
    publication: {
      id: string;
      title: string;
    };
  }>;
}

/**
 * Clean, High-End Academic Member Card with Large Prominent Portrait
 */
function TeamMemberCard({
  member,
  badgeText,
  isDirector = false,
  isTeacher = false,
}: {
  member: TeamMemberData;
  badgeText: string;
  isDirector?: boolean;
  isTeacher?: boolean;
}) {
  return (
    <Link
      href={`/team/${member.slug}`}
      className={`group relative flex flex-col w-full rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 focus:outline-none overflow-hidden ${
        isDirector
          ? "border-[var(--brand-primary)] bg-[var(--surface)] shadow-md hover:shadow-xl max-w-sm sm:max-w-md mx-auto"
          : isTeacher
          ? "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/60 shadow-xs hover:shadow-xl hover:shadow-[var(--brand-primary)]/5"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/50 shadow-xs hover:shadow-md"
      }`}
    >
      {/* 1. Large Edge-to-Edge Prominent Portrait Section */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] overflow-hidden bg-[var(--surface-raised)] shrink-0">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 260px, 320px"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--brand-primary)]/10 via-[var(--surface-raised)] to-[var(--brand-primary)]/5 text-[var(--brand-primary)]">
            <span className="text-2xl sm:text-4xl font-black">
              {member.name
                .split(" ")
                .filter((w) => !["Prof.", "Dr.", "Md."].includes(w))
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || member.name.slice(0, 2)}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1">BTIB Researcher</span>
          </div>
        )}

        {/* Subtle Dark Scrim Overlay at the Bottom of Photo */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none" />

        {/* Floating Category / Role Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10.5px] font-semibold tracking-tight shadow-md backdrop-blur-md ${
              isDirector
                ? "bg-[var(--brand-primary)] text-white"
                : isTeacher
                ? "bg-black/65 text-white border border-white/20"
                : "bg-black/55 text-white/90 border border-white/15"
            }`}
          >
            {badgeText}
          </span>
        </div>
      </div>

      {/* 2. Details Container */}
      <div className="p-3 sm:p-4.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Full Name: Clean Line-Clamp with Balanced Min-Height (No Truncate Cutoff) */}
          <h3 className="font-bold text-xs sm:text-[15px] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug line-clamp-2 min-h-[2.1rem] sm:min-h-[2.6rem] flex items-center">
            {member.name}
          </h3>

          {/* Academic Designation / Role */}
          <p className="text-[10.5px] sm:text-xs font-semibold text-[var(--brand-primary)] line-clamp-2 leading-tight min-h-[1.75rem] sm:min-h-[2rem] flex items-center mt-1">
            {member.title || "Researcher"}
          </p>

          {/* Department Affiliation */}
          <p className="text-[9.5px] sm:text-[11px] text-[var(--text-muted)] line-clamp-1 mt-1 font-normal">
            Dept. of Biotechnology & Genetic Eng.
          </p>
        </div>

        {/* Bottom Metadata & Action Link */}
        <div className="mt-3 pt-2.5 border-t border-[var(--border)]/60 space-y-1.5">
          {member.email && (
            <p className="text-[9.5px] sm:text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 text-[var(--brand-primary)] shrink-0" />
              <span className="truncate">{member.email}</span>
            </p>
          )}

          <div className="flex items-center justify-between text-[10.5px] sm:text-xs font-semibold text-[var(--brand-primary)] group-hover:text-[var(--brand-accent)] transition-colors pt-0.5">
            <span>{isTeacher || isDirector ? "Faculty Profile" : "View Profile"}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Clean Section Header for Each Academic Tier (No Lines)
 */
function TierHeader({
  title,
  highlight,
  subtitle,
}: {
  title: string;
  highlight: string;
  subtitle: string;
}) {
  return (
    <div className="text-center space-y-1 mb-3.5 sm:mb-8">
      <h2 className="text-lg sm:text-2xl font-black font-sans tracking-tight text-[var(--text-primary)]">
        {title} <span className="text-[var(--brand-primary)]">{highlight}</span>
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

export function TeamClient({ members }: { members: TeamMemberData[] }) {
  // 1. Leadership: Director & PI
  const director =
    members.find(
      (m) =>
        m.category === MemberCategory.PI_FACULTY &&
        m.slug === "mohammad-shahedur-rahman"
    ) || members.find((m) => m.category === MemberCategory.PI_FACULTY);

  // 2. Faculty Teachers (other PI_FACULTY)
  const teachers = members.filter(
    (m) =>
      m.category === MemberCategory.PI_FACULTY &&
      (!director || m.id !== director.id)
  );

  // 3. Postdocs
  const postdocs = members.filter(
    (m) => m.category === MemberCategory.POSTDOC
  );

  // 4. Ph.D. Scholars
  const phds = members.filter((m) => m.category === MemberCategory.PHD);

  // 5. M.Sc. Researchers
  const mscs = members.filter((m) => m.category === MemberCategory.MSC);

  // 6. Undergraduate Thesis Candidates
  const bscs = members.filter(
    (m) => m.category === MemberCategory.BSC_THESIS
  );

  // 7. Research Support Staff & Operations
  const staff = members.filter(
    (m) => m.category === MemberCategory.RESEARCH_ASSISTANT
  );

  // 8. Alumni
  const alumni = members.filter(
    (m) => m.category === MemberCategory.ALUMNI
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 sm:space-y-16 py-2 sm:py-4">

      {/* =================================================================== */}
      {/* 1. TIER 1: LABORATORY DIRECTOR & PRINCIPAL INVESTIGATOR              */}
      {/* =================================================================== */}
      {director && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Laboratory Leadership &"
            highlight="Director"
            subtitle="Principal investigator directing biotechnology research, microbial genetics, and academic mentorship."
          />
          <div className="flex justify-center">
            <TeamMemberCard
              member={director}
              badgeText="Director & Principal Investigator"
              isDirector
              isTeacher
            />
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 2. TIER 2: FACULTY TEACHERS & CO-INVESTIGATORS                      */}
      {/* =================================================================== */}
      {teachers.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Faculty Members &"
            highlight="Teachers"
            subtitle="Senior professors and faculty advisors directing specialized research divisions."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {teachers.map((teacher) => (
              <TeamMemberCard
                key={teacher.id}
                member={teacher}
                badgeText="Faculty Teacher · Investigator"
                isTeacher
              />
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 3. TIER 3: POSTDOCTORAL RESEARCH FELLOWS                            */}
      {/* =================================================================== */}
      {postdocs.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Postdoctoral Research"
            highlight="Fellows"
            subtitle="Full-time doctoral scholars advancing experimental bioprocesses and bioreactor engineering."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {postdocs.map((fellow) => (
              <TeamMemberCard key={fellow.id} member={fellow} badgeText="Postdoctoral Fellow" />
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 4. TIER 4: DOCTORAL SCHOLARS (Ph.D.)                                */}
      {/* =================================================================== */}
      {phds.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Doctoral Scholars"
            highlight="(Ph.D.)"
            subtitle="Ph.D. candidates conducting original dissertation research on enzyme kinetics and algal systems."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {phds.map((scholar) => (
              <TeamMemberCard key={scholar.id} member={scholar} badgeText="Ph.D. Scholar" />
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 5. TIER 5: GRADUATE RESEARCHERS (M.Sc.)                             */}
      {/* =================================================================== */}
      {mscs.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Graduate Researchers"
            highlight="(M.Sc.)"
            subtitle="Master of Science thesis scholars executing experimental laboratory dissertations."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {mscs.map((researcher) => (
              <TeamMemberCard key={researcher.id} member={researcher} badgeText="M.Sc. Researcher" />
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 6. TIER 6: UNDERGRADUATE THESIS CANDIDATES (B.Sc. Hon.)             */}
      {/* =================================================================== */}
      {bscs.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Undergraduate Thesis"
            highlight="Candidates"
            subtitle="Fourth-year B.Sc. Honours scholars completing experiential biotechnology thesis projects."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {bscs.map((candidate) => (
              <TeamMemberCard key={candidate.id} member={candidate} badgeText="B.Sc. Candidate" />
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 7. TIER 7: RESEARCH STAFF & OPERATIONS                              */}
      {/* =================================================================== */}
      {staff.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Research Operations &"
            highlight="Staff"
            subtitle="Laboratory managers and research technicians supporting analytical instrumentation and safety."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {staff.map((person) => (
              <TeamMemberCard key={person.id} member={person} badgeText="Operations Specialist" />
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 8. TIER 8: DISTINGUISHED ALUMNI                                     */}
      {/* =================================================================== */}
      {alumni.length > 0 && (
        <section className="space-y-3 sm:space-y-6">
          <TierHeader
            title="Distinguished Lab"
            highlight="Alumni"
            subtitle="Former doctoral and graduate researchers now leading scientific careers in academia and industry."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto">
            {alumni.map((alum) => (
              <TeamMemberCard key={alum.id} member={alum} badgeText="Alumni" />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
