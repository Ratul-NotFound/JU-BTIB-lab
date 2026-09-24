import * as React from "react";
import { Metadata } from "next";
import { getProjects } from "@/server/queries/projects";
import { ProjectsListClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Projects & Innovations | BTIB Lab - Jahangirnagar University",
  description:
    "Explore current and completed biotechnology projects at BTIB Lab, including the Liquid-Tree microalgae photobioreactor, enzyme kinetics, and biopolymer valorization.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
          Research Projects & <span className="text-[var(--brand-primary)]">Field Deployments</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          From benchtop fermentation kinetic optimization to the 250-liter Liquid-Tree urban carbon capture
          prototypes operating on the campus of Jahangirnagar University, explore our translational research efforts.
        </p>
      </section>

      {/* Interactive client filter and cards */}
      <ProjectsListClient projects={projects} />
    </div>
  );
}
