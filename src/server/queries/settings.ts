import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  type LandingPillarsSectionData,
  DEFAULT_LANDING_PILLARS,
  type FacultyLeadershipContentData,
  DEFAULT_FACULTY_LEADERSHIP,
  type ResearchCapabilitiesSectionData,
  DEFAULT_RESEARCH_CAPABILITIES,
  type LiquidTreeInnovationData,
  DEFAULT_LIQUID_TREE_INNOVATION,
  type HomepageSectionsData,
  DEFAULT_HOMEPAGE_SECTIONS,
  type AboutMilestonesSectionData,
  DEFAULT_ABOUT_MILESTONES,
  type AboutAchievementsSectionData,
  DEFAULT_ABOUT_ACHIEVEMENTS,
  type AboutFacilitiesSectionData,
  DEFAULT_ABOUT_FACILITIES,
} from "@/types/settings-sections";

export * from "@/types/settings-sections";

function getCachedSiteSettings() {
  return unstable_cache(
    async () => {
      return await db.siteSetting.findUnique({
        where: { id: "singleton" },
      });
    },
    ["site-settings"],
    {
      tags: [CACHE_TAGS.SETTINGS],
      revalidate: 3600,
    }
  )();
}

export const getSiteSettings = cache(async function getSiteSettings() {
  try {
    return await getCachedSiteSettings();
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
});

function getCachedContentBlocks() {
  return unstable_cache(
    async () => {
      return await db.contentBlock.findMany();
    },
    ["content-blocks"],
    {
      tags: [CACHE_TAGS.CONTENT_BLOCKS],
      revalidate: 3600,
    }
  )();
}

export async function getContentBlocks() {
  try {
    return await getCachedContentBlocks();
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return [];
  }
}

function getCachedContentBlockByKey(key: string) {
  const cacheKey = ["content-block-by-key", key];
  return unstable_cache(
    async () => {
      return await db.contentBlock.findUnique({
        where: { key },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.CONTENT_BLOCKS],
      revalidate: 3600,
    }
  )();
}

export async function getContentBlockByKey(key: string) {
  try {
    return await getCachedContentBlockByKey(key);
  } catch (error) {
    console.error(`Error fetching content block ${key}:`, error);
    return null;
  }
}

export const getLandingPillarsSection = cache(
  async function getLandingPillarsSection(): Promise<LandingPillarsSectionData> {
    try {
      const block = await getContentBlockByKey("landing.pillars");
      if (block && typeof block.content === "object" && block.content !== null) {
        const content = block.content as Partial<LandingPillarsSectionData>;
        if (Array.isArray(content.items) && content.items.length > 0) {
          return {
            sectionTitle: content.sectionTitle || DEFAULT_LANDING_PILLARS.sectionTitle,
            sectionSubtitle: content.sectionSubtitle || DEFAULT_LANDING_PILLARS.sectionSubtitle,
            sectionBadge: content.sectionBadge || DEFAULT_LANDING_PILLARS.sectionBadge,
            actionText: content.actionText || DEFAULT_LANDING_PILLARS.actionText,
            actionLink: content.actionLink || DEFAULT_LANDING_PILLARS.actionLink,
            items: [...content.items].sort((a, b) => (a.order || 0) - (b.order || 0)),
          };
        }
      }
      return DEFAULT_LANDING_PILLARS;
    } catch (error) {
      console.error("Error fetching landing pillars section:", error);
      return DEFAULT_LANDING_PILLARS;
    }
  }
);

export const getFacultyLeadershipSection = cache(
  async function getFacultyLeadershipSection(): Promise<FacultyLeadershipContentData> {
    try {
      const block = await getContentBlockByKey("landing.leadership");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<FacultyLeadershipContentData>;
        return {
          name: c.name || DEFAULT_FACULTY_LEADERSHIP.name,
          title: c.title || DEFAULT_FACULTY_LEADERSHIP.title,
          email: c.email || DEFAULT_FACULTY_LEADERSHIP.email,
          photoUrl: c.photoUrl || DEFAULT_FACULTY_LEADERSHIP.photoUrl,
          department: c.department || DEFAULT_FACULTY_LEADERSHIP.department,
          institution: c.institution || DEFAULT_FACULTY_LEADERSHIP.institution,
          address: c.address || DEFAULT_FACULTY_LEADERSHIP.address,
          kicker: c.kicker || DEFAULT_FACULTY_LEADERSHIP.kicker,
          subKicker: c.subKicker || DEFAULT_FACULTY_LEADERSHIP.subKicker,
          heading: c.heading || DEFAULT_FACULTY_LEADERSHIP.heading,
          philosophy: c.philosophy || DEFAULT_FACULTY_LEADERSHIP.philosophy,
          quote: c.quote || DEFAULT_FACULTY_LEADERSHIP.quote,
          quoteAuthor: c.quoteAuthor || DEFAULT_FACULTY_LEADERSHIP.quoteAuthor,
          supervisoryFields:
            Array.isArray(c.supervisoryFields) && c.supervisoryFields.length > 0
              ? c.supervisoryFields
              : DEFAULT_FACULTY_LEADERSHIP.supervisoryFields,
        };
      }
      return DEFAULT_FACULTY_LEADERSHIP;
    } catch (error) {
      console.error("Error fetching faculty leadership section:", error);
      return DEFAULT_FACULTY_LEADERSHIP;
    }
  }
);

export const getResearchCapabilitiesSection = cache(
  async function getResearchCapabilitiesSection(): Promise<ResearchCapabilitiesSectionData> {
    try {
      const block = await getContentBlockByKey("research.capabilities");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<ResearchCapabilitiesSectionData>;
        if (Array.isArray(c.items) && c.items.length > 0) {
          return {
            sectionTitle: c.sectionTitle || DEFAULT_RESEARCH_CAPABILITIES.sectionTitle,
            sectionSubtitle: c.sectionSubtitle || DEFAULT_RESEARCH_CAPABILITIES.sectionSubtitle,
            items: [...c.items].sort((a, b) => (a.order || 0) - (b.order || 0)),
          };
        }
      }
      return DEFAULT_RESEARCH_CAPABILITIES;
    } catch (error) {
      console.error("Error fetching research capabilities section:", error);
      return DEFAULT_RESEARCH_CAPABILITIES;
    }
  }
);

export const getLiquidTreeInnovationSection = cache(
  async function getLiquidTreeInnovationSection(): Promise<LiquidTreeInnovationData> {
    try {
      const block = await getContentBlockByKey("innovation.liquid_tree");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<LiquidTreeInnovationData>;
        return {
          badge: c.badge || DEFAULT_LIQUID_TREE_INNOVATION.badge,
          locationBadge: c.locationBadge || DEFAULT_LIQUID_TREE_INNOVATION.locationBadge,
          title: c.title || DEFAULT_LIQUID_TREE_INNOVATION.title,
          description: c.description || DEFAULT_LIQUID_TREE_INNOVATION.description,
          microalgaeSpecies: c.microalgaeSpecies || DEFAULT_LIQUID_TREE_INNOVATION.microalgaeSpecies,
          volumetricCapacity: c.volumetricCapacity || DEFAULT_LIQUID_TREE_INNOVATION.volumetricCapacity,
          treesEquivalent: c.treesEquivalent || DEFAULT_LIQUID_TREE_INNOVATION.treesEquivalent,
          coverImage: c.coverImage || DEFAULT_LIQUID_TREE_INNOVATION.coverImage,
          unitTag: c.unitTag || DEFAULT_LIQUID_TREE_INNOVATION.unitTag,
          dossierLink: c.dossierLink || DEFAULT_LIQUID_TREE_INNOVATION.dossierLink,
        };
      }
      return DEFAULT_LIQUID_TREE_INNOVATION;
    } catch (error) {
      console.error("Error fetching liquid tree innovation section:", error);
      return DEFAULT_LIQUID_TREE_INNOVATION;
    }
  }
);

export const getHomepageSections = cache(
  async function getHomepageSections(): Promise<HomepageSectionsData> {
    try {
      const block = await getContentBlockByKey("landing.sections");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<HomepageSectionsData>;
        return {
          disciplinesTitle: c.disciplinesTitle || DEFAULT_HOMEPAGE_SECTIONS.disciplinesTitle,
          disciplinesSubtitle: c.disciplinesSubtitle || DEFAULT_HOMEPAGE_SECTIONS.disciplinesSubtitle,
          disciplinesLinkText: c.disciplinesLinkText || DEFAULT_HOMEPAGE_SECTIONS.disciplinesLinkText,
          disciplinesLinkHref: c.disciplinesLinkHref || DEFAULT_HOMEPAGE_SECTIONS.disciplinesLinkHref,

          projectsTitle: c.projectsTitle || DEFAULT_HOMEPAGE_SECTIONS.projectsTitle,
          projectsSubtitle: c.projectsSubtitle || DEFAULT_HOMEPAGE_SECTIONS.projectsSubtitle,
          projectsLinkText: c.projectsLinkText || DEFAULT_HOMEPAGE_SECTIONS.projectsLinkText,
          projectsLinkHref: c.projectsLinkHref || DEFAULT_HOMEPAGE_SECTIONS.projectsLinkHref,

          galleryTitle: c.galleryTitle || DEFAULT_HOMEPAGE_SECTIONS.galleryTitle,
          gallerySubtitle: c.gallerySubtitle || DEFAULT_HOMEPAGE_SECTIONS.gallerySubtitle,
          galleryLinkText: c.galleryLinkText || DEFAULT_HOMEPAGE_SECTIONS.galleryLinkText,
          galleryLinkHref: c.galleryLinkHref || DEFAULT_HOMEPAGE_SECTIONS.galleryLinkHref,
          galleryCards:
            Array.isArray(c.galleryCards) && c.galleryCards.length > 0
              ? [...c.galleryCards].sort((a, b) => (a.order || 0) - (b.order || 0))
              : DEFAULT_HOMEPAGE_SECTIONS.galleryCards,
        };
      }
      return DEFAULT_HOMEPAGE_SECTIONS;
    } catch (error) {
      console.error("Error fetching homepage sections:", error);
      return DEFAULT_HOMEPAGE_SECTIONS;
    }
  }
);

export const getAboutMilestonesSection = cache(
  async function getAboutMilestonesSection(): Promise<AboutMilestonesSectionData> {
    try {
      const block = await getContentBlockByKey("about.milestones");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<AboutMilestonesSectionData>;
        if (Array.isArray(c.items) && c.items.length > 0) {
          return {
            sectionTitle: c.sectionTitle || DEFAULT_ABOUT_MILESTONES.sectionTitle,
            sectionSubtitle: c.sectionSubtitle || DEFAULT_ABOUT_MILESTONES.sectionSubtitle,
            items: [...c.items].sort((a, b) => (a.order || 0) - (b.order || 0)),
          };
        }
      }
      return DEFAULT_ABOUT_MILESTONES;
    } catch (error) {
      console.error("Error fetching about milestones:", error);
      return DEFAULT_ABOUT_MILESTONES;
    }
  }
);

export const getAboutAchievementsSection = cache(
  async function getAboutAchievementsSection(): Promise<AboutAchievementsSectionData> {
    try {
      const block = await getContentBlockByKey("about.achievements");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<AboutAchievementsSectionData>;
        if (Array.isArray(c.items) && c.items.length > 0) {
          return {
            sectionTitle: c.sectionTitle || DEFAULT_ABOUT_ACHIEVEMENTS.sectionTitle,
            sectionSubtitle: c.sectionSubtitle || DEFAULT_ABOUT_ACHIEVEMENTS.sectionSubtitle,
            items: [...c.items].sort((a, b) => (a.order || 0) - (b.order || 0)),
          };
        }
      }
      return DEFAULT_ABOUT_ACHIEVEMENTS;
    } catch (error) {
      console.error("Error fetching about achievements:", error);
      return DEFAULT_ABOUT_ACHIEVEMENTS;
    }
  }
);

export const getAboutFacilitiesSection = cache(
  async function getAboutFacilitiesSection(): Promise<AboutFacilitiesSectionData> {
    try {
      const block = await getContentBlockByKey("about.facilities");
      if (block && typeof block.content === "object" && block.content !== null) {
        const c = block.content as Partial<AboutFacilitiesSectionData>;
        if (Array.isArray(c.items) && c.items.length > 0) {
          return {
            sectionTitle: c.sectionTitle || DEFAULT_ABOUT_FACILITIES.sectionTitle,
            sectionSubtitle: c.sectionSubtitle || DEFAULT_ABOUT_FACILITIES.sectionSubtitle,
            items: [...c.items].sort((a, b) => (a.order || 0) - (b.order || 0)),
          };
        }
      }
      return DEFAULT_ABOUT_FACILITIES;
    } catch (error) {
      console.error("Error fetching about facilities:", error);
      return DEFAULT_ABOUT_FACILITIES;
    }
  }
);
