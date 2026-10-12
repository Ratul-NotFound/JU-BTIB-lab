"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { updateSiteSettings, updateContentBlock } from "@/server/actions/settings";
import { changePasswordAction } from "@/server/actions/auth";
import { MediaPicker } from "@/components/admin/media-picker";
import Image from "next/image";
import {
  Save,
  Image as ImageIcon,
  Sparkles,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  UserCheck,
  GraduationCap,
  Award,
  Compass,
  Microscope,
  FolderKanban,
  Clock,
  Camera,
} from "lucide-react";
import {
  type LandingPillarItem,
  type LandingPillarsSectionData,
  DEFAULT_LANDING_PILLARS,
  type FacultyLeadershipContentData,
  DEFAULT_FACULTY_LEADERSHIP,
  type LiquidTreeInnovationData,
  DEFAULT_LIQUID_TREE_INNOVATION,
  type ResearchCapabilitiesSectionData,
  type ResearchCapabilityItem,
  DEFAULT_RESEARCH_CAPABILITIES,
  type HomepageSectionsData,
  type HomepageGalleryPreviewItem,
  DEFAULT_HOMEPAGE_SECTIONS,
  type AboutMilestonesSectionData,
  type AboutMilestoneItem,
  DEFAULT_ABOUT_MILESTONES,
  type AboutAchievementsSectionData,
  type AboutAchievementItem,
  DEFAULT_ABOUT_ACHIEVEMENTS,
  type AboutFacilitiesSectionData,
  type AboutFacilityItem,
  DEFAULT_ABOUT_FACILITIES,
} from "@/types/settings-sections";
import type { Prisma } from "@prisma/client";

const ABOUT_ICON_OPTIONS = [
  { value: "calendar", label: "Calendar / Established & Timeline" },
  { value: "flask", label: "Flask / Bioprocess & Reaction" },
  { value: "award", label: "Award / Excellence & Peer Review" },
  { value: "users", label: "Users / Alumni & Scholars" },
  { value: "cpu", label: "CPU / Pilot Systems & Automation" },
  { value: "microscope", label: "Microscope / Analytical Suite" },
  { value: "layers", label: "Layers / Biomaterials & Platforms" },
  { value: "sparkles", label: "Sparkles / Innovation & Flagship" },
];

const PILLAR_ICONS = [
  { value: "compass", label: "Compass / Navigation & Motto" },
  { value: "target", label: "Target / Scientific Mission" },
  { value: "flask", label: "Flask / Bioprocess & Laboratory" },
  { value: "layers", label: "Layers / Circular Bioeconomy & Platforms" },
  { value: "microscope", label: "Microscope / Analytical Prospecting" },
  { value: "dna", label: "DNA / Genetics & Molecular Biology" },
  { value: "sprout", label: "Sprout / Bioresources & Agro-biotech" },
  { value: "atom", label: "Atom / Nanotechnology & Physics" },
  { value: "sparkles", label: "Sparkles / Innovation & Flagship" },
  { value: "award", label: "Award / Excellence & Accreditations" },
  { value: "globe", label: "Globe / Circular Economy & Deployment" },
  { value: "zap", label: "Zap / Kinetics & Parameter Telemetry" },
  { value: "activity", label: "Activity / Biomedicine & Healthcare" },
  { value: "cpu", label: "CPU / Automated Bioreactor Systems" },
  { value: "book", label: "Book / Education & Heritage" },
];

export interface HeroSlideItem {
  id: string;
  src: string;
  alt: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: "default-slide-1",
    src: "/images/hero-lab.jpg",
    alt: "Bioresources Technology and Industrial Biotechnology Laboratory Analytical Station",
  },
  {
    id: "default-slide-2",
    src: "/images/liquid-tree.jpg",
    alt: "250L Urban Liquid-Tree Photobioreactor Column at Jahangirnagar University",
  },
  {
    id: "default-slide-3",
    src: "/images/facilities/cleanroom-pilot.jpg",
    alt: "Cleanroom Pilot Fermentation Facility with Bioreactor Trains",
  },
  {
    id: "default-slide-4",
    src: "/images/fermentation.jpg",
    alt: "Automated Stirred-Tank Fermenters with Digital Bioprocess Controls",
  },
  {
    id: "default-slide-5",
    src: "/images/bioplastics.jpg",
    alt: "Biodegradable Composite Biomaterial Matrices & Biopolymer Packaging",
  },
];

interface SiteSettingsData {
  id: string;
  labName: string;
  labShortName: string;
  departmentName: string;
  institutionName: string;
  address: string;
  contactEmail: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroBgImage?: string | null;
  heroBgImageAlt?: string | null;
  aboutHeroImage?: string | null;
  liquidTreeImage?: string | null;
  heritageCampusImage?: string | null;
  labIntroImage?: string | null;
  labLogoUrl?: string | null;
  labLogoWhiteUrl?: string | null;
  universityLogoUrl?: string | null;
  universityLogoWhiteUrl?: string | null;
  bannerImages?: unknown;
}

interface ContentBlockData {
  id: string;
  key: string;
  title: string;
  content: unknown;
}

export function SettingsClient({
  initialSettings,
  initialBlocks,
  initialLandingPillars,
  initialHomepageSections,
  initialAboutMilestones,
  initialAboutAchievements,
  initialAboutFacilities,
  initialResearchCapabilities,
  initialLeadership,
  initialLiquidTree,
  initialTab,
}: {
  initialSettings: SiteSettingsData | null;
  initialBlocks: ContentBlockData[];
  initialLandingPillars?: LandingPillarsSectionData | null;
  initialHomepageSections?: HomepageSectionsData | null;
  initialAboutMilestones?: AboutMilestonesSectionData | null;
  initialAboutAchievements?: AboutAchievementsSectionData | null;
  initialAboutFacilities?: AboutFacilitiesSectionData | null;
  initialResearchCapabilities?: ResearchCapabilitiesSectionData | null;
  initialLeadership?: FacultyLeadershipContentData | null;
  initialLiquidTree?: LiquidTreeInnovationData | null;
  initialTab?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const normalizeTab = (t?: string) => {
    if (t === "landing") return "home";
    if (t === "innovation") return "research_page";
    return t || "identity";
  };

  const [activeTab, setActiveTab] = React.useState(normalizeTab(initialTab));

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  // PI Leadership & Academic Philosophy State
  const [piName, setPiName] = React.useState(initialLeadership?.name || DEFAULT_FACULTY_LEADERSHIP.name);
  const [piTitle, setPiTitle] = React.useState(initialLeadership?.title || DEFAULT_FACULTY_LEADERSHIP.title);
  const [piEmail, setPiEmail] = React.useState(initialLeadership?.email || DEFAULT_FACULTY_LEADERSHIP.email);
  const [piPhotoUrl, setPiPhotoUrl] = React.useState(initialLeadership?.photoUrl || DEFAULT_FACULTY_LEADERSHIP.photoUrl || "");
  const [piDepartment, setPiDepartment] = React.useState(initialLeadership?.department || DEFAULT_FACULTY_LEADERSHIP.department);
  const [piInstitution, setPiInstitution] = React.useState(initialLeadership?.institution || DEFAULT_FACULTY_LEADERSHIP.institution);
  const [piAddress, setPiAddress] = React.useState(initialLeadership?.address || DEFAULT_FACULTY_LEADERSHIP.address);
  const [piKicker, setPiKicker] = React.useState(initialLeadership?.kicker || DEFAULT_FACULTY_LEADERSHIP.kicker);
  const [piSubKicker, setPiSubKicker] = React.useState(initialLeadership?.subKicker || DEFAULT_FACULTY_LEADERSHIP.subKicker);
  const [piHeading, setPiHeading] = React.useState(initialLeadership?.heading || DEFAULT_FACULTY_LEADERSHIP.heading);
  const [piPhilosophy, setPiPhilosophy] = React.useState(initialLeadership?.philosophy || DEFAULT_FACULTY_LEADERSHIP.philosophy);
  const [piQuote, setPiQuote] = React.useState(initialLeadership?.quote || DEFAULT_FACULTY_LEADERSHIP.quote);
  const [piQuoteAuthor, setPiQuoteAuthor] = React.useState(initialLeadership?.quoteAuthor || DEFAULT_FACULTY_LEADERSHIP.quoteAuthor || "");
  const [piSupervisoryFieldsStr, setPiSupervisoryFieldsStr] = React.useState(
    (initialLeadership?.supervisoryFields || DEFAULT_FACULTY_LEADERSHIP.supervisoryFields).join(", ")
  );
  const [savingLeadership, setSavingLeadership] = React.useState(false);

  // Flagship Liquid-Tree Photobioreactor Innovation State
  const [ltBadge, setLtBadge] = React.useState(initialLiquidTree?.badge || DEFAULT_LIQUID_TREE_INNOVATION.badge);
  const [ltLocationBadge, setLtLocationBadge] = React.useState(initialLiquidTree?.locationBadge || DEFAULT_LIQUID_TREE_INNOVATION.locationBadge);
  const [ltTitle, setLtTitle] = React.useState(initialLiquidTree?.title || DEFAULT_LIQUID_TREE_INNOVATION.title);
  const [ltDescription, setLtDescription] = React.useState(initialLiquidTree?.description || DEFAULT_LIQUID_TREE_INNOVATION.description);
  const [ltSpecies, setLtSpecies] = React.useState(initialLiquidTree?.microalgaeSpecies || DEFAULT_LIQUID_TREE_INNOVATION.microalgaeSpecies);
  const [ltVolume, setLtVolume] = React.useState(initialLiquidTree?.volumetricCapacity || DEFAULT_LIQUID_TREE_INNOVATION.volumetricCapacity);
  const [ltTrees, setLtTrees] = React.useState(initialLiquidTree?.treesEquivalent || DEFAULT_LIQUID_TREE_INNOVATION.treesEquivalent);
  const [ltImage, setLtImage] = React.useState(initialLiquidTree?.coverImage || DEFAULT_LIQUID_TREE_INNOVATION.coverImage);
  const [ltUnitTag, setLtUnitTag] = React.useState(initialLiquidTree?.unitTag || DEFAULT_LIQUID_TREE_INNOVATION.unitTag);
  const [ltDossierLink, setLtDossierLink] = React.useState(initialLiquidTree?.dossierLink || DEFAULT_LIQUID_TREE_INNOVATION.dossierLink);
  const [savingLiquidTree, setSavingLiquidTree] = React.useState(false);

  // Landing Page Sections & Pillars State
  const [landingSectionTitle, setLandingSectionTitle] = React.useState(
    initialLandingPillars?.sectionTitle || DEFAULT_LANDING_PILLARS.sectionTitle
  );
  const [landingSectionSubtitle, setLandingSectionSubtitle] = React.useState(
    initialLandingPillars?.sectionSubtitle || DEFAULT_LANDING_PILLARS.sectionSubtitle
  );
  const [landingSectionBadge, setLandingSectionBadge] = React.useState(
    initialLandingPillars?.sectionBadge || DEFAULT_LANDING_PILLARS.sectionBadge || "Core Research Pillars"
  );
  const [landingActionText, setLandingActionText] = React.useState(
    initialLandingPillars?.actionText || DEFAULT_LANDING_PILLARS.actionText || "Explore history & vision"
  );
  const [landingActionLink, setLandingActionLink] = React.useState(
    initialLandingPillars?.actionLink || DEFAULT_LANDING_PILLARS.actionLink || "/about"
  );
  const [pillarCards, setPillarCards] = React.useState<LandingPillarItem[]>(() => {
    if (initialLandingPillars?.items && initialLandingPillars.items.length > 0) {
      return initialLandingPillars.items;
    }
    return DEFAULT_LANDING_PILLARS.items;
  });
  const [savingLanding, setSavingLanding] = React.useState(false);

  const handleAddPillarCard = () => {
    const newId = `pillar-${Date.now()}`;
    const newCard: LandingPillarItem = {
      id: newId,
      badge: "Scientific Focus",
      title: "New Research Tenet",
      description: "Briefly explain the objectives, methodology, and industrial application of this research pillar.",
      icon: "flask",
      image: "",
      imageAlt: "",
      link: "/research",
      order: pillarCards.length + 1,
    };
    setPillarCards((prev) => [...prev, newCard]);
    toast("Added new pillar card. Don't forget to click 'Save Landing Sections' to apply changes.", "info");
  };

  const handleUpdatePillarCard = (idx: number, field: keyof LandingPillarItem, val: string | number) => {
    setPillarCards((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeletePillarCard = (idx: number) => {
    setPillarCards((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.map((item, i) => ({ ...item, order: i + 1 }));
    });
    toast("Pillar card removed. Click 'Save Landing Sections' to commit.", "info");
  };

  const handleMovePillarCard = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= pillarCards.length) return;
    setPillarCards((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((item, i) => ({ ...item, order: i + 1 }));
    });
  };

  const handleRestoreDefaultPillars = () => {
    if (window.confirm("Restore default laboratory pillars (Bioresource to Bioproduct, Indigenous Bioprospecting, Bioprocess Kinetics, Circular Bioeconomy)? Any unsaved custom cards will be replaced.")) {
      setLandingSectionTitle(DEFAULT_LANDING_PILLARS.sectionTitle);
      setLandingSectionSubtitle(DEFAULT_LANDING_PILLARS.sectionSubtitle);
      setLandingSectionBadge(DEFAULT_LANDING_PILLARS.sectionBadge || "Core Research Pillars");
      setLandingActionText(DEFAULT_LANDING_PILLARS.actionText || "Explore history & vision");
      setLandingActionLink(DEFAULT_LANDING_PILLARS.actionLink || "/about");
      setPillarCards(DEFAULT_LANDING_PILLARS.items);
      toast("Default pillars loaded. Click 'Save Landing Sections' to commit.", "info");
    }
  };

  const handleSaveLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLanding(true);
    try {
      const payload: LandingPillarsSectionData = {
        sectionTitle: landingSectionTitle.trim(),
        sectionSubtitle: landingSectionSubtitle.trim(),
        sectionBadge: landingSectionBadge.trim(),
        actionText: landingActionText.trim(),
        actionLink: landingActionLink.trim(),
        items: pillarCards.map((c, i) => ({
          id: c.id || `pillar-${i + 1}`,
          badge: c.badge || "",
          title: c.title || "",
          description: c.description || "",
          icon: c.icon || "compass",
          image: c.image || "",
          imageAlt: c.imageAlt || c.title || "",
          link: c.link || "",
          order: i + 1,
        })),
      };

      await updateContentBlock({
        key: "landing.pillars",
        title: "Landing Page Pillars & Highlights",
        content: payload,
      });

      toast("Landing page sections & pillars saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save landing page sections", "error");
    } finally {
      setSavingLanding(false);
    }
  };

  const handleSaveLeadership = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLeadership(true);
    try {
      const payload: FacultyLeadershipContentData = {
        name: piName.trim(),
        title: piTitle.trim(),
        email: piEmail.trim(),
        photoUrl: piPhotoUrl.trim() || undefined,
        department: piDepartment.trim(),
        institution: piInstitution.trim(),
        address: piAddress.trim(),
        kicker: piKicker.trim(),
        subKicker: piSubKicker.trim(),
        heading: piHeading.trim(),
        philosophy: piPhilosophy.trim(),
        quote: piQuote.trim(),
        quoteAuthor: piQuoteAuthor.trim() || undefined,
        supervisoryFields: piSupervisoryFieldsStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await updateContentBlock({
        key: "landing.leadership",
        title: "PI Leadership & Philosophy Section",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("PI Leadership & Academic Direction saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save PI leadership", "error");
    } finally {
      setSavingLeadership(false);
    }
  };

  const handleSaveLiquidTree = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLiquidTree(true);
    try {
      const payload: LiquidTreeInnovationData = {
        badge: ltBadge.trim(),
        locationBadge: ltLocationBadge.trim(),
        title: ltTitle.trim(),
        description: ltDescription.trim(),
        microalgaeSpecies: ltSpecies.trim(),
        volumetricCapacity: ltVolume.trim(),
        treesEquivalent: ltTrees.trim(),
        coverImage: ltImage.trim() || "/images/domains/algae-carbon.jpg",
        unitTag: ltUnitTag.trim(),
        dossierLink: ltDossierLink.trim() || "/projects/liquid-tree-photobioreactor",
      };

      await updateContentBlock({
        key: "innovation.liquid_tree",
        title: "Flagship Liquid-Tree Photobioreactor Feature",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("Liquid-Tree Photobioreactor specifications saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save Liquid-Tree data", "error");
    } finally {
      setSavingLiquidTree(false);
    }
  };

  // --- HOMEPAGE ADDITIONAL SECTIONS STATE & HANDLERS ---
  const [disciplinesTitle, setDisciplinesTitle] = React.useState(
    initialHomepageSections?.disciplinesTitle || DEFAULT_HOMEPAGE_SECTIONS.disciplinesTitle
  );
  const [disciplinesSubtitle, setDisciplinesSubtitle] = React.useState(
    initialHomepageSections?.disciplinesSubtitle || DEFAULT_HOMEPAGE_SECTIONS.disciplinesSubtitle
  );
  const [disciplinesLinkText, setDisciplinesLinkText] = React.useState(
    initialHomepageSections?.disciplinesLinkText || DEFAULT_HOMEPAGE_SECTIONS.disciplinesLinkText
  );
  const [disciplinesLinkHref, setDisciplinesLinkHref] = React.useState(
    initialHomepageSections?.disciplinesLinkHref || DEFAULT_HOMEPAGE_SECTIONS.disciplinesLinkHref
  );

  const [projectsTitle, setProjectsTitle] = React.useState(
    initialHomepageSections?.projectsTitle || DEFAULT_HOMEPAGE_SECTIONS.projectsTitle
  );
  const [projectsSubtitle, setProjectsSubtitle] = React.useState(
    initialHomepageSections?.projectsSubtitle || DEFAULT_HOMEPAGE_SECTIONS.projectsSubtitle
  );
  const [projectsLinkText, setProjectsLinkText] = React.useState(
    initialHomepageSections?.projectsLinkText || DEFAULT_HOMEPAGE_SECTIONS.projectsLinkText
  );
  const [projectsLinkHref, setProjectsLinkHref] = React.useState(
    initialHomepageSections?.projectsLinkHref || DEFAULT_HOMEPAGE_SECTIONS.projectsLinkHref
  );

  const [homeGalleryTitle, setHomeGalleryTitle] = React.useState(
    initialHomepageSections?.galleryTitle || DEFAULT_HOMEPAGE_SECTIONS.galleryTitle
  );
  const [homeGallerySubtitle, setHomeGallerySubtitle] = React.useState(
    initialHomepageSections?.gallerySubtitle || DEFAULT_HOMEPAGE_SECTIONS.gallerySubtitle
  );
  const [homeGalleryLinkText, setHomeGalleryLinkText] = React.useState(
    initialHomepageSections?.galleryLinkText || DEFAULT_HOMEPAGE_SECTIONS.galleryLinkText
  );
  const [homeGalleryLinkHref, setHomeGalleryLinkHref] = React.useState(
    initialHomepageSections?.galleryLinkHref || DEFAULT_HOMEPAGE_SECTIONS.galleryLinkHref
  );
  const [homeGalleryCards, setHomeGalleryCards] = React.useState<HomepageGalleryPreviewItem[]>(() => {
    if (initialHomepageSections?.galleryCards && initialHomepageSections.galleryCards.length > 0) {
      return initialHomepageSections.galleryCards;
    }
    return DEFAULT_HOMEPAGE_SECTIONS.galleryCards;
  });
  const [savingHomepageSections, setSavingHomepageSections] = React.useState(false);

  const handleAddGalleryCard = () => {
    const newCard: HomepageGalleryPreviewItem = {
      id: `gallery-card-${Date.now()}`,
      title: "New Facility Showcase",
      tag: "Research Suite",
      photo: "/images/fermentation.jpg",
      alt: "Laboratory instrumentation showcase",
      order: homeGalleryCards.length + 1,
    };
    setHomeGalleryCards((prev) => [...prev, newCard]);
    toast("Added new gallery card. Remember to click 'Save Homepage Additional Sections' to persist.", "info");
  };

  const handleUpdateGalleryCard = (idx: number, field: keyof HomepageGalleryPreviewItem, val: string | number) => {
    setHomeGalleryCards((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteGalleryCard = (idx: number) => {
    setHomeGalleryCards((prev) => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, order: i + 1 })));
    toast("Gallery card removed.", "info");
  };

  const handleMoveGalleryCard = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= homeGalleryCards.length) return;
    setHomeGalleryCards((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  };

  const handleSaveHomepageSections = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHomepageSections(true);
    try {
      const payload: HomepageSectionsData = {
        disciplinesTitle: disciplinesTitle.trim(),
        disciplinesSubtitle: disciplinesSubtitle.trim(),
        disciplinesLinkText: disciplinesLinkText.trim(),
        disciplinesLinkHref: disciplinesLinkHref.trim(),
        projectsTitle: projectsTitle.trim(),
        projectsSubtitle: projectsSubtitle.trim(),
        projectsLinkText: projectsLinkText.trim(),
        projectsLinkHref: projectsLinkHref.trim(),
        galleryTitle: homeGalleryTitle.trim(),
        gallerySubtitle: homeGallerySubtitle.trim(),
        galleryLinkText: homeGalleryLinkText.trim(),
        galleryLinkHref: homeGalleryLinkHref.trim(),
        galleryCards: homeGalleryCards.map((c, i) => ({
          id: c.id || `preview-${i + 1}`,
          title: c.title.trim(),
          tag: c.tag.trim(),
          photo: c.photo.trim(),
          alt: c.alt.trim(),
          order: i + 1,
        })),
      };

      await updateContentBlock({
        key: "landing.sections",
        title: "Homepage Disciplines, Projects & Gallery Showcase",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("Homepage sections and gallery showcase saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save homepage sections", "error");
    } finally {
      setSavingHomepageSections(false);
    }
  };

  // --- ABOUT PAGE MILESTONES STATE & HANDLERS ---
  const [milestonesTitle, setMilestonesTitle] = React.useState(
    initialAboutMilestones?.sectionTitle || DEFAULT_ABOUT_MILESTONES.sectionTitle
  );
  const [milestonesSubtitle, setMilestonesSubtitle] = React.useState(
    initialAboutMilestones?.sectionSubtitle || DEFAULT_ABOUT_MILESTONES.sectionSubtitle
  );
  const [milestonesList, setMilestonesList] = React.useState<AboutMilestoneItem[]>(() => {
    if (initialAboutMilestones?.items && initialAboutMilestones.items.length > 0) {
      return initialAboutMilestones.items;
    }
    return DEFAULT_ABOUT_MILESTONES.items;
  });
  const [savingMilestones, setSavingMilestones] = React.useState(false);

  const handleAddMilestone = () => {
    const newM: AboutMilestoneItem = {
      id: `milestone-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      title: "New Research Milestone",
      tag: "Breakthrough",
      description: "Describe the historic discovery, grant inception, or laboratory expansion.",
      order: milestonesList.length + 1,
    };
    setMilestonesList((prev) => [...prev, newM]);
    toast("Added new milestone card.", "info");
  };

  const handleUpdateMilestone = (idx: number, field: keyof AboutMilestoneItem, val: string | number) => {
    setMilestonesList((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteMilestone = (idx: number) => {
    setMilestonesList((prev) => prev.filter((_, i) => i !== idx).map((m, i) => ({ ...m, order: i + 1 })));
    toast("Milestone removed.", "info");
  };

  const handleMoveMilestone = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= milestonesList.length) return;
    setMilestonesList((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((m, i) => ({ ...m, order: i + 1 }));
    });
  };

  const handleSaveAboutMilestones = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMilestones(true);
    try {
      const payload: AboutMilestonesSectionData = {
        sectionTitle: milestonesTitle.trim(),
        sectionSubtitle: milestonesSubtitle.trim(),
        items: milestonesList.map((m, i) => ({
          id: m.id || `m-${i + 1}`,
          year: m.year.trim(),
          title: m.title.trim(),
          tag: m.tag.trim(),
          description: m.description.trim(),
          order: i + 1,
        })),
      };

      await updateContentBlock({
        key: "about.milestones",
        title: "About Page Historical Milestones",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("About page chronological milestones saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save milestones", "error");
    } finally {
      setSavingMilestones(false);
    }
  };

  // --- ABOUT PAGE ACHIEVEMENTS / IMPACT METRICS ---
  const [achievementsTitle, setAchievementsTitle] = React.useState(
    initialAboutAchievements?.sectionTitle || DEFAULT_ABOUT_ACHIEVEMENTS.sectionTitle
  );
  const [achievementsSubtitle, setAchievementsSubtitle] = React.useState(
    initialAboutAchievements?.sectionSubtitle || DEFAULT_ABOUT_ACHIEVEMENTS.sectionSubtitle
  );
  const [achievementsList, setAchievementsList] = React.useState<AboutAchievementItem[]>(() => {
    if (initialAboutAchievements?.items && initialAboutAchievements.items.length > 0) {
      return initialAboutAchievements.items;
    }
    return DEFAULT_ABOUT_ACHIEVEMENTS.items;
  });
  const [savingAchievements, setSavingAchievements] = React.useState(false);

  const handleAddAchievement = () => {
    const newA: AboutAchievementItem = {
      id: `ach-${Date.now()}`,
      metric: "100+",
      label: "Scientific Landmark",
      detail: "Quantifiable impact metric or achievement details.",
      iconKey: "award",
      order: achievementsList.length + 1,
    };
    setAchievementsList((prev) => [...prev, newA]);
    toast("Added new achievement metric card.", "info");
  };

  const handleUpdateAchievement = (idx: number, field: keyof AboutAchievementItem, val: string | number) => {
    setAchievementsList((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteAchievement = (idx: number) => {
    setAchievementsList((prev) => prev.filter((_, i) => i !== idx).map((a, i) => ({ ...a, order: i + 1 })));
    toast("Achievement metric removed.", "info");
  };

  const handleMoveAchievement = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= achievementsList.length) return;
    setAchievementsList((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((a, i) => ({ ...a, order: i + 1 }));
    });
  };

  const handleSaveAboutAchievements = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAchievements(true);
    try {
      const payload: AboutAchievementsSectionData = {
        sectionTitle: achievementsTitle.trim(),
        sectionSubtitle: achievementsSubtitle.trim(),
        items: achievementsList.map((a, i) => ({
          id: a.id || `ach-${i + 1}`,
          metric: a.metric.trim(),
          label: a.label.trim(),
          detail: a.detail.trim(),
          iconKey: a.iconKey,
          order: i + 1,
        })),
      };

      await updateContentBlock({
        key: "about.achievements",
        title: "About Page Cumulative Impact & Benchmarks",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("About page impact benchmarks saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save impact benchmarks", "error");
    } finally {
      setSavingAchievements(false);
    }
  };

  // --- ABOUT PAGE FACILITIES SUITES ---
  const [facilitiesTitle, setFacilitiesTitle] = React.useState(
    initialAboutFacilities?.sectionTitle || DEFAULT_ABOUT_FACILITIES.sectionTitle
  );
  const [facilitiesSubtitle, setFacilitiesSubtitle] = React.useState(
    initialAboutFacilities?.sectionSubtitle || DEFAULT_ABOUT_FACILITIES.sectionSubtitle
  );
  const [facilitiesList, setFacilitiesList] = React.useState<AboutFacilityItem[]>(() => {
    if (initialAboutFacilities?.items && initialAboutFacilities.items.length > 0) {
      return initialAboutFacilities.items;
    }
    return DEFAULT_ABOUT_FACILITIES.items;
  });
  const [savingFacilities, setSavingFacilities] = React.useState(false);

  const handleAddFacility = () => {
    const newF: AboutFacilityItem = {
      id: `fac-${Date.now()}`,
      title: "New Research Suite",
      description: "Description of the laboratory instrumentation, cleanroom parameters, or analytical tools.",
      iconKey: "flask",
      order: facilitiesList.length + 1,
    };
    setFacilitiesList((prev) => [...prev, newF]);
    toast("Added new facility card.", "info");
  };

  const handleUpdateFacility = (idx: number, field: keyof AboutFacilityItem, val: string | number) => {
    setFacilitiesList((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteFacility = (idx: number) => {
    setFacilitiesList((prev) => prev.filter((_, i) => i !== idx).map((f, i) => ({ ...f, order: i + 1 })));
    toast("Facility card removed.", "info");
  };

  const handleMoveFacility = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= facilitiesList.length) return;
    setFacilitiesList((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((f, i) => ({ ...f, order: i + 1 }));
    });
  };

  const handleSaveAboutFacilities = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFacilities(true);
    try {
      const payload: AboutFacilitiesSectionData = {
        sectionTitle: facilitiesTitle.trim(),
        sectionSubtitle: facilitiesSubtitle.trim(),
        items: facilitiesList.map((f, i) => ({
          id: f.id || `fac-${i + 1}`,
          title: f.title.trim(),
          description: f.description.trim(),
          iconKey: f.iconKey,
          order: i + 1,
        })),
      };

      await updateContentBlock({
        key: "about.facilities",
        title: "About Page Core Facilities & Suites",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("About page research facilities saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save facilities", "error");
    } finally {
      setSavingFacilities(false);
    }
  };

  // --- RESEARCH PAGE METHODOLOGICAL CAPABILITIES ---
  const [capabilitiesTitle, setCapabilitiesTitle] = React.useState(
    initialResearchCapabilities?.sectionTitle || DEFAULT_RESEARCH_CAPABILITIES.sectionTitle
  );
  const [capabilitiesSubtitle, setCapabilitiesSubtitle] = React.useState(
    initialResearchCapabilities?.sectionSubtitle || DEFAULT_RESEARCH_CAPABILITIES.sectionSubtitle
  );
  const [capabilitiesList, setCapabilitiesList] = React.useState<ResearchCapabilityItem[]>(() => {
    if (initialResearchCapabilities?.items && initialResearchCapabilities.items.length > 0) {
      return initialResearchCapabilities.items;
    }
    return DEFAULT_RESEARCH_CAPABILITIES.items;
  });
  const [savingCapabilities, setSavingCapabilities] = React.useState(false);

  const handleAddCapability = () => {
    const newCap: ResearchCapabilityItem = {
      id: `cap-${Date.now()}`,
      title: "New Research Capability",
      description: "Technical methodology, instrumentation, or analytical process description.",
      order: capabilitiesList.length + 1,
    };
    setCapabilitiesList((prev) => [...prev, newCap]);
    toast("Added new capability card.", "info");
  };

  const handleUpdateCapability = (idx: number, field: keyof ResearchCapabilityItem, val: string | number) => {
    setCapabilitiesList((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteCapability = (idx: number) => {
    setCapabilitiesList((prev) => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, order: i + 1 })));
    toast("Capability card removed.", "info");
  };

  const handleMoveCapability = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= capabilitiesList.length) return;
    setCapabilitiesList((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  };

  const handleSaveCapabilities = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCapabilities(true);
    try {
      const payload: ResearchCapabilitiesSectionData = {
        sectionTitle: capabilitiesTitle.trim(),
        sectionSubtitle: capabilitiesSubtitle.trim(),
        items: capabilitiesList.map((c, i) => ({
          id: c.id || `cap-${i + 1}`,
          title: c.title.trim(),
          description: c.description.trim(),
          order: i + 1,
        })),
      };

      await updateContentBlock({
        key: "research.capabilities",
        title: "Research Scope Advanced Capabilities & Instrumentation",
        content: payload as unknown as Prisma.InputJsonValue,
      });

      toast("Research page capabilities and methodology saved successfully!", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save research capabilities", "error");
    } finally {
      setSavingCapabilities(false);
    }
  };

  // Settings State - Identity & Copy
  const [labName, setLabName] = React.useState(initialSettings?.labName || "");
  const [labShortName, setLabShortName] = React.useState(initialSettings?.labShortName || "BTIB Lab");
  const [departmentName, setDepartmentName] = React.useState(initialSettings?.departmentName || "");
  const [institutionName, setInstitutionName] = React.useState(initialSettings?.institutionName || "");
  const [address, setAddress] = React.useState(initialSettings?.address || "");
  const [contactEmail, setContactEmail] = React.useState(initialSettings?.contactEmail || "");
  const [tagline, setTagline] = React.useState(initialSettings?.tagline || "");
  const [heroHeading, setHeroHeading] = React.useState(initialSettings?.heroHeading || "");
  const [heroSubheading, setHeroSubheading] = React.useState(initialSettings?.heroSubheading || "");

  // Settings State - Section Images & Banners
  const [heroSlides, setHeroSlides] = React.useState<HeroSlideItem[]>(() => {
    if (Array.isArray(initialSettings?.bannerImages) && initialSettings.bannerImages.length > 0) {
      const valid = (initialSettings.bannerImages as { src?: string; alt?: string }[])
        .filter((s) => s && typeof s.src === "string" && s.src.trim() !== "")
        .map((s, idx) => ({
          id: `slide-${idx}-${Date.now()}`,
          src: s.src || "",
          alt: s.alt || "",
        }));
      if (valid.length > 0) return valid;
    }
    return DEFAULT_HERO_SLIDES;
  });

  const [aboutHeroImage, setAboutHeroImage] = React.useState(initialSettings?.aboutHeroImage || "");
  const [liquidTreeImage, setLiquidTreeImage] = React.useState(initialSettings?.liquidTreeImage || "");
  const [heritageCampusImage, setHeritageCampusImage] = React.useState(initialSettings?.heritageCampusImage || "");
  const [labIntroImage, setLabIntroImage] = React.useState(initialSettings?.labIntroImage || "");
  const [labLogoUrl, setLabLogoUrl] = React.useState(initialSettings?.labLogoUrl || "");
  const [labLogoWhiteUrl, setLabLogoWhiteUrl] = React.useState(initialSettings?.labLogoWhiteUrl || "");
  const [universityLogoUrl, setUniversityLogoUrl] = React.useState(initialSettings?.universityLogoUrl || "");
  const [universityLogoWhiteUrl, setUniversityLogoWhiteUrl] = React.useState(initialSettings?.universityLogoWhiteUrl || "");

  const [savingSettings, setSavingSettings] = React.useState(false);

  // Content Blocks State
  const blocks = initialBlocks;
  const [savingBlockKey, setSavingBlockKey] = React.useState<string | null>(null);

  const handleUpdateSlide = (idx: number, field: "src" | "alt", val: string) => {
    setHeroSlides((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      toast("The hero section should have at least one background slide.", "error");
      return;
    }
    setHeroSlides((prev) => prev.filter((_, i) => i !== idx));
    toast("Slide removed. Click 'Save Section Images' to apply changes.", "info");
  };

  const handleMoveSlide = (idx: number, direction: "up" | "down") => {
    setHeroSlides((prev) => {
      const next = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const handleAddSlide = () => {
    setHeroSlides((prev) => [
      ...prev,
      {
        id: `slide-new-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        src: "",
        alt: "BTIB Laboratory Research Facility",
      },
    ]);
  };

  const handleResetDefaultSlides = () => {
    if (window.confirm("Reset hero background slideshow to the 5 default authentic laboratory photos?")) {
      setHeroSlides(DEFAULT_HERO_SLIDES);
      toast("Reset to 5 default laboratory slides. Click Save to persist.", "info");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const cleanedSlides = heroSlides
        .filter((s) => Boolean(s.src && s.src.trim() !== ""))
        .map((s) => ({ src: s.src.trim(), alt: s.alt.trim() }));

      await updateSiteSettings({
        labName,
        labShortName,
        departmentName,
        institutionName,
        address,
        contactEmail,
        tagline,
        heroHeading,
        heroSubheading,
        heroBgImage: cleanedSlides[0]?.src || null,
        heroBgImageAlt: cleanedSlides[0]?.alt || null,
        bannerImages: cleanedSlides,
        aboutHeroImage: aboutHeroImage || null,
        liquidTreeImage: liquidTreeImage || null,
        heritageCampusImage: heritageCampusImage || null,
        labIntroImage: labIntroImage || null,
        labLogoUrl: labLogoUrl || null,
        labLogoWhiteUrl: labLogoWhiteUrl || null,
        universityLogoUrl: universityLogoUrl || null,
        universityLogoWhiteUrl: universityLogoWhiteUrl || null,
      });
      toast("Laboratory settings & section images saved successfully", "success");
      setSavingSettings(false);
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
      setSavingSettings(false);
    }
  };

  const handleSaveBlock = async (key: string, title: string, text: string) => {
    setSavingBlockKey(key);

    try {
      await updateContentBlock({
        key,
        title,
        content: { text },
      });
      toast(`Block "${title}" updated`, "success");
      setSavingBlockKey(null);
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
      setSavingBlockKey(null);
    }
  };

  // Password Change State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("New password and confirmation do not match", "error");
      return;
    }
    if (newPassword.length < 8) {
      toast("New password must be at least 8 characters long", "error");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        toast(res.error || "Failed to change password", "error");
      } else {
        toast("Password updated successfully! Please keep your new credentials safe.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const tabs = [
    { id: "identity", label: "Institutional Identity" },
    { id: "home", label: "Homepage Sections & Cards" },
    { id: "about", label: "About Page Sections & Cards" },
    { id: "research_page", label: "Research Page Sections" },
    { id: "leadership", label: "PI Leadership & Direction" },
    { id: "imagery", label: "Section Imagery & Banners" },
    { id: "copy", label: "Static Editorial Copy" },
    { id: "security", label: "Security & Credentials" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Laboratory Configuration & Settings
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Institutional identity lockups, coordinates, hero banner photos, and section imagery control.
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. Identity Tab */}
      {activeTab === "identity" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Details</CardTitle>
              <CardDescription>
                Official university department names and canonical laboratory coordinates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">LABORATORY FULL NAME</label>
                <Input
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">SHORT NAME / CODE</label>
                  <Input
                    required
                    value={labShortName}
                    onChange={(e) => setLabShortName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">CONTACT EMAIL</label>
                  <Input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">DEPARTMENT</label>
                  <Input
                    required
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">UNIVERSITY</label>
                  <Input
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">PHYSICAL POSTAL ADDRESS</label>
                <Input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Home Page Hero Copy</CardTitle>
              <CardDescription>
                Primary editorial headline and mission positioning shown on the home hero.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">LAB TAGLINE</label>
                <Input
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">HERO HEADLINE</label>
                <Input
                  required
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">HERO SUBHEADING</label>
                <Textarea
                  required
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={savingSettings} className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Institutional Settings</span>
            </Button>
          </div>
        </form>
      )}

      {/* 2. Homepage Sections, Pillars & Cards Tab */}
      {(activeTab === "home" || activeTab === "landing") && (
        <div className="space-y-8 max-w-4xl">
        <form onSubmit={handleSaveLanding} className="space-y-6">
          {/* Overview Info Banner */}
          <div className="p-4 rounded-md border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                Landing Page Sections &amp; Scientific Pillars Editor
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Manage the dynamic research tenets, badges, descriptive copy, click-through URLs, and thumbnail pictures displayed on the public homepage. Every card supports custom photography, icon selection, live reordering, and immediate deletion.
              </p>
            </div>
          </div>

          {/* Section 1 Header & CTA Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Section Header &amp; Call To Action</CardTitle>
              <CardDescription>
                Configure the primary headline, descriptive preamble, and action link displayed above the research tenet cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">SECTION BADGE / OVERTITLE</label>
                  <Input
                    value={landingSectionBadge}
                    onChange={(e) => setLandingSectionBadge(e.target.value)}
                    placeholder="Core Research Pillars"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">SECTION MONUMENTAL TITLE</label>
                  <Input
                    required
                    value={landingSectionTitle}
                    onChange={(e) => setLandingSectionTitle(e.target.value)}
                    placeholder="From Bioresource to Bioproduct"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">SECTION SUBTITLE / OVERVIEW</label>
                <Textarea
                  required
                  rows={3}
                  value={landingSectionSubtitle}
                  onChange={(e) => setLandingSectionSubtitle(e.target.value)}
                  placeholder="The Bioresources Technology and Industrial Biotechnology Laboratory..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">ACTION BUTTON TEXT</label>
                  <Input
                    value={landingActionText}
                    onChange={(e) => setLandingActionText(e.target.value)}
                    placeholder="Explore history & vision"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">ACTION TARGET LINK</label>
                  <Input
                    value={landingActionLink}
                    onChange={(e) => setLandingActionLink(e.target.value)}
                    placeholder="/about"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pillar Cards Management Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Tenet &amp; Research Pillar Cards</CardTitle>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--surface-raised)] text-[var(--brand-primary)] border border-[var(--border)]">
                      {pillarCards.length} {pillarCards.length === 1 ? "Card" : "Cards"}
                    </span>
                  </div>
                  <CardDescription className="mt-1">
                    Add new cards, customize titles and descriptions, change or remove pictures, select icons, or rearrange order.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRestoreDefaultPillars}
                    className="gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    title="Restore default factory lab pillars"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Defaults</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddPillarCard}
                    className="gap-1.5 text-xs bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {pillarCards.length === 0 ? (
                <div className="p-8 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-raised)] space-y-3">
                  <p className="text-sm text-[var(--text-secondary)]">No pillar cards currently configured.</p>
                  <div className="flex justify-center gap-3">
                    <Button type="button" size="sm" onClick={handleAddPillarCard} className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Add First Card
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleRestoreDefaultPillars} className="gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Restore Defaults
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pillarCards.map((card, idx) => (
                    <div
                      key={card.id || `card-${idx}`}
                      className="p-4 sm:p-5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] space-y-4 transition-all hover:border-[var(--brand-primary)]/40 shadow-xs"
                    >
                      {/* Card Header Toolbar */}
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--surface)] text-[var(--brand-primary)] border border-[var(--border)]">
                            CARD 0{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-md">
                            {card.title || "Untitled Card"}
                          </span>
                          {card.badge && (
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                              {card.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => handleMovePillarCard(idx, "up")}
                            className="h-7 w-7 p-0"
                            title="Move card up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === pillarCards.length - 1}
                            onClick={() => handleMovePillarCard(idx, "down")}
                            className="h-7 w-7 p-0"
                            title="Move card down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePillarCard(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                            title="Delete this pillar card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Card Configuration Fields */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Text and Metadata (7 cols) */}
                        <div className="lg:col-span-7 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">CARD TITLE</label>
                              <Input
                                required
                                value={card.title}
                                onChange={(e) => handleUpdatePillarCard(idx, "title", e.target.value)}
                                placeholder="e.g. Circular Bioeconomy"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">BADGE / CATEGORY</label>
                              <Input
                                value={card.badge}
                                onChange={(e) => handleUpdatePillarCard(idx, "badge", e.target.value)}
                                placeholder="e.g. Applied Motive"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">CARD ICON</label>
                              <select
                                value={card.icon || "compass"}
                                onChange={(e) => handleUpdatePillarCard(idx, "icon", e.target.value)}
                                className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                              >
                                {PILLAR_ICONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">CLICK LINK (OPTIONAL)</label>
                              <Input
                                value={card.link || ""}
                                onChange={(e) => handleUpdatePillarCard(idx, "link", e.target.value)}
                                placeholder="e.g. /projects or /about"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[var(--text-secondary)]">DESCRIPTION</label>
                            <Textarea
                              required
                              rows={3}
                              value={card.description}
                              onChange={(e) => handleUpdatePillarCard(idx, "description", e.target.value)}
                              placeholder="Brief summary of the pillar..."
                            />
                          </div>
                        </div>

                        {/* Picture Management (5 cols) */}
                        <div className="lg:col-span-5 space-y-3 p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)]">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-semibold uppercase text-[var(--text-secondary)]">
                              CARD PICTURE / THUMBNAIL
                            </span>
                            {card.image && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdatePillarCard(idx, "image", "")}
                                className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                title="Remove card picture"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove Picture
                              </Button>
                            )}
                          </div>

                          {card.image ? (
                            <div className="space-y-2">
                              <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                                <Image
                                  src={card.image}
                                  alt={card.imageAlt || card.title || "Pillar preview"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Input
                                value={card.imageAlt || ""}
                                onChange={(e) => handleUpdatePillarCard(idx, "imageAlt", e.target.value)}
                                placeholder="Picture Alt Text (Accessibility)"
                                className="text-xs h-7"
                              />
                            </div>
                          ) : (
                            <div className="p-3 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-raised)]/50">
                              <span className="text-[11px] text-[var(--text-muted)] block">
                                No picture selected. This card will display with an icon badge on the homepage.
                              </span>
                            </div>
                          )}

                          <MediaPicker
                            label={card.image ? "Change Picture" : "Choose / Upload Picture"}
                            value={card.image || ""}
                            onChange={(url) => handleUpdatePillarCard(idx, "image", url)}
                            folder="landing"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Action Bar */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={savingLanding}
              className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Landing Page Sections &amp; Pillars</span>
            </Button>
          </div>
        </form>

        {/* Part B: Additional Homepage Sections (Disciplines, Deployments, Gallery Showcase) */}
        <form onSubmit={handleSaveHomepageSections} className="space-y-6 pt-4 border-t border-[var(--border)]">
          {/* Section 2: Core Research Disciplines Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Core Research Disciplines Section Header</CardTitle>
                  <CardDescription>
                    Configure the title, descriptive preamble, and action link displayed above the research disciplines cards on the homepage.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION TITLE</label>
                <Input
                  required
                  value={disciplinesTitle}
                  onChange={(e) => setDisciplinesTitle(e.target.value)}
                  placeholder="Core Research Disciplines"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE / PREAMBLE</label>
                <Textarea
                  rows={2}
                  required
                  value={disciplinesSubtitle}
                  onChange={(e) => setDisciplinesSubtitle(e.target.value)}
                  placeholder="From indigenous microbial screening to continuous photobioreactor operation..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">ACTION BUTTON TEXT</label>
                  <Input
                    value={disciplinesLinkText}
                    onChange={(e) => setDisciplinesLinkText(e.target.value)}
                    placeholder="View all 8 divisions"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">ACTION LINK URL</label>
                  <Input
                    value={disciplinesLinkHref}
                    onChange={(e) => setDisciplinesLinkHref(e.target.value)}
                    placeholder="/research"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Flagship Deployments Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Flagship Research &amp; Deployments Section Header</CardTitle>
                  <CardDescription>
                    Configure the title, descriptive preamble, and action link displayed above the flagship project cards on the homepage.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION TITLE</label>
                <Input
                  required
                  value={projectsTitle}
                  onChange={(e) => setProjectsTitle(e.target.value)}
                  placeholder="Flagship Research & Field Deployments"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE / PREAMBLE</label>
                <Textarea
                  rows={2}
                  required
                  value={projectsSubtitle}
                  onChange={(e) => setProjectsSubtitle(e.target.value)}
                  placeholder="Translating fundamental bioresource research into functional prototypes..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">ACTION BUTTON TEXT</label>
                  <Input
                    value={projectsLinkText}
                    onChange={(e) => setProjectsLinkText(e.target.value)}
                    placeholder="View all active projects"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">ACTION LINK URL</label>
                  <Input
                    value={projectsLinkHref}
                    onChange={(e) => setProjectsLinkHref(e.target.value)}
                    placeholder="/projects"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Authentic Laboratory Gallery Showcase */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-md bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/20">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Homepage Authentic Gallery Showcase Cards</CardTitle>
                    <CardDescription>
                      Manage the 4 curated photographic cards displayed in the homepage gallery bento section.
                    </CardDescription>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGalleryCard}
                  className="gap-1.5 self-start sm:self-auto text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Showcase Photo Card</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION TITLE</label>
                  <Input
                    required
                    value={homeGalleryTitle}
                    onChange={(e) => setHomeGalleryTitle(e.target.value)}
                    placeholder="Laboratory Facilities in Action"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">ACTION LINK TEXT</label>
                  <Input
                    value={homeGalleryLinkText}
                    onChange={(e) => setHomeGalleryLinkText(e.target.value)}
                    placeholder="View complete archive"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE</label>
                  <Input
                    value={homeGallerySubtitle}
                    onChange={(e) => setHomeGallerySubtitle(e.target.value)}
                    placeholder="Authentic photographic archive documenting our bioreactor pilots..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">ACTION LINK URL</label>
                  <Input
                    value={homeGalleryLinkHref}
                    onChange={(e) => setHomeGalleryLinkHref(e.target.value)}
                    placeholder="/gallery"
                  />
                </div>
              </div>

              {/* Showcase Cards List */}
              <div className="space-y-4 pt-2">
                {homeGalleryCards.map((card, idx) => (
                  <div
                    key={card.id || `home-gallery-${idx}`}
                    className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface)] text-[var(--bio-teal)] border border-[var(--border)]">
                          PHOTO 0{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">
                          {card.title || "Untitled Photo"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveGalleryCard(idx, "up")}
                          className="h-7 w-7 p-0"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === homeGalleryCards.length - 1}
                          onClick={() => handleMoveGalleryCard(idx, "down")}
                          className="h-7 w-7 p-0"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGalleryCard(idx)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[var(--text-secondary)]">PHOTO TITLE</label>
                            <Input
                              required
                              value={card.title}
                              onChange={(e) => handleUpdateGalleryCard(idx, "title", e.target.value)}
                              placeholder="Liquid-Tree Outdoor Column"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[var(--text-secondary)]">TAG / BADGE</label>
                            <Input
                              value={card.tag}
                              onChange={(e) => handleUpdateGalleryCard(idx, "tag", e.target.value)}
                              placeholder="Pilot Facility"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">ALT TEXT (ACCESSIBILITY)</label>
                          <Input
                            value={card.alt}
                            onChange={(e) => handleUpdateGalleryCard(idx, "alt", e.target.value)}
                            placeholder="Detailed caption of the equipment..."
                          />
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[11px] font-mono text-[var(--text-secondary)] block">
                          SHOWCASE PHOTOGRAPH
                        </label>
                        {card.photo ? (
                          <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                            <Image
                              src={card.photo}
                              alt={card.alt || card.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="p-3 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] text-[11px] text-[var(--text-muted)]">
                            No photograph selected
                          </div>
                        )}
                        <MediaPicker
                          label={card.photo ? "Change Photo" : "Upload / Select Photo"}
                          value={card.photo}
                          onChange={(url) => handleUpdateGalleryCard(idx, "photo", url)}
                          folder="gallery"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={savingHomepageSections}
              className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Homepage Disciplines, Deployments &amp; Gallery Showcase</span>
            </Button>
          </div>
        </form>
        </div>
      )}

      {/* 3. About Page Sections & Cards Tab */}
      {activeTab === "about" && (
        <div className="space-y-8 max-w-4xl">
          {/* Card 1: Chronological Milestones & Scientific Evolution */}
          <form onSubmit={handleSaveAboutMilestones} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>About Page Chronological Milestones</CardTitle>
                      <CardDescription>
                        Timeline cards chronicling the laboratory&apos;s inception, facilities expansion, and scientific milestones.
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMilestone}
                    className="gap-1.5 self-start sm:self-auto text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone Phase</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION TITLE</label>
                    <Input
                      required
                      value={milestonesTitle}
                      onChange={(e) => setMilestonesTitle(e.target.value)}
                      placeholder="Full History: 2012 to Present"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE / PREAMBLE</label>
                    <Input
                      value={milestonesSubtitle}
                      onChange={(e) => setMilestonesSubtitle(e.target.value)}
                      placeholder="From an exploratory academic screening initiative..."
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {milestonesList.map((m, idx) => (
                    <div
                      key={m.id || `m-${idx}`}
                      className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface)] text-[var(--brand-primary)] border border-[var(--border)]">
                            PHASE 0{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[var(--text-primary)]">
                            {m.year} — {m.title || "Untitled Milestone"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => handleMoveMilestone(idx, "up")}
                            className="h-7 w-7 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === milestonesList.length - 1}
                            onClick={() => handleMoveMilestone(idx, "down")}
                            className="h-7 w-7 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMilestone(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                            title="Delete milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">YEAR / ERA</label>
                          <Input
                            required
                            value={m.year}
                            onChange={(e) => handleUpdateMilestone(idx, "year", e.target.value)}
                            placeholder="2012"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">MILESTONE TITLE</label>
                          <Input
                            required
                            value={m.title}
                            onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                            placeholder="Laboratory Foundation & Inception"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">TAG / BADGE</label>
                          <Input
                            value={m.tag}
                            onChange={(e) => handleUpdateMilestone(idx, "tag", e.target.value)}
                            placeholder="Established"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-3">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">DESCRIPTION</label>
                          <Textarea
                            rows={2}
                            required
                            value={m.description}
                            onChange={(e) => handleUpdateMilestone(idx, "description", e.target.value)}
                            placeholder="Detailed description of the milestone..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    isLoading={savingMilestones}
                    className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Historical Milestones</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Card 2: Cumulative Research Impact Metrics */}
          <form onSubmit={handleSaveAboutAchievements} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-md bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>About Page Impact Benchmarks &amp; Metrics</CardTitle>
                      <CardDescription>
                        Configure the 4 high-impact quantitative achievement stat cards displayed on the About page.
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAchievement}
                    className="gap-1.5 self-start sm:self-auto text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric Card</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION TITLE</label>
                    <Input
                      required
                      value={achievementsTitle}
                      onChange={(e) => setAchievementsTitle(e.target.value)}
                      placeholder="Laboratory Benchmarks & Impact"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE / PREAMBLE</label>
                    <Input
                      value={achievementsSubtitle}
                      onChange={(e) => setAchievementsSubtitle(e.target.value)}
                      placeholder="Quantitative overview of academic training..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {achievementsList.map((a, idx) => (
                    <div
                      key={a.id || `ach-${idx}`}
                      className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface)] text-[var(--bio-teal)] border border-[var(--border)]">
                          METRIC 0{idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => handleMoveAchievement(idx, "up")}
                            className="h-7 w-7 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === achievementsList.length - 1}
                            onClick={() => handleMoveAchievement(idx, "down")}
                            className="h-7 w-7 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAchievement(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                            title="Delete metric"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">STAT / VALUE</label>
                          <Input
                            required
                            value={a.metric}
                            onChange={(e) => handleUpdateAchievement(idx, "metric", e.target.value)}
                            placeholder="e.g. 250 L or 15+"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">ICON</label>
                          <select
                            value={a.iconKey || "award"}
                            onChange={(e) => handleUpdateAchievement(idx, "iconKey", e.target.value as AboutAchievementItem["iconKey"])}
                            className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                          >
                            {ABOUT_ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--text-secondary)]">METRIC LABEL</label>
                        <Input
                          required
                          value={a.label}
                          onChange={(e) => handleUpdateAchievement(idx, "label", e.target.value)}
                          placeholder="e.g. Liquid-Tree Photobioreactor"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--text-secondary)]">EXPLANATORY DETAIL</label>
                        <Textarea
                          rows={2}
                          value={a.detail}
                          onChange={(e) => handleUpdateAchievement(idx, "detail", e.target.value)}
                          placeholder="Brief detail of the landmark..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    isLoading={savingAchievements}
                    className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Impact Benchmarks</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Card 3: Core Facilities & Suites */}
          <form onSubmit={handleSaveAboutFacilities} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>About Page Core Facilities &amp; Suites</CardTitle>
                      <CardDescription>
                        Configure the physical research suites, cleanroom facilities, and cryopreservation banks.
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFacility}
                    className="gap-1.5 self-start sm:self-auto text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Facility Suite</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION TITLE</label>
                    <Input
                      required
                      value={facilitiesTitle}
                      onChange={(e) => setFacilitiesTitle(e.target.value)}
                      placeholder="Core Facilities & Laboratory Suites"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE / PREAMBLE</label>
                    <Input
                      value={facilitiesSubtitle}
                      onChange={(e) => setFacilitiesSubtitle(e.target.value)}
                      placeholder="Situated in the Department of Biotechnology & Genetic Engineering..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {facilitiesList.map((f, idx) => (
                    <div
                      key={f.id || `fac-${idx}`}
                      className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface)] text-[var(--brand-primary)] border border-[var(--border)]">
                          SUITE 0{idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => handleMoveFacility(idx, "up")}
                            className="h-7 w-7 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === facilitiesList.length - 1}
                            onClick={() => handleMoveFacility(idx, "down")}
                            className="h-7 w-7 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFacility(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                            title="Delete facility"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">SUITE TITLE</label>
                          <Input
                            required
                            value={f.title}
                            onChange={(e) => handleUpdateFacility(idx, "title", e.target.value)}
                            placeholder="Fermentation Kinetics Cleanroom"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">ICON</label>
                          <select
                            value={f.iconKey || "flask"}
                            onChange={(e) => handleUpdateFacility(idx, "iconKey", e.target.value as AboutFacilityItem["iconKey"])}
                            className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                          >
                            {ABOUT_ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--text-secondary)]">DESCRIPTION</label>
                        <Textarea
                          rows={2}
                          required
                          value={f.description}
                          onChange={(e) => handleUpdateFacility(idx, "description", e.target.value)}
                          placeholder="Equipped with automated stirred-tank bioreactor systems..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    isLoading={savingFacilities}
                    className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Core Facilities Suites</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      )}

      {/* 2. PI Leadership & Direction Tab */}
      {activeTab === "leadership" && (
        <form onSubmit={handleSaveLeadership} className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Principal Investigator Profile &amp; Contact</CardTitle>
                  <CardDescription>
                    Official title, academic credentials, contact details, and institutional portrait photograph.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">PI FULL NAME</label>
                      <Input
                        required
                        value={piName}
                        onChange={(e) => setPiName(e.target.value)}
                        placeholder="Prof. Dr. Shahedur Rahman"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">TITLE &amp; DESIGNATION</label>
                      <Input
                        required
                        value={piTitle}
                        onChange={(e) => setPiTitle(e.target.value)}
                        placeholder="Professor & Lead Principal Investigator"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">DIRECT EMAIL</label>
                      <Input
                        type="email"
                        required
                        value={piEmail}
                        onChange={(e) => setPiEmail(e.target.value)}
                        placeholder="shahedur@juniv.edu"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">OFFICE / LAB LOCATION</label>
                      <Input
                        value={piAddress}
                        onChange={(e) => setPiAddress(e.target.value)}
                        placeholder="Room 214, Department of GEB, JU"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">DEPARTMENT</label>
                      <Input
                        value={piDepartment}
                        onChange={(e) => setPiDepartment(e.target.value)}
                        placeholder="Department of Genetic Engineering and Biotechnology"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">UNIVERSITY / INSTITUTION</label>
                      <Input
                        value={piInstitution}
                        onChange={(e) => setPiInstitution(e.target.value)}
                        placeholder="Jahangirnagar University, Savar, Dhaka-1342"
                      />
                    </div>
                  </div>
                </div>

                {/* PI Portrait / Photo Picker */}
                <div className="md:col-span-4 space-y-3">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium block">
                    FACULTY PORTRAIT
                  </label>
                  {piPhotoUrl ? (
                    <div className="space-y-2">
                      <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                        <Image
                          src={piPhotoUrl}
                          alt={piName || "Faculty Lead"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPiPhotoUrl("")}
                        className="text-xs text-red-500 hover:text-red-600 h-7 w-full"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-raised)]/50 flex flex-col items-center justify-center min-h-[160px]">
                      <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                      <span className="text-xs text-[var(--text-muted)]">No portrait photograph set</span>
                    </div>
                  )}

                  <MediaPicker
                    label={piPhotoUrl ? "Change Photo" : "Upload / Select Portrait"}
                    value={piPhotoUrl}
                    onChange={(url) => setPiPhotoUrl(url)}
                    folder="team"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Academic Philosophy &amp; Direction</CardTitle>
                  <CardDescription>
                    Vision statement, quote callout, and graduate supervision focus areas.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION KICKER</label>
                  <Input
                    value={piKicker}
                    onChange={(e) => setPiKicker(e.target.value)}
                    placeholder="FACULTY LEADERSHIP"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SUB-KICKER / BADGE</label>
                  <Input
                    value={piSubKicker}
                    onChange={(e) => setPiSubKicker(e.target.value)}
                    placeholder="PRINCIPAL INVESTIGATOR"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION HEADING</label>
                <Input
                  required
                  value={piHeading}
                  onChange={(e) => setPiHeading(e.target.value)}
                  placeholder="Directing Applied Biotechnology Toward National Bioresource Security"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  RESEARCH PHILOSOPHY &amp; MISSION STATEMENT
                </label>
                <Textarea
                  rows={4}
                  required
                  value={piPhilosophy}
                  onChange={(e) => setPiPhilosophy(e.target.value)}
                  placeholder="Detailed statement on the lab's mission, student mentorship, and translational objectives..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">FEATURED QUOTE</label>
                  <Textarea
                    rows={2}
                    value={piQuote}
                    onChange={(e) => setPiQuote(e.target.value)}
                    placeholder="Brief inspirational or scientific quote..."
                  />
                </div>
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">QUOTE ATTRIBUTION</label>
                  <Input
                    value={piQuoteAuthor}
                    onChange={(e) => setPiQuoteAuthor(e.target.value)}
                    placeholder="e.g. Prof. Dr. Shahedur Rahman"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  SUPERVISORY &amp; RESEARCH FOCUS (COMMA-SEPARATED)
                </label>
                <Input
                  value={piSupervisoryFieldsStr}
                  onChange={(e) => setPiSupervisoryFieldsStr(e.target.value)}
                  placeholder="Bioprocess Engineering, Microalgal Biotechnology, Industrial Enzymology, Molecular Screening"
                />
                <span className="text-[11px] text-[var(--text-muted)] block">
                  Tags displayed as badges in the faculty leadership section.
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={savingLeadership}
              className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save PI Leadership &amp; Direction</span>
            </Button>
          </div>
        </form>
      )}

      {/* 4. Research Scope Page Sections Tab */}
      {(activeTab === "research_page" || activeTab === "innovation") && (
        <div className="space-y-8 max-w-4xl">
          {/* Flagship Liquid-Tree Photobioreactor Innovation */}
          <form onSubmit={handleSaveLiquidTree} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-md bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] border border-[var(--bio-teal)]/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Flagship Innovation: Liquid-Tree Urban Photobioreactor</CardTitle>
                    <CardDescription>
                      Configure the flagship 250L microalgae photobioreactor feature showcased on the Research Scope page (/research).
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">FEATURE BADGE</label>
                        <Input
                          value={ltBadge}
                          onChange={(e) => setLtBadge(e.target.value)}
                          placeholder="FLAGSHIP INNOVATION"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">LOCATION BADGE</label>
                        <Input
                          value={ltLocationBadge}
                          onChange={(e) => setLtLocationBadge(e.target.value)}
                          placeholder="JU CAMPUS INSTALLATION"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">UNIT MODEL / TAG</label>
                        <Input
                          value={ltUnitTag}
                          onChange={(e) => setLtUnitTag(e.target.value)}
                          placeholder="UNIT 01 - DEPLOYED"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SYSTEM TITLE</label>
                      <Input
                        required
                        value={ltTitle}
                        onChange={(e) => setLtTitle(e.target.value)}
                        placeholder="Liquid-Tree: Urban Microalgae Photobioreactor"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                        TECHNICAL DESCRIPTION &amp; URBAN PURPOSE
                      </label>
                      <Textarea
                        rows={3}
                        required
                        value={ltDescription}
                        onChange={(e) => setLtDescription(e.target.value)}
                        placeholder="High-density microalgal cultivation system engineered for urban atmospheric carbon capture..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">MICROALGAE SPECIES</label>
                        <Input
                          value={ltSpecies}
                          onChange={(e) => setLtSpecies(e.target.value)}
                          placeholder="Chlorella vulgaris / Scenedesmus"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">WORKING VOLUME</label>
                        <Input
                          value={ltVolume}
                          onChange={(e) => setLtVolume(e.target.value)}
                          placeholder="250 Liters"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">TREES EQUIVALENCY</label>
                        <Input
                          value={ltTrees}
                          onChange={(e) => setLtTrees(e.target.value)}
                          placeholder="Equivalent to 1 mature tree"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">DOSSIER / PROJECT URL</label>
                      <Input
                        value={ltDossierLink}
                        onChange={(e) => setLtDossierLink(e.target.value)}
                        placeholder="/projects/liquid-tree-photobioreactor"
                      />
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="md:col-span-4 space-y-3">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium block">
                      PHOTOBIOREACTOR PICTURE
                    </label>
                    {ltImage ? (
                      <div className="space-y-2">
                        <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                          <Image
                            src={ltImage}
                            alt="Liquid-Tree Photobioreactor"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setLtImage("")}
                          className="text-xs text-red-500 hover:text-red-600 h-7 w-full"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Clear Picture
                        </Button>
                      </div>
                    ) : (
                      <div className="p-6 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-raised)]/50 flex flex-col items-center justify-center min-h-[140px]">
                        <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                        <span className="text-xs text-[var(--text-muted)]">No cover photograph set</span>
                      </div>
                    )}

                    <MediaPicker
                      label={ltImage ? "Change Picture" : "Upload / Select Picture"}
                      value={ltImage}
                      onChange={(url) => setLtImage(url)}
                      folder="research"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                isLoading={savingLiquidTree}
                className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Liquid-Tree Photobioreactor</span>
              </Button>
            </div>
          </form>

          {/* Methodological Core & Technical Capabilities Cards */}
          <form onSubmit={handleSaveCapabilities} className="space-y-6 pt-4 border-t border-[var(--border)]">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                      <Microscope className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>Methodological Core & Technical Capabilities</CardTitle>
                      <CardDescription>
                        Custom cards describing lab analytical pipelines, instrumentation suites, and methodology on the Research Scope page.
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--bio-teal)]">
                      {capabilitiesList.length} Cards
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddCapability}
                      className="gap-1.5 text-xs bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Capability</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/50">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION HEADING</label>
                    <Input
                      value={capabilitiesTitle}
                      onChange={(e) => setCapabilitiesTitle(e.target.value)}
                      placeholder="Methodological Core & Technical Capabilities"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">SECTION SUBTITLE / CONTEXT</label>
                    <Input
                      value={capabilitiesSubtitle}
                      onChange={(e) => setCapabilitiesSubtitle(e.target.value)}
                      placeholder="Equipped with advanced analytical instrumentation..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {capabilitiesList.map((cap, idx) => (
                    <div
                      key={cap.id || `cap-${idx}`}
                      className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] space-y-3 transition-all hover:border-[var(--brand-primary)]/40 shadow-xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--surface)] text-[var(--brand-primary)] border border-[var(--border)]">
                            CAPABILITY #{idx + 1}
                          </span>
                          <span className="text-xs font-medium text-[var(--text-primary)] truncate max-w-[280px]">
                            {cap.title || "Untitled Capability"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => handleMoveCapability(idx, "up")}
                            className="h-7 w-7 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={idx === capabilitiesList.length - 1}
                            onClick={() => handleMoveCapability(idx, "down")}
                            className="h-7 w-7 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCapability(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                            title="Delete this capability card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">CAPABILITY TITLE / INSTRUMENT</label>
                          <Input
                            required
                            value={cap.title}
                            onChange={(e) => handleUpdateCapability(idx, "title", e.target.value)}
                            placeholder="e.g. High-Pressure Liquid Chromatography (HPLC)"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-secondary)]">DETAILED METHODOLOGY &amp; SCOPE</label>
                          <Textarea
                            rows={3}
                            required
                            value={cap.description}
                            onChange={(e) => handleUpdateCapability(idx, "description", e.target.value)}
                            placeholder="Analytical quantification of secondary metabolites, lipids, and purified biomolecules..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {capabilitiesList.length === 0 && (
                    <div className="p-8 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] space-y-2">
                      <Microscope className="w-8 h-8 mx-auto opacity-40" />
                      <p className="text-sm">No capabilities configured yet.</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCapability}
                        className="text-xs"
                      >
                        Add First Capability
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                isLoading={savingCapabilities}
                className="gap-2 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Methodological Capabilities Cards</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Section Imagery & Banners Tab */}
      {activeTab === "imagery" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          {/* 1. Homepage Hero Section Background Slideshow */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Homepage Hero Background Slideshow</CardTitle>
                    <CardDescription>
                      These high-resolution pictures crossfade automatically in the hero background. View, change, reorder, or delete any of them.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--bio-teal)]">
                    {heroSlides.length} {heroSlides.length === 1 ? "Slide" : "Slides"}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetDefaultSlides}
                    className="gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    title="Restore original 5 lab facility photos"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSlide}
                    className="gap-1.5 text-xs bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] space-y-4 transition-all hover:border-[var(--brand-primary)]/40 shadow-xs"
                  >
                    {/* Slide Header Toolbar */}
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--surface)] text-[var(--brand-primary)] border border-[var(--border)]">
                          SLIDE 0{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[var(--bio-teal)] bg-[var(--bio-teal)]/10 border border-[var(--bio-teal)]/20">
                            Primary Poster
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, "up")}
                          className="h-7 w-7 p-0"
                          title="Move slide up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === heroSlides.length - 1}
                          onClick={() => handleMoveSlide(idx, "down")}
                          className="h-7 w-7 p-0"
                          title="Move slide down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSlide(idx)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                          title="Delete this slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Slide Body: Thumbnail Preview + Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Thumbnail Preview */}
                      <div className="md:col-span-4">
                        <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20 group">
                          {slide.src ? (
                            <>
                              <Image
                                src={slide.src}
                                alt={slide.alt || `Hero slide ${idx + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-[10px] font-mono text-white truncate">
                                  {slide.src}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-xs p-4 text-center">
                              <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                              <span>No image chosen yet</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Inputs & MediaPicker */}
                      <div className="md:col-span-8 space-y-3">
                        <MediaPicker
                          label="Background Photo (Upload or Select from Media Library)"
                          value={slide.src}
                          onChange={(newUrl) => handleUpdateSlide(idx, "src", newUrl)}
                          folder="banners"
                        />

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-[var(--text-secondary)]">
                            ALT TEXT / DESCRIPTION (FOR ACCESSIBILITY &amp; SEO)
                          </label>
                          <Input
                            value={slide.alt}
                            onChange={(e) => handleUpdateSlide(idx, "alt", e.target.value)}
                            placeholder="e.g. Bioresources Technology and Industrial Biotechnology Laboratory Cleanroom Suite"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSlide}
                  className="gap-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Slide to Hero Slideshow</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Feature Banners */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--brand-primary)]" />
                <CardTitle>Page Banners &amp; Feature Pictures</CardTitle>
              </div>
              <CardDescription>
                Control individual section photos across the About page, Liquid-Tree feature, and Campus heritage sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* About Page Facility Banner */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      About Page Facility Banner
                    </h4>
                    {aboutHeroImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAboutHeroImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {aboutHeroImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={aboutHeroImage} alt="About facility banner preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on the About page overview header and history section.
                  </p>
                  <MediaPicker
                    label="Facility / Cleanroom Picture"
                    value={aboutHeroImage}
                    onChange={setAboutHeroImage}
                    folder="facilities"
                  />
                </div>

                {/* Liquid-Tree Photobioreactor Banner */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Liquid-Tree Photobioreactor Banner
                    </h4>
                    {liquidTreeImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLiquidTreeImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {liquidTreeImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={liquidTreeImage} alt="Liquid-Tree banner preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on the flagship 250L urban microalgae innovation banners.
                  </p>
                  <MediaPicker
                    label="Liquid-Tree Column Picture"
                    value={liquidTreeImage}
                    onChange={setLiquidTreeImage}
                    folder="innovations"
                  />
                </div>

                {/* Campus Heritage Picture */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Campus Heritage Picture
                    </h4>
                    {heritageCampusImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setHeritageCampusImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {heritageCampusImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={heritageCampusImage} alt="Campus heritage picture preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on university heritage &amp; institutional context sections.
                  </p>
                  <MediaPicker
                    label="Jahangirnagar Campus Picture"
                    value={heritageCampusImage}
                    onChange={setHeritageCampusImage}
                    folder="campus"
                  />
                </div>

                {/* Lab Intro / Mission Banner */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Lab Intro / Mission Banner
                    </h4>
                    {labIntroImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLabIntroImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {labIntroImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={labIntroImage} alt="Lab intro picture preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on the &ldquo;From Bioresource to Bioproduct&rdquo; overview cards.
                  </p>
                  <MediaPicker
                    label="Lab Overview Picture"
                    value={labIntroImage}
                    onChange={setLabIntroImage}
                    folder="lab"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Logos Control */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--brand-primary)]" />
                <CardTitle>Institutional Brand Logos</CardTitle>
              </div>
              <CardDescription>
                Customize laboratory and university brand logos used in navigation header, footer, and hero.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      BTIB Laboratory Logo
                    </h4>
                    {(labLogoUrl || labLogoWhiteUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setLabLogoUrl("");
                          setLabLogoWhiteUrl("");
                        }}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Both
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center min-h-[70px]">
                      {labLogoUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={labLogoUrl} alt="Lab logo standard preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">No Standard Logo</span>
                      )}
                    </div>
                    <div className="p-3 rounded-md border border-slate-700 bg-slate-900 flex flex-col items-center justify-center min-h-[70px]">
                      {labLogoWhiteUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={labLogoWhiteUrl} alt="Lab logo white preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">No White Logo</span>
                      )}
                    </div>
                  </div>
                  <MediaPicker
                    label="Dark Theme / Standard Logo"
                    value={labLogoUrl}
                    onChange={setLabLogoUrl}
                    folder="branding"
                  />
                  <MediaPicker
                    label="Light Theme / White Logo (Hero &amp; Dark Footer)"
                    value={labLogoWhiteUrl}
                    onChange={setLabLogoWhiteUrl}
                    folder="branding"
                  />
                </div>

                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Jahangirnagar University Logo
                    </h4>
                    {(universityLogoUrl || universityLogoWhiteUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUniversityLogoUrl("");
                          setUniversityLogoWhiteUrl("");
                        }}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Both
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center min-h-[70px]">
                      {universityLogoUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={universityLogoUrl} alt="University logo standard preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">No Standard Logo</span>
                      )}
                    </div>
                    <div className="p-3 rounded-md border border-slate-700 bg-slate-900 flex flex-col items-center justify-center min-h-[70px]">
                      {universityLogoWhiteUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={universityLogoWhiteUrl} alt="University logo white preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">No White Logo</span>
                      )}
                    </div>
                  </div>
                  <MediaPicker
                    label="Dark Theme / Standard Logo"
                    value={universityLogoUrl}
                    onChange={setUniversityLogoUrl}
                    folder="branding"
                  />
                  <MediaPicker
                    label="Light Theme / White Logo (Hero &amp; Dark Footer)"
                    value={universityLogoWhiteUrl}
                    onChange={setUniversityLogoWhiteUrl}
                    folder="branding"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={savingSettings} className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Section Images &amp; Banners</span>
            </Button>
          </div>
        </form>
      )}

      {/* 4. Static Copy Tab */}
      {activeTab === "copy" && (
        <div className="space-y-6 max-w-4xl">
          {blocks.filter((b) => b.key !== "landing.pillars").map((b) => {
            const currentText =
              typeof b.content === "object" && b.content !== null && "text" in b.content
                ? String((b.content as { text: string }).text)
                : "";

            return (
              <Card key={b.key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{b.title}</CardTitle>
                    <span className="specimen-tag text-[10px]">{b.key}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    defaultValue={currentText}
                    id={`text-${b.key}`}
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      isLoading={savingBlockKey === b.key}
                      onClick={() => {
                        const inputEl = document.getElementById(
                          `text-${b.key}`
                        ) as HTMLTextAreaElement;
                        if (inputEl) {
                          handleSaveBlock(b.key, b.title, inputEl.value);
                        }
                      }}
                      className="gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Copy</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Security & Credentials Tab */}
      {activeTab === "security" && (
        <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Change Administrator Password</CardTitle>
                  <CardDescription>
                    Update your account credentials. Requires entering your current password for security verification.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  CURRENT PASSWORD
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  NEW PASSWORD (MIN. 8 CHARACTERS)
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  CONFIRM NEW PASSWORD
                </label>
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  minLength={8}
                />
              </div>

              <div className="pt-2">
                <div className="p-3.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text-muted)] space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--bio-teal)]" />
                    <span>Password Security Guidelines</span>
                  </div>
                  <p className="leading-relaxed">
                    Use a strong passphrase containing uppercase, lowercase, numbers, and special symbols. When changed, your new password takes effect immediately for all subsequent logins.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  isLoading={changingPassword}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
