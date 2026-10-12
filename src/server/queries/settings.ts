import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";

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
    ["content-blocks-all"],
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

export interface LandingPillarItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  imageAlt?: string;
  link?: string;
  order: number;
}

export interface LandingPillarsSectionData {
  sectionTitle: string;
  sectionSubtitle: string;
  sectionBadge?: string;
  actionText?: string;
  actionLink?: string;
  items: LandingPillarItem[];
}

export const DEFAULT_LANDING_PILLARS: LandingPillarsSectionData = {
  sectionTitle: "From Bioresource to Bioproduct",
  sectionSubtitle:
    "The Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University translates biological wealth into scalable biotechnological applications, bringing together scientific expertise to solve environmental, food security, and industrial challenges.",
  sectionBadge: "Core Research Pillars",
  actionText: "Explore history & vision",
  actionLink: "/about",
  items: [
    {
      id: "pillar-1",
      badge: "Core Motto",
      icon: "compass",
      title: "Bioresource to Bioproduct",
      description:
        "Our foundational scientific ethos — converting indigenous natural resources into scalable industrial, agricultural, and healthcare solutions.",
      image: "/images/hero-lab.jpg",
      imageAlt: "Bioresource to Bioproduct Analytical Station",
      link: "/about",
      order: 1,
    },
    {
      id: "pillar-2",
      badge: "Scientific Mission",
      icon: "target",
      title: "Indigenous Bioprospecting",
      description:
        "Isolating, cataloging, and characterizing extremophilic bacterial, fungal, and microalgal strains from diverse ecosystems across Bangladesh.",
      image: "/images/domains/microbial-biotech.jpg",
      imageAlt: "Microbial Culture and Bioprospecting",
      link: "/research",
      order: 2,
    },
    {
      id: "pillar-3",
      badge: "Research Target",
      icon: "flask",
      title: "Bioprocess Kinetics",
      description:
        "Bridging molecular biology with chemical engineering through digital parameter telemetry, Monod kinetic rates, and automated bioreactors.",
      image: "/images/facilities/cleanroom-pilot.jpg",
      imageAlt: "Cleanroom Pilot Fermentation Suite",
      link: "/equipment",
      order: 3,
    },
    {
      id: "pillar-4",
      badge: "Applied Motive",
      icon: "layers",
      title: "Circular Bioeconomy",
      description:
        "Translating benchtop discoveries into field deployments, including 250L urban photobioreactors and compostable agricultural biopolymers.",
      image: "/images/liquid-tree.jpg",
      imageAlt: "250L Urban Liquid-Tree Photobioreactor Column",
      link: "/projects",
      order: 4,
    },
  ],
};

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

export interface FacultyLeadershipContentData {
  name: string;
  title: string;
  email: string;
  photoUrl?: string;
  department: string;
  institution: string;
  address: string;
  kicker: string;
  subKicker: string;
  heading: string;
  philosophy: string;
  quote: string;
  quoteAuthor?: string;
  supervisoryFields: string[];
}

export const DEFAULT_FACULTY_LEADERSHIP: FacultyLeadershipContentData = {
  name: "Prof. Mohammad Shahedur Rahman",
  title: "Principal Investigator & Professor",
  email: "rahmanms@bgeju.edu.bd",
  photoUrl: "/images/team/shahedur-rahman.jpg",
  department: "Department of Biotechnology & Genetic Engineering",
  institution: "Jahangirnagar University",
  address: "Savar, Dhaka-1342, Bangladesh",
  kicker: "Faculty Leadership",
  subKicker: "RESEARCH DIRECTION",
  heading: "Academic Direction & Research Philosophy",
  philosophy:
    "Professor Rahman directs the Bioresources Technology and Industrial Biotechnology Laboratory within the Department of Biotechnology & Genetic Engineering. His research program investigates microbial biodiversity bioprospecting, fermentation kinetics, and urban microalgae photobioreactors, training doctoral, master's, and undergraduate thesis scholars in translational biotechnology.",
  quote:
    "Our mission is to translate Bangladesh's indigenous biological wealth into scalable biotechnological solutions that benefit our industry, environment, and scientific community.",
  quoteAuthor: "Prof. Mohammad Shahedur Rahman",
  supervisoryFields: [
    "Microbial Enzyme Kinetics",
    "Microalgae Photobioreactors",
    "Bionanotechnology",
    "Translational Bioprocesses",
    "Biopolymer Matrices",
  ],
};

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

export interface ResearchCapabilityItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ResearchCapabilitiesSectionData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: ResearchCapabilityItem[];
}

export const DEFAULT_RESEARCH_CAPABILITIES: ResearchCapabilitiesSectionData = {
  sectionTitle: "Advanced Research Capabilities & Instrumentation",
  sectionSubtitle:
    "Integrated technical systems spanning upstream microbial cultivation, parameter telemetry, and downstream bioresource refining.",
  items: [
    {
      id: "cap-1",
      title: "Kinetic Fermentation Modeling",
      description:
        "Multi-parameter digital monitoring of Monod kinetic rates, oxygen uptake rates (OUR), and volumetric productivity in stirred-tank fermentors.",
      order: 1,
    },
    {
      id: "cap-2",
      title: "Photobioreactor Engineering",
      description:
        "Gas sparging dynamics, photosynthetic photon flux density (PPFD) regulation, and high-density microalgal cultivation for carbon capture.",
      order: 2,
    },
    {
      id: "cap-3",
      title: "Multi-Enzyme Immobilization",
      description:
        "Covalent bonding onto natural polysaccharide and chitosan carriers to enhance thermal stability and catalytic reusability over 20+ cycles.",
      order: 3,
    },
    {
      id: "cap-4",
      title: "Indigenous Bioprospecting",
      description:
        "Systematic screening of extremophilic and wetland bacterial isolates across Bangladesh for novel hydrolytic enzymes and antimicrobial metabolites.",
      order: 4,
    },
  ],
};

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

export interface LiquidTreeInnovationData {
  badge: string;
  locationBadge: string;
  title: string;
  description: string;
  microalgaeSpecies: string;
  volumetricCapacity: string;
  treesEquivalent: string;
  coverImage: string;
  unitTag: string;
  dossierLink: string;
}

export const DEFAULT_LIQUID_TREE_INNOVATION: LiquidTreeInnovationData = {
  badge: "Flagship Research Initiative",
  locationBadge: "Campus Deployment · Savar",
  title: "250L Liquid-Tree Urban Microalgae Photobioreactor",
  description:
    "Pioneering Bangladesh's first operational urban microalgal carbon sequestration column. Operating on the Jahangirnagar University campus, the unit continuously fixes ambient CO2 and produces clean oxygen equivalent to two mature 10-year-old trees.",
  microalgaeSpecies: "Chlorella vulgaris",
  volumetricCapacity: "250 Liters",
  treesEquivalent: "2 mature trees",
  coverImage: "/images/domains/algae-carbon.jpg",
  unitTag: "Operational Unit #01 · Savar Campus",
  dossierLink: "/projects/liquid-tree-photobioreactor",
};

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

// --- HOMEPAGE DYNAMIC SECTIONS & GALLERY PREVIEWS ---
export interface HomepageGalleryPreviewItem {
  id: string;
  title: string;
  tag: string;
  photo: string;
  alt: string;
  order: number;
}

export interface HomepageSectionsData {
  disciplinesTitle: string;
  disciplinesSubtitle: string;
  disciplinesLinkText: string;
  disciplinesLinkHref: string;

  projectsTitle: string;
  projectsSubtitle: string;
  projectsLinkText: string;
  projectsLinkHref: string;

  galleryTitle: string;
  gallerySubtitle: string;
  galleryLinkText: string;
  galleryLinkHref: string;
  galleryCards: HomepageGalleryPreviewItem[];
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionsData = {
  disciplinesTitle: "Core Research Disciplines",
  disciplinesSubtitle:
    "From indigenous microbial screening to continuous photobioreactor operation, our investigations bridge fundamental biological discovery and scalable industrial application.",
  disciplinesLinkText: "View all 8 divisions",
  disciplinesLinkHref: "/research",

  projectsTitle: "Flagship Research & Field Deployments",
  projectsSubtitle:
    "Translating fundamental bioresource research into functional prototypes, bioprocess platforms, and sustainable materials.",
  projectsLinkText: "View all active projects",
  projectsLinkHref: "/projects",

  galleryTitle: "Laboratory Facilities in Action",
  gallerySubtitle:
    "Authentic photographic archive documenting our bioreactor pilots, microbial cultures, and experimental benchwork.",
  galleryLinkText: "View complete archive",
  galleryLinkHref: "/gallery",
  galleryCards: [
    {
      id: "preview-1",
      title: "Liquid-Tree Outdoor Column",
      tag: "Pilot Facility",
      photo: "/images/liquid-tree.jpg",
      alt: "250-Liter Liquid-Tree photobioreactor column deployed outdoors at Jahangirnagar University",
      order: 1,
    },
    {
      id: "preview-2",
      title: "Cleanroom Bioprocessing Suite",
      tag: "Pilot Cleanroom",
      photo: "/images/facilities/cleanroom-pilot.jpg",
      alt: "Cleanroom pilot fermentation facility with stainless steel bioreactor trains",
      order: 2,
    },
    {
      id: "preview-3",
      title: "Automated Stirred-Tank Bioreactor",
      tag: "Fermentation Kinetics",
      photo: "/images/fermentation.jpg",
      alt: "Sartorius benchtop fermenter with telemetry display",
      order: 3,
    },
    {
      id: "preview-4",
      title: "Biodegradable Composite Matrices",
      tag: "Biomaterials",
      photo: "/images/bioplastics.jpg",
      alt: "Petri dish testing of starch-chitosan composite biodegradable films",
      order: 4,
    },
  ],
};

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

// --- ABOUT PAGE: HISTORICAL MILESTONES ---
export interface AboutMilestoneItem {
  id: string;
  year: string;
  title: string;
  tag: string;
  description: string;
  order: number;
}

export interface AboutMilestonesSectionData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: AboutMilestoneItem[];
}

export const DEFAULT_ABOUT_MILESTONES: AboutMilestonesSectionData = {
  sectionTitle: "Chronological Milestones & Scientific Evolution",
  sectionSubtitle:
    "Key achievements charting our development from indigenous bioprospecting initiatives to university-wide translational biotechnology deployments.",
  items: [
    {
      id: "m-1",
      year: "2012",
      title: "Laboratory Foundation & Inception",
      tag: "Established",
      description:
        "Founded by Professor Mohammad Shahedur Rahman within the Department of Biotechnology & Genetic Engineering at Jahangirnagar University. Initiated systematic bioprospecting of indigenous microbial strains from wetland and riverine ecosystems across Bangladesh.",
      order: 1,
    },
    {
      id: "m-2",
      year: "2016",
      title: "Bioprocess Kinetics & Fermentation Suite",
      tag: "Expansion",
      description:
        "Commissioned automated 5-liter stirred-tank bioreactor systems (Sartorius Biostat), establishing closed-loop dissolved oxygen control and fermentation kinetic modeling for industrial enzymes.",
      order: 2,
    },
    {
      id: "m-3",
      year: "2019",
      title: "Enzyme Immobilization Breakthrough",
      tag: "Research Milestone",
      description:
        "Engineered novel multi-enzyme immobilized matrices for the production of high-fructose corn syrup (HFCS) and secondary metabolite conversion, bridging molecular chemistry and industrial catalysis.",
      order: 3,
    },
    {
      id: "m-4",
      year: "2021",
      title: "Environmental Biosorption & Genomic Surveillance",
      tag: "Civic Contribution",
      description:
        "Pioneered microbial biosorption filters for hexavalent chromium in Savar industrial runoff and contributed to national SARS-CoV-2 genomic epidemiology sequencing.",
      order: 4,
    },
    {
      id: "m-5",
      year: "2024",
      title: "250L Liquid-Tree Photobioreactor Deployment",
      tag: "Flagship Innovation",
      description:
        "Constructed and deployed Bangladesh's first operational 250-liter microalgal photobioreactor column, achieving continuous volumetric carbon sequestration equivalent to 2 mature urban trees.",
      order: 5,
    },
    {
      id: "m-6",
      year: "2026",
      title: "Circular Bioeconomy & Biopolymer Scaling",
      tag: "Current Horizon",
      description:
        "Expanding translational research into compostable agricultural-waste bioplastics, microbial biofertilizers, and high-cell-density pilot production for local industrial adoption.",
      order: 6,
    },
  ],
};

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

// --- ABOUT PAGE: IMPACT & ACHIEVEMENTS METRICS ---
export interface AboutAchievementItem {
  id: string;
  metric: string;
  label: string;
  detail: string;
  iconKey: "calendar" | "flask" | "award" | "users" | "cpu" | "microscope" | "layers" | "sparkles";
  order: number;
}

export interface AboutAchievementsSectionData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: AboutAchievementItem[];
}

export const DEFAULT_ABOUT_ACHIEVEMENTS: AboutAchievementsSectionData = {
  sectionTitle: "Cumulative Research & Institutional Impact",
  sectionSubtitle: "Quantitative overview of academic training, scientific publications, and pilot deployments.",
  items: [
    {
      id: "ach-1",
      iconKey: "calendar",
      metric: "2012",
      label: "Year Established",
      detail: "14+ years of continuous translational biotechnology research at Jahangirnagar University.",
      order: 1,
    },
    {
      id: "ach-2",
      iconKey: "flask",
      metric: "250 L",
      label: "Liquid-Tree Photobioreactor",
      detail: "First operational urban microalgae carbon capture and oxygenation column in Bangladesh.",
      order: 2,
    },
    {
      id: "ach-3",
      iconKey: "award",
      metric: "15+",
      label: "Peer-Reviewed Discoveries",
      detail: "Published across high-impact international journals indexed in PubMed, Elsevier, and Springer.",
      order: 3,
    },
    {
      id: "ach-4",
      iconKey: "users",
      metric: "50+",
      label: "Alumni & Scholars Trained",
      detail: "B.Sc., M.Sc., and Ph.D. scholars now serving across global academic and industrial laboratories.",
      order: 4,
    },
  ],
};

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

// --- ABOUT PAGE: CORE FACILITIES ---
export interface AboutFacilityItem {
  id: string;
  title: string;
  description: string;
  iconKey: "flask" | "cpu" | "microscope" | "layers" | "sparkles";
  order: number;
}

export interface AboutFacilitiesSectionData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: AboutFacilityItem[];
}

export const DEFAULT_ABOUT_FACILITIES: AboutFacilitiesSectionData = {
  sectionTitle: "Laboratory Physical Infrastructure & Specialized Suites",
  sectionSubtitle: "Dedicated research spaces designed for microbial culture, bioprocess kinetics, and chemical instrumentation.",
  items: [
    {
      id: "fac-1",
      iconKey: "flask",
      title: "Fermentation Kinetics Cleanroom",
      description:
        "Equipped with automated stirred-tank bioreactor systems with digital control loops for dissolved oxygen, agitation, pH, and nutrient feed kinetics.",
      order: 1,
    },
    {
      id: "fac-2",
      iconKey: "cpu",
      title: "Liquid-Tree Photobioreactor Yard",
      description:
        "Pilot-scale cultivation columns utilizing Chlorella vulgaris for volumetric carbon mitigation, microalgal biomass harvesting, and urban oxygenation.",
      order: 2,
    },
    {
      id: "fac-3",
      iconKey: "microscope",
      title: "Microbial Culture & Cryo Repository",
      description:
        "Deep-freeze -80°C strain preservation bank cataloging indigenous bacterial, fungal, and microalgal isolates collected from diverse ecological zones.",
      order: 3,
    },
    {
      id: "fac-4",
      iconKey: "layers",
      title: "Biomaterials Characterization Station",
      description:
        "Analytical suite for tensile, degradation, water absorption, and spectrophotometric testing of bioplastic and edible composite films.",
      order: 4,
    },
  ],
};

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

