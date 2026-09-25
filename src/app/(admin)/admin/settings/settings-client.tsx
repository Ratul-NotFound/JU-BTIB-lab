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
import { Save } from "lucide-react";

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
}: {
  initialSettings: SiteSettingsData | null;
  initialBlocks: ContentBlockData[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("identity");

  // Settings State
  const [labName, setLabName] = React.useState(initialSettings?.labName || "");
  const [labShortName, setLabShortName] = React.useState(initialSettings?.labShortName || "BTIB Lab");
  const [departmentName, setDepartmentName] = React.useState(initialSettings?.departmentName || "");
  const [institutionName, setInstitutionName] = React.useState(initialSettings?.institutionName || "");
  const [address, setAddress] = React.useState(initialSettings?.address || "");
  const [contactEmail, setContactEmail] = React.useState(initialSettings?.contactEmail || "");
  const [tagline, setTagline] = React.useState(initialSettings?.tagline || "");
  const [heroHeading, setHeroHeading] = React.useState(initialSettings?.heroHeading || "");
  const [heroSubheading, setHeroSubheading] = React.useState(initialSettings?.heroSubheading || "");
  const [savingSettings, setSavingSettings] = React.useState(false);

  // Content Blocks State
  const blocks = initialBlocks;
  const [savingBlockKey, setSavingBlockKey] = React.useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
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
      });
      toast("Laboratory settings saved successfully", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
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
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSavingBlockKey(null);
    }
  };

  const tabs = [
    { id: "identity", label: "Institutional Identity" },
    { id: "copy", label: "Static Editorial Copy" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Laboratory Configuration & Settings
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Institutional identity lockups, coordinates, and static editorial content blocks.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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

      {activeTab === "copy" && (
        <div className="space-y-6 max-w-4xl">
          {blocks.map((b) => {
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
    </div>
  );
}
