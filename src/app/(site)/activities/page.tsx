import * as React from "react";
import { Metadata } from "next";
import { getActivities } from "@/server/queries/activities";
import { ActivitiesListClient } from "./activities-client";

export const metadata: Metadata = {
  title: "Activities, Events & Milestones | BTIB Lab - Jahangirnagar University",
  description:
    "Explore recent events, national achievements, field expeditions, symposia, and academic milestones from BTIB Lab at Jahangirnagar University.",
};

export const revalidate = 60;

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* Compact Header */}
      <section className="space-y-1.5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
          Academic Events & Milestones
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
          Activities, Events & <span className="text-[var(--brand-primary)]">Achievements</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
          Chronicle of scientific seminars, competitive grant awards, field expeditions, and translational biotechnology milestones.
        </p>
      </section>

      {/* Compact Interactive Activities Listing */}
      <ActivitiesListClient activities={activities} />
    </div>
  );
}
