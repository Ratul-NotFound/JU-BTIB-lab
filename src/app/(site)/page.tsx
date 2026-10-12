import * as React from "react";
import {
  getSiteSettings,
  getLandingPillarsSection,
  getHomepageSections,
} from "@/server/queries/settings";
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
  const [
    settings,
    researchAreas,
    totalPublications,
    featuredProjects,
    galleryAlbums,
    pillarsData,
    homepageSections,
  ] = await Promise.all([
    getSiteSettings(),
    getResearchAreas(),
    getPublicationsCount(),
    getProjects({ featuredOnly: true }),
    getGalleryAlbums(),
    getLandingPillarsSection(),
    getHomepageSections(),
  ]);

  return (
    <div className="w-full flex flex-col">
      {/* Hero: Clean fullscreen with full name of the lab in the middle */}
      <FullscreenHero
        heroHeading={settings?.heroHeading}
        heroSubheading={settings?.heroSubheading}
        totalDivisions={researchAreas.length || 8}
        totalPublications={totalPublications}
        heroBgImage={settings?.heroBgImage}
        heroBgImageAlt={settings?.heroBgImageAlt}
        bannerImages={settings?.bannerImages}
        labLogoUrl={settings?.labLogoUrl}
        labLogoWhiteUrl={settings?.labLogoWhiteUrl}
        universityLogoUrl={settings?.universityLogoUrl}
        universityLogoWhiteUrl={settings?.universityLogoWhiteUrl}
      />

      {/* Section 1: Short About, Motto, Mission, Target & Motive */}
      <LabIntroSection data={pillarsData} />

      {/* Section 2: Research Areas & Works */}
      <ResearchPillars
        areas={researchAreas.slice(0, 4)}
        sectionTitle={homepageSections.disciplinesTitle}
        sectionSubtitle={homepageSections.disciplinesSubtitle}
        actionText={homepageSections.disciplinesLinkText}
        actionLink={homepageSections.disciplinesLinkHref}
      />

      {/* Section 3: Flagship Research Projects */}
      <FeaturedProjectsSection
        projects={featuredProjects.slice(0, 3)}
        sectionTitle={homepageSections.projectsTitle}
        sectionSubtitle={homepageSections.projectsSubtitle}
        actionText={homepageSections.projectsLinkText}
        actionLink={homepageSections.projectsLinkHref}
      />

      {/* Section 4: Short Authentic Gallery */}
      <ShortGallerySection
        albums={galleryAlbums}
        sectionTitle={homepageSections.galleryTitle}
        sectionSubtitle={homepageSections.gallerySubtitle}
        actionText={homepageSections.galleryLinkText}
        actionLink={homepageSections.galleryLinkHref}
        customPreviews={homepageSections.galleryCards}
      />
    </div>
  );
}

