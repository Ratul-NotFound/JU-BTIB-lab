import * as React from "react";
import { Metadata } from "next";
import { getPublications, getPublicationsTimeline } from "@/server/queries/publications";
import { PublicationsClient } from "./publications-client";
import { getScholarlyArticleJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Publications & Scholarly Output | BTIB Lab - Jahangirnagar University",
  description:
    "Peer-reviewed research publications, journal articles, and conference proceedings from the Bioresources Technology and Industrial Biotechnology Laboratory, Jahangirnagar University.",
};

export const revalidate = 60;

export default async function PublicationsPage() {
  const [publications, timeline] = await Promise.all([
    getPublications(),
    getPublicationsTimeline(),
  ]);

  const articlesJsonLd = publications.map((pub) => getScholarlyArticleJsonLd(pub));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-10">
        {/* Header */}
        <section className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
            Peer-Reviewed <span className="text-[var(--brand-primary)]">Publications & Literature</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
            Scholarly works from BTIB Lab indexed in international scientific literature, spanning
            microbial bioprocess kinetics, plant bioresources, molecular biotechnology, and algae
            photobioreactors at Jahangirnagar University.
          </p>
        </section>

        {/* Publications interactive client listing */}
        <PublicationsClient publications={publications} timeline={timeline} />
      </div>
    </>
  );
}
