import * as React from "react";
import { getSiteSettings } from "@/server/queries/settings";
import { getResearchAreas } from "@/server/queries/research-areas";
import { getPublicationsCount } from "@/server/queries/publications";
import { getProjects } from "@/server/queries/projects";
import { getGalleryAlbums } from "@/server/queries/gallery";
import { FullscreenHero } from "@/components/site/fullscreen-hero";
import { LabIntroSection } from "@/components/site/lab-intro-section";
import { ResearchPillars } from "@/components/site/research-pillars";
import { FeaturedProjectsSection } from "@/components/site/featured-projects-section";
import { ShortGallerySection } from "@/components/site/short-gallery-section";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, researchAreas, totalPublications, featuredProjects, galleryAlbums] = await Promise.all([
    getSiteSettings(),
    getResearchAreas(),
    getPublicationsCount(),
    getProjects({ featuredOnly: true }),
    getGalleryAlbums(),
  ]);

  return (
    <div className="w-full flex flex-col">
      {/* Hero: Clean fullscreen with full name of the lab in the middle */}
      <FullscreenHero
        heroSubheading={settings?.heroSubheading}
        totalDivisions={researchAreas.length || 8}
        totalPublications={totalPublications}
      />

      {/* Section 1: Short About, Motto, Mission, Target & Motive */}
      <LabIntroSection />

      {/* Section 2: Research Areas & Works */}
      <ResearchPillars areas={researchAreas.slice(0, 4)} />

      {/* Section 3: Flagship Research Projects */}
      <FeaturedProjectsSection projects={featuredProjects.slice(0, 3)} />

      {/* Section 4: Short Authentic Gallery */}
      <ShortGallerySection albums={galleryAlbums} />
    </div>
  );
}

