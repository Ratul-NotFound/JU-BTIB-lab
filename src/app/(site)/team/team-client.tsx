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
 * Clean, Minimalist Member Card (No Connection Lines)
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
      className={`group relative flex flex-col items-center w-full max-w-[290px] mx-auto rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 focus:outline-none ${
        isDirector
          ? "border-[var(--brand-primary)] bg-[var(--surface)] shadow-md hover:shadow-xl p-6"
          : isTeacher
          ? "border-[var(--brand-primary)]/40 bg-[var(--surface)] hover:border-[var(--brand-primary)] shadow-xs hover:shadow-lg p-5"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] shadow-xs hover:shadow-md p-5"
      } text-center`}
    >
      {/* Category / Role Badge */}
      <div className="mb-3.5">
        <span
          className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
            isDirector
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : isTeacher
              ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30"
              : "bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)]"
          }`}
        >
          {badgeText}
        </span>
      </div>

      {/* Portrait Photo */}
      <div
        className={`relative aspect-square ${
          isDirector ? "w-28 h-28 sm:w-32 sm:h-32" : "w-24 h-24 sm:w-28 sm:h-28"
        } rounded-2xl overflow-hidden mx-auto border-2 ${
          isDirector || isTeacher
            ? "border-[var(--brand-primary)]"
            : "border-[var(--border)]"
        } bg-[var(--surface-raised)] group-hover:border-[var(--brand-primary)] transition-colors shadow-xs`}
      >
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="128px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-[var(--brand-primary)]">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 space-y-1 w-full">
        <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate">
          {member.name}
        </h3>

        <p className="text-xs sm:text-sm font-semibold text-[var(--brand-primary)] truncate">
          {member.title || "Researcher"}
        </p>

        <p className="text-[11px] text-[var(--text-muted)] truncate">
          Dept. of Biotechnology & Genetic Eng.
        </p>

        {member.email && (
          <p className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1 truncate pt-0.5">
            <Mail className="w-3 h-3 text-[var(--brand-primary)] shrink-0" />
            <span className="truncate">{member.email}</span>
          </p>
        )}

        <div className="pt-2 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--brand-primary)] group-hover:underline">
          <span>{isTeacher || isDirector ? "View Faculty Profile" : "View Profile"}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
    <div className="text-center space-y-1.5 mb-8">
      <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-[var(--text-primary)]">
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
    <div className="w-full max-w-6xl mx-auto space-y-16 py-4">

      {/* =================================================================== */}
      {/* 1. TIER 1: LABORATORY DIRECTOR & PRINCIPAL INVESTIGATOR              */}
      {/* =================================================================== */}
      {director && (
        <section className="space-y-6">
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
        <section className="space-y-6">
          <TierHeader
            title="Faculty Members &"
            highlight="Teachers"
            subtitle="Senior professors and faculty advisors directing specialized research divisions."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard
                  member={teacher}
                  badgeText="Faculty Teacher · Investigator"
                  isTeacher
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 3. TIER 3: POSTDOCTORAL RESEARCH FELLOWS                            */}
      {/* =================================================================== */}
      {postdocs.length > 0 && (
        <section className="space-y-6">
          <TierHeader
            title="Postdoctoral Research"
            highlight="Fellows"
            subtitle="Full-time doctoral scholars advancing experimental bioprocesses and bioreactor engineering."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {postdocs.map((fellow) => (
              <div key={fellow.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard member={fellow} badgeText="Postdoctoral Fellow" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 4. TIER 4: DOCTORAL SCHOLARS (Ph.D.)                                */}
      {/* =================================================================== */}
      {phds.length > 0 && (
        <section className="space-y-6">
          <TierHeader
            title="Doctoral Scholars"
            highlight="(Ph.D.)"
            subtitle="Ph.D. candidates conducting original dissertation research on enzyme kinetics and algal systems."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {phds.map((scholar) => (
              <div key={scholar.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard member={scholar} badgeText="Ph.D. Scholar" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 5. TIER 5: GRADUATE RESEARCHERS (M.Sc.)                             */}
      {/* =================================================================== */}
      {mscs.length > 0 && (
        <section className="space-y-6">
          <TierHeader
            title="Graduate Researchers"
            highlight="(M.Sc.)"
            subtitle="Master of Science thesis scholars executing experimental laboratory dissertations."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {mscs.map((researcher) => (
              <div key={researcher.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard member={researcher} badgeText="M.Sc. Researcher" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 6. TIER 6: UNDERGRADUATE THESIS CANDIDATES (B.Sc. Hon.)             */}
      {/* =================================================================== */}
      {bscs.length > 0 && (
        <section className="space-y-6">
          <TierHeader
            title="Undergraduate Thesis"
            highlight="Candidates"
            subtitle="Fourth-year B.Sc. Honours scholars completing experiential biotechnology thesis projects."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {bscs.map((candidate) => (
              <div key={candidate.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard member={candidate} badgeText="B.Sc. Thesis Candidate" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 7. TIER 7: RESEARCH STAFF & OPERATIONS                              */}
      {/* =================================================================== */}
      {staff.length > 0 && (
        <section className="space-y-6">
          <TierHeader
            title="Research Operations &"
            highlight="Staff"
            subtitle="Laboratory managers and research technicians supporting analytical instrumentation and safety."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {staff.map((person) => (
              <div key={person.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard member={person} badgeText="Operations Specialist" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 8. TIER 8: DISTINGUISHED ALUMNI                                     */}
      {/* =================================================================== */}
      {alumni.length > 0 && (
        <section className="space-y-6">
          <TierHeader
            title="Distinguished Lab"
            highlight="Alumni"
            subtitle="Former doctoral and graduate researchers now leading scientific careers in academia and industry."
          />
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {alumni.map((alum) => (
              <div key={alum.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[290px]">
                <TeamMemberCard member={alum} badgeText="Distinguished Alumni" />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
