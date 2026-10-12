import {
  getSiteSettings,
  getContentBlocks,
  getLandingPillarsSection,
  getHomepageSections,
  getAboutMilestonesSection,
  getAboutAchievementsSection,
  getAboutFacilitiesSection,
  getResearchCapabilitiesSection,
  getFacultyLeadershipSection,
  getLiquidTreeInnovationSection,
} from "@/server/queries/settings";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const [
    settings,
    blocks,
    landingPillars,
    homepageSections,
    aboutMilestones,
    aboutAchievements,
    aboutFacilities,
    researchCapabilities,
    leadership,
    liquidTree,
  ] = await Promise.all([
    getSiteSettings(),
    getContentBlocks(),
    getLandingPillarsSection(),
    getHomepageSections(),
    getAboutMilestonesSection(),
    getAboutAchievementsSection(),
    getAboutFacilitiesSection(),
    getResearchCapabilitiesSection(),
    getFacultyLeadershipSection(),
    getLiquidTreeInnovationSection(),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <SettingsClient
        initialSettings={settings}
        initialBlocks={blocks}
        initialLandingPillars={landingPillars}
        initialHomepageSections={homepageSections}
        initialAboutMilestones={aboutMilestones}
        initialAboutAchievements={aboutAchievements}
        initialAboutFacilities={aboutFacilities}
        initialResearchCapabilities={researchCapabilities}
        initialLeadership={leadership}
        initialLiquidTree={liquidTree}
        initialTab={resolvedParams?.tab}
      />
    </div>
  );
}
