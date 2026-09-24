import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTeamMembers } from "@/server/queries/team";
import { TeamClient } from "./team-client";

export const metadata: Metadata = {
  title: "Research Team & Faculty | BTIB Lab - Jahangirnagar University",
  description:
    "Meet the researchers, graduate students, and faculty investigators leading biotechnology research at BTIB Lab, Jahangirnagar University.",
};

export const revalidate = 60;

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <section className="space-y-4 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
          Research Team & <span className="text-[var(--brand-primary)]">Hierarchy</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          Faculty leadership, doctoral scholars, and thesis investigators advancing industrial biotechnology, microbial bioprocess kinetics, and bioresource engineering at Jahangirnagar University.
        </p>
      </section>

      {/* Modern, Minimalist Team Client Showcase */}
      <TeamClient members={members} />

      {/* Recruitment / Thesis Inquiries Banner */}
      <section className="p-8 sm:p-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Join Our <span className="text-[var(--brand-primary)]">Research Group</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
            We are actively accepting inquiries for B.Sc. Hon. thesis placements, M.Sc. research fellowships,
            and Ph.D. candidates passionate about bioprocess scale-up and bioresource valorization.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Inquire for Placements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
