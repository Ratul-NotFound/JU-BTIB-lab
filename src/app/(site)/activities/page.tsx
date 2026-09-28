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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-6 sm:space-y-10">
      {/* Header */}
      <section className="space-y-2 sm:space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12] sm:leading-[1.08]">
          Activities, Events & Achievements
        </h1>
        <p className="text-xs sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          Chronicle of scientific seminars, competitive grant awards, field expeditions, and translational biotechnology milestones at Jahangirnagar University.
        </p>
      </section>

      {/* Interactive Activities Listing */}
      <ActivitiesListClient activities={activities} />
    </div>
  );
}
