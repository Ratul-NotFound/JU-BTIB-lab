import { getSiteSettings, getContentBlocks } from "@/server/queries/settings";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, blocks] = await Promise.all([
    getSiteSettings(),
    getContentBlocks(),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <SettingsClient initialSettings={settings} initialBlocks={blocks} />
    </div>
  );
}
