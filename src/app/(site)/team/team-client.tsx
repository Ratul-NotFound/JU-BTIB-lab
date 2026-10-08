"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MemberCategory } from "@prisma/client";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem, InteractiveCard } from "@/components/ui/reveal";

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
    <InteractiveCard hoverY={-4} className="h-full">
      <Link
        href={`/team/${member.slug}`}
        className={`group relative flex flex-col w-full h-full rounded-2xl border transition-all duration-300 focus:outline-none overflow-hidden ${
          isDirector
            ? "border-[var(--brand-primary)] bg-[var(--surface)] shadow-md hover:shadow-lg max-w-sm sm:max-w-md mx-auto"
            : isTeacher
            ? "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/60 shadow-xs hover:shadow-md"
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

          {/* Clean Rectangular Category / Role Tag */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-medium tracking-tight shadow-xs backdrop-blur-md ${
                isDirector
                  ? "bg-[var(--brand-primary)] text-white"
                  : isTeacher
                  ? "bg-black/70 text-white border border-white/20"
                  : "bg-black/60 text-white/90 border border-white/15"
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
              Dept. of Biotechnology &amp; Genetic Eng.
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
    </InteractiveCard>
  );
}

/**
 * Clean Section Header for Each Academic Tier (Single-Color Typography)
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
    <Reveal direction="up" distance={15}>
      <div className="text-center space-y-1 mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
          {title} {highlight}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto px-2">
          {subtitle}
        </p>
      </div>
    </Reveal>
  );
}

export function TeamClient({ members = [] }: { members?: TeamMemberData[] }) {
  const safeMembers = Array.isArray(members) ? members : [];

  // 1. Leadership: Director & PI
  const director =
    safeMembers.find(
      (m) =>
        m.category === MemberCategory.PI_FACULTY &&
        m.slug === "mohammad-shahedur-rahman"
    ) || safeMembers.find((m) => m.category === MemberCategory.PI_FACULTY);

  // 2. Faculty Teachers (other PI_FACULTY)
  const teachers = safeMembers.filter(
    (m) =>
      m.category === MemberCategory.PI_FACULTY &&
      (!director || m.id !== director.id)
  );

  // 3. Postdocs
  const postdocs = safeMembers.filter(
    (m) => m.category === MemberCategory.POSTDOC
  );

  // 4. Ph.D. Scholars
  const phds = safeMembers.filter((m) => m.category === MemberCategory.PHD);

  // 5. M.Sc. Researchers
  const mscs = safeMembers.filter((m) => m.category === MemberCategory.MSC);

  // 6. Undergraduate Thesis Candidates
  const bscs = safeMembers.filter(
    (m) => m.category === MemberCategory.BSC_THESIS
  );

  // 7. Research Support Staff & Operations
  const staff = safeMembers.filter(
    (m) => m.category === MemberCategory.RESEARCH_ASSISTANT
  );

  // 8. Alumni
  const alumni = safeMembers.filter(
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
          <Reveal direction="up" distance={20} className="flex justify-center">
            <TeamMemberCard
              member={director}
              badgeText="Director & Principal Investigator"
              isDirector
              isTeacher
            />
          </Reveal>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {teachers.map((teacher) => (
              <StaggerItem key={teacher.id} yOffset={20}>
                <TeamMemberCard
                  member={teacher}
                  badgeText="Faculty Teacher · Investigator"
                  isTeacher
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {postdocs.map((fellow) => (
              <StaggerItem key={fellow.id} yOffset={20}>
                <TeamMemberCard member={fellow} badgeText="Postdoctoral Fellow" />
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {phds.map((scholar) => (
              <StaggerItem key={scholar.id} yOffset={20}>
                <TeamMemberCard member={scholar} badgeText="Ph.D. Scholar" />
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {mscs.map((researcher) => (
              <StaggerItem key={researcher.id} yOffset={20}>
                <TeamMemberCard member={researcher} badgeText="M.Sc. Researcher" />
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {bscs.map((candidate) => (
              <StaggerItem key={candidate.id} yOffset={20}>
                <TeamMemberCard member={candidate} badgeText="B.Sc. Candidate" />
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {staff.map((person) => (
              <StaggerItem key={person.id} yOffset={20}>
                <TeamMemberCard member={person} badgeText="Operations Specialist" />
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          <StaggerContainer
            staggerDelay={0.06}
            delayChildren={0.04}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 max-w-5xl mx-auto"
          >
            {alumni.map((alum) => (
              <StaggerItem key={alum.id} yOffset={20}>
                <TeamMemberCard member={alum} badgeText="Alumni" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

    </div>
  );
}
