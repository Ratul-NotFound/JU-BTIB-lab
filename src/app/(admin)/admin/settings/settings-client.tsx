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
import { MediaPicker } from "@/components/admin/media-picker";
import { Save, Image as ImageIcon, Sparkles, Building2 } from "lucide-react";

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
  const [heroBgImage, setHeroBgImage] = React.useState(initialSettings?.heroBgImage || "");
  const [heroBgImageAlt, setHeroBgImageAlt] = React.useState(initialSettings?.heroBgImageAlt || "");
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
        heroBgImage: heroBgImage || null,
        heroBgImageAlt: heroBgImageAlt || null,
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
    { id: "imagery", label: "Section Imagery & Banners" },
    { id: "copy", label: "Static Editorial Copy" },
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

      {/* 2. Section Imagery & Banners Tab */}
      {activeTab === "imagery" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          {/* Homepage Hero Section Imagery */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />
                <CardTitle>Homepage Hero Section Background</CardTitle>
              </div>
              <CardDescription>
                Upload or select a custom high-resolution background picture for the main landing page hero section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MediaPicker
                label="Hero Background Picture (JPG/WebP/PNG)"
                value={heroBgImage}
                onChange={setHeroBgImage}
                folder="banners"
              />

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  HERO IMAGE ALT TEXT / DESCRIPTION (FOR ACCESSIBILITY &amp; SEO)
                </label>
                <Input
                  value={heroBgImageAlt}
                  onChange={(e) => setHeroBgImageAlt(e.target.value)}
                  placeholder="e.g. Bioresources Technology and Industrial Biotechnology Laboratory Cleanroom Suite"
                />
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
                <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                    About Page Facility Banner
                  </h4>
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

                <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                    Liquid-Tree Photobioreactor Banner
                  </h4>
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

                <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                    Campus Heritage Picture
                  </h4>
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

                <div className="space-y-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                    Lab Intro / Mission Banner
                  </h4>
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
                <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                    BTIB Laboratory Logo
                  </h4>
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

                <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                    Jahangirnagar University Logo
                  </h4>
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

      {/* 3. Static Copy Tab */}
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
