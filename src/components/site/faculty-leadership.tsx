import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, Quote } from "lucide-react";
import {
  type FacultyLeadershipContentData,
  DEFAULT_FACULTY_LEADERSHIP,
} from "@/server/queries/settings";

export interface FacultyLeadershipData {
  name?: string;
  photoUrl?: string | null;
  title?: string | null;
  email?: string | null;
}

export function FacultyLeadership({
  data,
  piMember,
}: {
  data?: FacultyLeadershipContentData | null;
  piMember?: FacultyLeadershipData | null;
}) {
  const merged = {
    ...DEFAULT_FACULTY_LEADERSHIP,
    ...(data || {}),
    ...(piMember
      ? {
          name: piMember.name || data?.name || DEFAULT_FACULTY_LEADERSHIP.name,
          photoUrl: piMember.photoUrl || data?.photoUrl || DEFAULT_FACULTY_LEADERSHIP.photoUrl,
          title: piMember.title || data?.title || DEFAULT_FACULTY_LEADERSHIP.title,
          email: piMember.email || data?.email || DEFAULT_FACULTY_LEADERSHIP.email,
        }
      : {}),
  };

  const photo = merged.photoUrl || "/images/team/shahedur-rahman.jpg";
  const name = merged.name;
  const title = merged.title;
  const email = merged.email;

  return (
    <section className="w-full bg-[var(--surface)] py-20 sm:py-28 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait & Direct Contact */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left space-y-5">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-md overflow-hidden border border-[var(--border)] shadow-md group bg-[var(--surface-raised)]">
              <Image
                src={photo}
                alt={`${name}, Principal Investigator at BTIB Lab`}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 176px, 208px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                {name}
              </h3>
              <p className="text-sm font-mono text-[var(--bio-teal)] font-medium mt-1">
                {title}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-light leading-relaxed">
                {merged.department}
                <br />
                {merged.institution}, {merged.address}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] hover:border-[var(--bio-teal)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </a>

              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--bio-teal)] hover:underline"
              >
                <span>Meet all scholars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Scholarly Mission & Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="editorial-kicker">{merged.kicker}</span>
                <span className="text-[var(--border-strong)]">•</span>
                <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                  {merged.subKicker}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                {merged.heading}
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
                {merged.philosophy}
              </p>
            </div>

            {/* Dignified Quote */}
            <div className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] space-y-3 relative">
              <Quote className="w-5 h-5 text-[var(--bio-teal)] opacity-60" />
              <p className="text-sm sm:text-base font-serif italic text-[var(--text-primary)] leading-relaxed">
                &ldquo;{merged.quote}&rdquo;
              </p>
            </div>

            {/* Core Disciplines */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Primary Supervisory Fields
              </span>
              <div className="flex flex-wrap gap-2">
                {merged.supervisoryFields.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded text-xs font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
